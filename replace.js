const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { search: /CricVault/g, replace: 'RJ Doctor Bat' },
  { search: /cricvault/g, replace: 'rj doctor bat' },
  { search: /CRICVAULT/g, replace: 'RJ DOCTOR BAT' },
  { search: /Cricvault/g, replace: 'RJ Doctor Bat' },
  { search: /#b3e600/gi, replace: '#B89B2B' },
  { search: /rgba\(204,255,0/g, replace: 'rgba(212,175,55' },
  { search: /#ccff00/gi, replace: '#D4AF37' },
  { search: /#C6FF00/gi, replace: '#D4AF37' }
];

function processDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      replacements.forEach(rule => {
        content = content.replace(rule.search, rule.replace);
      });
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Replacement complete.');
