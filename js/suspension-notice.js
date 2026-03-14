/**
 * Suspension Notice Dismissal System
 * Professional implementation for handling the annoying suspension warning
 */

(function () {
  const i18n = globalThis.AutoJoinI18n;
  const t = (key, params = {}) => (i18n ? i18n.t(key, params) : key);

  // Configuration
  const STORAGE_KEY = 'aj_suspension_notice_dismissed';
  const MINIMIZED_KEY = 'aj_suspension_notice_minimized';

  // State management
  let noticeElement = null;
  let isInitialized = false;

  /**
   * Initialize the suspension notice dismissal system
   */
  function init() {
    if (isInitialized) return;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    noticeElement = document.getElementById('suspensionNotice');
    if (!noticeElement) return;

    isInitialized = true;
    setupDismissalSystem();
    restoreUserPreferences();
  }

  /**
   * Set up the dismissal system
   */
  function setupDismissalSystem() {
    // Create virtual dismiss button (CSS ::after element)
    noticeElement.addEventListener('click', handleNoticeClick);

    // Add keyboard support
    noticeElement.addEventListener('keydown', handleKeydown);
    noticeElement.setAttribute('tabindex', '0');
    noticeElement.setAttribute('aria-label', t('suspensionNotice.ariaLabel'));
  }

  /**
   * Handle clicks on the notice
   */
  function handleNoticeClick(event) {
    const rect = noticeElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Check if click is in the dismiss button area (top-right corner)
    const isCloseButtonArea =
      clickX >= rect.width - 32 &&
      clickX <= rect.width - 8 &&
      clickY >= 8 &&
      clickY <= 32;

    if (isCloseButtonArea) {
      event.preventDefault();
      event.stopPropagation();
      showDismissOptions();
    } else if (noticeElement.classList.contains('aj-minimized')) {
      // Expand if minimized
      expandNotice();
    }
  }

  /**
   * Handle keyboard interactions
   */
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      showDismissOptions();
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (noticeElement.classList.contains('aj-minimized')) {
        event.preventDefault();
        expandNotice();
      }
    }
  }

  /**
   * Show dismiss options to the user
   */
  function showDismissOptions() {
    const options = [
      { text: t('suspensionNotice.option.permanent'), action: 'permanent' },
      { text: t('suspensionNotice.option.minimize'), action: 'minimize' },
      { text: t('suspensionNotice.option.session'), action: 'session' },
      { text: t('suspensionNotice.option.cancel'), action: 'cancel' },
    ];

    // Create simple modal with options
    const modal = createDismissModal(options);
    document.body.appendChild(modal);

    // Focus management
    const firstButton = modal.querySelector('button');
    if (firstButton) firstButton.focus();
  }

  /**
   * Create dismiss options modal
   */
  function createDismissModal(options) {
    const modal = document.createElement('div');
    modal.className = 'aj-dismiss-modal';
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;

    const content = document.createElement('div');
    content.style.cssText = `
            background: ${document.body.classList.contains('night-theme') ? '#161d2b' : '#ffffff'};
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            margin: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border: 1px solid ${document.body.classList.contains('night-theme') ? 'rgba(98, 116, 164, 0.45)' : '#e5e7eb'};
        `;

    const title = document.createElement('h3');
    title.textContent = t('suspensionNotice.title');
    title.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
            color: ${document.body.classList.contains('night-theme') ? '#f4f6ff' : '#1f2937'};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

    const description = document.createElement('p');
    description.textContent = t('suspensionNotice.description');
    description.style.cssText = `
            margin: 0 0 20px 0;
            font-size: 14px;
            color: ${document.body.classList.contains('night-theme') ? '#c0c9e6' : '#6b7280'};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

    options.forEach((option) => {
      const button = document.createElement('button');
      button.textContent = option.text;

      const isNightTheme = document.body.classList.contains('night-theme');
      const isCancel = option.action === 'cancel';

      let backgroundColor, textColor, borderStyle;

      if (isCancel) {
        backgroundColor = 'transparent';
        textColor = isNightTheme ? '#c0c9e6' : '#6b7280';
        borderStyle = isNightTheme
          ? '1px solid rgba(98, 116, 164, 0.3)'
          : '1px solid #d1d5db';
      } else {
        backgroundColor = isNightTheme ? '#059669' : '#3b82f6';
        textColor = '#ffffff';
        borderStyle = 'none';
      }

      button.style.cssText = `
                padding: 12px 16px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transition: all 0.2s ease;
                background: ${backgroundColor};
                color: ${textColor};
                border: ${borderStyle};
            `;

      button.addEventListener('click', () => {
        handleDismissAction(option.action);
        document.body.removeChild(modal);
      });

      button.addEventListener('mouseenter', () => {
        if (option.action !== 'cancel') {
          button.style.transform = 'translateY(-1px)';
          button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
          button.style.background = document.body.classList.contains(
            'night-theme',
          )
            ? 'rgba(124, 203, 255, 0.1)'
            : '#f9fafb';
        }
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'none';
        button.style.boxShadow = 'none';
        if (option.action === 'cancel') {
          button.style.background = 'transparent';
        }
      });

      buttonContainer.appendChild(button);
    });

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(buttonContainer);
    modal.appendChild(content);

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    // Close on Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    return modal;
  }

  /**
   * Handle dismiss actions
   */
  function handleDismissAction(action) {
    switch (action) {
      case 'permanent':
        noticeElement.classList.add('aj-permanently-hidden');
        localStorage.setItem(STORAGE_KEY, 'true');
        localStorage.removeItem(MINIMIZED_KEY);
        break;

      case 'minimize':
        noticeElement.classList.add('aj-minimized');
        noticeElement.classList.remove('aj-hidden');
        localStorage.setItem(MINIMIZED_KEY, 'true');
        localStorage.removeItem(STORAGE_KEY);
        break;

      case 'session':
        noticeElement.classList.add('aj-hidden');
        noticeElement.classList.remove('aj-minimized');
        // Don't save to localStorage - only for this session
        break;

      case 'cancel':
        // Do nothing
        break;
    }
  }

  /**
   * Expand minimized notice
   */
  function expandNotice() {
    noticeElement.classList.remove('aj-minimized');
    localStorage.removeItem(MINIMIZED_KEY);
  }

  /**
   * Restore user preferences
   */
  function restoreUserPreferences() {
    const isPermanentlyHidden = localStorage.getItem(STORAGE_KEY) === 'true';
    const isMinimized = localStorage.getItem(MINIMIZED_KEY) === 'true';

    if (isPermanentlyHidden) {
      noticeElement.classList.add('aj-permanently-hidden');
    } else if (isMinimized) {
      noticeElement.classList.add('aj-minimized');
    }
  }

  /**
   * Public API for manual control
   */
  window.ajSuspensionNotice = {
    hide: () => handleDismissAction('session'),
    minimize: () => handleDismissAction('minimize'),
    hidePermanently: () => handleDismissAction('permanent'),
    show: () => {
      noticeElement.classList.remove(
        'aj-hidden',
        'aj-minimized',
        'aj-permanently-hidden',
      );
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(MINIMIZED_KEY);
    },
    toggle: () => {
      if (noticeElement.classList.contains('aj-minimized')) {
        expandNotice();
      } else {
        handleDismissAction('minimize');
      }
    },
  };

  // Initialize when DOM is ready
  init();
})();
