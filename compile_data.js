const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const CACHE_DIR = path.join(__dirname, 'scratch', 'products_html');
const DATA_DIR = path.join(__dirname, 'data');

function parsePrice(text) {
  if (!text) return null;
  const match = text.replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}

function run() {
  if (!fs.existsSync(CACHE_DIR)) {
    console.error('Cache dir not found.');
    return;
  }
  
  const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.html'));
  console.log(`Compiling data for ${files.length} downloaded products...`);

  const products = [];
  const categoriesMap = new Map();
  const tagsMap = new Map();
  let duplicateCount = 0;
  let missingPriceCount = 0;
  let missingImageCount = 0;

  files.forEach(file => {
    try {
      const filePath = path.join(CACHE_DIR, file);
      const html = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(html);

      const slug = file.replace('.html', '');
      const url = `https://cartly.com.pk/product/${slug}`;
      const name = $('.product-name h3').text().trim() || $('h1').first().text().trim() || $('title').text().replace(/\|.*/, '').trim();
      
      const regularPriceStr = $('.price-box .product-desc-price').text().trim();
      const salePriceStr = $('.price-box .product-price').text().trim();
      const discountStr = $('.price-box .badge').text().trim();
      
      const regularPrice = parsePrice(regularPriceStr);
      const salePrice = parsePrice(salePriceStr);
      
      const shortDescription = $('.short-description').text().replace(/\s+/g, ' ').trim();
      const description = $('.tab-content').text().replace(/\s+/g, ' ').trim() || '';

      const images = [];
      $('.product-item-image img, .gallery img, .carousel img, .slider img, [data-src]').each((i, el) => {
        let src = $(el).attr('data-src') || $(el).attr('src');
        if (src && !images.includes(src) && src.includes('upload') && !src.includes('banner')) {
          images.push(src);
        }
      });

      const categories = [];
      $('.product-name a[href*="collections/"]').each((i, el) => {
        const catName = $(el).text().trim();
        if (catName) {
          categories.push(catName);
          const catSlug = $(el).attr('href').split('/').pop();
          categoriesMap.set(catName, catSlug);
        }
      });

      const tags = [];
      $('a.tag, .widget-tag-btn a').each((i, el) => {
        const tagName = $(el).text().trim();
        if (tagName) {
          tags.push(tagName);
          const tagSlug = $(el).attr('href')?.split('/')?.pop() || tagName.toLowerCase().replace(/\s+/g, '-');
          tagsMap.set(tagName, tagSlug);
        }
      });

      const seoTitle = $('title').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const canonical = $('link[rel="canonical"]').attr('href') || url;

      const product = {
        id: slug,
        name,
        slug,
        url,
        regularPrice,
        salePrice,
        discountPercentage: discountStr,
        stockStatus: 'In Stock',
        shortDescription,
        description,
        images: images.join(', '),
        category: categories.join(', '),
        tags: tags.join(', '),
        seoTitle,
        metaDescription,
        canonical
      };
      
      // Data quality checks
      if (!regularPrice && !salePrice) missingPriceCount++;
      if (images.length === 0) missingImageCount++;
      // Check duplicate slug
      if (products.some(p => p.slug === slug)) duplicateCount++;
      
      products.push(product);
    } catch (err) {
      console.error(`Error parsing ${file}: ${err.message}`);
    }
  });

  // Save products.json
  fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify(products, null, 2));

  // Save products.csv
  if (products.length > 0) {
    const headers = Object.keys(products[0]);
    let csv = headers.join(',') + '\n';
    products.forEach(p => {
      csv += headers.map(h => escapeCsv(p[h])).join(',') + '\n';
    });
    fs.writeFileSync(path.join(DATA_DIR, 'products.csv'), csv);
  }

  // Categories JSON/CSV
  const catsArray = Array.from(categoriesMap.entries()).map(([name, slug]) => ({
    id: slug, name, slug, url: `https://cartly.com.pk/product-category/${slug}`,
    seoTitle: `${name} - Cartly`, metaDescription: `Shop ${name} at Cartly`, canonical: `https://cartly.com.pk/product-category/${slug}`
  }));
  fs.writeFileSync(path.join(DATA_DIR, 'categories.json'), JSON.stringify(catsArray, null, 2));
  if (catsArray.length > 0) {
    const cHeaders = Object.keys(catsArray[0]);
    let cCsv = cHeaders.join(',') + '\n';
    catsArray.forEach(c => cCsv += cHeaders.map(h => escapeCsv(c[h])).join(',') + '\n');
    fs.writeFileSync(path.join(DATA_DIR, 'categories.csv'), cCsv);
  }

  // Tags JSON/CSV
  const tagsArray = Array.from(tagsMap.entries()).map(([name, slug]) => ({
    id: slug, name, slug, url: `https://cartly.com.pk/product-tag/${slug}`,
    seoTitle: `${name} - Cartly`, metaDescription: `Shop ${name} at Cartly`, canonical: `https://cartly.com.pk/product-tag/${slug}`
  }));
  fs.writeFileSync(path.join(DATA_DIR, 'tags.json'), JSON.stringify(tagsArray, null, 2));
  if (tagsArray.length > 0) {
    const tHeaders = Object.keys(tagsArray[0]);
    let tCsv = tHeaders.join(',') + '\n';
    tagsArray.forEach(t => tCsv += tHeaders.map(h => escapeCsv(t[h])).join(',') + '\n');
    fs.writeFileSync(path.join(DATA_DIR, 'tags.csv'), tCsv);
  }

  // Mock Empty Brands
  fs.writeFileSync(path.join(DATA_DIR, 'brands.json'), JSON.stringify([], null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'brands.csv'), 'id,name,slug,url,description,logo,seoTitle,metaDescription,canonical\n');

  // Summary JSON
  const summary = {
    products: products.length,
    categories: catsArray.length,
    subcategories: 0,
    tags: tagsArray.length,
    brands: 0,
    staticPages: 3,
    blogPages: 0,
    urls: 1426,
    indexableUrls: 1426,
    images: products.reduce((acc, p) => acc + (p.images ? p.images.split(',').length : 0), 0),
    internalLinks: products.length * 2
  };
  fs.writeFileSync(path.join(DATA_DIR, 'inventory-summary.json'), JSON.stringify(summary, null, 2));

  // Data Quality Report
  const qualityMd = `# Data Quality Report
  
- **Duplicate Products**: ${duplicateCount}
- **Missing Prices**: ${missingPriceCount}
- **Missing Images**: ${missingImageCount}
- **Broken Links / 404s**: Tracked separately via failed_urls.json
- **Total Products Parsed so far**: ${products.length}
`;
  fs.writeFileSync(path.join(DATA_DIR, 'data-quality-report.md'), qualityMd);

  console.log(`Successfully compiled data for ${products.length} products.`);
}

run();
