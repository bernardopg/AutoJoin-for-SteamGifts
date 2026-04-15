import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const buildDir = path.join(rootDir, 'build', 'extension');
const includePaths = [
  '_locales',
  'css',
  'html',
  'js',
  'media',
  'manifest.json',
  'LICENSE',
  'README.md',
];

fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(buildDir, { recursive: true });

const copyRecursive = (sourcePath, destinationPath) => {
  const stat = fs.statSync(sourcePath);

  if (stat.isDirectory()) {
    fs.mkdirSync(destinationPath, { recursive: true });
    for (const entry of fs.readdirSync(sourcePath)) {
      copyRecursive(
        path.join(sourcePath, entry),
        path.join(destinationPath, entry),
      );
    }
    return;
  }

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
};

for (const relativePath of includePaths) {
  copyRecursive(
    path.join(rootDir, relativePath),
    path.join(buildDir, relativePath),
  );
}

const manifest = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'manifest.json'), 'utf8'),
);
const metadataPath = path.join(buildDir, 'build-metadata.json');
fs.writeFileSync(
  metadataPath,
  JSON.stringify(
    {
      version: manifest.version,
      generatedAt: new Date().toISOString(),
      source: 'npm run build',
      includedPaths: includePaths,
    },
    null,
    2,
  ) + '\n',
);

console.log(`Build ready at ${path.relative(rootDir, buildDir)} (version ${manifest.version}).`);
