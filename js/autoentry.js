const autoJoinSettingsStore = globalThis.AutoJoinSettingsStore;
const thisVersion = 20230517;

let settings = autoJoinSettingsStore
  ? autoJoinSettingsStore.getDefaults({ lastLaunchedVersion: thisVersion })
  : {};
const autoJoinI18n = globalThis.AutoJoinI18n;
const steamCommunityHelper = globalThis.AutoJoinSteamCommunity;
function t(key, params = {}) {
  return autoJoinI18n ? autoJoinI18n.t(key, params) : key;
}
let token;
const currentState = {
  amountOfPoints: 0,
  set points(n) {
    this.amountOfPoints = parseInt(n, 10);
    document.querySelectorAll('.nav__points').forEach((el) => {
      el.textContent = this.amountOfPoints;
    });
  },
  get points() {
    return this.amountOfPoints;
  },
};

let steamAppData = {};
let steamPackageData = {};
let ownedSteamApps = [];
let wishList = [];
let pageNumber;
let lastPage;
let loadingNextPage;
let pageLink;
let thirdPart;
const autoentryState = {};
Object.defineProperties(autoentryState, {
  settings: {
    get: () => settings,
    set: (value) => {
      settings = value;
    },
  },
  token: {
    get: () => token,
    set: (value) => {
      token = value;
    },
  },
  steamAppData: {
    get: () => steamAppData,
    set: (value) => {
      steamAppData = value;
    },
  },
  steamPackageData: {
    get: () => steamPackageData,
    set: (value) => {
      steamPackageData = value;
    },
  },
  ownedSteamApps: {
    get: () => ownedSteamApps,
    set: (value) => {
      ownedSteamApps = value;
    },
  },
  wishList: {
    get: () => wishList,
    set: (value) => {
      wishList = value;
    },
  },
  currentState: {
    get: () => currentState,
  },
});

const state = autoentryState;

const autoentrySteamDataFactory = globalThis.AutoJoinAutoentrySteamData;
const autoentryGiveawayFactory = globalThis.AutoJoinAutoentryGiveaway;
const autoentrySteamData = autoentrySteamDataFactory?.createSteamDataHelpers({
  state: autoentryState,
  t,
  steamCommunityHelper,
  chrome,
  document,
  refreshSteamData,
});
const autoentryGiveaway = autoentryGiveawayFactory?.createGiveawayHelpers({
  state: autoentryState,
  t,
  chrome,
  document,
  thisVersion,
});

function shouldLoadSteamData() {
  return autoentrySteamData.shouldLoadSteamData();
}

function normalizeSteamProfileUrl(url) {
  return autoentrySteamData.normalizeSteamProfileUrl(url);
}

function getSteamCacheKeys(profileUrl, steamProfileID) {
  return autoentrySteamData.getSteamCacheKeys(profileUrl, steamProfileID);
}

function applyCachedSteamData(storageData, cacheKeys) {
  return autoentrySteamData.applyCachedSteamData(storageData, cacheKeys);
}

function saveSteamData(cacheKeys) {
  return autoentrySteamData.saveSteamData(cacheKeys);
}

function updateSteamDataBanner(steamDataIssueKey, retryContext = {}) {
  return autoentrySteamData.updateSteamDataBanner(
    steamDataIssueKey,
    retryContext,
  );
}

function resolveSteamProfileId(profileUrl) {
  return autoentrySteamData.resolveSteamProfileId(profileUrl);
}

function fetchCommunitySteamData(steamProfileID) {
  return autoentrySteamData.fetchCommunitySteamData(steamProfileID);
}

function modifyPageDOM(pageDOM, timeLoaded) {
  return autoentryGiveaway.modifyPageDOM(pageDOM, timeLoaded);
}

function loadDescription(giveaway) {
  return autoentryGiveaway.loadDescription(giveaway);
}

function priorityGiveaway(giveaway, steamGroup, regionLocked, whitelist) {
  return autoentryGiveaway.priorityGiveaway(
    giveaway,
    steamGroup,
    regionLocked,
    whitelist,
  );
}

function ignoreGiveaway(steamGroup, whitelist) {
  return autoentryGiveaway.ignoreGiveaway(steamGroup, whitelist);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', getSettings);
} else {
  getSettings();
}

