const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const productsPath = path.join(__dirname, '../src/data/products.json');
const productsDataPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

let fixedCount = 0;
let missingCount = 0;

console.log(`Starting image reconciliation for ${products.length} products...`);

products.forEach((product) => {
  const slug = product.slug;
  const htmlPath = path.join(__dirname, `../scratch/products_html/${slug}.html`);

  let realImages = [];

  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);

    // Strategy 1: Check og:image meta tag
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage && !ogImage.includes('placeholder') && !ogImage.includes('logo')) {
      realImages.push(ogImage);
    }

    // Strategy 2: Look for main product image in gallery / main container
    $('.product-image img, .single-product-img img, .woocommerce-product-gallery__image img, .product-detail img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !realImages.includes(src) && !src.includes('logo') && !src.includes('placeholder')) {
        realImages.push(src);
      }
    });

    // Strategy 3: Find any image in the HTML whose filename matches the product slug
    if (realImages.length === 0) {
      $('img').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (src && src.includes(slug)) {
          realImages.push(src);
        }
      });
    }
  }

  // Fallback: If no image found in HTML, search the existing images list for an image URL matching the slug
  if (realImages.length === 0 && product.images) {
    const existingList = Array.isArray(product.images) ? product.images : product.images.split(',').map(s => s.trim());
    const slugMatch = existingList.find(img => img.includes(slug));
    if (slugMatch) {
      realImages.push(slugMatch);
    }
  }

  if (realImages.length > 0) {
    const newImagesStr = realImages.join(', ');
    if (product.images !== newImagesStr) {
      product.images = newImagesStr;
      fixedCount++;
    }
  } else {
    missingCount++;
  }
});

console.log(`Reconciliation complete.`);
console.log(`Fixed/Corrected image mappings: ${fixedCount}`);
console.log(`Products without valid source image: ${missingCount}`);

// Save updated products.json
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
if (fs.existsSync(productsDataPath)) {
  fs.writeFileSync(productsDataPath, JSON.stringify(products, null, 2), 'utf8');
}
console.log(`Updated products.json saved.`);
