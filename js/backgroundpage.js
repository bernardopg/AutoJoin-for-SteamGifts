importScripts('core/i18n.js', 'core/settings-store.js', 'core/steam-store.js');

/*
  This script page is the background script. autoentry.js is the autojoin button and other page
  modifications
*/

/* Offscreen weirdness, to use DOMParser and Audio with manifest v3...*/
let creating;
const setupOffscreenDocument = async (path) => {
  const offscreenUrl = chrome.runtime.getURL(path);
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [offscreenUrl],
  });

  if (existingContexts.length > 0) {
    return;
  }

  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ['DOM_PARSER', 'AUDIO_PLAYBACK'],
      justification:
        'Parsing HTML returned by fetch request to get useful data',
    });
    await creating;
    creating = null;
  }
};

const parseHTML = async (html) => {
  await setupOffscreenDocument('html/offscreen.html');

  return new Promise((resolve) => {
    // Correlate requests to a single response from offscreen context
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const onDone = (msg) => {
      if (
        msg &&
        msg.target === 'background' &&
        msg.type === 'parsed' &&
        msg.requestId === requestId
      ) {
        chrome.runtime.onMessage.removeListener(onDone);
        resolve(msg.payload);
      }
    };
    chrome.runtime.onMessage.addListener(onDone);
    // Send message to offscreen document
    chrome.runtime.sendMessage({
      task: 'parse',
      target: 'offscreen',
      requestId,
      data: html,
    });
  });
};

const playAudio = async (volume) => {
  await setupOffscreenDocument('html/offscreen.html');
  chrome.runtime.sendMessage({
    task: 'audio',
    target: 'offscreen',
    data: volume,
  });
};

const createTab = (createProperties) =>
  new Promise((resolve, reject) => {
    chrome.tabs.create(createProperties, (tab) => {
      const { lastError } = chrome.runtime;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }
      resolve(tab);
    });
  });

const removeTab = (tabId) =>
  new Promise((resolve, reject) => {
    chrome.tabs.remove(tabId, () => {
      const { lastError } = chrome.runtime;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }
      resolve();
    });
  });

const getTab = (tabId) =>
  new Promise((resolve, reject) => {
    chrome.tabs.get(tabId, (tab) => {
      const { lastError } = chrome.runtime;
      if (lastError) {
        reject(new Error(lastError.message));
        return;
      }
      resolve(tab);
    });
  });

const executeScript = (tabId, func, args = []) =>
  new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func,
        args,
      },
      (results) => {
        const { lastError } = chrome.runtime;
        if (lastError) {
          reject(new Error(lastError.message));
          return;
        }
        resolve(results);
      },
    );
  });

const waitForTabComplete = (tabId, timeoutMs = 15000) =>
  new Promise((resolve, reject) => {
    let resolved = false;
    const cleanup = () => {
      chrome.tabs.onUpdated.removeListener(onUpdated);
      clearTimeout(timeoutId);
    };
    const finish = (value) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(value);
    };
    const fail = (error) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      reject(error);
    };
    const onUpdated = (updatedTabId, changeInfo, tab) => {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        finish(tab);
      }
    };
    const timeoutId = setTimeout(() => {
      fail(new Error(`Timed out waiting for tab ${tabId} to finish loading`));
    }, timeoutMs);

    chrome.tabs.onUpdated.addListener(onUpdated);
    getTab(tabId)
      .then((tab) => {
        if (tab?.status === 'complete') {
          finish(tab);
        }
      })
      .catch(fail);
  });

const looksLikeSteamSessionBlocked = (url, html) => {
  if (!html) return false;

  if (
    url.includes('steamcommunity.com') &&
    /<title>\s*Sign In\s*<\/title>/i.test(html)
  ) {
    return true;
  }

  if (
    url.includes('store.steampowered.com/wishlist') &&
    /<title>\s*Wishlist - Error\s*<\/title>/i.test(html)
  ) {
    return true;
  }

  return false;
};

const fetchPageWithBrowserSession = async (url) => {
  let tab;

  try {
    tab = await createTab({ url, active: false });
    await waitForTabComplete(tab.id);

    const [result] = await executeScript(
      tab.id,
      async (delayMs) => {
        await new Promise((resolve) => {
          setTimeout(resolve, delayMs);
        });

        return {
          title: document.title,
          html: document.documentElement.outerHTML,
        };
      },
      [1200],
    );

    return {
      status: 200,
      text: result?.result?.html || '',
      title: result?.result?.title || '',
    };
  } finally {
    if (tab?.id) {
      removeTab(tab.id).catch((error) => {
        console.warn('Failed to remove temporary Steam tab:', error);
      });
    }
  }
};

