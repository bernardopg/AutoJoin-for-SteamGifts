const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const i18n = require('../js/core/i18n');

const rootDir = path.resolve(__dirname, '..');
const sourceDirs = ['js', 'html'];

function listSourceFiles() {
  const files = [];

  const walk = (dirPath) => {
    fs.readdirSync(dirPath, { withFileTypes: true }).forEach((entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && /\.(js|html)$/u.test(entry.name)) {
        files.push(fullPath);
      }
    });
  };

  sourceDirs.forEach((dir) => {
    walk(path.join(rootDir, dir));
  });

  return files;
}

function collectUsedKeys() {
  const usedKeys = new Set();
  const usedPrefixes = new Set();
  const regexes = [
    /\b(?:t|bgT|translate)\(\s*['"]([^'"]+)['"]/g,
    /\b(?:t|bgT|translate)\(\s*`([^`$]+)\$\{/g,
    /\b(?:this\.)?i18n\.t\(\s*['"]([^'"]+)['"]/g,
    /data-i18n(?:-(?:placeholder|title|aria-label))?=['"]([^'"]+)['"]/g,
  ];

  listSourceFiles().forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    regexes.forEach((regex) => {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(content))) {
        if (regex.source.includes('`([^`$]+)\\$\\{')) {
          usedPrefixes.add(match[1]);
        } else {
          usedKeys.add(match[1]);
        }
      }
    });
  });

  return { usedKeys, usedPrefixes };
}

function isCoveredByPrefix(key, prefixes) {
  return [...prefixes].some((prefix) => key.startsWith(prefix));
}

test('translation keys used in source exist in the catalogs', () => {
  const catalogKeys = new Set(Object.keys(i18n.getCatalog('en')));
  const { usedKeys, usedPrefixes } = collectUsedKeys();

  const missingKeys = [...usedKeys].filter((key) => !catalogKeys.has(key));
  const orphanKeys = [...catalogKeys].filter(
    (key) => !usedKeys.has(key) && !isCoveredByPrefix(key, usedPrefixes),
  );

  assert.deepEqual(missingKeys, []);

  if (orphanKeys.length > 0) {
    console.warn(`Orphan translation keys: ${orphanKeys.join(', ')}`);
  }
});
