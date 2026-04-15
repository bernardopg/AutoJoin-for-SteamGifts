(() => {
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

  const calculateWinChance = (
    timeLeft,
    timeStart,
    numberOfEntries,
    numberOfCopies,
    timeLoaded,
  ) => {
    const timePassed = timeLoaded - timeStart;
    const predictionOfEntries = (numberOfEntries / timePassed) * timeLeft;
    const chance =
      (1 / (numberOfEntries + 1 + predictionOfEntries)) * 100 * numberOfCopies;
    return chance;
  };

  const api = {
    looksLikeSteamSessionBlocked,
    calculateWinChance,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  globalThis.AutoJoinBackgroundHelpers = api;
})();