const fetchSteamStoreUserDataWithBrowserSession = async () => {
  let tab;

  try {
    tab = await createTab({
      url: 'https://store.steampowered.com/',
      active: false,
    });
    await waitForTabComplete(tab.id);

    const [result] = await executeScript(
      tab.id,
      async (delayMs) => {
        await new Promise((resolve) => {
          setTimeout(resolve, delayMs);
        });

        const isLoggedIn =
          Boolean(document.querySelector('#global_actions .playerAvatar')) ||
          Boolean(document.querySelector('#account_pulldown')) ||
          Boolean(
            document.querySelector('a.global_action_link[href*="logout"]'),
          );

        try {
          const response = await fetch('/dynamicstore/userdata/', {
            credentials: 'include',
            headers: {
              accept: 'application/json',
            },
          });
          const text = await response.text();
          let data = null;

          try {
            data = JSON.parse(text);
          } catch (error) {
            data = null;
          }

          return {
            isLoggedIn,
            ok: response.ok,
            status: response.status,
            data,
          };
        } catch (error) {
          return {
            isLoggedIn,
            ok: false,
            status: 0,
            error: error.message,
          };
        }
      },
      [1200],
    );

    const payload = result?.result || {};
    const normalized = steamStoreHelper?.extractStoreUserData(payload.data) || {
      ownedGames: [],
      wishlist: [],
    };

    return {
      status: payload.status || 0,
      ok: Boolean(payload.ok),
      isLoggedIn: Boolean(payload.isLoggedIn),
      ownedGames: normalized.ownedGames,
      wishlist: normalized.wishlist,
      error: payload.error || '',
    };
  } finally {
    if (tab?.id) {
      removeTab(tab.id).catch((error) => {
        console.warn('Failed to remove temporary Steam Store tab:', error);
      });
    }
  }
};

/* Variables declaration */
let arr = [];
let settings;
const link = 'https://www.steamgifts.com/giveaways/search?page=';
let pages = 1;
let pagestemp = pages;
let token = '';
let mylevel = 0;
let timepassed = 0;
let timetopass = 100;
let justLaunched = true;
const thisVersion = 20170929;
let totalWishlistGAcnt = 0;
let useWishlistPriorityForMainBG = false;
let currPoints = 0;
const backgroundSettingsStore = globalThis.AutoJoinSettingsStore;
const backgroundI18n = globalThis.AutoJoinI18n;
const steamStoreHelper = globalThis.AutoJoinSteamStore;

const bgT = (key, params = {}) => {
  backgroundI18n?.setLocale(settings?.Language || 'auto');
  return backgroundI18n ? backgroundI18n.t(key, params) : key;
};

const steamKeyRedeemResponses = {
  0: 'NoDetail',
  1: 'AVSFailure',
  2: 'InsufficientFunds',
  3: 'ContactSupport',
  4: 'Timeout',
  5: 'InvalidPackage',
  6: 'InvalidPaymentMethod',
  7: 'InvalidData',
  8: 'OthersInProgress',
  9: 'AlreadyPurchased',
  10: 'WrongPrice',
  11: 'FraudCheckFailed',
  12: 'CancelledByUser',
  13: 'RestrictedCountry',
  14: 'BadActivationCode',
  15: 'DuplicateActivationCode',
  16: 'UseOtherPaymentMethod',
  17: 'UseOtherFunctionSource',
  18: 'InvalidShippingAddress',
  19: 'RegionNotSupported',
  20: 'AcctIsBlocked',
  21: 'AcctNotVerified',
  22: 'InvalidAccount',
  23: 'StoreBillingCountryMismatch',
  24: 'DoesNotOwnRequiredApp',
  25: 'CanceledByNewTransaction',
  26: 'ForceCanceledPending',
  27: 'FailCurrencyTransProvider',
  28: 'FailedCyberCafe',
  29: 'NeedsPreApproval',
  30: 'PreApprovalDenied',
  31: 'WalletCurrencyMismatch',
  32: 'EmailNotValidated',
  33: 'ExpiredCard',
  34: 'TransactionExpired',
  35: 'WouldExceedMaxWallet',
  36: 'MustLoginPS3AppForPurchase',
  37: 'CannotShipToPOBox',
  38: 'InsufficientInventory',
  39: 'CannotGiftShippedGoods',
  40: 'CannotShipInternationally',
  41: 'BillingAgreementCancelled',
  42: 'InvalidCoupon',
  43: 'ExpiredCoupon',
  44: 'AccountLocked',
  45: 'OtherAbortableInProgress',
  46: 'ExceededSteamLimit',
  47: 'OverlappingPackagesInCart',
  48: 'NoWallet',
  49: 'NoCachedPaymentMethod',
  50: 'CannotRedeemCodeFromClient',
  51: 'PurchaseAmountNoSupportedByProvider',
  52: 'OverlappingPackagesInPendingTransaction',
  53: 'RateLimited',
  54: 'OwnsExcludedApp',
  55: 'CreditCardBinMismatchesType',
  56: 'CartValueTooHigh',
  57: 'BillingAgreementAlreadyExists',
  58: 'POSACodeNotActivated',
  59: 'CannotShipToCountry',
  60: 'HungTransactionCancelled',
  61: 'PaypalInternalError',
  62: 'UnknownGlobalCollectError',
  63: 'InvalidTaxAddress',
  64: 'PhysicalProductLimitExceeded',
  65: 'PurchaseCannotBeReplayed',
  66: 'DelayedCompletion',
  67: 'BundleTypeCannotBeGifted',
};

