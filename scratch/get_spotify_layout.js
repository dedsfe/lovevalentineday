const fs = require('fs');
const path = require('path');

const payloadPath = 'C:\\Users\\dedsf\\.gemini\\antigravity\\brain\\4e71bcf4-73a9-4d71-a13b-e8d326709724\\scratch\\clean_payload.txt';

if (!fs.existsSync(payloadPath)) {
  console.log('Payload file not found');
  process.exit(1);
}

const text = fs.readFileSync(payloadPath, 'utf8');
const searchString = 'spotifyLayout';
let index = text.indexOf(searchString);

while (index !== -1) {
  console.log(`\n=== Found '${searchString}' at index ${index} ===`);
  console.log(text.substring(Math.max(0, index - 200), index + 1500));
  index = text.indexOf(searchString, index + 1);
}
