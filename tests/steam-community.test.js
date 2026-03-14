const test = require('node:test');
const assert = require('node:assert/strict');

const { extractSteamIdFromProfileHtml } = require('../js/core/steam-community');

test('extracts steamid from g_rgProfileData for vanity profiles', () => {
  const html = `
    <html>
      <script>
        g_rgProfileData = {"url":"https://steamcommunity.com/id/omg_bitter/","steamid":"76561198893709131","personaname":"Bitter"};
      </script>
      <a href="https://steamcommunity.com/profiles/76561198088078416/">Other profile</a>
    </html>
  `;

  assert.equal(extractSteamIdFromProfileHtml(html), '76561198893709131');
});

test('falls back to numeric profile url when profile data is missing', () => {
  const html = `
    <html>
      <a href="https://steamcommunity.com/profiles/76561198000000000/">Profile</a>
    </html>
  `;

  assert.equal(extractSteamIdFromProfileHtml(html), '76561198000000000');
});