const findAndRedeemKeys = async (wonPage) => {
  // Notifies about the steams response of a key sent to be redeemed
  const notifySteamCodeResponse = (info) => {
    notify('key', info);
  };

  for (const keyBtn of wonPage.querySelectorAll('.view_key_btn')) {
    // Get necessary data
    const dataForm =
      keyBtn.parentElement.nextElementSibling.querySelector('form');
    const winnerId = dataForm.querySelector("input[name='winner_id']").value;
    const xsrfToken = dataForm.querySelector("input[name='xsrf_token']").value;
    let latestSteamKeyRedeemResponse = ''; // for debugging

    // Request the won key
    const formData = new FormData();
    formData.append('do', 'view_key');
    formData.append('winner_id', winnerId);
    formData.append('xsrf_token', xsrfToken);

    const res = await fetch('https://www.steamgifts.com/ajax.php', {
      method: 'post',
      body: formData,
    });
    if (res.ok) {
      const json = await res.json();

      // This should be remade
      const data = JSON.stringify(json);
      const keyStartIndex = data.indexOf('?key=') + 5;
      const keyEndIndex =
        keyStartIndex + data.substring(data.indexOf('?key=')).indexOf('\\') - 5;
      const key = data.substring(keyStartIndex, keyEndIndex); // RIP

      // Check key format
      if (
        /^[a-zA-Z0-9]{4,6}\\-[a-zA-Z0-9]{4,6}\\-[a-zA-Z0-9]{4,6}$/.test(key)
      ) {
        const res = await fetch('//store.steampowered.com');
        const data = await res.text();

        // Check if user is logged in on Steam
        if (data.indexOf('playerAvatar') != -1) {
          const steamSessionId = data.substring(
            data.indexOf('g_sessionID') + 15,
            data.indexOf('g_sessionID') + 15 + 24,
          );

          const formData = new FormData();
          formData.append('product_key', key);
          formData.append('sessionid', steamSessionId);
          const res = await fetch(
            'https://store.steampowered.com/account/ajaxregisterkey/',
            {
              method: 'post',
              body: formData,
            },
          );
          if (res.ok) {
            const data = res.json();
            latestSteamKeyRedeemResponse = JSON.stringify(data); // for debugging

            const itemsList = data.purchase_receipt_info.line_items.map(
              (item) => item.line_item_description,
            );
            const redeemedGames = itemsList.join(',');

            console.debug(
              steamKeyRedeemResponses[data.purchase_result_details],
            );

            // Check response (success needs to be exactly 1, no more, no less)
            if (data.success === 1) {
              console.debug(
                bgT('background.keyRedeem.success', {
                  games: redeemedGames,
                }),
              );
              notifySteamCodeResponse(
                bgT('background.keyRedeem.success', {
                  games: redeemedGames,
                }),
              );

              // Mark as received
              const formData = new FormData();
              formData.append('xsrf_token', xsrfToken);
              formData.append('do', 'received_feedback');
              formData.append('action', '1');
              formData.append('winner_id', 'winnerId');
              const res = await fetch('https://www.steamgifts.com/ajax.php', {
                method: 'post',
                body: formData,
              });
              if (!res.ok)
                console.error(
                  `Error while trying to mark giveaway as received: HTTP ${res.status}`,
                );
            } else if (
              steamKeyRedeemResponses[data.purchase_result_details] != undefined
            ) {
              // In case there is an error but the names of the games failed to be redeemed are also returned
              if (redeemedGames != '') {
                console.warn(
                  bgT('background.keyRedeem.failureWithGame', {
                    key,
                    games: redeemedGames,
                    reason:
                      steamKeyRedeemResponses[data.purchase_result_details],
                  }),
                );
                notifySteamCodeResponse(
                  bgT('background.keyRedeem.failureWithGame', {
                    key,
                    games: redeemedGames,
                    reason:
                      steamKeyRedeemResponses[data.purchase_result_details],
                  }),
                );
              } else {
                console.warn(
                  bgT('background.keyRedeem.failure', {
                    key,
                    reason:
                      steamKeyRedeemResponses[data.purchase_result_details],
                  }),
                );
                notifySteamCodeResponse(
                  bgT('background.keyRedeem.failure', {
                    key,
                    reason:
                      steamKeyRedeemResponses[data.purchase_result_details],
                  }),
                );
              }
            } else {
              console.warn(
                bgT('background.keyRedeem.unknown', { key }),
                latestSteamKeyRedeemResponse,
              );
              notifySteamCodeResponse(
                bgT('background.keyRedeem.unknown', { key }),
              );
            }
          } else {
            console.error(`Error registering key on Steam: HTTP ${res.status}`);
          }
        } else {
          console.warn(
            '[!] Not logged in on Steam! Code: ' + key + ' was not redeemed!',
          );
          notifySteamCodeResponse(
            'Not logged in on Steam!\nCode: ' + key + ' was not redeemed!',
          );
        }
      } else {
        console.warn('[AutoJoin] Invalid key format received from Steam.');
        notifySteamCodeResponse(
          'Invalid Format!\nCode: ' + key + ' was not redeemed!',
        );
      }
    } else {
      console.error(`Error while trying to fetch a key: HTTP ${res.status}`);
    }
  }
};

