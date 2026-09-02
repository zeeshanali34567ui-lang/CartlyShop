const fs = require('fs');
const https = require('https');
const path = require('path');
const sharp = require('sharp');

const PRODUCTS_JSON_PATH = path.join(__dirname, '..', 'web', 'src', 'data', 'products.json');
const ROOT_DATA_DIR = path.join(__dirname, '..', 'data');
const WEB_DATA_DIR = path.join(__dirname, '..', 'web', 'src', 'data');

const RAW_DIR = path.join(__dirname, '..', 'scratch', 'original_images');
const PUBLIC_UPLOADS_DIR = path.join(__dirname, '..', 'web', 'public', 'uploads');

if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });

function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1500) {
      return resolve(true);
    }

    const file = fs.createWriteStream(destPath);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://cartly.com.pk/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      timeout: 15000
    }, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    });

    req.on('error', () => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    });
  });
}

function createBannerSvg(width, bannerHeight) {
  const iconSize = Math.round(bannerHeight * 0.82);
  const iconX = Math.round(width * 0.035);
  const iconY = Math.round((bannerHeight - iconSize) / 2);
  
  const fontSize = Math.round(bannerHeight * 0.68);
  const textX = Math.round(width * 0.54);
  const textY = Math.round(bannerHeight * 0.73);
  const strokeWidth = Math.max(2, Math.round(fontSize * 0.085));
  
  const displayText = '0310-6375837';

  return `
    <svg width="${width}" height="${bannerHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff3b56" />
          <stop offset="48%" stop-color="#8a6f91" />
          <stop offset="100%" stop-color="#00beec" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
      </defs>
      
      <!-- Gradient Banner Background -->
      <rect width="${width}" height="${bannerHeight}" fill="url(#bannerGrad)" />
      
      <!-- Official WhatsApp Icon -->
      <g transform="translate(${iconX}, ${iconY}) scale(${iconSize / 48})">
        <circle cx="24" cy="24" r="23" fill="#25D366" stroke="#ffffff" stroke-width="1.5" />
        <path fill="#ffffff" d="M 34.6 28.3 C 34.0 28.0 31.0 26.5 30.5 26.3 C 30.0 26.1 29.6 26.0 29.2 26.6 C 28.8 27.2 27.6 28.7 27.2 29.1 C 26.9 29.5 26.5 29.6 25.9 29.3 C 25.3 29.0 23.3 28.3 21.0 26.2 C 19.2 24.6 18.0 22.6 17.6 22.0 C 17.3 21.4 17.6 21.0 17.9 20.7 C 18.1 20.5 18.5 20.0 18.8 19.6 C 19.1 19.2 19.2 18.9 19.4 18.4 C 19.6 18.0 19.5 17.6 19.3 17.3 C 19.2 17.0 18.0 14.0 17.5 12.8 C 17.0 11.6 16.5 11.7 16.1 11.7 C 15.7 11.7 15.3 11.7 14.8 11.7 C 14.4 11.7 13.7 11.9 13.1 12.5 C 12.6 13.1 11.0 14.6 11.0 17.6 C 11.0 20.5 13.2 23.4 13.5 23.8 C 13.8 24.2 17.7 30.2 23.7 32.8 C 25.1 33.4 26.3 33.8 27.2 34.1 C 28.7 34.5 30.0 34.5 31.0 34.3 C 32.2 34.1 34.6 32.8 35.1 31.4 C 35.6 30.0 35.6 28.8 35.4 28.5 C 35.3 28.3 35.0 28.2 34.6 28.0 Z"/>
      </g>
      
      <!-- Phone Number: 0310-6375837 with Black Outline -->
      <g filter="url(#shadow)">
        <text 
          x="${textX}" 
          y="${textY}" 
          text-anchor="middle" 
          font-family="Arial, Helvetica, sans-serif" 
          font-weight="900" 
          font-size="${fontSize}px" 
          fill="#000000" 
          stroke="#000000" 
          stroke-width="${strokeWidth * 2}" 
          stroke-linejoin="round"
          letter-spacing="1px"
        >${displayText}</text>
        
        <text 
          x="${textX}" 
          y="${textY}" 
          text-anchor="middle" 
          font-family="Arial, Helvetica, sans-serif" 
          font-weight="900" 
          font-size="${fontSize}px" 
          fill="#ffffff" 
          stroke="#000000" 
          stroke-width="${strokeWidth * 0.5}" 
          stroke-linejoin="round"
          letter-spacing="1px"
        >${displayText}</text>
      </g>
    </svg>
  `;
}

