const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

const CACHE_DIR = path.join(__dirname, 'scratch', 'products_html');
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}

function fetchPage(url, retries = 3) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive'
      },
      timeout: 15000
    };
    const req = https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        const redirectUrl = new URL(res.headers.location, url).href;
        if (retries > 0) {
          fetchPage(redirectUrl, retries - 1).then(resolve).catch(reject);
        } else {
          reject(new Error(`Too many redirects. Last: ${redirectUrl}`));
        }
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => resolve(html));
    });
    req.on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => fetchPage(url, retries - 1).then(resolve).catch(reject), 2000);
      } else {
        reject(err);
      }
    });
    req.on('timeout', () => {
      req.destroy();
      if (retries > 0) {
        setTimeout(() => fetchPage(url, retries - 1).then(resolve).catch(reject), 2000);
      } else {
        reject(new Error('TIMEOUT'));
      }
    });
  });
}

function parsePrice(text) {
  if (!text) return null;
  const match = text.replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

async function run() {
  const sitemapPath = path.join(DATA_DIR, 'sitemap_urls.json');
  if (!fs.existsSync(sitemapPath)) {
    console.error('Sitemap not found. Cannot audit.');
    return;
  }
  
  const sitemapData = JSON.parse(fs.readFileSync(sitemapPath, 'utf-8'));
  const discoveredProductUrls = sitemapData.products;
  
  const auditRecords = [];
  const products = [];
  const categoriesMap = new Map();
  const tagsMap = new Map();
  
  let successfullyExtractedProducts = 0;
  let duplicatesCount = 0;
  let invalidProductUrls = 0;
  let unavailableProducts = 0;
  let missingProducts = 0;

  const uniqueSlugs = new Set();
  
  console.log(`Auditing ${discoveredProductUrls.length} discovered product URLs...`);

  // First pass: identify missing HTML
  const queue = [];
  for (const url of discoveredProductUrls) {
    const slug = url.split('/').pop() || url.replace(/\/$/, '').split('/').pop();
    const filePath = path.join(CACHE_DIR, `${slug}.html`);
    const htmlDownloaded = fs.existsSync(filePath) && fs.statSync(filePath).size > 100;
    if (!htmlDownloaded) {
      queue.push({ url, slug, filePath });
    }
  }

  console.log(`Missing HTML for ${queue.length} products. Fetching now with 10 concurrency...`);
  
  // Concurrent fetcher
  let active = 0;
  let index = 0;
  await new Promise(resolve => {
    const next = () => {
      if (index >= queue.length && active === 0) return resolve();
      while (active < 10 && index < queue.length) {
        const item = queue[index++];
        active++;
        fetchPage(item.url, 3)
          .then(html => {
            fs.writeFileSync(item.filePath, html);
            // Verify it's a valid product page by checking a basic selector
            const $ = cheerio.load(html);
            if ($('.product-name h3').length === 0 && $('.price-box').length === 0) {
              item.failureReason = 'Invalid Product Page structure';
            }
          })
          .catch(err => {
            item.failureReason = err.message;
          })
          .finally(() => {
            active--;
            if (index % 50 === 0) console.log(`Fetched ${index}/${queue.length}`);
            next();
          });
      }
    };
    next();
  });

  console.log('Fetching complete. Proceeding to audit and parsing...');

  // Second pass: Audit & Parse
  for (const url of discoveredProductUrls) {
    let slug = url.split('/').pop() || url.replace(/\/$/, '').split('/').pop();
    
    // Check canonical redirect/duplicates
    if (uniqueSlugs.has(slug)) {
      duplicatesCount++;
      auditRecords.push({
        product_url: url, slug, discovered: true, html_downloaded: false, parsed: false,
        included_in_products_json: false, included_in_products_csv: false, failure_reason: 'Duplicate Slug/Redirect'
      });
      continue;
    }
    uniqueSlugs.add(slug);

    const filePath = path.join(CACHE_DIR, `${slug}.html`);
    const htmlDownloaded = fs.existsSync(filePath);
    
    let parsed = false;
    let failureReason = htmlDownloaded ? '' : 'Failed to download (HTTP Error or Timeout)';
    let productData = null;

    if (htmlDownloaded) {
      try {
        const html = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(html);
        
        // Basic check for product page
        if ($('.product-name h3').length === 0 && $('.price-box').length === 0 && $('title').text().includes('404')) {
           invalidProductUrls++;
           failureReason = 'Page is 404 or not a product';
        } else {
          const name = $('.product-name h3').text().trim() || $('h1').first().text().trim() || $('title').text().replace(/\|.*/, '').trim();
          const regularPriceStr = $('.price-box .product-desc-price').text().trim();
          const salePriceStr = $('.price-box .product-price').text().trim();
          const discountStr = $('.price-box .badge').text().trim();
          
          const shortDescription = $('.short-description').text().replace(/\s+/g, ' ').trim();
          const description = $('.tab-content').text().replace(/\s+/g, ' ').trim() || '';

          const images = [];
          $('.product-item-image img, .gallery img, .carousel img, .slider img, [data-src]').each((i, el) => {
            let src = $(el).attr('data-src') || $(el).attr('src');
            if (src && !images.includes(src) && src.includes('upload') && !src.includes('banner')) images.push(src);
          });

          const categories = [];
          $('.product-name a[href*="collections/"]').each((i, el) => {
            const catName = $(el).text().trim();
            if (catName) { categories.push(catName); categoriesMap.set(catName, $(el).attr('href').split('/').pop()); }
          });

          const tags = [];
          $('a.tag, .widget-tag-btn a').each((i, el) => {
            const tagName = $(el).text().trim();
            if (tagName) { tags.push(tagName); tagsMap.set(tagName, $(el).attr('href')?.split('/')?.pop() || tagName.toLowerCase().replace(/\s+/g, '-')); }
          });

          if (!name && !regularPriceStr && !salePriceStr) {
             invalidProductUrls++;
             failureReason = 'Parsed data empty - invalid product template';
          } else {
             productData = {
               id: slug, name, slug, url,
               regularPrice: parsePrice(regularPriceStr),
               salePrice: parsePrice(salePriceStr),
               discountPercentage: discountStr,
               stockStatus: 'In Stock',
               shortDescription, description,
               images: images.join(', '),
               category: categories.join(', '),
               tags: tags.join(', '),
               seoTitle: $('title').text().trim(),
               metaDescription: $('meta[name="description"]').attr('content') || '',
               canonical: $('link[rel="canonical"]').attr('href') || url
             };
             products.push(productData);
             parsed = true;
             successfullyExtractedProducts++;
          }
        }
      } catch (err) {
        failureReason = 'Parse error: ' + err.message;
        unavailableProducts++;
      }
    } else {
       // if we reach here and it's not downloaded
       const queuedItem = queue.find(q => q.url === url);
       if (queuedItem && queuedItem.failureReason) failureReason = queuedItem.failureReason;
       unavailableProducts++;
    }

    auditRecords.push({
      product_url: url, slug,
      discovered: true,
      html_downloaded: htmlDownloaded,
      parsed,
      included_in_products_json: parsed,
      included_in_products_csv: parsed,
      failure_reason: failureReason
    });
  }

  // Calculate missing products logically based on the strict formula
  const uniqueProductUrls = discoveredProductUrls.length - duplicatesCount;
  // According to formula: uniqueProductUrls = successfullyExtractedProducts + invalidProductUrls + unavailableProducts + missingProducts (which should be 0)
  missingProducts = uniqueProductUrls - (successfullyExtractedProducts + invalidProductUrls + unavailableProducts);

  // Write files
  // 1. Audit CSV
  const auditHeaders = Object.keys(auditRecords[0]);
  let auditCsv = auditHeaders.join(',') + '\n';
  auditRecords.forEach(r => auditCsv += auditHeaders.map(h => escapeCsv(r[h])).join(',') + '\n');
  fs.writeFileSync(path.join(DATA_DIR, 'product-url-audit.csv'), auditCsv);

  // 2. Reconciliation JSON
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

  // 3. Update products JSON/CSV
  fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(products, null, 2));
  if (products.length > 0) {
    const pHeaders = Object.keys(products[0]);
    let pCsv = pHeaders.join(',') + '\n';
    products.forEach(p => pCsv += pHeaders.map(h => escapeCsv(p[h])).join(',') + '\n');
    fs.writeFileSync(path.join(DATA_DIR, 'products.csv'), pCsv);
  }

  // 4. Update Summary JSON
  if (fs.existsSync(path.join(DATA_DIR, 'inventory-summary.json'))) {
    const summary = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'inventory-summary.json'), 'utf-8'));
    summary.products = products.length;
    summary.images = products.reduce((acc, p) => acc + (p.images ? p.images.split(',').length : 0), 0);
    fs.writeFileSync(path.join(DATA_DIR, 'inventory-summary.json'), JSON.stringify(summary, null, 2));
  }

  console.log('AUDIT COMPLETE');
  console.log(JSON.stringify(reconciliation, null, 2));
}

run();