async function getSettings() {
  if (!autoJoinSettingsStore) {
    console.error('AutoJoinSettingsStore is not available.');
    return;
  }

  try {
    state.settings = await autoJoinSettingsStore.load({
      lastLaunchedVersion: thisVersion,
    });
    autoJoinI18n?.setLocale(settings.Language);
    loadCache();
  } catch (error) {
    console.error('Failed to load settings:', error);
    if (window.AutoJoinUtils) {
      AutoJoinUtils.showNotification(
        t('content.notifications.settingsLoadFailed'),
        'error',
      );
    }
  }
}

function loadCache() {
  if (!shouldLoadSteamData()) {
    // skip loading and updating cache in no setting that uses it is turned on
    onPageLoad();
    return;
  }

  chrome.storage.local.get(async (data) => {
    if (typeof data.Packages != 'undefined') {
      state.steamPackageData = data.Packages;
      console.debug('Steam packages cached: ', steamPackageData);
    }
    if (typeof data.Apps != 'undefined') {
      state.steamAppData = data.Apps;
      console.debug('Steam apps cached: ', steamAppData);
    }

    const avatarLink = document.querySelector(
      '.nav__button-container--notification a.nav__avatar-outer-wrap',
    );
    if (!avatarLink || !avatarLink.href) {
      // Not logged in or structure changed; continue without Steam data
      onPageLoad();
      return;
    }
    const userProfile = normalizeSteamProfileUrl(avatarLink.href);
    let steamProfileID = '';
    const response = await chrome.runtime.sendMessage({
      task: 'fetch',
      url: userProfile,
    });
    if (response.status === 200) {
      steamProfileID =
        steamCommunityHelper?.extractSteamIdFromProfileHtml(response.text) ||
        '';
    }

    applyCachedSteamData(data, getSteamCacheKeys(userProfile, steamProfileID));

    onPageLoad(); // should be after updating cache, but it takes a lot of time
    refreshSteamData({
      profileUrl: userProfile,
      steamProfileID,
    });
  });
}

async function refreshSteamData({ profileUrl = '', steamProfileID = '' } = {}) {
  try {
    let steamDataIssueKey = null;

    const storeResponse = await chrome.runtime.sendMessage({
      task: 'fetchSteamStoreUserData',
    });
    if (storeResponse?.status === 200 && storeResponse.isLoggedIn) {
      state.ownedSteamApps = storeResponse.ownedGames || [];
      state.wishList = storeResponse.wishlist || [];
      saveSteamData(getSteamCacheKeys(profileUrl, steamProfileID));

      console.debug('Steam data updated:', {
        ownedGames: ownedSteamApps.length,
        wishlist: wishList.length,
      });

      updateSteamDataBanner(null, {
        profileUrl,
        steamProfileID,
      });
      return;
    }

    if (storeResponse?.isLoggedIn === false) {
      steamDataIssueKey = 'content.notifications.steamLoginRequired';
      console.info(t(steamDataIssueKey));
    }

    let resolvedSteamProfileID = steamProfileID;
    const permissionResponse = await chrome.runtime.sendMessage({
      task: 'checkPermission',
      ask: 'true',
    });

    if (permissionResponse?.granted === 'true') {
      if (!resolvedSteamProfileID && profileUrl) {
        resolvedSteamProfileID = await resolveSteamProfileId(profileUrl);
      }

      if (resolvedSteamProfileID) {
        steamDataIssueKey =
          (await fetchCommunitySteamData(resolvedSteamProfileID)) ||
          steamDataIssueKey;
      } else {
        steamDataIssueKey ||= 'content.notifications.steamLoginRequired';
      }
    } else {
      steamDataIssueKey ||= 'content.notifications.permissionDenied';
      console.warn(t('content.notifications.permissionDenied'));
    }

    saveSteamData(getSteamCacheKeys(profileUrl, resolvedSteamProfileID));

    console.debug('Steam data updated:', {
      ownedGames: ownedSteamApps.length,
      wishlist: wishList.length,
    });

    updateSteamDataBanner(steamDataIssueKey, {
      profileUrl,
      steamProfileID: resolvedSteamProfileID,
    });
  } catch (error) {
    console.error('Error updating Steam data:', error);
  }
}

