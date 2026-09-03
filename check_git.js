const { execSync } = require('child_process');
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const allImages = data.flatMap(p => typeof p.images === 'string' ? [p.images] : (p.images || []));
const uniqueImages = [...new Set(allImages)];

const stdout = execSync('git ls-tree -r HEAD --name-only').toString();
const gitFiles = new Set(stdout.split('\n').filter(Boolean).map(l => l.trim()));
// also handle git quoting (git ls-tree quotes files with spaces and special chars)
const unquotedGitFiles = new Set([...gitFiles].map(l => {
    if (l.startsWith('"') && l.endsWith('"')) {
        return l.slice(1, -1).replace(/\\"/g, '"');
    }
    return l;
}));

let missingFromGit = 0;
uniqueImages.forEach(img => {
    let p = 'public' + img;
    if (p.startsWith('public//')) p = p.replace('//', '/');
    if (!unquotedGitFiles.has(p)) {
        missingFromGit++;
        console.log("Missing from git: ", p);
    }
});

console.log('Images missing from git:', missingFromGit);