globalThis.findAndRedeemKeys = findAndRedeemKeys;

// Minimal Giveaway representation for background worker (decoupled from content scripts)
class BGGiveaway {
  constructor(data) {
    this.code = data.code;
    this.appid = data.appid;
    this.cost = data.cost;
    this.timeleft = data.timeleft;
    this.level = data.level;
    this.numberOfCopies = data.numberOfCopies || 1;
    this.numberOfEntries = data.numberOfEntries || 0;
    this.status = data.status || {
      Entered: false,
      NoPoints: false,
      NoLevel: false,
    };
    this.odds = data.odds || 0;
  }

  getUrl() {
    return `https://www.steamgifts.com/giveaway/${this.code}/`;
  }
}

const compareLevel = (a, b) => b.level - a.level;
const compareOdds = (a, b) => b.odds - a.odds;

const calculateWinChance = (
  timeLeft,
  timeStart,
  numberOfEntries,
  numberOfCopies,
  timeLoaded,
) => {
  const timePassed = timeLoaded - timeStart; // time passed in seconds
  // calculate rate of entries and multiply by time left,
  // probably not very accurate as we assume linear rate
  const predictionOfEntries = (numberOfEntries / timePassed) * timeLeft;
  const chance =
    (1 / (numberOfEntries + 1 + predictionOfEntries)) * 100 * numberOfCopies;
  return chance;
};

const notify = async (type, msg) => {
  switch (type) {
    case 'win':
      try {
        const response = await fetch(
          'https://www.steamgifts.com/giveaways/won',
        );
        if (!response.ok) {
          console.error(
            `Could not fetch /giveaways/won page: HTTP ${response.status}`,
          );
          break;
        }
        const wonPageHtml = await response.text();
        // Parse name via offscreen document (service workers don't have DOMParser)
        const parsed = await parseHTML({
          items: ['won', 'wonName'],
          html: wonPageHtml,
        });
        const name = parsed.wonName || bgT('background.winFallbackName');

        chrome.notifications.clear('won_notification', () => {
          const e = {
            type: 'basic',
            title: bgT('background.title'),
            message: bgT('background.notifications.win', { name }),
            iconUrl: chrome.runtime.getURL('./media/autologosteam.png'),
          };
          chrome.notifications.create('won_notification', e, () => {
            backgroundSettingsStore
              ?.load()
              .then((data) => {
                if (data.PlayAudio === true) {
                  playAudio(data.AudioVolume);
                }
              })
              .catch((error) => {
                console.error('Failed to read audio settings:', error);
              });
          });
        });
        if (settings?.AutoRedeemKey) {
          // Delegate key redemption to offscreen document
          await setupOffscreenDocument('html/offscreen.html');
          chrome.runtime.sendMessage({
            task: 'redeemKeys',
            target: 'offscreen',
            data: { html: wonPageHtml },
          });
        }
      } catch (err) {
        console.error('Error while notifying about a win:', err);
      }
      break;
    case 'points':
      chrome.notifications.clear('points_notification', () => {
        const e = {
          type: 'basic',
          title: bgT('background.title'),
          message: bgT('background.notifications.points', { points: msg }),
          iconUrl: chrome.runtime.getURL('./media/autologosteam.png'),
        };
        chrome.notifications.create('points_notification', e);
      });
      break;
    case 'key':
      chrome.notifications.clear('key_notification', () => {
        const e = {
          type: 'basic',
          title: bgT('background.title'),
          message: msg,
          iconUrl: chrome.runtime.getURL('./media/autologosteam.png'),
        };
        chrome.notifications.create('key_notification', e);
      });
      break;
    default:
      console.warn('Unknown notification type');
      break;
  }
};

