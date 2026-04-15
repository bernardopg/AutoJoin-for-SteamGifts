const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateWinChance,
  looksLikeSteamSessionBlocked,
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
