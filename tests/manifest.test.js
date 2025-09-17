const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const fileExists = (relativePath) =>
  fs.existsSync(path.join(rootDir, relativePath));

test('manifest metadata is present', () => {
  assert.equal(manifest.manifest_version, 3, 'Extension must use Manifest V3');
  assert.equal(manifest.name, 'AutoJoin for SteamGifts');
  assert.equal(typeof manifest.version, 'string');
  assert.ok(Array.isArray(manifest.permissions));
  assert.ok(manifest.permissions.includes('storage'));
});

test('background service worker is reachable', () => {
  assert.ok(
    fileExists(manifest.background.service_worker),
    `Missing background service worker: ${manifest.background.service_worker}`,
  );
});

test('content script bundles exist', () => {
  manifest.content_scripts
    .flatMap((entry) => entry.js || [])
    .forEach((scriptPath) => {
      assert.ok(
        fileExists(scriptPath),
        `Missing content script: ${scriptPath}`,
      );
    });

  manifest.content_scripts
    .flatMap((entry) => entry.css || [])
    .forEach((stylePath) => {
      assert.ok(fileExists(stylePath), `Missing stylesheet: ${stylePath}`);
    });
});

test('icon assets are available', () => {
  Object.values(manifest.icons).forEach((iconPath) => {
    assert.ok(fileExists(iconPath), `Missing icon asset: ${iconPath}`);
  });
});

test('host permissions include SteamGifts domains', () => {
  const hostPermissions = manifest.host_permissions || [];
  const optionalHosts = manifest.optional_host_permissions || [];
  const contentMatches = manifest.content_scripts.flatMap(
    (entry) => entry.matches || [],
  );
  const combined = [...contentMatches, ...hostPermissions, ...optionalHosts];

  assert.ok(
    combined.some((pattern) => pattern.includes('steamgifts.com')),
    'Expect SteamGifts host permissions in manifest',
  );
});
