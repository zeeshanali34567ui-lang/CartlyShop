const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchSitemap(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch sitemap: Status code ${res.statusCode}`));
        return;
      }
      let xml = '';
      res.on('data', (chunk) => { xml += chunk; });
      res.on('end', () => resolve(xml));
    }).on('error', reject);
  });
}

function parseUrls(xml) {
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

async function run() {
  try {
    const xml = await fetchSitemap('https://cartly.com.pk/sitemap.xml');
    console.log(`Fetched sitemap. Length: ${xml.length} bytes.`);
    const urls = parseUrls(xml);
    console.log(`Discovered ${urls.length} URLs in sitemap.`);
    
    // Classify URLs
    const categories = [];
    const products = [];
    const tags = [];
    const other = [];

    urls.forEach(url => {
      if (url === 'https://cartly.com.pk/' || url === 'https://cartly.com.pk') {
        other.push(url);
      } else if (url.includes('/product/')) {
        products.push(url);
      } else if (url.includes('/category/')) {
        categories.push(url);
      } else if (url.includes('/tag/')) {
        tags.push(url);
      } else {
        other.push(url);
      }
    });

    console.log(`Summary of sitemap URLs:`);
    console.log(`Products: ${products.length}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Tags: ${tags.length}`);
    console.log(`Other (static, blog, etc.): ${other.length}`);

    const result = {
      total: urls.length,
      products,
      categories,
      tags,
      other
    };

    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/sitemap_urls.json', JSON.stringify(result, null, 2));
    console.log('Saved discovered URLs to data/sitemap_urls.json');

  } catch (err) {
    console.error('Error running sitemap downloader:', err);
  }
}

run();
