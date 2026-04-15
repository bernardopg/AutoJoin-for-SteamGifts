import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rootDir = process.cwd();
const i18n = require('../js/core/i18n');

const failures = [];
const locales = i18n.listLocales();
const baselineLocale = 'en';
const baselineKeys = Object.keys(i18n.getCatalog(baselineLocale)).sort();

for (const locale of locales) {
  const currentKeys = Object.keys(i18n.getCatalog(locale)).sort();
  const missingKeys = baselineKeys.filter((key) => !currentKeys.includes(key));
  const extraKeys = currentKeys.filter((key) => !baselineKeys.includes(key));

  if (missingKeys.length > 0 || extraKeys.length > 0) {
    failures.push(
      `${locale}: missing [${missingKeys.join(', ')}], extra [${extraKeys.join(', ')}]`,
    );
  }
}

const readLocaleMessages = (localeDir) =>
  JSON.parse(
    fs.readFileSync(
      path.join(rootDir, '_locales', localeDir, 'messages.json'),
      'utf8',
    ),
  );

const extensionLocales = {
  en: readLocaleMessages('en'),
  pt_BR: readLocaleMessages('pt_BR'),
};
const extensionBaselineKeys = Object.keys(extensionLocales.en).sort();

for (const [locale, catalog] of Object.entries(extensionLocales)) {
  const keys = Object.keys(catalog).sort();
  const missingKeys = extensionBaselineKeys.filter(
    (key) => !keys.includes(key),
  );
  const extraKeys = keys.filter((key) => !extensionBaselineKeys.includes(key));

  if (missingKeys.length > 0 || extraKeys.length > 0) {
    failures.push(
      `_locales/${locale}: missing [${missingKeys.join(', ')}], extra [${extraKeys.join(', ')}]`,
    );
  }
}

if (failures.length > 0) {
  console.error('i18n drift detected:\n');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `i18n OK: ${locales.length} application locales + extension manifest locales are aligned.`,
);
