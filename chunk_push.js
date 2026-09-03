const fs = require('fs');
const { execSync } = require('child_process');

// Load remaining untracked images
const stdout = execSync('git ls-tree -r HEAD --name-only').toString();
const gitFiles = new Set(stdout.split('\n').filter(l => l.includes('public/uploads/')).map(l => l.trim().split('/').pop()));
const localFiles = fs.readdirSync('public/uploads');
let untracked = [];
localFiles.forEach(f => {
    if (!gitFiles.has(f)) {
        untracked.push(f);
    }
});
fs.writeFileSync('untracked_images.json', JSON.stringify(untracked, null, 2));

const BATCH_SIZE = 5;
console.log(`Starting push of ${untracked.length} images in batches of ${BATCH_SIZE}...`);

for (let i = 0; i < untracked.length; i += BATCH_SIZE) {
    const batch = untracked.slice(i, i + BATCH_SIZE);
    
    // add files
    for (const file of batch) {
        execSync(`git add "public/uploads/${file}"`);
    }
    
    // commit and push
    try {
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        console.log(`Committing batch ${batchNum}...`);
        execSync(`git commit -m "Sync untracked public images batch ${batchNum} of ${Math.ceil(untracked.length / BATCH_SIZE)}"`);
        console.log(`Pushing batch ${batchNum}...`);
        execSync(`git push`);
        console.log(`Batch ${batchNum} pushed successfully.`);
    } catch (e) {
        console.error(`Error on batch ${Math.floor(i / BATCH_SIZE) + 1}`);
        console.error(e.stdout ? e.stdout.toString() : e.message);
        break; // Stop if push fails
    }
}
console.log("Done!");