/* This function scans the pages and calls the function pagesloaded() once it finished
   All giveaways that must be entered are pushed in an array called "arr"
   Remember once scanpage is over, pagesloaded is called */
const scanpage = async (html) => {
  const timePageLoaded = Math.round(Date.now() / 1000);

  let result = { giveaways: [], giveawaysWithoutPinned: [] };
  result = await parseHTML({ items: Object.keys(result), html });

  const giveaways =
    settings.IgnorePinnedBG === true ||
    (useWishlistPriorityForMainBG && pagestemp === pages)
      ? result.giveawaysWithoutPinned
      : result.giveaways;

  if (!Array.isArray(giveaways)) {
    console.error('This should always be an array, something went wrong.');
    console.error('IgnorePinnedBG: ', settings.IgnorePinnedBG);
    console.error('WishlistPriority: ', useWishlistPriorityForMainBG);
    console.error(`Pages: ${pagestemp} | ${pages}`);
    console.error(giveaways);
  }

  for (const giveaway of giveaways) {
    if (giveaway.levelTooHigh) continue;
    if (giveaway.isGroupGA && settings.IgnoreGroupsBG) continue;

    giveaway.timeLeft = giveaway.timeEnd - timePageLoaded;
    const oddsOfWinning = calculateWinChance(
      giveaway.timeLeft,
      giveaway.timeStart,
      giveaway.numberOfEntries,
      giveaway.numberOfCopies,
      timePageLoaded,
    );
    arr.push(
      new BGGiveaway({
        code: giveaway.GAcode,
        level: parseInt(giveaway.GAlevel, 10),
        appid: giveaway.GAsteamAppID,
        cost: parseInt(giveaway.cost, 10),
        timeleft: giveaway.timeLeft,
        numberOfCopies: giveaway.numberOfCopies || 1,
        numberOfEntries: giveaway.numberOfEntries || 0,
        status: { Entered: false, NoPoints: false, NoLevel: false },
        odds: oddsOfWinning,
      }),
    );
  }

  if (pagestemp === pages) {
    totalWishlistGAcnt = arr.length;
  }
  pagestemp--;
  if (
    pagestemp === 0 ||
    (currPoints < settings.PointsToPreserve &&
      useWishlistPriorityForMainBG &&
      settings.IgnorePreserveWishlistOnMainBG &&
      totalWishlistGAcnt !== 0)
  ) {
    pagestemp = 0;
    pagesloaded();
  }
};

/* This function is called once all pages have been parsed
   this sends the requests to steamgifts */
