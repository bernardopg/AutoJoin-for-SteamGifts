import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'build/**', 'dist/**', 'css/fontawesome/**'],
  },
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        ...globals.webextensions,
        $: 'readonly',
        importScripts: 'readonly',
        // Scripts are loaded as classic scripts and share these via globalThis.
        loadSettings: 'writable',
        AutoJoinUtils: 'readonly',
        Giveaway: 'readonly',
        // js/core modules double as CommonJS for the test suite.
        module: 'writable',
        require: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'warn',
      'no-param-reassign': ['error', { props: false }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-console': 'off',
    },
  },
  {
    // Files that own the shared classic-script globals declared above.
    files: ['js/core/giveaway.js', 'js/settings.js', 'js/utils-enhanced.js'],
    rules: { 'no-redeclare': 'off' },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
  },
];
