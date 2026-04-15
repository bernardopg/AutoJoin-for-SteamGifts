const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getPriorityScore,
  shouldFilterGiveaway,
} = require('../js/core/giveaway');

const giveaway = (overrides = {}) => ({
  appid: 123,
  level: 5,
  cost: 10,
  status: { Entered: false },
  isDLC: false,
  hasTradingCards: true,
  isGroupGA: false,
  isWhitelistGA: false,
  isRegionLocked: false,
  ...overrides,
});

test('shouldFilterGiveaway applies the expected pure rules', () => {
  const settings = {
    HideLevelsBelow: 1,
    HideLevelsAbove: 10,
    HideCostsBelow: 0,
    HideCostsAbove: 50,
    HideEntered: true,
    HideDlc: true,
    HideNonTradingCards: true,
    HideGroups: true,
    HideWhitelist: true,
  };

  assert.equal(shouldFilterGiveaway(giveaway(), settings, [], []), false);
  assert.equal(
    shouldFilterGiveaway(
      giveaway({ status: { Entered: true } }),
      settings,
      [],
      [],
    ),
    true,
  );
  assert.equal(
    shouldFilterGiveaway(giveaway({ isDLC: true }), settings, [], []),
    true,
  );
  assert.equal(
    shouldFilterGiveaway(
      giveaway({ hasTradingCards: false }),
      settings,
      [],
      [],
    ),
    true,
  );
  assert.equal(
    shouldFilterGiveaway(giveaway({ isGroupGA: true }), settings, [], []),
    true,
  );
  assert.equal(
    shouldFilterGiveaway(giveaway({ isWhitelistGA: true }), settings, [], []),
    true,
  );
  assert.equal(shouldFilterGiveaway(giveaway(), settings, [123], []), true);
  assert.equal(shouldFilterGiveaway(giveaway(), settings, [], [123]), false);
});

test('getPriorityScore combines wishlist, group, region, whitelist, level, and odds', () => {
  const settings = {
    PriorityWishlist: true,
    PriorityGroup: true,
    PriorityRegion: true,
    PriorityWhitelist: true,
    LevelPriority: true,
    OddsPriority: true,
  };

  assert.equal(
    getPriorityScore(
      giveaway({
        isGroupGA: true,
        isRegionLocked: true,
        isWhitelistGA: true,
        level: 3,
      }),
      settings,
      [123],
      7,
    ),
    1000 + 100 + 50 + 25 + 30 + 7,
  );
});
