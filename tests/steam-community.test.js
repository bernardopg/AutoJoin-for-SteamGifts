const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const { extractSteamIdFromProfileHtml } = require('../js/core/steam-community');

const fixturePath = (name) =>
  path.resolve(__dirname, 'fixtures/steam-community', name);

test('extracts steamid from g_rgProfileData for vanity profiles', () => {
  const profileData = fs
    .readFileSync(fixturePath('vanity-profile-data.json'), 'utf8')
    .trim();
  const html = `<html><script>g_rgProfileData = ${profileData};</script><a href="https://steamcommunity.com/profiles/76561198088078416/">Other profile</a></html>`;

  assert.equal(extractSteamIdFromProfileHtml(html), '76561198893709131');
});

test('falls back to numeric profile url when profile data is missing', () => {
  assert.equal(
    extractSteamIdFromProfileHtml(
      fs.readFileSync(fixturePath('numeric-profile.html'), 'utf8'),
    ),
    '76561198000000000',
  );
});
