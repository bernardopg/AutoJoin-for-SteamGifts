const test = require('node:test');
const assert = require('node:assert/strict');

const i18n = require('../js/core/i18n');

test('normalizes supported locales', () => {
  assert.equal(i18n.normalizeLocale('pt-BR'), 'pt-BR');
  assert.equal(i18n.normalizeLocale('pt_BR'), 'pt-BR');
  assert.equal(i18n.normalizeLocale('pt'), 'pt-BR');
  assert.equal(i18n.normalizeLocale('en-US'), 'en');
  assert.equal(i18n.normalizeLocale('auto'), 'auto');
});

test('falls back to English for unknown locales', () => {
  assert.equal(i18n.resolveLocale('de-DE'), 'en');
});

test('returns translated strings with interpolation', () => {
  i18n.setLocale('pt-BR');
  assert.equal(
    i18n.t('content.notifications.autoJoinSummary.other', { count: 3 }),
    '3 sorteios participados com sucesso',
  );

  i18n.setLocale('en');
  assert.equal(
    i18n.t('validation.rangeError', {
      name: 'Delay',
      min: 5,
      max: 60,
    }),
    'Delay must be between 5 and 60',
  );
});
