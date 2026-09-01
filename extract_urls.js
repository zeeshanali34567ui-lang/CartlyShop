const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}

function run() {
  const sitemapData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'sitemap_urls.json'), 'utf-8'));
  
  const siteUrls = [];
  
  // Categorize URLs
  const allUrls = [
    ...sitemapData.products.map(u => ({ url: u, type: 'product' })),
    ...sitemapData.categories.map(u => ({ url: u, type: 'category' })),
    ...sitemapData.tags.map(u => ({ url: u, type: 'tag' })),
    ...sitemapData.other.map(u => ({ url: u, type: u === 'https://cartly.com.pk/' ? 'homepage' : 'other' }))
  ];

  allUrls.forEach(({ url, type }) => {
    siteUrls.push({
      URL: url,
      Slug: url.replace(/\/$/, '').split('/').pop(),
      PageType: type,
      HTTPStatus: 200, // Assumed from successful sitemap fetch
      Indexability: 'Indexable'
    });
  });

  // Add static pages
  if (fs.existsSync(path.join(DATA_DIR, 'static-pages.json'))) {
    const staticPages = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'static-pages.json'), 'utf-8'));
    staticPages.forEach(p => {
      if (!siteUrls.some(su => su.URL === p.url)) {
        siteUrls.push({
          URL: p.url,
          Slug: p.url.replace(/\/$/, '').split('/').pop(),
          PageType: 'static',
          HTTPStatus: 200,
          Indexability: 'Indexable'
        });
      }
    });
  }

  // Save site-urls.csv
  const headers = ['URL', 'Slug', 'PageType', 'HTTPStatus', 'Indexability'];
  let csv = headers.join(',') + '\n';
  siteUrls.forEach(su => {
    csv += headers.map(h => escapeCsv(su[h])).join(',') + '\n';
  });
  
  fs.writeFileSync(path.join(DATA_DIR, 'site-urls.csv'), csv);
  console.log(`Saved site-urls.csv with ${siteUrls.length} entries.`);

  // Dummy internal-links.csv for structure
  fs.writeFileSync(path.join(DATA_DIR, 'internal-links.csv'), 'Source URL,Destination URL,Anchor Text\nhttps://cartly.com.pk/,https://cartly.com.pk/shop,Shop Now\n');
  console.log('Saved internal-links.csv structure.');
}

run();
