const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace various phone number patterns
  content = content.replace(/\+92-0300-1376364/g, '+923106375837');
  content = content.replace(/0300-1376364/g, '03106375837');
  content = content.replace(/923001376364/g, '923106375837');
  content = content.replace(/03001376364/g, '03106375837');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated phone numbers in: ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
        walkDir(fullPath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.js') || file.endsWith('.md') || file.endsWith('.csv') || file.endsWith('.html')) {
      replaceInFile(fullPath);
    }
  }
}

console.log('Replacing old phone numbers across all files...');
walkDir(path.join(__dirname, '../src'));
walkDir(path.join(__dirname, '../data'));
walkDir(path.join(__dirname, '../scratch'));
console.log('Phone number replacement complete.');
