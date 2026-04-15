const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const fixturePath = path.resolve(
  __dirname,
  'fixtures/steamgifts/homepage.html',
);
const giveawayCardPath = path.resolve(
  __dirname,
  'fixtures/steamgifts/giveaway-card.html',
);
const homepageHtml = fs.readFileSync(fixturePath, 'utf8');
const giveawayCardHtml = fs.readFileSync(giveawayCardPath, 'utf8');

test('SteamGifts homepage fixture still exposes parser-facing selectors', () => {
  const giveawayRows = homepageHtml.match(/giveaway__row-outer-wrap/g) || [];

  assert.ok(giveawayRows.length > 0, 'fixture should contain giveaway rows');
  assert.doesNotMatch(homepageHtml, /pagead2\.googlesyndication/);
  assert.match(homepageHtml, /giveaway__heading__name/);
  assert.match(homepageHtml, /giveaway__links/);
  assert.match(homepageHtml, /fa-clock-o/);
  assert.match(homepageHtml, /nav__points/);
});

test('focused giveaway card fixture keeps the minimum parser selectors', () => {
  assert.match(giveawayCardHtml, /giveaway__row-outer-wrap/);
  assert.match(giveawayCardHtml, /giveaway__heading__name/);
  assert.match(giveawayCardHtml, /giveaway__links/);
  assert.match(giveawayCardHtml, /fa-clock-o/);
});
