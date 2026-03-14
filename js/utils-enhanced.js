/**
 * AutoJoin for SteamGifts - Enhanced Utilities
 * Modern utility functions with improved error handling and performance
 */

class AutoJoinUtils {
  static t(key, params = {}) {
    return globalThis.AutoJoinI18n
      ? globalThis.AutoJoinI18n.t(key, params)
      : key;
  }

  /**
   * Safely parse JSON with error handling
   * @param {string} jsonString - JSON string to parse
   * @param {*} defaultValue - Default value if parsing fails
   * @returns {*} Parsed object or default value
   */
  static safeJsonParse(jsonString, defaultValue = null) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Failed to parse JSON:', error);
      return defaultValue;
    }
  }

  /**
   * Safely stringify object to JSON
   * @param {*} obj - Object to stringify
   * @param {string} defaultValue - Default value if stringifying fails
   * @returns {string} JSON string or default value
   */
  static safeJsonStringify(obj, defaultValue = '{}') {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      console.warn('Failed to stringify object:', error);
      return defaultValue;
    }
  }

  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @param {boolean} immediate - Execute immediately on first call
   * @returns {Function} Debounced function
   */
  static debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Create a delay/sleep function
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Promise that resolves after delay
   */
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generate random number between min and max (inclusive)
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  static randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random delay for more human-like behavior
   * @param {number} baseDelay - Base delay in milliseconds
   * @param {number} variance - Variance percentage (0-1)
   * @returns {number} Random delay
   */
  static randomDelay(baseDelay, variance = 0.2) {
    const varianceAmount = baseDelay * variance;
    return baseDelay + this.randomBetween(-varianceAmount, varianceAmount);
  }

  /**
   * Format number with thousands separators
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  static formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  }

  /**
   * Format time duration in human readable format
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration
   */
  static formatDuration(seconds) {
    const units = [
      { baseKey: 'utils.time.day', seconds: 86400 },
      { baseKey: 'utils.time.hour', seconds: 3600 },
      { baseKey: 'utils.time.minute', seconds: 60 },
      { baseKey: 'utils.time.second', seconds: 1 },
    ];

    for (const unit of units) {
      const count = Math.floor(seconds / unit.seconds);
      if (count >= 1) {
        return `${count} ${this.t(
          `${unit.baseKey}.${count === 1 ? 'one' : 'other'}`,
        )}`;
      }
    }
    return this.t('utils.time.zeroSeconds');
  }

  /**
   * Format precise time remaining
   * @param {number} endTime - End timestamp
   * @returns {string} Formatted time remaining
   */
  static formatTimeRemaining(endTime) {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTime - now;

    if (remaining <= 0) {
      return this.t('utils.time.ended');
    }

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  /**
   * Sanitize HTML string to prevent XSS
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  static sanitizeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Show notification to user
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {number} duration - Auto-hide duration in milliseconds (0 = manual close)
   * @returns {HTMLElement} Notification element
   */
  static showNotification(message, type = 'info', duration = 5000) {
    // Ensure notification container exists
    let container = document.getElementById('notification-container');
    if (!container) {
      container = this.createElement('div', {
        id: 'notification-container',
        className: 'notification-container',
      });
      document.body.appendChild(container);
    }

    // Create notification element
    const notification = this.createElement('div', {
      className: `notification ${type}`,
    });

    const title = this.t(`utils.notification.${type}`);
    const iconMap = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle',
    };

    notification.innerHTML = `
      <div class="notification-title">
        <i class="${iconMap[type] || iconMap.info}"></i>
        ${title}
      </div>
      <div class="notification-message">${this.sanitizeHtml(message)}</div>
      <button class="notification-close" type="button" aria-label="${this.t(
        'utils.close',
      )}">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    const closeNotification = () => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    };

    closeBtn.addEventListener('click', closeNotification);

    // Add to container and show
    container.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(closeNotification, duration);
    }

    return notification;
  }

  /**
   * Create DOM element with attributes and content
   * @param {string} tag - HTML tag name
   * @param {Object} attributes - Element attributes
   * @param {string|Node} content - Element content
   * @returns {HTMLElement} Created element
   */
  static createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else {
        element.setAttribute(key, value);
      }
    });

    if (typeof content === 'string') {
      element.innerHTML = content;
    } else if (content instanceof Node) {
      element.appendChild(content);
    }

    return element;
  }

  /**
   * Create loading spinner element
   * @param {string} size - Spinner size (sm, md, lg)
   * @returns {HTMLElement} Spinner element
   */
  static createSpinner(size = 'md') {
    return this.createElement('div', {
      className: `spinner spinner-${size}`,
      'aria-label': this.t('utils.loading'),
      role: 'status',
    });
  }

  /**
   * Get element's position relative to viewport
   * @param {HTMLElement} element - Target element
   * @returns {Object} Position object with top, left, width, height
   */
  static getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height,
    };
  }

  /**
   * Check if element is in viewport
   * @param {HTMLElement} element - Target element
   * @param {number} threshold - Threshold percentage (0-1)
   * @returns {boolean} True if element is in viewport
   */
  static isInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const windowWidth =
      window.innerWidth || document.documentElement.clientWidth;

    const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
    const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;
    if (!vertInView || !horInView) {
      return false;
    }

    const visibleHeight =
      Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const thresholdPixels = Math.max(0, Math.min(1, threshold)) * rect.height;

    return visibleHeight >= thresholdPixels;
  }

  /**
   * Smooth scroll to element
   * @param {HTMLElement|string} target - Target element or selector
   * @param {Object} options - Scroll options
   */
  static scrollToElement(target, options = {}) {
    const element =
      typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const defaultOptions = {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    };

    element.scrollIntoView({ ...defaultOptions, ...options });
  }

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  static async copyToClipboard(text) {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      // Use the deprecated command as fallback only
      const success = document.execCommand('copy');
      textArea.remove();
      return success;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get URL parameters as object
   * @param {string} url - URL to parse (defaults to current URL)
   * @returns {Object} URL parameters
   */
  static getUrlParams(url = window.location.href) {
    const urlObj = new URL(url);
    const params = {};
    for (const [key, value] of urlObj.searchParams) {
      params[key] = value;
    }
    return params;
  }

  /**
   * Set URL parameter without page reload
   * @param {string} key - Parameter key
   * @param {string} value - Parameter value
   */
  static setUrlParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.replaceState({}, '', url);
  }

  /**
   * Remove URL parameter without page reload
   * @param {string} key - Parameter key to remove
   */
  static removeUrlParam(key) {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.replaceState({}, '', url);
  }

  /**
   * Local storage wrapper with error handling
   */
  static storage = {
    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Stored value or default
     */
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.warn('Failed to get from localStorage:', error);
        return defaultValue;
      }
    },

    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn('Failed to set in localStorage:', error);
        return false;
      }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn('Failed to remove from localStorage:', error);
        return false;
      }
    },

    /**
     * Clear all localStorage
     * @returns {boolean} Success status
     */
    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.warn('Failed to clear localStorage:', error);
        return false;
      }
    },
  };

  /**
   * Performance monitoring utilities
   */
  static performance = {
    /**
     * Start performance timer
     * @param {string} label - Timer label
     */
    start(label) {
      performance.mark(`${label}-start`);
    },

    /**
     * End performance timer and log result
     * @param {string} label - Timer label
     * @returns {number} Duration in milliseconds
     */
    end(label) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      const measure = performance.getEntriesByName(label)[0];
      console.debug(`${label}: ${measure.duration.toFixed(2)}ms`);
      return measure.duration;
    },
  };

  /**
   * Feature detection utilities
   */
  static features = {
    /**
     * Check if browser supports a feature
     * @param {string} feature - Feature to check
     * @returns {boolean} Support status
     */
    supports(feature) {
      const features = {
        localStorage: () => {
          try {
            const test = '__test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
          } catch {
            return false;
          }
        },
        clipboard: () => navigator.clipboard && window.isSecureContext,
        webp: () => {
          const canvas = document.createElement('canvas');
          return canvas.toDataURL('image/webp').startsWith('data:image/webp');
        },
        intersectionObserver: () => 'IntersectionObserver' in window,
        resizeObserver: () => 'ResizeObserver' in window,
        customElements: () => 'customElements' in window,
        shadowDOM: () => 'attachShadow' in Element.prototype,
      };

      return features[feature] ? features[feature]() : false;
    },
  };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AutoJoinUtils;
} else {
  window.AutoJoinUtils = AutoJoinUtils;
}
