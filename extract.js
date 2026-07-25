const fs = require('fs');
const readline = require('readline');
const path = require('path');

const transcripts = [
    "C:/Users/deons/.gemini/antigravity/brain/00b8f2ed-7cd8-4cd6-aa65-7209fb6eaf24/.system_generated/logs/transcript_full.jsonl",
    "C:/Users/deons/.gemini/antigravity/brain/0dcbe9da-149f-4a10-84a4-65f4ebce5b75/.system_generated/logs/transcript_full.jsonl",
    "C:/Users/deons/.gemini/antigravity/brain/14aba278-3efa-4c88-9efa-3eb1de310d34/.system_generated/logs/transcript_full.jsonl"
];

const outputFile = path.join(__dirname, 'extracted_code.md');
const out = fs.createWriteStream(outputFile);

async function processLineByLine(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    out.write(`\n\n# From ${path.basename(path.dirname(path.dirname(path.dirname(filePath))))}\n`);

    for await (const line of rl) {
        try {
            const parsed = JSON.parse(line);
            if (parsed.content) {
                // Find all markdown code blocks with file names
                const regex = /`{3}[\w]*\n([\s\S]*?)`{3}/g;
                let match;
                while ((match = regex.exec(parsed.content)) !== null) {
                    out.write(match[0] + '\n\n');
                }
            }
        } catch (e) {
            // ignore JSON parse errors
        }
    }
}

async function main() {
    for (const file of transcripts) {
        await processLineByLine(file);
    }
    out.close();
    console.log("Done extracting code.");
}

main();