function pagesloaded() {
  let wishlistArr;
  if (useWishlistPriorityForMainBG) {
    wishlistArr = arr.slice(0, totalWishlistGAcnt);
    if (settings.LevelPriorityBG) {
      wishlistArr.sort(compareLevel);
    } else if (settings.OddsPriorityBG) {
      wishlistArr.sort(compareOdds);
    }
    arr = arr.slice(totalWishlistGAcnt);
  }

  if (settings.LevelPriorityBG) {
    arr.sort(compareLevel);
  } else if (settings.OddsPriorityBG) {
    arr.sort(compareOdds);
  }
  if (useWishlistPriorityForMainBG) {
    arr = wishlistArr.concat(arr);
  }

  let timeouts = [];

  for (const ga of arr) {
    if (ga.level < settings.MinLevelBG) {
      // this may be unnecessary since level_min search parameter https://www.steamgifts.com/discussion/5WsxS/new-search-parameters
      continue;
    }
    if (ga.cost < settings.MinCostBG) {
      console.debug(
        `Giveaway ${ga.getUrl()} (${ga.cost} P) | Level: ${
          ga.level
        } | Time left: ${ga.timeleft} s`,
      );
      console.debug(
        `^Skipped, cost: ${ga.cost}, your settings.MinCostBG is ${settings.MinCostBG}`,
      );
      continue;
    }
    if (settings.MaxCostBG != -1 && ga.cost > settings.MaxCostBG) {
      console.debug(
        `Giveaway ${ga.getUrl()} (${ga.cost} P) | Level: ${
          ga.level
        } | Time left: ${ga.timeleft} s`,
      );
      console.debug(
        `^Skipped, cost: ${ga.cost}, your settings.MaxCostBG is ${settings.MaxCostBG}`,
      );
      continue;
    }
    if (ga.timeleft > settings.MaxTimeLeftBG && settings.MaxTimeLeftBG !== 0) {
      console.debug(
        `Giveaway ${ga.getUrl()} (${ga.cost} P) | Level: ${
          ga.level
        } | Time left: ${ga.timeleft} s`,
      );
      console.debug(
        `^Skipped, timeleft: ${ga.timeleft}, your settings.MaxTimeLeftBG is ${settings.MaxTimeLeftBG}`,
      );
      continue;
    }

    timeouts.push(
      setTimeout(
        async () => {
          const formData = new FormData();
          formData.append('xsrf_token', token);
          formData.append('do', 'entry_insert');
          formData.append('code', ga.code);

          const res = await fetch('https://www.steamgifts.com/ajax.php', {
            method: 'post',
            body: formData,
          });
          const jsonResponse = await res.json();
          console.debug(
            `Giveaway ${ga.getUrl()} (${ga.cost} P) | Level: ${
              ga.level
            } | Time left: ${ga.timeleft} s`,
          );

          let clearTimeouts = false;
          if (
            jsonResponse.msg === 'Not Enough Points' ||
            (jsonResponse.points < settings.PointsToPreserve &&
              useWishlistPriorityForMainBG &&
              settings.IgnorePreserveWishlistOnMainBG)
          ) {
            // Stop to preserve points when wishlist priority is enabled or not enough points
            clearTimeouts = true;
          }

          if (clearTimeouts) {
            console.debug(
              "^Not Enough Points or your PointsToPreserve limit reached, we're done for now",
            );
            for (const timeout of timeouts) {
              clearTimeout(timeout);
            }
            timeouts = [];
          } else {
            console.debug('^Entered');
          }
        },
        (timeouts.length + 1) * settings.DelayBG * 1000 +
          Math.floor(Math.random() * 2001),
      ),
    );
  }
}

