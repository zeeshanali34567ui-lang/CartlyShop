const { execSync } = require('child_process');
const fs = require('fs');

const BATCH_SIZE = 50;

// Get all files that need to be renamed
const stdout = execSync('git status --porcelain').toString();
const lines = stdout.split('\n').filter(Boolean);

let toRename = [];

lines.forEach(line => {
    if (line.startsWith(' D web/public/uploads/')) {
        const file = line.split('web/public/uploads/')[1].trim();
        toRename.push(file);
    }
});

console.log(`Found ${toRename.length} files to migrate.`);

for (let i = 0; i < toRename.length; i += BATCH_SIZE) {
    const batch = toRename.slice(i, i + BATCH_SIZE);
    
    // add files
    for (const file of batch) {
        try {
            execSync(`git rm "web/public/uploads/${file}"`, { stdio: 'ignore' });
            execSync(`git add "public/uploads/${file}"`, { stdio: 'ignore' });
        } catch(e) {}
    }
    
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toRename.length / BATCH_SIZE);
    
    try {
        execSync(`git commit -m "Migrate assets to root batch ${batchNum} of ${totalBatches}"`);
        console.log(`Committed batch ${batchNum}`);
        execSync(`git push`);
        console.log(`Pushed batch ${batchNum}`);
    } catch (e) {
        console.log(`Error on batch ${batchNum}`);
        break;
    }
}

// Add the rest of the modified files (data json etc)
try {
    execSync(`git add data/ scratch/ compile_data.js reports/`);
    execSync(`git commit -m "Update data files and reports"`);
    execSync(`git push`);
    console.log("Final data push done");
} catch(e) {}

