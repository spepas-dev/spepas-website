// export-tree.js
import fs from 'fs';
import path from 'path';

const IGNORES = new Set(['node_modules', '.git', 'dist', 'images', 'public']);

const OUTFILE = path.resolve(process.argv[2] || 'tree.txt');
const ROOT   = path.resolve(process.argv[3] || '.');

let output = '';

// Recursively walk directories
function walk(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).filter(entry => !IGNORES.has(entry.name));
  entries.forEach((entry, idx) => {
    const isLast = idx === entries.length - 1;
    const pointer = isLast ? '└── ' : '├── ';
    const name = entry.name + (entry.isDirectory() ? '/' : '');
    output += prefix + pointer + name + '\n';
    if (entry.isDirectory()) {
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      walk(path.join(dir, entry.name), nextPrefix);
    }
  });
}

output += path.basename(ROOT) + '/\n';
walk(ROOT);

fs.writeFileSync(OUTFILE, output, 'utf8');
console.log(`✔️  Tree saved to ${OUTFILE}`);