/* This function checks for a won gift, then calls the scanpage function */
/* e is the whole html page */
const settingsloaded = async () => {
  if (settings.IgnoreGroupsBG && settings.PageForBG === 'all') {
    settings.IgnoreGroupsBG = true;
  }
  if (settings.PageForBG === 'all' && settings.WishlistPriorityForMainBG) {
    useWishlistPriorityForMainBG = true;
  } else {
    useWishlistPriorityForMainBG = false;
  }
  pages = settings.PagesToLoadBG;
  if (pages < 2 && useWishlistPriorityForMainBG) {
    pages = 2;
  }
  timetopass = 10 * settings.RepeatHoursBG;
  if (justLaunched || settings.RepeatHoursBG === 0) {
    // settings.RepeatHoursBG == 0 means it should autojoin every time
    justLaunched = false;
    timepassed = timetopass;
  } else {
    timepassed += 5;
  }

  let result = { won: false, myPoints: 0, myLevel: 0, token: '' };

  /* If background autojoin is disabled or not enough time passed only check if won */
  if (settings.BackgroundAJ === false || timepassed < timetopass) {
    const res = await fetch(link + 1);
    const html = await res.text();
    result = await parseHTML({
      items: Object.keys(result),
      html,
    });

    if (result.won) {
      notify('win');
    } else {
      currPoints = result.myPoints;
      if (currPoints >= settings.NotifyLimitAmount && settings.NotifyLimit) {
        console.info(
          `Sending notification about accumulated points: ${currPoints} > ${settings.NotifyLimitAmount}`,
        );
        notify('points', currPoints);
      }
      console.debug(`Current Points: ${currPoints}`);
    }
    // check level and save if changed
    mylevel = result.myLevel;
    if (settings.LastKnownLevel !== mylevel) {
      backgroundSettingsStore?.save({ LastKnownLevel: mylevel });
    }
  } else {
    /* Else check if won first (since pop-up disappears after first view), then start scanning pages */
    timepassed = 0; // reset timepassed
    const link = `https://www.steamgifts.com/giveaways/search?type=${settings.PageForBG}&level_min=${settings.MinLevelBG}&level_max=${settings.LastKnownLevel}&page=`;
    const wishLink = `https://www.steamgifts.com/giveaways/search?type=wishlist&level_min=${settings.MinLevelBG}&level_max=${settings.LastKnownLevel}&page=`;
    let linkToUse = '';
    if (useWishlistPriorityForMainBG) linkToUse = wishLink;
    else linkToUse = link;
    arr.length = 0;

    const res = await fetch(linkToUse + 1);
    const html = await res.text();
    result = await parseHTML({
      items: Object.keys(result),
      html,
    });

    currPoints = result.myPoints;
    if (result.won) {
      notify('win');
    } else if (
      currPoints >= settings.NotifyLimitAmount &&
      settings.NotifyLimit
    ) {
      console.info(
        `Sending notification about accumulated points: ${currPoints} > ${settings.NotifyLimitAmount}`,
      );
      notify('points', currPoints);
    }

    if (pages > 5 || pages < 1) {
      pagestemp = 3;
    } else {
      pagestemp = pages;
    } // in case someone has old setting with more than 5 pages to load or somehow set this value to <1 use 3 (default)

    token = result.token;
    mylevel = result.myLevel;
    // save new level if it changed
    if (settings.LastKnownLevel !== mylevel) {
      backgroundSettingsStore?.save({ LastKnownLevel: mylevel });
    }

    if (
      currPoints >= settings.PointsToPreserve ||
      (useWishlistPriorityForMainBG && settings.IgnorePreserveWishlistOnMainBG)
    ) {
      scanpage(html); // scan this page that was already loaded to get info above
      let i = 0;
      if (useWishlistPriorityForMainBG) {
        linkToUse = link;
        i = 1;
      }
      if (currPoints >= settings.PointsToPreserve) {
        for (let n = 2 - i; n <= pages - i; n++) {
          // scan next pages
          if (n > 3 - i) {
            break;
          } // no more than 3 pages at a time since the ban wave
          const res = await fetch(linkToUse + n);
          const newPage = await res.text();
          scanpage(newPage);
        }
      }
    }
  }
};

/* Load settings, then call settingsloaded() */
const loadsettings = async () => {
  if (!backgroundSettingsStore) {
    console.error(
      'AutoJoinSettingsStore is not available in background script.',
    );
    return;
  }

  try {
    settings = await backgroundSettingsStore.load({
      lastLaunchedVersion: thisVersion,
    });
    settingsloaded();
  } catch (error) {
    console.error('Failed to load background settings:', error);
  }
};

loadsettings().catch((error) => {
  console.error('Initial settings load failed:', error);
});

/* It all begins with the loadsettings call */
chrome.alarms.onAlarm.addListener((alarm) => {
  console.debug(`Alarm fired. ${new Date().toLocaleString()}`);
  if (alarm.name === 'routine') {
    loadsettings().catch((error) => {
      console.error('loadsettings failed:', error);
    });
  }
});

const createAlarm = () => {
  /* Create first alarm as soon as possible, repeat every 30 minutes */
  chrome.alarms.get('routine', (alarm) => {
    if (!alarm) {
      chrome.alarms.create(
        'routine',
        {
          delayInMinutes: 0.5,
          periodInMinutes: 30,
        },
        () => {
          console.debug('Alarm set.');
        },
      );
    }
  });
};
createAlarm();

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.clearAll(createAlarm);
});
chrome.runtime.onStartup.addListener(createAlarm);

/* Creating a new tab if notification is clicked */
chrome.notifications.onClicked.addListener((notificationId) => {
  let url;
  switch (notificationId) {
    case '1.5.0 announcement':
      url =
        'http://steamcommunity.com/groups/autojoin#announcements/detail/1485483400577229657';
      break;
    case 'points_notification':
      url = 'https://www.steamgifts.com/';
      break;
    default:
      url = 'https://www.steamgifts.com/giveaways/won';
  }
  chrome.windows.getCurrent((currentWindow) => {
    if (currentWindow) {
      chrome.tabs.create({
        url,
      });
    } else {
      chrome.windows.create({
        url,
        type: 'normal',
        focused: true,
      });
    }
  });
});