async function processAndPatchImage(rawPath, publicPath) {
  try {
    const meta = await sharp(rawPath).metadata();
    const width = meta.width;
    const height = meta.height;

    // Detect if banner is present at bottom
    const { data, info } = await sharp(rawPath).raw().toBuffer({ resolveWithObject: true });
    const channels = info.channels;

    let hasBanner = false;
    let bannerY = Math.round(height * (528 / 600));

    // Sample bottom region to verify banner gradient
    for (let y = height - 1; y >= Math.max(0, height - 100); y -= 2) {
      const idxL = (y * width + Math.min(width - 1, 5)) * channels;
      const rL = data[idxL], gL = data[idxL + 1], bL = data[idxL + 2];
      
      const idxR = (y * width + Math.max(0, width - 6)) * channels;
      const rR = data[idxR], gR = data[idxR + 1], bR = data[idxR + 2];
      
      // Reddish/pink left side and cyan/blue right side
      if (rL > 150 && rL > gL && rL > bL && bR > 130 && bR > rR) {
        hasBanner = true;
        bannerY = y;
      } else if (hasBanner) {
        break;
      }
    }

    if (hasBanner) {
      const bannerHeight = height - bannerY;
      const svgBanner = createBannerSvg(width, bannerHeight);
      const bannerBuffer = Buffer.from(svgBanner);

      await sharp(rawPath)
        .composite([{ input: bannerBuffer, top: bannerY, left: 0 }])
        .webp({ quality: 90 })
        .toFile(publicPath);
    } else {
      // Clean image without modification
      await sharp(rawPath)
        .webp({ quality: 90 })
        .toFile(publicPath);
    }

    return true;
  } catch (err) {
    console.error(`Failed to process ${rawPath}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('====================================================================');
  console.log('     RE-RUNNING FORCE IMAGE ASSET PATCHING (OVERWRITING ALL)        ');
  console.log('====================================================================\n');

  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));
  console.log(`Loaded ${products.length} products.`);

  const rawFiles = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.webp'));
  console.log(`Found ${rawFiles.length} raw original images in scratch/original_images/.\n`);

  let patchedCount = 0;
  let totalCount = 0;

  for (let i = 0; i < rawFiles.length; i++) {
    const fn = rawFiles[i];
    const rawPath = path.join(RAW_DIR, fn);
    const publicPath = path.join(PUBLIC_UPLOADS_DIR, fn);

    if (fs.existsSync(rawPath) && fs.statSync(rawPath).size > 500) {
      const ok = await processAndPatchImage(rawPath, publicPath);
      if (ok) patchedCount++;
    }
    totalCount++;

    if (totalCount % 100 === 0 || totalCount === rawFiles.length) {
      console.log(`Progress: ${totalCount} / ${rawFiles.length} images processed (${Math.round((totalCount / rawFiles.length) * 100)}%)...`);
    }
  }

  console.log(`\nAll ${patchedCount} image assets successfully patched with 0310-6375837 in web/public/uploads/!\n`);

  // Update products.json and products.csv with local image paths
  console.log('Synchronizing products.json and products.csv...');
  const updatedProducts = products.map(p => {
    if (!p.images) return p;
    const imgList = p.images.split(',').map(s => s.trim()).filter(Boolean);
    const localImgList = imgList.map(url => {
      const fn = path.basename(url.split('?')[0]);
      const localPublicPath = path.join(PUBLIC_UPLOADS_DIR, fn);
      if (fs.existsSync(localPublicPath)) {
        return `/uploads/${fn}`;
      }
      return url;
    });

    return {
      ...p,
      images: localImgList.join(', ')
    };
  });

  const targetDirs = [ROOT_DATA_DIR, WEB_DATA_DIR];
  targetDirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // 1. products.json
    fs.writeFileSync(path.join(dir, 'products.json'), JSON.stringify(updatedProducts, null, 2));

    // 2. products.csv
    const csvKeys = ['id', 'name', 'slug', 'url', 'regularPrice', 'salePrice', 'discountPercentage', 'stockStatus', 'shortDescription', 'description', 'images', 'category', 'tags', 'ratingCount', 'ratingValue', 'seoTitle', 'metaDescription', 'canonical'];
    let csv = csvKeys.join(',') + '\n';
    updatedProducts.forEach(p => {
      csv += csvKeys.map(h => escapeCsv(p[h])).join(',') + '\n';
    });
    fs.writeFileSync(path.join(dir, 'products.csv'), csv);
  });

  console.log('Synchronization complete. All images are locally served with the 0310-6375837 banner.');
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