function onPageLoad() {
  state.token = document.querySelector('input[name="xsrf_token"]')?.value;
  if (!token) {
    console.error('Could not find CSRF token');
    if (window.AutoJoinUtils) {
      AutoJoinUtils.showNotification(
        t('content.notifications.securityTokenMissing'),
        'error',
      );
    }
    return;
  }
  let pagesLoaded = 1;
  currentState.points = document
    .querySelector('.nav__points')
    .textContent.replace(',', '');
  // parsePage(document.querySelector('html')); // parse this page first
  /* Add AutoJoin and cog button */
  const info = document.createElement('div');
  info.id = 'info';
  const featuredSummary = document.querySelector('.featured__summary');
  if (featuredSummary) {
    featuredSummary.prepend(info);
  } else {
    document.body.appendChild(info);
  }
  if (settings.AutoJoinButton) {
    const buttonsAJ = document.createElement('div');
    buttonsAJ.id = 'buttonsAJ';
    const btnSettings = document.createElement('button');
    btnSettings.id = 'btnSettings';
    btnSettings.className = 'AutoJoinButtonEnabled';
    const cog = document.createElement('i');
    cog.className = 'fa fa-cog fa-4x fa-inverse';
    btnSettings.appendChild(cog);

    const btnAutoJoin = document.createElement('input');
    btnAutoJoin.id = 'btnAutoJoin';
    btnAutoJoin.type = 'button';
    btnAutoJoin.value = t('content.autoJoin');

    // Add debounced click handler to prevent rapid clicking
    const debouncedAutoJoin = AutoJoinUtils.debounce(() => {
      if (btnAutoJoin.disabled) return;

      btnAutoJoin.disabled = true;
      btnAutoJoin.classList.add('loading');

      if (settings.LoadFive && pagesLoaded < 5) {
        btnAutoJoin.value = t('content.loadingPages');
      } else {
        btnAutoJoin.value = t('content.processing');
      }

      try {
        fireAutoJoin();
      } catch (error) {
        console.error('Error during AutoJoin:', error);
        btnAutoJoin.disabled = false;
        btnAutoJoin.classList.remove('loading');
        btnAutoJoin.value = t('content.autoJoin');
        if (window.AutoJoinUtils) {
          AutoJoinUtils.showNotification(
            t('content.notifications.autoJoinFailed', {
              message: error.message,
            }),
            'error',
          );
        }
      }
    }, 1000);

    btnAutoJoin.addEventListener('click', debouncedAutoJoin);

    const suspensionNotice = document.createElement('div');
    suspensionNotice.id = 'suspensionNotice';
    const linkToAnnouncement = document.createElement('a');
    linkToAnnouncement.href =
      'http://steamcommunity.com/groups/autojoin#announcements/detail/1485483400577229657';
    linkToAnnouncement.target = '_blank';
    const riskLine = document.createElement('p');
    riskLine.textContent = t('content.suspensionRisk');
    const readMoreLine = document.createElement('p');
    readMoreLine.textContent = t('content.readMore');
    linkToAnnouncement.append(riskLine, readMoreLine);
    suspensionNotice.appendChild(linkToAnnouncement);

    buttonsAJ.appendChild(btnAutoJoin);
    buttonsAJ.appendChild(btnSettings);
    buttonsAJ.appendChild(suspensionNotice);
    const featuredSummary = document.querySelector('.featured__summary');
    if (featuredSummary) {
      featuredSummary.prepend(buttonsAJ);
    } else {
      document.body.appendChild(buttonsAJ);
    }
  } else {
    // Add a Settings button to the navbar if not already present
    if (!document.getElementById('ajSettingsNavBtn')) {
      const navbar = document.querySelector('.nav__left-container');
      if (navbar) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'nav__button-container';
        const button = document.createElement('a');
        button.className = 'nav__button';
        // Use a unique ID distinct from the circular cog button
        button.id = 'ajSettingsNavBtn';
        button.textContent = t('content.settingsButton');
        buttonContainer.appendChild(button);
        navbar.appendChild(buttonContainer);
      }
    }
  }

  /* First time cog/settings button is pressed inject part of settings.html and show it
     If settings already injected just show them */
  const bindSettingsOpener = (el) => {
    if (!el) return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (chrome?.runtime?.openOptionsPage) {
        chrome.runtime.openOptionsPage();
        return;
      }
      // Reuse existing modal if present
      const existing = document.getElementById('settingsDiv');
      if (existing) {
        document.getElementById('settingsShade')?.classList.add('fadeIn');
        existing.classList.add('fadeIn');
        document.body.classList.add('aj-modal-open');
        setTimeout(() => {
          existing.querySelector('button, input, select, textarea, a')?.focus();
        }, 0);
        return;
      }

      // Guard against duplicate injection from parallel instances
      const htmlEl = document.documentElement;
      if (
        htmlEl.dataset.ajSettingsInjecting === 'true' ||
        htmlEl.dataset.ajSettingsInjected === 'true'
      ) {
        const start = Date.now();
        const wait = setInterval(() => {
          const modal = document.getElementById('settingsDiv');
          if (modal) {
            clearInterval(wait);
            document.getElementById('settingsShade')?.classList.add('fadeIn');
            modal.classList.add('fadeIn');
            document.body.classList.add('aj-modal-open');
            setTimeout(() => {
              modal
                .querySelector('button, input, select, textarea, a')
                ?.focus();
            }, 0);
          } else if (Date.now() - start > 3000) {
            clearInterval(wait);
          }
        }, 50);
        return;
      }

      // Inject once
      htmlEl.dataset.ajSettingsInjecting = 'true';
      fetch(chrome.runtime.getURL('/html/settings.html'))
        .then((resp) => resp.text())
        .then((settingsHTML) => {
          const parser = new DOMParser();
          const settingsDOM = parser.parseFromString(settingsHTML, 'text/html');
          const settingsDiv = settingsDOM.getElementById('bodyWrapper');
          document.querySelector('body').appendChild(settingsDiv);
          htmlEl.dataset.ajSettingsInjected = 'true';
          htmlEl.dataset.ajSettingsInjecting = 'false';
          // Make sure Font Awesome is loaded when injecting inline
          if (
            !document.querySelector(
              'link[href*="font-awesome"], link[href*="fontawesome"]',
            )
          ) {
            const fa = document.createElement('link');
            fa.rel = 'stylesheet';
            fa.href =
              'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(fa);
          }
          loadSettings();
          document.getElementById('settingsShade').classList.add('fadeIn');
          document.getElementById('settingsDiv').classList.add('fadeIn');
          document.body.classList.add('aj-modal-open');
          setTimeout(() => {
            document
              .querySelector(
                '#settingsDiv button, #settingsDiv input, #settingsDiv select, #settingsDiv textarea, #settingsDiv a',
              )
              ?.focus();
          }, 0);
        })
        .catch(() => {
          htmlEl.dataset.ajSettingsInjecting = 'false';
        });
    });
  };

  bindSettingsOpener(document.getElementById('btnSettings'));
  bindSettingsOpener(document.getElementById('ajSettingsNavBtn'));

  const postsElement = document.querySelector(
    ':not(.pinned-giveaways__inner-wrap) > .giveaway__row-outer-wrap',
  )?.parentNode;
  if (postsElement) {
    postsElement.id = 'posts'; // give div with giveaways id "posts"
  } else {
    // this shouldn't happen often but in case opened page doesn't have giveaways
    const dummyElement = document.createElement('div');
    dummyElement.id = 'posts';
    document.body.append(dummyElement);
  }

  let accountInfo = null;
  if (settings.ShowPoints) {
    accountInfo = document.querySelector('a[href="/account"]').cloneNode(true);
    accountInfo.classList.add('pointsFloating');
    accountInfo.style.position = 'fixed';
    accountInfo.style.opacity = '0';
    accountInfo.style.top = '4em';
    document.querySelector('body').prepend(accountInfo);
  }

  if (settings.InfiniteScrolling) {
    document
      .querySelector('.widget-container .widget-container--margin-top')
      ?.remove();
  }
  const splitPageLinks = document.querySelectorAll('.pagination__navigation a');
  const splitPageHasNext = document
    .querySelector('.pagination__navigation')
    ?.textContent.includes('Next');
  let onlyOnePage = false;
  if (splitPageHasNext) {
    pagesLoaded = 9999;
    onlyOnePage = true;
  }

  async function loadPage() {
    if (lastPage) {
      return;
    }

    const timeLoaded = Math.round(Date.now() / 1000); // when the page was loaded (in seconds)
    if (loadingNextPage === false) {
      loadingNextPage = true;

      const res = await fetch(pageLink + pageNumber + thirdPart);
      if (!res.ok) {
        console.error(`Error loading next page: HTTP ${res.status}`);
        return;
      }
      const html = await res.text();
      const domParser = new DOMParser();
      const dom = domParser.parseFromString(html, 'text/html');

      const gaElements = dom.querySelectorAll(
        ':not(.pinned-giveaways__inner-wrap) > .giveaway__row-outer-wrap',
      );
      const containerEl = document.createElement('div');
      containerEl.append(`Page ${pageNumber}`);
      containerEl.append(...gaElements);
      if (gaElements.length < 50) {
        lastPage = true;
        pagesLoaded = 9999;
        const p = document.querySelector('.pagination');
        if (p) p.style.display = 'none';
      }
      modifyPageDOM(containerEl, timeLoaded);
      [...document.querySelectorAll('#posts')].at(-1).append(containerEl);
      pageNumber++;
      pagesLoaded++;
      loadingNextPage = false;
    }
  }

  function fireAutoJoin() {
    if (settings.LoadFive && pagesLoaded < settings.PagesToLoad) {
      loadPage();
      setTimeout(() => {
        fireAutoJoin();
      }, 50);
      return;
    }
    let entered = 0;
    let timeouts = [];

    let selectItems =
      '.giveaway__row-inner-wrap:not(.is-faded) .giveaway__heading__name';

    // Here I'm filtering the giveaways to enter only those created by regular users in the #posts div
    // which means featured giveaways won't be autojoined if user decides so in the options

    if (settings.IgnorePinned) {
      selectItems = `#posts ${selectItems}`;
    }

    const myLevel = parseInt(
      document
        .querySelector('a[href="/account"] span:nth-child(2)')
        .textContent.match(/(\d+)/)[1],
      10,
    );
    for (let level = myLevel; level >= 0; level--) {
      document.querySelectorAll(selectItems).forEach((el) => {
        const current = el.closest('.giveaway__row-inner-wrap');
        const whiteListGiveaway = Boolean(
          current.querySelector('.giveaway__column--whitelist'),
        );
        const regionLockedGiveaway = Boolean(
          current.querySelector('.giveaway__column--region-restricted'),
        );
        const steamGroupGiveaway = Boolean(
          current.querySelector('.giveaway__column--group'),
        );
        const giveawayLevel = Boolean(
          current.querySelector('.giveaway__column--contributor-level'),
        )
          ? parseInt(
              current
                .querySelector('.giveaway__column--contributor-level')
                .textContent.match(/Level (\d)/)[1],
            )
          : 0;
        if (
          giveawayLevel == level ||
          (priorityGiveaway(
            current,
            steamGroupGiveaway,
            regionLockedGiveaway,
            whiteListGiveaway,
          ) &&
            !ignoreGiveaway(steamGroupGiveaway, whiteListGiveaway))
        ) {
          const cost = parseInt(
            [...current.querySelectorAll('.giveaway__heading__thin')]
              .at(-1)
              .textContent.match(/\d+/)[0],
            10,
          );
          if (
            cost >= settings.MinCost &&
            (settings.MaxCost == -1 || cost <= settings.MaxCost)
          ) {
            timeouts.push(
              setTimeout(
                function () {
                  const code = current
                    .querySelector('a.giveaway__heading__name')
                    .href.match(/.+giveaway\/(.+)\//)[1];
                  const formData = new FormData();
                  formData.append('xsrf_token', token);
                  formData.append('do', 'entry_insert');
                  formData.append('code', code);
                  fetch(`${window.location.origin}/ajax.php`, {
                    method: 'post',
                    credentials: 'include',
                    body: formData,
                  })
                    .then((resp) => resp.json())
                    .then((jsonResponse) => {
                      if (jsonResponse.type === 'success') {
                        current.classList.toggle('is-faded');
                        currentState.points = jsonResponse.points.replace(
                          ',',
                          '',
                        );
                        entered++;
                        const btnEl = current.querySelector('.btnSingle');
                        btnEl.setAttribute('walkState', 'leave');
                        btnEl.disabled = false;
                        btnEl.textContent = t('content.leave');
                        updateButtons();
                      }
                      if (jsonResponse.points < 5) {
                        for (const timeout of timeouts) {
                          clearTimeout(timeout);
                        }
                        timeouts = [];
                      }
                      const infoEl = document.querySelector('#info');
                      if (infoEl) {
                        if (entered < 1) {
                          infoEl.textContent = t('content.enteredSummary.none');
                        } else {
                          infoEl.textContent = t(
                            entered === 1
                              ? 'content.enteredSummary.one'
                              : 'content.enteredSummary.other',
                            { count: entered },
                          );
                        }
                        infoEl.style.display = 'block';
                      }
                    });
                },
                timeouts.length * settings.Delay * 1000 +
                  Math.floor(Math.random() * 1000),
              ),
            );
          } else {
            if (cost < settings.MinCost) {
              console.debug(
                `^Skipped, cost: ${cost}, your settings.MinCost is ${settings.MinCost}`,
              );
            } else {
              console.debug(
                `^Skipped, cost: ${cost}, your settings.MaxCost is ${settings.MaxCost}`,
              );
            }
          }
        }
      });
    }

    // Enhanced completion feedback
    setTimeout(
      () => {
        const btnAutoJoin = document.querySelector('#btnAutoJoin');
        if (btnAutoJoin) {
          btnAutoJoin.disabled = false;
          btnAutoJoin.classList.remove('loading');
          btnAutoJoin.classList.add('success');
          btnAutoJoin.value =
            entered > 0
              ? t('content.joinedButton', { count: entered })
              : t('content.noEntries');

          // Show notification
          if (window.AutoJoinUtils) {
            if (entered > 0) {
              AutoJoinUtils.showNotification(
                t(
                  entered === 1
                    ? 'content.notifications.autoJoinSummary.one'
                    : 'content.notifications.autoJoinSummary.other',
                  { count: entered },
                ),
                'success',
              );
            } else {
              AutoJoinUtils.showNotification(
                t('content.notifications.noGiveawaysMatched'),
                'info',
              );
            }
          }

          // Reset button after delay and hide info banner for a clean layout
          setTimeout(() => {
            btnAutoJoin.classList.remove('success');
            btnAutoJoin.value = t('content.autoJoin');
            const infoEl = document.querySelector('#info');
            if (infoEl) {
              infoEl.style.display = 'none';
              infoEl.textContent = '';
            }
          }, 3000);
        }
      },
      timeouts.length * settings.Delay * 1000 + 2000,
    );

    document.querySelector('#btnAutoJoin').value = t('content.goodLuck');
  }

  if (splitPageHasNext) {
    const splitPageLink =
      splitPageLinks[splitPageLinks.length - 1].href.split('page=');
    pageLink = `${splitPageLink[0]}page=`;
    pageNumber = splitPageLink[1];
    thirdPart = '';
    if (!isFinite(pageNumber) || pageNumber < 1) {
      thirdPart = pageNumber.substr(pageNumber.indexOf('&'));
      pageNumber = pageNumber.substr(0, pageNumber.indexOf('&'));
    }
    // This is a work-around since steamgifts.com stopped showing last page number.
    // Proper fix is to check every new page's pagination, last page doesn't have "Next" link.
    // lastPage = 100;
    // try {
    //   lastPage = ($('.pagination__navigation')
    //     .find('a:contains("Last")')
    //     .attr('href')
    //     .split('page='))[1];
    //   if (!$.isNumeric(lastPage)) {
    //     lastPage = lastPage.substr(0, lastPage.indexOf('&'));
    //   }
    // } catch (e) {
    //   lastPage = 100;
    // }
    loadingNextPage = false;
    // Avoid double infinite-scroll when PageEnhancer already set it up
    const enhancerActivated = Boolean(window.__AJ_InfScrollActivated);
    if (settings.InfiniteScrolling && !enhancerActivated) {
      const spinnerEl = document.createElement('div');
      spinnerEl.style.marginLeft = 'auto';
      spinnerEl.style.marginRight = 'auto';
      const spinnerInnerEl = document.createElement('i');
      spinnerInnerEl.classList.add('fa', 'fa-refresh', 'fa-spin');
      spinnerEl.append(spinnerInnerEl);
      const pagination = document.querySelector('.pagination');
      if (pagination) {
        pagination.innerHTML = '';
        pagination.append(spinnerEl);
      }
    }
    // Throttled scroll handler to reduce forced reflow
    const onScroll = AutoJoinUtils.throttle(() => {
      const docEl = document.documentElement;
      const currentPos = window.pageYOffset || docEl.scrollTop;
      const viewHeight = window.innerHeight;
      const pageHeight = docEl.scrollHeight;

      if (settings.ShowPoints && accountInfo) {
        if (currentPos > viewHeight * 2) {
          accountInfo.style.display = 'block';
          accountInfo.style.opacity = '1';
        } else if (currentPos < viewHeight + viewHeight / 2) {
          accountInfo.style.display = 'none';
          accountInfo.style.opacity = '0';
        }
      }
      if (
        settings.InfiniteScrolling &&
        !enhancerActivated &&
        currentPos + viewHeight > pageHeight - 600
      ) {
        loadPage();
      }
    }, 150);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function updateButtons() {
    if (settings.ShowButtons) {
      document
        .querySelectorAll('.btnSingle:not([walkState="no-level"])')
        .forEach((el) => {
          if (!el.parentElement.classList.contains('is-faded')) {
            const pointsNeededRaw = el.parentElement
              .querySelector('.giveaway__heading__thin:last-of-type')
              .textContent.match(/(\d+)P/);
            const pointsNeeded = parseInt(
              pointsNeededRaw[pointsNeededRaw.length - 1],
              10,
            );
            if (pointsNeeded > currentState.points) {
              el.disabled = true;
              el.value = t('content.notEnoughPoints');
              el.setAttribute('walkState', 'no-points');
            } else {
              el.disabled = false;
              el.value = t('content.join');
              el.setAttribute('walkState', 'join');
            }
          }
        });
    }
  }

  const timeOfFirstPage = Math.round(Date.now() / 1000);
  modifyPageDOM(document.querySelector('body'), timeOfFirstPage);

  document
    .querySelector('#posts')
    .parentElement.addEventListener('click', (event) => {
      if (!event.target) return;

      let clickedEl = event.target.closest('.giveaway__hide');
      if (clickedEl) {
        const thisPost = clickedEl.closest('.giveaway__row-outer-wrap');
        const gameid = thisPost.dataset.gameId;
        console.debug(`hiding ${gameid}`);
        clickedEl.classList.remove('fa-eye-slash');
        clickedEl.classList.add('fa-refresh', 'fa-spin');

        const formData = new FormData();
        formData.append('xsrf_token', token);
        formData.append('game_id', gameid);
        formData.append('do', 'hide_giveaways_by_game_id');
        fetch(`${window.location.origin}/ajax.php`, {
          method: 'post',
          credentials: 'include',
          body: formData,
        }).then(() => {
          document
            .querySelectorAll(`[data-game-id='${gameid}']`)
            .forEach((el) => {
              el.style.opacity = '0';
              el.style.display = 'none';
              // todo: return animations
            });
        });
      }

      clickedEl = event.target.closest('.description');
      if (clickedEl) {
        const thisPost = clickedEl.closest('.giveaway__row-outer-wrap');
        if (clickedEl.classList.contains('descriptionLoad')) {
          loadDescription(thisPost);
        } else {
          const descriptionContent = thisPost.querySelector(
            '.descriptionContent',
          );
          if (descriptionContent.classList.toggle('visible')) {
            clickedEl.querySelector('span').textContent = t(
              'content.hideDescription',
            );
          } else {
            clickedEl.querySelector('span').textContent = t(
              'content.showDescription',
            );
          }
        }
      }
    });

  document.addEventListener('click', async (event) => {
    const clickedEl = event.target.closest('.btnSingle');
    if (clickedEl) {
      // Prevent multiple clicks during processing
      if (
        clickedEl.disabled &&
        !clickedEl.classList.contains('temp-disabled')
      ) {
        return;
      }

      const thisButton = clickedEl;
      const thisWrap = thisButton.parentElement;

      // Add loading state
      thisButton.disabled = true;
      thisButton.classList.add('loading');
      const originalText = thisButton.textContent;
      thisButton.textContent = t('content.processing');

      const giveawayUrlPath = thisWrap.querySelector(
        '.giveaway__heading__name',
      ).href;
      const uniqueCode = giveawayUrlPath.match(/.+giveaway\/(.+)\//)[1];

      if (!uniqueCode) {
        // Reset button state on error
        thisButton.disabled = false;
        thisButton.classList.remove('loading');
        thisButton.textContent = originalText;
        return;
      }

      const formData = new FormData();
      formData.append('xsrf_token', token);
      formData.append('code', uniqueCode);

      try {
        if (thisButton.getAttribute('walkState') === 'join') {
          if (settings.AutoDescription) {
            if (
              thisWrap
                .querySelector('.description')
                .classList.contains('descriptionLoad')
            ) {
              thisWrap.querySelector('.description').click();
            }
          }
          formData.append('do', 'entry_insert');
          const res = await fetch(`${window.location.origin}/ajax.php`, {
            method: 'post',
            credentials: 'include',
            body: formData,
          });
          if (!res.ok) {
            console.error(`Error entering giveaway: HTTP ${res.status}`);
            return;
          }
          const json = await res.json();
          if (json.type === 'success') {
            thisWrap.classList.toggle('is-faded');
            if (settings.HideEntered) {
              thisWrap.style.opacity = '0';
              thisWrap.style.display = 'none';
              thisWrap.parentElement.remove();
              // todo: return animations
            } else {
              thisButton.setAttribute('walkState', 'leave');
              thisButton.disabled = false;
              thisButton.classList.remove('loading');
              thisButton.textContent = t('content.leave');
            }
            currentState.points = json.points.replace(',', '');
            updateButtons();
            /* Post Comment */
            if (settings.AutoComment && settings.Comment) {
              /* parse comment settings */
              const comments = settings.Comment.split('#').map((comment) =>
                comment.trim(),
              );
              const chosenComment =
                comments[Math.floor(Math.random() * comments.length)];
              if (chosenComment) {
                // checks if an empty comment has been selected
                const commentFormData = new FormData();
                commentFormData.append('xsrf_token', token);
                commentFormData.append('do', 'comment_new');
                commentFormData.append('description', chosenComment);
                commentFormData.append('parent_id', '');
                try {
                  const res = await fetch(giveawayUrlPath, {
                    method: 'post',
                    credentials: 'include',
                    redirect: 'follow',
                    body: commentFormData,
                  });
                  if (!res.ok) {
                    console.error(`Error leaving comment: HTTP ${res.status}`);
                  } else {
                    console.debug(
                      `Comment posted successfully for ${giveawayUrlPath}`,
                    );
                  }
                } catch (commentError) {
                  console.error('Error posting comment:', commentError);
                }
              }
            }
          } else {
            thisButton.classList.remove('loading');
            thisButton.disabled = false;
            thisButton.textContent = `Error: ${json.msg}`;
          }
        } else {
          formData.append('do', 'entry_delete');
          const res = await fetch(`${window.location.origin}/ajax.php`, {
            method: 'post',
            credentials: 'include',
            body: formData,
          });
          if (!res.ok) {
            console.error(`Error leaving giveaway: HTTP ${res.status}`);
            thisButton.classList.remove('loading');
            thisButton.disabled = false;
            thisButton.textContent = t('content.networkError');
            setTimeout(() => {
              thisButton.textContent = originalText;
            }, 2000);
            return;
          }
          const json = await res.json();
          if (json.type === 'success') {
            thisWrap.classList.toggle('is-faded');
            currentState.points = json.points.replace(',', '');
            thisButton.setAttribute('walkState', 'join');
            thisButton.disabled = false;
            thisButton.classList.remove('loading');
            thisButton.textContent = t('content.join');
            updateButtons();
          } else {
            thisButton.classList.remove('loading');
            thisButton.disabled = false;
            thisButton.textContent = `Error: ${json.msg}`;
          }
        }
      } catch (error) {
        console.error('Error processing giveaway action:', error);
        thisButton.textContent = t('content.networkError');
        setTimeout(() => {
          thisButton.textContent = originalText;
          thisButton.disabled = false;
        }, 2000);
      } finally {
        // Always remove loading state
        thisButton.classList.remove('loading');
      }
    }
  });

  /* I wonder if anyone actually uses this.. */
  if (settings.RepeatIfOnPage) {
    setInterval(() => {
      if (onlyOnePage) {
        pageLink = window.location.href;
        loadingNextPage = false;
        pageNumber = '';
        thirdPart = '';
        lastPage = true;
        pagesLoaded = 0;
        document.querySelector('#posts').replaceChildren();
        loadPage();
      } else {
        pagesLoaded = 0;
        pageNumber = 1;
        if (settings.InfiniteScrolling) {
          settings.InfiniteScrolling = false;
          document.querySelector('#posts').replaceChildren();
          loadPage();
          setTimeout(() => {
            settings.InfiniteScrolling = true;
          }, 5000);
        } else {
          document.querySelector('#posts').replaceChildren();
          loadPage();
        }
      }
      fireAutoJoin();
    }, 3600000 * settings.RepeatHours);
  }
}
