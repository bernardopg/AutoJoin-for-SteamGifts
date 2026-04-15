/*
 * AutoJoin for SteamGifts - Giveaway helpers for autoentry
 * Centralizes giveaway DOM mutation, Steam store checks, and action helpers.
 */

(() => {
  function secToTime(x) {
    let sec = x;
    const days = Math.floor(sec / (24 * 60 * 60));
    sec %= 86400;
    const hours = Math.floor(sec / (60 * 60));
    sec %= 3600;
    const minutes = Math.floor(sec / 60);
    sec %= 60;
    if (days !== 0) {
      return `${days}d ${hours}:${minutes.toString().padStart(2, '0')}:${sec
        .toString()
        .padStart(2, '0')}`;
    } else if (hours !== 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${sec
        .toString()
        .padStart(2, '0')}`;
    } else if (minutes !== 0) {
      return `${minutes.toString().padStart(2, '0')}:${sec
        .toString()
        .padStart(2, '0')}`;
    }
    return `${sec} s`;
  }

  function createGiveawayHelpers({ state, t, chrome, document, thisVersion }) {
    function calculateWinChance(giveaway, timeLoaded) {
      const timeLeft =
        parseInt(
          giveaway.querySelector('.fa.fa-clock-o + span').dataset.timestamp,
          10,
        ) - timeLoaded;
      const timePassed =
        timeLoaded -
        parseInt(
          giveaway
            .querySelector('.giveaway__username')
            .parentElement.querySelector('span').dataset.timestamp,
          10,
        );
      const numberOfEntries = parseInt(
        giveaway
          .querySelector('.giveaway__links a[href$="/entries"]')
          ?.textContent.replace(',', ''),
        10,
      );
      let numberOfCopies = 1;
      if (
        giveaway
          .querySelector('.giveaway__heading__thin')
          .textContent.replace(',', '')
          .match(/\(\d+ Copies\)/)
      ) {
        numberOfCopies = parseInt(
          giveaway
            .querySelector('.giveaway__heading__thin')
            .textContent.replace(',', '')
            .match(/\d+/)[0],
          10,
        );
      }
      const predictionOfEntries = (numberOfEntries / timePassed) * timeLeft;
      let chance =
        (1 / (numberOfEntries + 1 + predictionOfEntries)) *
        100 *
        numberOfCopies;
      if (chance > 100) chance = 100;
      return chance.toFixed(3);
    }

    function loadDescription(giveaway) {
      const giveawayToggleText = giveaway.querySelector('.description span');
      const giveawayURL = giveaway.querySelector(
        '.giveaway__heading__name',
      ).href;
      const giveawayDescriptionEl = giveaway.querySelector('.descriptionLoad');
      giveawayToggleText.textContent = t('content.hideDescription');
      giveawayDescriptionEl.className = 'description';
      const giveawayDescriptionWrapper = document.createElement('div');
      giveawayDescriptionWrapper.className = 'descriptionContent visible';
      giveaway.appendChild(giveawayDescriptionWrapper);
      const descriptionIcon = giveaway.querySelector('.descriptionIcon');
      descriptionIcon.className = 'fa fa-refresh fa-spin descriptionIcon';

      fetch(giveawayURL, { credentials: 'include' })
        .then((resp) => resp.text())
        .then((giveawayContent) => {
          const parser = new DOMParser();
          const giveawayDOM = parser.parseFromString(
            giveawayContent,
            'text/html',
          );
          let giveawayDescription = giveawayDOM.querySelector(
            '.page__description .markdown',
          );
          if (giveawayDescription == null) {
            giveawayDescription = document.createTextNode(
              t('content.noDescription'),
            );
          }
          giveawayDescriptionWrapper.appendChild(giveawayDescription);
          descriptionIcon.className = 'fa fa-file-text descriptionIcon';
        });
    }

    function getSteamAppId(giveaway) {
      const steamLink =
        giveaway.querySelector('.fa-steam')?.parentElement?.href;
      if (!steamLink) {
        console.debug('error retrieving app id');
        return false;
      }
      const appmatch = steamLink.match(/.+app\/(\d+)\//);
      if (appmatch == null) {
        return false;
      }
      return parseInt(appmatch[1], 10);
    }

    function getSteamPackageId(giveaway) {
      const iconEl = giveaway.querySelector(
        '.giveaway__summary .giveaway__heading .giveaway__icon',
      );
      const steamLink = iconEl?.href || null;
      if (!steamLink) {
        console.debug('error retrieving package id');
        return false;
      }
      const packagematch = steamLink.match(/.+sub\/(\d+)\//);
      if (packagematch == null) {
        return false;
      }
      return parseInt(packagematch[1], 10);
    }

    function removeGiveaway(type, id, giveaway) {
      if (
        !giveaway.parentElement?.classList.contains(
          'pinned-giveaways__inner-wrap',
        )
      ) {
        console.debug(`hidden ${type}: ${id}`);
        giveaway.remove();
      }
    }

    function hasGame(id) {
      return state.ownedSteamApps.indexOf(id) > -1;
    }

    function inWishlist(id) {
      return state.wishList.indexOf(id) > -1;
    }

    function priorityGiveaway(giveaway, steamGroup, regionLocked, whitelist) {
      if (
        state.settings.PriorityWishlist &&
        inWishlist(getSteamAppId(giveaway))
      ) {
        return true;
      } else if (state.settings.PriorityGroup && steamGroup) {
        return true;
      } else if (state.settings.PriorityRegion && regionLocked) {
        return true;
      } else if (state.settings.PriorityWhitelist && whitelist) {
        return true;
      }
      return false;
    }

    function ignoreGiveaway(steamGroup, whitelist) {
      if (state.settings.IgnoreGroups && steamGroup) {
        return true;
      } else if (state.settings.IgnoreWhitelist && whitelist) {
        return true;
      }
      return false;
    }

    function filterGiveaway(giveaway, appID, appType, hasTradingCards) {
      const steamGroupGiveaway = Boolean(
        giveaway.querySelector('.giveaway__column--group'),
      );
      const whiteListGiveaway = Boolean(
        giveaway.querySelector('.giveaway__column--whitelist'),
      );

      if (hasGame(appID)) {
        return true;
      } else if (inWishlist(appID)) {
        return false;
      } else if (state.settings.HideNonTradingCards && !hasTradingCards) {
        return true;
      } else if (
        state.settings.HideDlc &&
        appType == 'dlc' &&
        appType != 'game'
      ) {
        return true;
      } else if (state.settings.HideGroups && steamGroupGiveaway) {
        return true;
      } else if (state.settings.HideWhitelist && whiteListGiveaway) {
        return true;
      }
      return false;
    }

    function cacheSteamAppData(
      appId,
      appType,
      tradingCards,
      lastUpdated,
      timeLoaded,
    ) {
      if (
        state.steamAppData[appId] === undefined ||
        timeLoaded - lastUpdated >= 604800 ||
        state.steamAppData[appId].version != thisVersion
      ) {
        state.steamAppData[appId] = {
          appId,
          type: appType,
          hasTradingCards: tradingCards,
          lastUpdated: timeLoaded,
          version: thisVersion,
        };

        const cacheAppData = {};
        cacheAppData.Apps = state.steamAppData;
        chrome.storage.local.set(cacheAppData, () => {
          if (chrome.runtime.lastError) {
            console.warn(chrome.runtime.lastError.message);
          } else {
            console.debug('Cached', state.steamAppData[appId]);
          }
        });
      }
    }

    function cacheSteamPackageData(packageId, appIds, lastUpdated, timeLoaded) {
      if (
        state.steamPackageData[packageId] === undefined ||
        timeLoaded - lastUpdated >= 604800 ||
        state.steamPackageData[packageId].version != thisVersion
      ) {
        state.steamPackageData[packageId] = {
          packageId,
          appIds,
          lastUpdated: timeLoaded,
          version: thisVersion,
        };

        const cachePackageData = {};
        cachePackageData.Packages = state.steamPackageData;
        chrome.storage.local.set(cachePackageData, () => {
          if (chrome.runtime.lastError) {
            console.warn(chrome.runtime.lastError.message);
          } else {
            console.debug('Cached', state.steamPackageData[packageId]);
          }
        });
      }
    }

    async function checkSteamPackageApps(
      appIds,
      packageId,
      giveaway,
      timeLoaded,
    ) {
      let removePackage = true;
      for (const appId of appIds) {
        const cacheData =
          state.steamAppData[appId] != undefined
            ? state.steamAppData[appId]
            : undefined;
        const lastUpdated = cacheData != undefined ? cacheData.lastUpdated : 0;

        if (cacheData != undefined) {
          if (
            cacheData != undefined &&
            !filterGiveaway(
              giveaway,
              appId,
              cacheData.appType,
              cacheData.hasTradingCards,
            )
          ) {
            removePackage = false;
          }
        }
        if (
          cacheData == undefined ||
          timeLoaded - lastUpdated >= 604800 ||
          cacheData.version != thisVersion
        ) {
          const url = `https://store.steampowered.com/api/packagedetails?packageids=${packageId}`;
          const response = await chrome.runtime.sendMessage({
            task: 'fetch',
            url,
          });
          if (response.status === 200) {
            const appUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&filters=basic,categories`;
            const appResp = await chrome.runtime.sendMessage({
              task: 'fetch',
              url: appUrl,
            });
            if (appResp.status === 200) {
              const appJson = JSON.parse(appResp.text);
              if (appJson[appId]?.success === true) {
                const data = appJson[appId].data;
                const hasCats = Array.isArray(data.categories);
                const tradingCards = hasCats
                  ? data.categories.some((c) => c && c.id == 29)
                  : false;
                cacheSteamAppData(
                  appId,
                  data.type,
                  tradingCards,
                  lastUpdated,
                  timeLoaded,
                );
                if (!filterGiveaway(giveaway, appId, data.type, tradingCards)) {
                  removePackage = false;
                }
              }
            }
          }
        }
        if (!removePackage) {
          break;
        }
      }
      if (removePackage) {
        removeGiveaway('package', packageId, giveaway);
      }
    }

    async function checkSteamPackageData(giveaway, timeLoaded) {
      const packageId = getSteamPackageId(giveaway);
      if (packageId == false) {
        return;
      }
      let appIds = [];
      const cacheData =
        state.steamPackageData[packageId] != undefined
          ? state.steamPackageData[packageId]
          : undefined;
      const lastUpdated = cacheData != undefined ? cacheData.lastUpdated : 0;

      if (cacheData != undefined) {
        appIds = state.steamPackageData[packageId].appIds;
        checkSteamPackageApps(appIds, packageId, giveaway, timeLoaded);
      }
      if (
        cacheData == undefined ||
        timeLoaded - lastUpdated >= 604800 ||
        cacheData.version != thisVersion
      ) {
        const url = `https://store.steampowered.com/api/packagedetails?packageids=${packageId}`;
        const response = await chrome.runtime.sendMessage({
          task: 'fetch',
          url,
        });
        if (response.status === 200) {
          const jsonResponse = JSON.parse(response.text);
          if (jsonResponse[packageId].success == true) {
            const jsonIds = jsonResponse[packageId].data.apps;
            for (
              let i = 0, numIds = jsonIds != null ? jsonIds.length : 0;
              i < numIds;
              i++
            ) {
              appIds[i] = jsonIds[i].id;
            }
            cacheSteamPackageData(packageId, appIds, lastUpdated, timeLoaded);
          }
          checkSteamPackageApps(appIds, packageId, giveaway, timeLoaded);
        }
      }
    }

    async function checkAppData(giveaway, timeLoaded) {
      const appId = getSteamAppId(giveaway);

      if (appId != false) {
        const cacheData =
          state.steamAppData[appId] != undefined
            ? state.steamAppData[appId]
            : undefined;
        const lastUpdated = cacheData != undefined ? cacheData.lastUpdated : 0;

        if (
          cacheData != undefined &&
          filterGiveaway(
            giveaway,
            appId,
            cacheData.type,
            cacheData.hasTradingCards,
          )
        ) {
          removeGiveaway('app', appId, giveaway);
        }
        if (
          cacheData == undefined ||
          timeLoaded - lastUpdated >= 604800 ||
          cacheData.version != thisVersion
        ) {
          const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&filters=basic,categories`;
          const response = await chrome.runtime.sendMessage({
            task: 'fetch',
            url,
          });
          if (response.status === 200) {
            const jsonResponse = JSON.parse(response.text);
            if (jsonResponse[appId].success == true) {
              const tradingCards =
                jsonResponse[appId].data.categories != undefined
                  ? jsonResponse[appId].data.categories.some(function (data) {
                      return data.id == 29;
                    })
                  : false;
              cacheSteamAppData(
                appId,
                jsonResponse[appId].data.type,
                tradingCards,
                lastUpdated,
                timeLoaded,
              );
              if (
                filterGiveaway(
                  giveaway,
                  appId,
                  jsonResponse[appId].data.type,
                  tradingCards,
                )
              ) {
                removeGiveaway('app', appId, giveaway);
              }
            }
          }
        }
      } else {
        checkSteamPackageData(giveaway, timeLoaded);
      }
    }

    function modifyPageDOM(pageDOM, timeLoaded) {
      const settings = state.settings;

      pageDOM
        .querySelectorAll('.giveaway__row-outer-wrap')
        .forEach((giveaway) => {
          const giveawayInnerWrap = giveaway.querySelector(
            '.giveaway__row-inner-wrap',
          );

          const levelEl = giveaway.querySelector(
            '.giveaway__column--contributor-level',
          );
          let level;
          if (levelEl === null) {
            level = 0;
          } else {
            level = parseInt(levelEl.textContent.match(/\d+/)[0], 10);
          }
          if (level < settings.HideLevelsBelow) giveaway.remove();
          if (level > settings.HideLevelsAbove) giveaway.remove();

          if (settings.HideCostsBelow > 0) {
            const copiesAndCostElements = giveaway.querySelectorAll(
              '.giveaway__heading__thin',
            );
            let costElement;
            if (copiesAndCostElements.length > 1) {
              costElement = copiesAndCostElements[1];
            } else {
              costElement = copiesAndCostElements[0];
            }
            const cost = Number.parseInt(
              costElement.textContent.match(/\d+/)[0],
              10,
            );
            if (cost < settings.HideCostsBelow) giveaway.remove();
          }
          if (settings.HideCostsAbove < 50) {
            const copiesAndCostElements = giveaway.querySelectorAll(
              '.giveaway__heading__thin',
            );
            let costElement;
            if (copiesAndCostElements.length > 1) {
              costElement = copiesAndCostElements[1];
            } else {
              costElement = copiesAndCostElements[0];
            }
            const cost = Number.parseInt(
              costElement.textContent.match(/\d+/)[0],
              10,
            );
            if (cost > settings.HideCostsAbove) giveaway.remove();
          }

          if (giveawayInnerWrap.classList.contains('is-faded')) {
            if (settings.HideEntered) {
              giveaway.remove();
              return;
            } else if (settings.ShowButtons) {
              const leaveBtn = document.createElement('input');
              leaveBtn.type = 'button';
              leaveBtn.value = t('content.leave');
              leaveBtn.className = 'btnSingle';
              leaveBtn.setAttribute('walkState', 'leave');
              giveawayInnerWrap.appendChild(leaveBtn);
            }
          } else if (settings.ShowButtons) {
            const joinBtn = document.createElement('input');
            joinBtn.type = 'button';
            joinBtn.className = 'btnSingle';
            if (
              giveawayInnerWrap.querySelector(
                '.giveaway__column--contributor-level--negative',
              )
            ) {
              joinBtn.value = t('content.needHigherLevel');
              joinBtn.setAttribute('walkState', 'no-level');
              joinBtn.disabled = true;
            } else {
              const pointsAndNumberOfCopies = giveaway.querySelectorAll(
                '.giveaway__heading__thin',
              );
              const pointsNeededRaw =
                pointsAndNumberOfCopies[
                  pointsAndNumberOfCopies.length - 1
                ].textContent.match(/(\d+)P/);
              const pointsNeeded = pointsNeededRaw[pointsNeededRaw.length - 1];
              if (parseInt(pointsNeeded, 10) > state.currentState.points) {
                joinBtn.value = t('content.notEnoughPoints');
                joinBtn.setAttribute('walkState', 'no-points');
                joinBtn.disabled = true;
              } else {
                joinBtn.value = t('content.join');
                joinBtn.setAttribute('walkState', 'join');
              }
            }
            giveawayInnerWrap.appendChild(joinBtn);
          }

          const giveawayHideEl = giveaway.querySelector('.giveaway__hide');
          if (giveawayHideEl) giveawayHideEl.dataset.popup = '';
          if (
            settings.HideDlc ||
            settings.HideNonTradingCards ||
            settings.HideGroups
          ) {
            checkAppData(giveaway, timeLoaded);
          }
          if (settings.ShowChance) {
            const oddsDiv = document.createElement('div');
            oddsDiv.style.cursor = 'help';
            oddsDiv.title = t('content.winOddsTitle');
            const oddsIcon = document.createElement('i');
            oddsIcon.className = 'fa fa-trophy';
            const oddsText = document.createTextNode(
              ` ${calculateWinChance(giveaway, timeLoaded)}%`,
            );
            oddsDiv.appendChild(oddsIcon);
            oddsDiv.appendChild(oddsText);
            giveaway
              .querySelector('.giveaway__columns')
              .insertBefore(
                oddsDiv,
                giveaway.querySelector('.giveaway__columns').firstChild,
              );
          }
          const descriptionDiv = document.createElement('div');
          descriptionDiv.className = 'description descriptionLoad';
          const descriptionA = document.createElement('a');
          const descriptionIcon = document.createElement('i');
          descriptionIcon.className = 'fa fa-file-text descriptionIcon';
          const descriptionText = document.createElement('span');
          descriptionText.textContent = t('content.showDescription');
          descriptionA.appendChild(descriptionIcon);
          descriptionA.appendChild(document.createTextNode(' '));
          descriptionA.appendChild(descriptionText);
          descriptionDiv.appendChild(descriptionA);
          giveaway
            .querySelector('.giveaway__links')
            .appendChild(descriptionDiv);
          if (
            document.querySelector('.pinned-giveaways__inner-wrap') &&
            document.querySelector('.pinned-giveaways__inner-wrap').children
              .length === 0
          ) {
            document.querySelector('.pinned-giveaways__inner-wrap').remove();
          }
          const timeRemaining =
            giveaway.querySelector('.fa-clock-o + span').dataset.timestamp -
            timeLoaded;
          if (settings.PreciseTime) {
            giveaway.querySelector('.fa-clock-o + span').textContent =
              secToTime(timeRemaining);
          }
        });
    }

    return {
      calculateWinChance,
      loadDescription,
      checkAppData,
      checkSteamPackageData,
      checkSteamPackageApps,
      cacheSteamAppData,
      cacheSteamPackageData,
      getSteamAppId,
      getSteamPackageId,
      removeGiveaway,
      priorityGiveaway,
      ignoreGiveaway,
      filterGiveaway,
      hasGame,
      inWishlist,
      secToTime,
      modifyPageDOM,
    };
  }

  const api = {
    createGiveawayHelpers,
    secToTime,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  globalThis.AutoJoinAutoentryGiveaway = api;
})();
