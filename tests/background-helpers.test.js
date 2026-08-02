const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateWinChance,
  looksLikeSteamSessionBlocked,
  matchesHost,
} = require('../js/core/background-helpers');

test('calculateWinChance returns the expected estimate', () => {
  const chance = calculateWinChance(0, 0, 9, 1, 20);
  assert.equal(chance, 10);
});

test('looksLikeSteamSessionBlocked detects steam login walls', () => {
  assert.equal(
    looksLikeSteamSessionBlocked(
      'https://steamcommunity.com/profiles/123',
      '<title> Sign In </title>',
    ),
    true,
  );
  assert.equal(
    looksLikeSteamSessionBlocked(
      'https://store.steampowered.com/wishlist',
      '<title> Wishlist - Error </title>',
    ),
    true,
  );
  assert.equal(
    looksLikeSteamSessionBlocked(
      'https://www.steamgifts.com/',
      '<title> Sign In </title>',
    ),
    false,
  );
});

test('matchesHost compares the hostname, not a substring', () => {
  assert.equal(
    matchesHost('https://steamcommunity.com/x', 'steamcommunity.com'),
    true,
  );
  assert.equal(
    matchesHost('https://api.steamcommunity.com/x', 'steamcommunity.com'),
    true,
  );
  assert.equal(
    matchesHost('https://steamcommunity.com.evil.tld/x', 'steamcommunity.com'),
    false,
  );
  assert.equal(
    matchesHost('https://evil.tld/?q=steamcommunity.com', 'steamcommunity.com'),
    false,
  );
  assert.equal(matchesHost('not a url', 'steamcommunity.com'), false);
});

test('looksLikeSteamSessionBlocked ignores spoofed steam hosts', () => {
  assert.equal(
    looksLikeSteamSessionBlocked(
      'https://steamcommunity.com.evil.tld/profiles/123',
      '<title> Sign In </title>',
    ),
    false,
  );
  assert.equal(
    looksLikeSteamSessionBlocked(
      'https://store.steampowered.com/app/1',
      '<title> Wishlist - Error </title>',
    ),
    false,
  );
});
