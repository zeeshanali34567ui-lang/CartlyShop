const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const https = require('https');

const DATA_DIR = path.join(__dirname, 'data');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      },
      timeout: 10000
    };
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed: ${res.statusCode} for ${url}`));
        return;
      }
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => resolve(html));
    }).on('error', reject).on('timeout', () => reject(new Error('TIMEOUT')));
  });
}

async function extractNavAndFooter() {
  const html = fs.readFileSync(path.join(__dirname, 'scratch', 'html', 'homepage.html'), 'utf-8');
  const $ = cheerio.load(html);

  // Extract Navigation
  const navigation = {
    topBar: [],
    mainMenu: [],
    categoriesMenu: []
  };

  $('.navbar-top a').each((i, el) => {
    navigation.topBar.push({ text: $(el).text().trim(), href: $(el).attr('href') });
  });

  $('.navbar-expand-lg').not('.navbar-top').find('.nav-item > a.nav-link').not('.dropdown-toggle').each((i, el) => {
    navigation.mainMenu.push({ text: $(el).text().trim(), href: $(el).attr('href') });
  });

  $('.dropdown-menu .dropdown-item').each((i, el) => {
    navigation.categoriesMenu.push({ text: $(el).text().trim(), href: $(el).attr('href') });
  });

  fs.writeFileSync(path.join(DATA_DIR, 'navigation.json'), JSON.stringify(navigation, null, 2));
  console.log('Saved data/navigation.json');

  // Extract Footer
  const footer = {
    sections: []
  };

  $('.footer .row > div').each((i, column) => {
    const title = $(column).find('h4, h5, h3').text().trim();
    if (!title) return;
    
    const links = [];
    $(column).find('a').each((j, el) => {
      links.push({ text: $(el).text().trim(), href: $(el).attr('href') });
    });
    
    const textContent = $(column).find('p, li').not(':has(a)').map((j, el) => $(el).text().trim()).get();
    
    footer.sections.push({ title, links, text: textContent });
  });

  fs.writeFileSync(path.join(DATA_DIR, 'footer.json'), JSON.stringify(footer, null, 2));
  console.log('Saved data/footer.json');
}

async function extractStaticPages() {
  const staticUrls = [
    'https://cartly.com.pk/about-us',
    'https://cartly.com.pk/contact-us',
    'https://cartly.com.pk/order_method'
  ];

  const staticPages = [];

  for (const url of staticUrls) {
    console.log(`Fetching static page: ${url}`);
    try {
      const html = await fetchPage(url);
      const $ = cheerio.load(html);
      
      const title = $('title').text().trim();
      const h1 = $('h1').first().text().trim();
      const seoDesc = $('meta[name="description"]').attr('content') || '';
      
      // Attempt to find main content
      let content = $('.container').text().replace(/\s+/g, ' ').trim();
      // Refine content by finding a specific container if possible
      const mainContentDiv = $('.about-us-content, .contact-content, main, article').first();
      if (mainContentDiv.length > 0) {
        content = mainContentDiv.text().replace(/\s+/g, ' ').trim();
      }

      staticPages.push({ url, title, h1, seoDescription: seoDesc, contentPreview: content.substring(0, 500) });
    } catch (err) {
      console.error(`Failed to fetch ${url}: ${err.message}`);
    }
  }

  fs.writeFileSync(path.join(DATA_DIR, 'static-pages.json'), JSON.stringify(staticPages, null, 2));
  console.log('Saved data/static-pages.json');
}

async function run() {
  await extractNavAndFooter();
  await extractStaticPages();
}

run();
