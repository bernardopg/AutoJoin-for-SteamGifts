const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createGiveawayHelpers,
  secToTime,
} = require('../js/core/autoentry-giveaway');

function makeHelpers(settingsOverrides = {}, stateOverrides = {}) {
  const state = {
    settings: {
      PriorityWishlist: false,
      PriorityGroup: false,
      PriorityRegion: false,
      PriorityWhitelist: false,
      IgnoreGroups: false,
      IgnoreWhitelist: false,
      HideDlc: false,
      HideNonTradingCards: false,
      HideGroups: false,
      HideWhitelist: false,
      ...settingsOverrides,
    },
    ownedSteamApps: [],
    wishList: [],
    steamAppData: {},
    steamPackageData: {},
    ...stateOverrides,
  };

  return createGiveawayHelpers({
    state,
    t: (key) => key,
    chrome: {
      storage: {
        local: {
          set: () => {},
        },
      },
      runtime: {
        lastError: null,
      },
    },
    document: {
      createElement: () => ({}),
      createTextNode: (value) => ({ value }),
    },
    thisVersion: 1,
  });
}

function makeGiveaway(appId, { group = false, whitelist = false } = {}) {
  return {
    querySelector(selector) {
      if (selector === '.fa-steam') {
        return {
          parentElement: {
            href: `https://store.steampowered.com/app/${appId}/`,
          },
        };
      }

      if (selector === '.giveaway__column--group') {
        return group ? {} : null;
      }

      if (selector === '.giveaway__column--whitelist') {
        return whitelist ? {} : null;
      }

      return null;
    },
  };
}

test('secToTime formats long and short durations', () => {
  assert.equal(secToTime(59), '59 s');
  assert.equal(secToTime(125), '02:05');
  assert.equal(secToTime(3661), '1:01:01');
  assert.equal(secToTime(90061), '1d 1:01:01');
});

test('priority and ignore rules follow the configured flags', () => {
  const helpers = makeHelpers(
    {
      PriorityWishlist: true,
      PriorityGroup: true,
      PriorityRegion: true,
      PriorityWhitelist: true,
      IgnoreGroups: true,
      IgnoreWhitelist: true,
    },
    {
      wishList: [123],
    },
  );

  assert.equal(
    helpers.priorityGiveaway(makeGiveaway(123), false, false, false),
    true,
  );
  assert.equal(
    helpers.priorityGiveaway(makeGiveaway(456), true, false, false),
    true,
  );
  assert.equal(
    helpers.priorityGiveaway(makeGiveaway(456), false, true, false),
    true,
  );
  assert.equal(
    helpers.priorityGiveaway(makeGiveaway(456), false, false, true),
    true,
  );
  assert.equal(helpers.ignoreGiveaway(true, false), true);
  assert.equal(helpers.ignoreGiveaway(false, true), true);
  assert.equal(helpers.ignoreGiveaway(false, false), false);
});

test('filter rules remove owned, DLC, group, and whitelist giveaways', () => {
  const helpers = makeHelpers(
    {
      HideNonTradingCards: true,
      HideDlc: true,
      HideGroups: true,
      HideWhitelist: true,
    },
    {
      ownedSteamApps: [100],
      wishList: [200],
    },
  );

  assert.equal(
    helpers.filterGiveaway(makeGiveaway(100), 100, 'game', true),
    true,
  );
  assert.equal(
    helpers.filterGiveaway(makeGiveaway(200), 200, 'game', true),
    false,
  );
  assert.equal(
    helpers.filterGiveaway(makeGiveaway(300), 300, 'game', false),
    true,
  );
  assert.equal(
    helpers.filterGiveaway(makeGiveaway(301), 301, 'dlc', true),
    true,
  );
  assert.equal(
    helpers.filterGiveaway(
      makeGiveaway(302, { group: true }),
      302,
      'game',
      true,
    ),
    true,
  );
  assert.equal(
    helpers.filterGiveaway(
      makeGiveaway(303, { whitelist: true }),
      303,
      'game',
      true,
    ),
    true,
  );
});
