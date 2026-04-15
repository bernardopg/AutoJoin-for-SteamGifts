const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const modulePath = path.resolve(__dirname, '../js/core/settings-actions.js');
const moduleSource = fs.readFileSync(modulePath, 'utf8');

function loadSettingsActions({ confirmResult = true } = {}) {
  const fillSettingsDivCalls = [];
  const syncDirtyStateCalls = [];
  const confirmCalls = [];

  const context = {
    console,
    globalThis: null,
    module: { exports: {} },
    exports: {},
    confirm: (message) => {
      confirmCalls.push(message);
      return confirmResult;
    },
  };
  context.globalThis = context;

  vm.runInNewContext(moduleSource, context, { filename: modulePath });

  const actions = context.module.exports;
  const settingsStore = {
    getDefaults: () => ({
      AutoJoinButton: false,
      PagesToLoad: 3,
      NightTheme: false,
    }),
  };
  const controller = actions.createSettingsActions({
    settingsStore,
    confirm: context.confirm,
    translate: (key) => key,
    fillSettingsDiv: (settings, options) => {
      fillSettingsDivCalls.push({ settings, options });
    },
    syncDirtyState: (payload) => {
      syncDirtyStateCalls.push(payload);
    },
  });

  return {
    controller,
    fillSettingsDivCalls,
    syncDirtyStateCalls,
    confirmCalls,
  };
}

test('resetSettingsToDefaults restores the form from store defaults', async () => {
  const {
    controller,
    fillSettingsDivCalls,
    syncDirtyStateCalls,
    confirmCalls,
  } = loadSettingsActions();

  const result = await controller.resetSettingsToDefaults();

  assert.equal(confirmCalls[0], 'settings.actions.resetConfirm');
  assert.equal(result.reset, true);
  assert.equal(result.defaults.AutoJoinButton, false);
  assert.equal(result.defaults.PagesToLoad, 3);
  assert.equal(result.defaults.NightTheme, false);
  assert.equal(fillSettingsDivCalls.length, 1);
  assert.equal(fillSettingsDivCalls[0].settings.AutoJoinButton, false);
  assert.equal(fillSettingsDivCalls[0].settings.PagesToLoad, 3);
  assert.equal(fillSettingsDivCalls[0].settings.NightTheme, false);
  assert.equal(fillSettingsDivCalls[0].options.persisted, false);
  assert.equal(syncDirtyStateCalls.length, 1);
  assert.equal(syncDirtyStateCalls[0].statusKey, 'settings.actions.resetDone');
  assert.equal(syncDirtyStateCalls[0].tone, 'info');
});

test('resetSettingsToDefaults aborts when the user cancels confirmation', async () => {
  const {
    controller,
    fillSettingsDivCalls,
    syncDirtyStateCalls,
    confirmCalls,
  } = loadSettingsActions({ confirmResult: false });

  const result = await controller.resetSettingsToDefaults();

  assert.equal(confirmCalls[0], 'settings.actions.resetConfirm');
  assert.equal(result.reset, false);
  assert.equal(result.cancelled, true);
  assert.equal(fillSettingsDivCalls.length, 0);
  assert.equal(syncDirtyStateCalls.length, 0);
});
