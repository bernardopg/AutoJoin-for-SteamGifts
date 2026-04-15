/**
 * AutoJoin for SteamGifts - Giveaway Core Module
 * Centralized giveaway logic and data management
 */

class Giveaway {
  constructor(data) {
    this.code = data.code;
    this.appid = data.appid;
    this.name = data.name;
    this.cost = data.cost;
    this.timeleft = data.timeleft;
    this.level = data.level;
    this.numberOfCopies = data.numberOfCopies || 1;
    this.numberOfEntries = data.numberOfEntries;
    this.status = data.status || {
      Entered: false,
      NoPoints: false,
      NoLevel: false,
    };
    this.timeStart = data.timeStart;
    this.timeEnd = data.timeEnd;
    this.isGroupGA = data.isGroupGA || false;
    this.isWhitelistGA = data.isWhitelistGA || false;
    this.isRegionLocked = data.isRegionLocked || false;
    this.isDLC = data.isDLC || false;
    this.hasTradingCards = data.hasTradingCards || false;
  }

  /**
   * Join this giveaway
   * @param {string} token - CSRF token
   * @returns {Promise<Object>} Response from SteamGifts
   */
  async join(token) {
    const formData = new FormData();
    formData.append('xsrf_token', token);
    formData.append('do', 'entry_insert');
    formData.append('code', this.code);

    try {
      const response = await fetch('https://www.steamgifts.com/ajax.php', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();

      if (json.type === 'success') {
        this.status.Entered = true;
        return {
          success: true,
          points: json.points,
          message: 'Successfully joined giveaway',
        };
      } else {
        this.status.Error = true;
        this.errorMsg = json.msg;
        return { success: false, message: json.msg };
      }
    } catch (error) {
      console.error('Error joining giveaway:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Leave this giveaway
   * @param {string} token - CSRF token
   * @returns {Promise<Object>} Response from SteamGifts
   */
  async leave(token) {
    const formData = new FormData();
    formData.append('xsrf_token', token);
    formData.append('do', 'entry_delete');
    formData.append('code', this.code);

    try {
      const response = await fetch('https://www.steamgifts.com/ajax.php', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();

      if (json.type === 'success') {
        this.status.Entered = false;
        return {
          success: true,
          points: json.points,
          message: 'Successfully left giveaway',
        };
      } else {
        this.status.Error = true;
        this.errorMsg = json.msg;
        return { success: false, message: json.msg };
      }
    } catch (error) {
      console.error('Error leaving giveaway:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Calculate win chance for this giveaway
   * @param {number} timeLoaded - When the page was loaded
   * @returns {number} Win chance percentage
   */
  calculateWinChance(timeLoaded) {
    const timePassed = timeLoaded - this.timeStart;
    const predictionOfEntries =
      (this.numberOfEntries / timePassed) * this.timeleft;
    let chance =
      (1 / (this.numberOfEntries + 1 + predictionOfEntries)) *
      100 *
      this.numberOfCopies;

    if (chance > 100) chance = 100;
    return Math.max(0, parseFloat(chance.toFixed(3)));
  }

  /**
   * Get formatted time remaining
   * @returns {string} Formatted time string
   */
  getFormattedTimeRemaining() {
    return AutoJoinUtils.formatTimeRemaining(this.timeEnd);
  }

  /**
   * Check if user can join this giveaway
   * @param {number} userPoints - User's current points
   * @param {number} userLevel - User's current level
   * @returns {Object} Can join status and reason
   */
  canJoin(userPoints, userLevel) {
    if (this.status.Entered) {
      return { canJoin: false, reason: 'Already entered' };
    }

    if (this.level > userLevel) {
      return { canJoin: false, reason: `Need level ${this.level}` };
    }

    if (this.cost > userPoints) {
      return { canJoin: false, reason: 'Not enough points' };
    }

    if (this.timeleft <= 0) {
      return { canJoin: false, reason: 'Giveaway ended' };
    }

    return { canJoin: true, reason: 'Can join' };
  }

  /**
   * Check if this giveaway should be filtered based on settings
   * @param {Object} settings - User settings
   * @param {Array} ownedGames - User's owned games
   * @param {Array} wishlist - User's wishlist
   * @returns {boolean} True if should be filtered (hidden)
   */
  shouldFilter(settings, ownedGames = [], wishlist = []) {
    return shouldFilterGiveaway(this, settings, ownedGames, wishlist);
  }

  /**
   * Get priority score for sorting
   * @param {Object} settings - User settings
   * @param {Array} wishlist - User's wishlist
   * @returns {number} Priority score (higher = more priority)
   */
  getPriorityScore(settings, wishlist = []) {
    return getPriorityScore(
      this,
      settings,
      wishlist,
      settings.OddsPriority ? this.calculateWinChance(Date.now() / 1000) : 0,
    );
  }

  /**
   * Post a comment on this giveaway
   * @param {string} token - CSRF token
   * @param {string} comment - Comment text
   * @returns {Promise<boolean>} Success status
   */
  async postComment(token, comment) {
    if (!comment || comment.trim() === '') {
      return false;
    }

    const giveawayUrl = `https://www.steamgifts.com/giveaway/${this.code}/`;
    const formData = new FormData();
    formData.append('xsrf_token', token);
    formData.append('do', 'comment_new');
    formData.append('description', comment.trim());
    formData.append('parent_id', '');

    try {
      const response = await fetch(giveawayUrl, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      return response.ok;
    } catch (error) {
      console.warn('Failed to post comment:', error);
      return false;
    }
  }

  /**
   * Load description for this giveaway
   * @returns {Promise<string>} Giveaway description HTML
   */
  async loadDescription() {
    const giveawayUrl = `https://www.steamgifts.com/giveaway/${this.code}/`;

    try {
      const response = await fetch(giveawayUrl, { credentials: 'include' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const giveawayDOM = parser.parseFromString(html, 'text/html');
      const description = giveawayDOM.querySelector(
        '.page__description .markdown',
      );

      return description ? description.innerHTML : 'No description available.';
    } catch (error) {
      console.error('Error loading description:', error);
      return 'Failed to load description.';
    }
  }

  /**
   * Get Steam store URL for this giveaway
   * @returns {string} Steam store URL
   */
  getSteamUrl() {
    return `https://store.steampowered.com/app/${this.appid}/`;
  }

  /**
   * Get SteamGifts URL for this giveaway
   * @returns {string} SteamGifts URL
   */
  getUrl() {
    return `https://www.steamgifts.com/giveaway/${this.code}/`;
  }

  /**
   * Convert to JSON for storage/export
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      code: this.code,
      appid: this.appid,
      name: this.name,
      cost: this.cost,
      timeleft: this.timeleft,
      level: this.level,
      numberOfCopies: this.numberOfCopies,
      numberOfEntries: this.numberOfEntries,
      status: this.status,
      timeStart: this.timeStart,
      timeEnd: this.timeEnd,
      isGroupGA: this.isGroupGA,
      isWhitelistGA: this.isWhitelistGA,
      isRegionLocked: this.isRegionLocked,
      isDLC: this.isDLC,
      hasTradingCards: this.hasTradingCards,
    };
  }

  /**
   * Create Giveaway from JSON
   * @param {Object} json - JSON data
   * @returns {Giveaway} New giveaway instance
   */
  static fromJSON(json) {
    return new Giveaway(json);
  }
}

/**
 * Giveaway Parser - Extracts giveaway data from HTML
 */
class GiveawayParser {
  /**
   * Parse giveaways from HTML page
   * @param {string} pageHTML - HTML content
   * @returns {Array<Giveaway>} Array of parsed giveaways
   */
  static parsePage(pageHTML) {
    const parser = new DOMParser();
    const pageDOM = parser.parseFromString(pageHTML, 'text/html');
    const giveawaysDOM = pageDOM.querySelectorAll('.giveaway__row-outer-wrap');
    const giveaways = [];

    giveawaysDOM.forEach((giveawayDOM) => {
      try {
        const giveawayData = this.parseGiveawayElement(giveawayDOM);
        if (giveawayData) {
          giveaways.push(new Giveaway(giveawayData));
        }
      } catch (error) {
        console.warn('Error parsing giveaway:', error);
      }
    });

    return giveaways;
  }

  /**
   * Parse single giveaway element
   * @param {HTMLElement} giveawayDOM - Giveaway DOM element
   * @returns {Object} Giveaway data object
   */
  static parseGiveawayElement(giveawayDOM) {
    const giveawayHeadingName = giveawayDOM.querySelector(
      '.giveaway__heading__name',
    );
    if (!giveawayHeadingName) return null;

    const code = giveawayHeadingName.href.match(/giveaway\/(.+)\//)?.[1];
    if (!code) return null;

    const name = giveawayHeadingName.textContent.trim();

    // Get Steam app ID
    const steamLink =
      giveawayDOM.querySelector('.fa.fa-steam')?.parentNode?.href;
    const appid = steamLink ? steamLink.match(/\/(\d+)\//)?.[1] : null;

    // Get cost and copies
    const copiesAndCostElements = giveawayDOM.querySelectorAll(
      '.giveaway__heading__thin',
    );
    let cost, numberOfCopies;

    if (copiesAndCostElements.length > 1) {
      numberOfCopies =
        parseInt(
          copiesAndCostElements[0].textContent
            .replace(',', '')
            .match(/\d+/)?.[0],
          10,
        ) || 1;
      cost =
        parseInt(copiesAndCostElements[1].textContent.match(/\d+/)?.[0], 10) ||
        0;
    } else {
      numberOfCopies = 1;
      cost =
        parseInt(copiesAndCostElements[0]?.textContent.match(/\d+/)?.[0], 10) ||
        0;
    }

    // Get level requirement
    const levelMatch = giveawayDOM.querySelector(
      '.giveaway__column--contributor-level',
    );
    const level = levelMatch
      ? parseInt(levelMatch.textContent.match(/Level (\d)/)?.[1], 10)
      : 0;

    // Get number of entries
    const numberOfEntries =
      parseInt(
        giveawayDOM
          .querySelector('.giveaway__links a[href$="/entries"]')
          ?.textContent.replace(',', ''),
        10,
      ) || 0;

    // Get time information
    const timeElement = giveawayDOM.querySelector('.fa-clock-o + span');
    const timeEnd = timeElement
      ? parseInt(timeElement.dataset.timestamp, 10)
      : 0;
    const timeleft = timeEnd * 1000 - Date.now();

    // Get start time
    const timeStartElement = giveawayDOM
      .querySelector('.giveaway__username')
      ?.parentElement?.querySelector('span');
    const timeStart = timeStartElement
      ? parseInt(timeStartElement.dataset.timestamp, 10)
      : 0;

    // Check status
    const status = { NoPoints: false, NoLevel: false, Entered: false };
    const giveawayInnerWrap = giveawayDOM.querySelector(
      '.giveaway__row-inner-wrap',
    );

    if (giveawayInnerWrap?.classList.contains('is-faded')) {
      status.Entered = true;
    }

    if (
      levelMatch?.classList.contains(
        'giveaway__column--contributor-level--negative',
      )
    ) {
      status.NoLevel = true;
    }

    // Check for special giveaway types
    const isGroupGA = Boolean(
      giveawayDOM.querySelector('.giveaway__column--group'),
    );
    const isWhitelistGA = Boolean(
      giveawayDOM.querySelector('.giveaway__column--whitelist'),
    );
    const isRegionLocked = Boolean(
      giveawayDOM.querySelector('.giveaway__column--region-restricted'),
    );

    return {
      code,
      appid,
      name,
      cost,
      timeleft,
      level,
      numberOfCopies,
      numberOfEntries,
      status,
      timeStart,
      timeEnd,
      isGroupGA,
      isWhitelistGA,
      isRegionLocked,
      isDLC: false, // Will be determined by Steam API
      hasTradingCards: false, // Will be determined by Steam API
    };
  }

  /**
   * Parse giveaways without pinned ones
   * @param {string} pageHTML - HTML content
   * @returns {Array<Giveaway>} Array of non-pinned giveaways
   */
  static parsePageWithoutPinned(pageHTML) {
    const parser = new DOMParser();
    const pageDOM = parser.parseFromString(pageHTML, 'text/html');
    const nonPinnedContainer = pageDOM.querySelector(
      ':not(.pinned-giveaways__inner-wrap) > .giveaway__row-outer-wrap',
    )?.parentElement;

    if (!nonPinnedContainer) {
      return [];
    }

    const giveawaysDOM = nonPinnedContainer.querySelectorAll(
      '.giveaway__row-outer-wrap',
    );
    const giveaways = [];

    giveawaysDOM.forEach((giveawayDOM) => {
      try {
        const giveawayData = this.parseGiveawayElement(giveawayDOM);
        if (giveawayData) {
          giveaways.push(new Giveaway(giveawayData));
        }
      } catch (error) {
        console.warn('Error parsing giveaway:', error);
      }
    });

    return giveaways;
  }

  /**
   * Extract user information from page
   * @param {string} pageHTML - HTML content
   * @returns {Object} User information
   */
  static parseUserInfo(pageHTML) {
    const parser = new DOMParser();
    const pageDOM = parser.parseFromString(pageHTML, 'text/html');

    const pointsElement = pageDOM.querySelector('.nav__points');
    const points = pointsElement
      ? parseInt(pointsElement.textContent.replace(',', ''), 10)
      : 0;

    const levelElement = pageDOM.querySelector(
      'a[href="/account"] span:last-child',
    );
    const level = levelElement ? parseInt(levelElement.title, 10) : 0;

    const tokenElement = pageDOM.querySelector('input[name="xsrf_token"]');
    const token = tokenElement ? tokenElement.value : '';

    const wonElement = pageDOM.querySelector('.popup--gift-received');
    const won = Boolean(wonElement);

    return { points, level, token, won };
  }
}

/**
 * Giveaway Manager - Handles collections and operations on giveaways
 */
class GiveawayManager {
  constructor() {
    this.giveaways = [];
    this.userPoints = 0;
    this.userLevel = 0;
    this.token = '';
  }

  /**
   * Add giveaways to the collection
   * @param {Array<Giveaway>} giveaways - Giveaways to add
   */
  addGiveaways(giveaways) {
    this.giveaways.push(...giveaways);
  }

  /**
   * Clear all giveaways
   */
  clear() {
    this.giveaways = [];
  }

  /**
   * Filter giveaways based on settings
   * @param {Object} settings - User settings
   * @param {Array} ownedGames - User's owned games
   * @param {Array} wishlist - User's wishlist
   * @returns {Array<Giveaway>} Filtered giveaways
   */
  filterGiveaways(settings, ownedGames = [], wishlist = []) {
    return this.giveaways.filter(
      (giveaway) => !giveaway.shouldFilter(settings, ownedGames, wishlist),
    );
  }

  /**
   * Sort giveaways by priority
   * @param {Object} settings - User settings
   * @param {Array} wishlist - User's wishlist
   * @returns {Array<Giveaway>} Sorted giveaways
   */
  sortByPriority(settings, wishlist = []) {
    return [...this.giveaways].sort((a, b) => {
      const scoreA = a.getPriorityScore(settings, wishlist);
      const scoreB = b.getPriorityScore(settings, wishlist);
      return scoreB - scoreA; // Higher score first
    });
  }

  /**
   * Get giveaways that can be joined
   * @param {number} userPoints - User's current points
   * @param {number} userLevel - User's current level
   * @returns {Array<Giveaway>} Joinable giveaways
   */
  getJoinableGiveaways(userPoints, userLevel) {
    return this.giveaways.filter(
      (giveaway) => giveaway.canJoin(userPoints, userLevel).canJoin,
    );
  }

  /**
   * Update user points
   * @param {number} points - New points value
   */
  updatePoints(points) {
    this.userPoints = parseInt(points, 10);

    // Update UI
    document.querySelectorAll('.nav__points').forEach((el) => {
      el.textContent = this.userPoints.toLocaleString();
    });
  }

  /**
   * Update user level
   * @param {number} level - New level value
   */
  updateLevel(level) {
    this.userLevel = parseInt(level, 10);
  }

  /**
   * Set CSRF token
   * @param {string} token - CSRF token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Get statistics about current giveaways
   * @returns {Object} Statistics object
   */
  getStats() {
    const total = this.giveaways.length;
    const entered = this.giveaways.filter((g) => g.status.Entered).length;
    const joinable = this.giveaways.filter(
      (g) => g.canJoin(this.userPoints, this.userLevel).canJoin,
    ).length;
    const totalCost = this.giveaways.reduce((sum, g) => sum + g.cost, 0);
    const averageCost = total > 0 ? Math.round(totalCost / total) : 0;

    return {
      total,
      entered,
      joinable,
      totalCost,
      averageCost,
      pointsNeeded: this.giveaways
        .filter((g) => g.canJoin(this.userPoints, this.userLevel).canJoin)
        .reduce((sum, g) => sum + g.cost, 0),
    };
  }
}

function shouldFilterGiveaway(
  giveaway,
  settings,
  ownedGames = [],
  wishlist = [],
) {
  if (
    giveaway.level < settings.HideLevelsBelow ||
    giveaway.level > settings.HideLevelsAbove
  ) {
    return true;
  }

  if (
    giveaway.cost < settings.HideCostsBelow ||
    giveaway.cost > settings.HideCostsAbove
  ) {
    return true;
  }

  if (settings.HideEntered && giveaway.status.Entered) {
    return true;
  }

  if (settings.HideDlc && giveaway.isDLC) {
    return true;
  }

  if (settings.HideNonTradingCards && !giveaway.hasTradingCards) {
    return true;
  }

  if (settings.HideGroups && giveaway.isGroupGA) {
    return true;
  }

  if (settings.HideWhitelist && giveaway.isWhitelistGA) {
    return true;
  }

  if (ownedGames.includes(giveaway.appid)) {
    return true;
  }

  if (wishlist.includes(giveaway.appid)) {
    return false;
  }

  return false;
}

function getPriorityScore(giveaway, settings, wishlist = [], odds = 0) {
  let score = 0;

  if (settings.PriorityWishlist && wishlist.includes(giveaway.appid)) {
    score += 1000;
  }

  if (settings.PriorityGroup && giveaway.isGroupGA) {
    score += 100;
  }

  if (settings.PriorityRegion && giveaway.isRegionLocked) {
    score += 50;
  }

  if (settings.PriorityWhitelist && giveaway.isWhitelistGA) {
    score += 25;
  }

  if (settings.LevelPriority) {
    score += giveaway.level * 10;
  }

  if (settings.OddsPriority) {
    score += odds;
  }

  return score;
}

// Export classes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Giveaway,
    GiveawayParser,
    GiveawayManager,
    shouldFilterGiveaway,
    getPriorityScore,
  };
} else {
  window.Giveaway = Giveaway;
  window.GiveawayParser = GiveawayParser;
  window.GiveawayManager = GiveawayManager;
}
