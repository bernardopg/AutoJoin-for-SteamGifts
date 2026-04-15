const test = require('node:test');
const assert = require('node:assert/strict');

const i18n = require('../js/core/i18n');

test('exposes locale catalogs for tooling and validation', () => {
  assert.deepEqual(i18n.listLocales().sort(), ['en', 'pt-BR']);

  const englishCatalog = i18n.getCatalog('en');
  const portugueseCatalog = i18n.getCatalog('pt-BR');

  assert.equal(typeof englishCatalog['settings.title'], 'string');
  assert.equal(typeof portugueseCatalog['settings.title'], 'string');
});

test('translation catalogs keep the same keys across locales', () => {
  const baselineKeys = Object.keys(i18n.getCatalog('en')).sort();

  i18n.listLocales().forEach((locale) => {
    assert.deepEqual(
      Object.keys(i18n.getCatalog(locale)).sort(),
      baselineKeys,
      `Locale ${locale} is missing or adding translation keys`,
    );
  });
});
