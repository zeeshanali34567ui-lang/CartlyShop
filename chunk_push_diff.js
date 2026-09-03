const { execSync } = require('child_process');

const BATCH_SIZE = 10;

// Get all files that are modified or deleted
const stdout = execSync('git status --porcelain').toString();
const lines = stdout.split('\n').filter(Boolean);

let toCommit = [];

lines.forEach(line => {
    // Only capture modified (M), deleted (D) or untracked (??)
    const file = line.substring(3).trim();
    if (file) {
        toCommit.push(file);
    }
});

console.log(`Found ${toCommit.length} files to commit.`);

for (let i = 0; i < toCommit.length; i += BATCH_SIZE) {
    const batch = toCommit.slice(i, i + BATCH_SIZE);
    
    // add files
    for (const file of batch) {
        try {
            execSync(`git add "${file}"`, { stdio: 'ignore' });
        } catch(e) {}
    }
    
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toCommit.length / BATCH_SIZE);
    
    try {
        execSync(`git commit -m "Update remaining files batch ${batchNum} of ${totalBatches}"`);
        console.log(`Committed batch ${batchNum}`);
        execSync(`git push`);
        console.log(`Pushed batch ${batchNum}`);
    } catch (e) {
        console.log(`Error on batch ${batchNum}: ${e.message}`);
    }
}
