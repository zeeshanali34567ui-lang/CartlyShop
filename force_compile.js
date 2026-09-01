const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const CACHE_DIR = path.join(__dirname, 'scratch', 'products_html');
const DATA_DIR = path.join(__dirname, 'data');

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('"')) return `"${str}"`;
  return str;
}

function parsePrice(text) {
  if (!text) return null;
  const match = text.replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

function run() {
  console.log("Starting quick force compile...");
  const sitemapData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'sitemap_urls.json'), 'utf-8'));
  const discoveredProductUrls = sitemapData.products;
  
  const csvPath = path.join(DATA_DIR, 'products.csv');
  fs.writeFileSync(csvPath, 'id,name,slug,url,regularPrice,salePrice,discountPercentage,stockStatus,shortDescription,description\n');
  
  let duplicatesCount = 0;
  let successfullyExtractedProducts = 0;
  let invalidProductUrls = 0;
  let unavailableProducts = 0;
  let missingProducts = 0;

  const uniqueSlugs = new Set();
  const products = [];
  
  for (let i = 0; i < discoveredProductUrls.length; i++) {
    const url = discoveredProductUrls[i];
    let slug = url.split('/').pop() || url.replace(/\/$/, '').split('/').pop();
    
    if (uniqueSlugs.has(slug)) {
      duplicatesCount++;
      continue;
    }
    uniqueSlugs.add(slug);

    const filePath = path.join(CACHE_DIR, `${slug}.html`);
    let htmlDownloaded = false;
    try {
        if (fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath);
            if (stat.size > 100) htmlDownloaded = true;
        }
    } catch(e) {}

    if (htmlDownloaded) {
      try {
        const html = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(html);
        
        if ($('.product-name h3').length === 0 && $('.price-box').length === 0) {
           invalidProductUrls++;
        } else {
          const name = $('.product-name h3').text().trim() || $('h1').first().text().trim() || $('title').text().replace(/\|.*/, '').trim();
          const regularPriceStr = $('.price-box .product-desc-price').text().trim();
          const salePriceStr = $('.price-box .product-price').text().trim();
          
          if (!name && !regularPriceStr && !salePriceStr) {
             invalidProductUrls++;
          } else {
             const prod = {
               id: slug, name, slug, url,
               regularPrice: parsePrice(regularPriceStr),
               salePrice: parsePrice(salePriceStr),
               discountPercentage: $('.price-box .badge').text().trim(),
               stockStatus: 'In Stock',
               shortDescription: $('.short-description').text().replace(/\s+/g, ' ').trim().substring(0, 100),
               description: ''
             };
             products.push(prod);
             const line = Object.keys(prod).map(k => escapeCsv(prod[k])).join(',') + '\n';
             fs.appendFileSync(csvPath, line);
             successfullyExtractedProducts++;
          }
        }
      } catch (err) {
        unavailableProducts++;
      }
    } else {
       missingProducts++;
    }
    
    if (i % 100 === 0) console.log(`Processed ${i}/${discoveredProductUrls.length}`);
  }

  const uniqueProductUrls = discoveredProductUrls.length - duplicatesCount;
  
  const reconciliation = {
    discoveredProductUrls: discoveredProductUrls.length,
    uniqueProductUrls,
    successfullyExtractedProducts,
    duplicates: duplicatesCount,
    invalidProductUrls,
    unavailableProducts,
    missingProducts
  };
  fs.writeFileSync(path.join(DATA_DIR, 'product-reconciliation.json'), JSON.stringify(reconciliation, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(products, null, 2));

  console.log("Done!");
}

run();
