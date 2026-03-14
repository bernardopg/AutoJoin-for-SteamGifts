const test = require('node:test');
const assert = require('node:assert/strict');

const {
  extractStoreUserData,
  normalizeSteamAppList,
} = require('../js/core/steam-store');

test('normalizeSteamAppList handles numeric arrays and deduplicates ids', () => {
  assert.deepEqual(normalizeSteamAppList([10, '20', 10, '30']), [10, 20, 30]);
});

test('normalizeSteamAppList handles keyed wishlist objects', () => {
  assert.deepEqual(
    normalizeSteamAppList({
      730: 1730000000,
      440: 1730000100,
    }),
    [440, 730],
  );
});

test('extractStoreUserData supports Steam Store dynamicstore payloads', () => {
  assert.deepEqual(
    extractStoreUserData({
      rgOwnedApps: [570, '730'],
      rgWishlist: {
        440: 1730000000,
        570: 1730000001,
      },
    }),
    {
      ownedGames: [570, 730],
      wishlist: [440, 570],
    },
  );
});
