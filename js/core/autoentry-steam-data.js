/*
 * AutoJoin for SteamGifts - Steam data helpers for autoentry
 * Keeps Steam profile cache, banner, and fetch logic isolated from the main content script.
 */

(() => {
  function normalizeSteamProfileUrl(url) {
    if (!url) {
      return '';
    }

    return url.endsWith('/') ? url : `${url}/`;
  }

  function getSteamCacheKeys(profileUrl, steamProfileID) {
    return [
      ...new Set(
        [steamProfileID, normalizeSteamProfileUrl(profileUrl)].filter(Boolean),
      ),
    ];
  }

  function createSteamDataHelpers({
    state,
    t,
    steamCommunityHelper,
    chrome,
    document,
    refreshSteamData,
  }) {
    function shouldLoadSteamData() {
      const { settings } = state;

      return (
        settings.HideDlc ||
        settings.HideNonTradingCards ||
        settings.HideGroups ||
        settings.PriorityWishlist
      );
    }

    function applyCachedSteamData(storageData, cacheKeys) {
      for (const cacheKey of cacheKeys) {
        if (!storageData[cacheKey]) {
          continue;
        }

        state.ownedSteamApps = storageData[cacheKey].ownedGames || [];
        state.wishList = storageData[cacheKey].wishlist || [];
        console.debug('Owned games: ', state.ownedSteamApps);
        console.debug('Wishlist: ', state.wishList);
        return true;
      }

      return false;
    }

    function saveSteamData(cacheKeys) {
      const steamUserData = {
        ownedGames: [...new Set(state.ownedSteamApps)],
        wishlist: [...new Set(state.wishList)],
      };
      const payload = {};

      cacheKeys.forEach((cacheKey) => {
        payload[cacheKey] = steamUserData;
      });

      chrome.storage.local.set(payload);
    }

    function updateSteamDataBanner(steamDataIssueKey, retryContext = {}) {
      const featuredSummary = document.querySelector('.featured__summary');
      const anchor = featuredSummary || document.body;
      let banner = document.getElementById('aj-permission-banner');

      if (!steamDataIssueKey) {
        if (banner) {
          banner.style.display = 'none';
        }
        return;
      }

      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'aj-permission-banner';
        banner.className = 'aj-permission-banner';

        if (featuredSummary) {
          anchor.prepend(banner);
        } else {
          anchor.appendChild(banner);
        }
      }

      banner.replaceChildren();

      const titleEl = document.createElement('strong');
      titleEl.textContent = t('content.permissionBanner.title');

      const bodyEl = document.createTextNode(
        ` ${t(
          steamDataIssueKey === 'content.notifications.steamLoginRequired'
            ? 'content.permissionBanner.loginBody'
            : 'content.permissionBanner.body',
        )} `,
      );

      const retryLink = document.createElement('a');
      retryLink.id = 'aj-perm-retry';
      retryLink.href = '#';
      retryLink.textContent = t('content.permissionBanner.retry');
      retryLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof refreshSteamData === 'function') {
          refreshSteamData(retryContext);
        }
      });

      banner.append(titleEl, bodyEl, retryLink, '.');
      banner.style.display = 'block';
    }

    async function resolveSteamProfileId(profileUrl) {
      if (!profileUrl) {
        return '';
      }

      const response = await chrome.runtime.sendMessage({
        task: 'fetch',
        url: profileUrl,
      });

      if (response.status !== 200) {
        return '';
      }

      return (
        steamCommunityHelper?.extractSteamIdFromProfileHtml(response.text) || ''
      );
    }

    async function fetchCommunitySteamData(steamProfileID) {
      const requiresSteamLogin = (html) =>
        /<title>\s*(Sign In|Wishlist - Error)\s*<\/title>/i.test(html);
      let steamDataIssueKey = null;

      let url = `https://steamcommunity.com/profiles/${steamProfileID}/games?tab=all`;
      let response = await chrome.runtime.sendMessage({ task: 'fetch', url });
      if (response.status === 200) {
        if (requiresSteamLogin(response.text)) {
          steamDataIssueKey = 'content.notifications.steamLoginRequired';
          console.info(t(steamDataIssueKey));
        } else {
          const patterns = [
            /rgGames\s*=\s*(\[.*?\])/s,
            /var\s+rgGames\s*=\s*(\[.*?\])/s,
            /RG\.games\s*=\s*(\[.*?\])/s,
          ];
          let jsonArrayStr = null;
          for (const pat of patterns) {
            const match = pat.exec(response.text);
            if (match && match[1]) {
              jsonArrayStr = match[1];
              break;
            }
          }
          if (jsonArrayStr) {
            try {
              const jsonResponse = JSON.parse(jsonArrayStr);
              state.ownedSteamApps = jsonResponse
                .map((g) => g.appid)
                .filter(Boolean);
            } catch (error) {
              console.info('Failed to parse owned games JSON');
            }
          } else {
            steamDataIssueKey = 'content.notifications.ownedGamesParseFailed';
            console.info(t(steamDataIssueKey));
          }
        }
      } else if (response.status === 403) {
        console.warn(t('content.notifications.skipOwnedGames'));
        steamDataIssueKey ||= 'content.notifications.skipOwnedGames';
      }

      url = `https://steamcommunity.com/profiles/${steamProfileID}/wishlist`;
      response = await chrome.runtime.sendMessage({ task: 'fetch', url });
      if (response.status === 200) {
        if (requiresSteamLogin(response.text)) {
          steamDataIssueKey ||= 'content.notifications.steamLoginRequired';
        } else {
          const regex = /steamcommunity\.com\/app\/(\d+)/g;
          let match;
          state.wishList = [];
          while ((match = regex.exec(response.text)) != null) {
            state.wishList.push(parseInt(match[1], 10));
          }
        }
      } else if (response.status === 403) {
        console.warn(t('content.notifications.skipWishlist'));
        steamDataIssueKey ||= 'content.notifications.skipWishlist';
      }

      return steamDataIssueKey;
    }

    return {
      shouldLoadSteamData,
      normalizeSteamProfileUrl,
      getSteamCacheKeys,
      applyCachedSteamData,
      saveSteamData,
      updateSteamDataBanner,
      resolveSteamProfileId,
      fetchCommunitySteamData,
    };
  }

  const api = {
    createSteamDataHelpers,
    normalizeSteamProfileUrl,
    getSteamCacheKeys,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  globalThis.AutoJoinAutoentrySteamData = api;
})();