chrome.runtime.onInstalled.addListener((updateInfo) => {
  if (!updateInfo.previousVersion) return;

  const parseVersion = (version) =>
    Number(
      version
        .split('.')
        .map((v) => v.padStart(3, 0))
        .join('')
        .padEnd(9, 0),
    );
  const prevVersion = parseVersion(updateInfo.previousVersion);

  if (prevVersion < parseVersion('1.5.0')) {
    console.log('Changing settings to prevent mass ban of extension users...');
    backgroundSettingsStore
      ?.save({
        BackgroundAJ: false,
        IgnorePinnedBG: true,
        RepeatIfOnPage: false,
        RepeatHoursBG: 5,
        RepeatHours: 5,
      })
      .then(() => {
        const e = {
          type: 'basic',
          title: bgT('background.notifications.guidelinesTitle'),
          message: bgT('background.notifications.guidelinesBody'),
          iconUrl: chrome.runtime.getURL('./media/autologosteam.png'),
        };
        chrome.notifications.create('1.5.0 announcement', e);
      })
      .catch((error) => {
        console.error('Failed to migrate settings for v1.5.0:', error);
      });
  }
  if (prevVersion < parseVersion('1.6.2')) {
    console.log('Changing settings of minCost to minCostBG');
    backgroundSettingsStore
      ?.load()
      .then((current) =>
        backgroundSettingsStore.save({
          MinCost: 0,
          MinCostBG: current.MinCost ?? 0,
        }),
      )
      .then(() => {
        console.info(
          'Migrated successfully minCost option from previous version',
        );
      })
      .catch((error) => {
        console.error('Failed to migrate minCost to minCostBG:', error);
      });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.task === 'notifyKey' && request.message) {
    notify('key', request.message);
    return;
  }
  if (request.task === 'checkPermission') {
    // Check if we have "*://steamcommunity.com/profiles/*" permission, ask for them if not
    console.debug(
      'Got a request for "*://steamcommunity.com/profiles/*" permission',
    );
    chrome.permissions.contains(
      {
        origins: ['*://steamcommunity.com/profiles/*'],
      },
      (result) => {
        if (result) {
          console.debug('We already have permission');
          sendResponse({ granted: 'true' });
        } else if (request.ask === 'true') {
          // We don't have permission, try to request them if ask is 'true'
          chrome.permissions.request(
            {
              origins: ['*://steamcommunity.com/profiles/*'],
            },
            (granted) => {
              if (granted) {
                console.debug('Permission granted');
                sendResponse({ granted: 'true' });
              } else {
                console.debug('Permission declined');
                sendResponse({ granted: 'false' });
              }
            },
          );
        } else {
          sendResponse({ granted: 'false' });
        }
      },
    );
    // Keep the message channel open for async sendResponse
    return true;
  }

  if (request.task === 'fetch') {
    // Fetch in background script to bypass CORS (content scripts can't do it anymore)
    const url = request.url;
    fetchHelper(url).then(sendResponse);
    return true;
  }

  if (request.task === 'fetchSteamStoreUserData') {
    fetchSteamStoreUserDataWithBrowserSession()
      .then(sendResponse)
      .catch((error) => {
        sendResponse({
          status: 0,
          ok: false,
          isLoggedIn: false,
          ownedGames: [],
          wishlist: [],
          error: error.message,
        });
      });
    return true;
  }
});

const fetchHelper = async (url) => {
  // using this helper function until https://crbug.com/40753031 is implemented
  const result = {
    status: null,
    text: '',
  };

  if (url.includes('steamcommunity.com')) {
    const havePermissions = await chrome.permissions.contains({
      origins: ['*://steamcommunity.com/profiles/*'],
    });

    if (!havePermissions) {
      console.warn(
        'Disabling settings that require optional permission which is not granted.',
      );

      backgroundSettingsStore
        ?.save({
          PriorityWishlist: false,
          HideNonTradingCards: false,
          HideDlc: false,
        })
        .catch((error) => {
          console.error(
            'Failed to update settings after permission denial:',
            error,
          );
        });

      result.status = 403;
      return result;
    }
  }

  const res = await fetch(url, {
    // Include cookies for cross-origin requests to Steam Community/Store
    credentials: 'include',
    redirect: 'follow',
    // Let the browser set CORS headers; extensions with host permissions can fetch cross-origin
    mode: 'cors',
  });
  result.status = res.status;
  if (res.ok) {
    const text = await res.text();
    result.text = text;

    if (looksLikeSteamSessionBlocked(url, text)) {
      try {
        console.info(
          `Falling back to browser-session scrape for authenticated Steam page: ${url}`,
        );
        const fallback = await fetchPageWithBrowserSession(url);
        if (fallback.text) {
          return {
            status: fallback.status,
            text: fallback.text,
          };
        }
      } catch (error) {
        console.warn('Browser-session scrape fallback failed:', error);
      }
    }
  }
  return result;
};
