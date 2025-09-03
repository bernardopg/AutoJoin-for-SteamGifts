// Initialize tabs functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach((button, index) => {
    // Add ARIA attributes for accessibility
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    button.setAttribute('tabindex', index === 0 ? '0' : '-1');

    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      activateTab(targetTab, button, tabButtons, tabContents);
    });

    // Add keyboard navigation
    button.addEventListener('keydown', (e) => {
      let targetButton = null;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          targetButton = button.nextElementSibling || tabButtons[0];
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          targetButton =
            button.previousElementSibling || tabButtons[tabButtons.length - 1];
          break;
        case 'Home':
          e.preventDefault();
          targetButton = tabButtons[0];
          break;
        case 'End':
          e.preventDefault();
          targetButton = tabButtons[tabButtons.length - 1];
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          button.click();
          break;
      }

      if (targetButton) {
        targetButton.focus();
        targetButton.click();
      }
    });
  });

  // Set initial tab content visibility
  tabContents.forEach((content, index) => {
    content.setAttribute('role', 'tabpanel');
    content.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
  });
}

function activateTab(targetTab, activeButton, tabButtons, tabContents) {
  // Remove active class from all buttons and contents
  tabButtons.forEach((btn) => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
    btn.setAttribute('tabindex', '-1');
  });

  tabContents.forEach((content) => {
    content.classList.remove('active');
    content.setAttribute('aria-hidden', 'true');
  });

  // Add active class to clicked button and corresponding content
  activeButton.classList.add('active');
  activeButton.setAttribute('aria-selected', 'true');
  activeButton.setAttribute('tabindex', '0');

  const targetContent = document.getElementById(targetTab);
  if (targetContent) {
    targetContent.classList.add('active');
    targetContent.setAttribute('aria-hidden', 'false');
  }
}

// Call this function when #settingsDiv is present on the page.
function loadSettings() {
  // Initialize tabs first
  initializeTabs();

  chrome.storage.sync.get(
    {
      AutoJoinButton: false,
      AutoDescription: true,
      AutoComment: false,
      Comment: '',
      IgnoreGroups: false,
      IgnorePinned: true,
      IgnoreWhitelist: false,
      IgnoreGroupsBG: false,
      IgnorePinnedBG: true,
      PageForBG: 'wishlist',
      RepeatHoursBG: 5,
      PagesToLoad: 3,
      PagesToLoadBG: 2,
      BackgroundAJ: false,
      LevelPriorityBG: true,
      OddsPriorityBG: false,
      InfiniteScrolling: true,
      ShowPoints: true,
      ShowButtons: true,
      LoadFive: false,
      HideDlc: false,
      HideEntered: false,
      HideGroups: false,
      HideNonTradingCards: false,
      HideWhitelist: false,
      HideLevelsBelow: 0,
      HideCostsBelow: 0,
      HideLevelsAbove: 10,
      HideCostsAbove: 50,
      PriorityGroup: false,
      PriorityRegion: false,
      PriorityWhitelist: false,
      PriorityWishlist: true,
      RepeatIfOnPage: false,
      RepeatHours: 5,
      NightTheme: false,
      LevelPriority: false,
      PlayAudio: true,
      AudioVolume: 1,
      Delay: 10,
      DelayBG: 10,
      MinLevelBG: 0,
      MinCost: 0,
      MinCostBG: 0,
      MaxCost: -1,
      MaxCostBG: -1,
      PointsToPreserve: 0,
      WishlistPriorityForMainBG: false,
      IgnorePreserveWishlistOnMainBG: false,
      ShowChance: true,
      NotifyLimit: false,
      NotifyLimitAmount: 300,
      PreciseTime: false,
      AutoRedeemKey: false,
    },
    (settings) => {
      // Apply theme within options page
      applyOptionsTheme(!!settings.NightTheme);
      fillSettingsDiv(settings);
    }
  );
}

function fillSettingsDiv(settings) {
  document.getElementById('chkAutoJoinButton').checked =
    settings.AutoJoinButton;
  document.getElementById('chkAutoDescription').checked =
    settings.AutoDescription;
  document.getElementById('chkAutoComment').checked = settings.AutoComment;
  document.getElementById('txtAutoComment').value = settings.Comment;
  document.getElementById('chkInfiniteScroll').checked =
    settings.InfiniteScrolling;
  document.getElementById('chkShowPoints').checked = settings.ShowPoints;
  document.getElementById('chkShowButtons').checked = settings.ShowButtons;
  document.getElementById('chkLoadFive').checked = settings.LoadFive;
  document.getElementById('chkHideDlc').checked = settings.HideDlc;
  document.getElementById('chkHideEntered').checked = settings.HideEntered;
  document.getElementById('chkHideGroups').checked = settings.HideGroups;
  document.getElementById('chkHideNonTradingCards').checked =
    settings.HideNonTradingCards;
  document.getElementById('chkHideWhitelist').checked = settings.HideWhitelist;
  document.getElementById('hideLevelsBelow').value = settings.HideLevelsBelow;
  document.getElementById('hideCostsBelow').value = settings.HideCostsBelow;
  document.getElementById('hideLevelsAbove').value = settings.HideLevelsAbove;
  document.getElementById('hideCostsAbove').value = settings.HideCostsAbove;
  document.getElementById('chkNightTheme').checked = settings.NightTheme;
  document.getElementById('chkRepeatIfOnPage').checked =
    settings.RepeatIfOnPage;
  document.getElementById('chkIgnoreGroups').checked = settings.IgnoreGroups;
  document.getElementById('chkIgnorePinned').checked = settings.IgnorePinned;
  document.getElementById('chkIgnoreWhitelist').checked =
    settings.IgnoreWhitelist;
  document.getElementById('chkIgnoreGroupsBG').checked =
    settings.IgnoreGroupsBG;
  document.getElementById('chkIgnorePinnedBG').checked =
    settings.IgnorePinnedBG;
  document.getElementById('chkEnableBG').checked = settings.BackgroundAJ;
  document.getElementById('chkGroupPriority').checked = settings.PriorityGroup;
  document.getElementById('chkRegionPriority').checked =
    settings.PriorityRegion;
  document.getElementById('chkWhitelistPriority').checked =
    settings.PriorityWhitelist;
  document.getElementById('chkWishlistPriority').checked =
    settings.PriorityWishlist;
  document.getElementById('chkLevelPriorityBG').checked =
    settings.LevelPriorityBG;
  document.getElementById('chkOddsPriorityBG').checked =
    settings.OddsPriorityBG;
  document.getElementById('chkPlayAudio').checked = settings.PlayAudio;
  document.getElementById('audioVolume').value = settings.AudioVolume;
  document.getElementById('chkShowChance').checked = settings.ShowChance;
  document.getElementById('hoursField').value = settings.RepeatHours;
  document.getElementById('pagestoload').value = settings.PagesToLoad;
  document.getElementById('pagestoloadBG').value = settings.PagesToLoadBG;
  document.getElementById('pageforBG').value = settings.PageForBG;
  document.getElementById('delayBG').value = settings.DelayBG;
  document.getElementById('delay').value = settings.Delay;
  document.getElementById('minLevelBG').value = settings.MinLevelBG;
  document.getElementById('minCost').value = settings.MinCost;
  document.getElementById('minCostBG').value = settings.MinCostBG;
  document.getElementById('maxCost').value = settings.MaxCost;
  document.getElementById('maxCostBG').value = settings.MaxCostBG;
  document.getElementById('pointsToPreserve').value = settings.PointsToPreserve;
  document.getElementById('chkWishlistPriorityForMainBG').checked =
    settings.WishlistPriorityForMainBG;
  document.getElementById('chkIgnorePreserveWishlistOnMainBG').checked =
    settings.IgnorePreserveWishlistOnMainBG;
  document.getElementById('chkNotifyLimit').checked = settings.NotifyLimit;
  document.getElementById('notifyLimitAmount').value =
    settings.NotifyLimitAmount;
  document.getElementById('chkPreciseTime').checked = settings.PreciseTime;
  if (settings.RepeatHoursBG === 0) {
    document.getElementById('hoursFieldBG').value = '0.5';
  } else {
    document.getElementById('hoursFieldBG').value = settings.RepeatHoursBG;
  }
  document.getElementById('chkAutoRedeemKey').checked = settings.AutoRedeemKey;

  settingsAttachEventListeners();
}

function applyOptionsTheme(night) {
  document.body.classList.toggle('night-theme', !!night);
}

function settingsAttachEventListeners() {
  const saveButtonEl = document.getElementById('btnSetSave');
  saveButtonEl.addEventListener('click', async () => {
    // Validate inputs before saving
    if (!validateSettings()) {
      return;
    }

    // Show loading state
    saveButtonEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveButtonEl.disabled = true;

    try {
      // Collect form data
      const settings = {};
      const formElements = document.querySelectorAll(
        '#settingsDiv input, #settingsDiv select, #settingsDiv textarea'
      );

      formElements.forEach((element) => {
        if (element.type === 'checkbox') {
          settings[element.id] = element.checked;
        } else if (element.type === 'radio') {
          if (element.checked) {
            settings[element.name] = element.value;
          }
        } else {
          settings[element.id] = element.value;
        }
      });

      // Handle special cases
      if (settings.hoursFieldBG === '0.5') {
        settings.hoursFieldBG = 0;
      }

      // Use SettingsManager to save
      let success = false;
      if (window.settingsManager) {
        success = await window.settingsManager.saveSettings(settings);
      } else {
        // Fallback to old method
        success = await saveSettingsOld(settings);
      }

      if (success) {
        // Show success state
        saveButtonEl.innerHTML = '<i class="fas fa-check"></i> Settings Saved!';
        setTimeout(() => {
          saveButtonEl.innerHTML = '<i class="fas fa-save"></i> Save Settings';
          saveButtonEl.disabled = false;
        }, 2000);

        if (!document.location.protocol.includes('http')) {
          window.location.reload();
        }
      } else {
        saveButtonEl.innerHTML = '<i class="fas fa-save"></i> Save Settings';
        saveButtonEl.disabled = false;
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      saveButtonEl.innerHTML = '<i class="fas fa-save"></i> Save Settings';
      saveButtonEl.disabled = false;

      if (window.AutoJoinUtils) {
        window.AutoJoinUtils.showNotification(
          'Failed to save settings',
          'error'
        );
      }
    }
  });

  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Save shortcut
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        saveButtonEl.click();
        return;
      }
    }

    // Close on Escape even without modifiers when modal is open
    if (
      e.key === 'Escape' &&
      document.body.classList.contains('aj-modal-open')
    ) {
      e.preventDefault();
      document.querySelector('.settingsCancel')?.click();
      return;
    }

    // Trap focus within modal while open
    if (e.key === 'Tab' && document.body.classList.contains('aj-modal-open')) {
      const modal = document.getElementById('settingsDiv');
      if (!modal) return;
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !modal.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !modal.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // grant "*://steamcommunity.com/profiles/*" permission
  document
    .getElementById('chkWishlistPriority')
    .addEventListener('change', requirePermissions);
  document
    .getElementById('chkHideNonTradingCards')
    .addEventListener('change', requirePermissions);
  document
    .getElementById('chkHideDlc')
    .addEventListener('change', requirePermissions);
  function requirePermissions(e) {
    if (e.target.checked) {
      // chrome.permissions.* API is not available in content script
      // we'll have to message background script to check if we have it

      // set new event listener for anticipated response
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.granted === 'true') {
          // we have permission, do nothing
        } else {
          // we don't have permission, uncheck this option
          e.target.checked = false;
        }
      });
      chrome.runtime.sendMessage({ task: 'checkPermission', ask: 'true' });
    }
  }

  // to show 0.5 when value goes below 1 in hoursFieldBG field
  document
    .getElementById('hoursFieldBG')
    .addEventListener('input', function () {
      if (this.value === 0) {
        this.value = 0.5;
      } else if (this.value % 1 !== 0 && this.value > 1) {
        this.value = parseInt(this.value, 10);
      }
    });

  const settingsCancelElements =
    document.getElementsByClassName('settingsCancel');
  Array.from(settingsCancelElements).forEach((element) => {
    element.addEventListener('click', () => {
      // If we are inside the extension options page, close the tab/window
      if (!document.location.protocol.includes('http')) {
        window.close();
        return;
      }
      const settingsShadeEl = document.getElementById('settingsShade');
      const settingsDivEl = document.getElementById('settingsDiv');
      settingsShadeEl.classList.remove('fadeIn');
      settingsShadeEl.classList.add('fadeOut');
      settingsDivEl.classList.remove('fadeIn');
      settingsDivEl.classList.add('fadeOut');
      // Re-enable page scrolling when modal closes
      document.body.classList.remove('aj-modal-open');
    });
  });

  const volumeSlider = document.getElementById('audioVolume');
  volumeSlider.addEventListener('click', setAudioVolume);

  processDependentSettings();
}

function setAudioVolume() {
  // play audio when changing volume
  const audio = new Audio(chrome.runtime.getURL('/media/audio.mp3'));
  audio.volume = document.getElementById('audioVolume').value;
  audio.play();
}

// Auto-initialize when used as options page
function initOptionsPageIfPresent() {
  if (document.getElementById('settingsDiv')) {
    const settingsDivEl = document.getElementById('settingsDiv');
    // Ensure the options UI is visible in standalone options page
    settingsDivEl.style.visibility = 'visible';
    settingsDivEl.classList.add('fadeIn');
    loadSettings();
    fitSettings();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOptionsPageIfPresent);
} else {
  initOptionsPageIfPresent();
}

/* This is for case when window.innerHeight is less than settings div height. */
function fitSettings() {
  if (
    window.innerHeight < document.getElementById('settingsDiv').clientHeight
  ) {
    document.getElementById('settingsDiv').className += ' fit';
  }
}

// Validate settings before saving
function validateSettings() {
  const errors = [];

  // Clear previous error states
  document.querySelectorAll('input, textarea, select').forEach((el) => {
    el.style.borderColor = '';
    el.classList.remove('setting-input-error');
  });

  // Validate and sanitize comment input
  const commentField = document.getElementById('txtAutoComment');
  if (commentField?.value?.trim()) {
    const comment = commentField.value.trim();
    if (comment.length > 1000) {
      errors.push('Comment text cannot exceed 1000 characters');
      commentField.style.borderColor = '#dc3545';
      commentField.classList.add('setting-input-error');
    }
    // Sanitize comment (remove script tags, etc.)
    commentField.value = comment.replace(/<script[^>]*>.*?<\/script>/gi, '');
  }

  // Validate number inputs
  const numberInputs = [
    { id: 'hoursField', min: 1, max: 24, name: 'Repeat hours' },
    { id: 'hoursFieldBG', min: 0.5, max: 24, name: 'Background repeat hours' },
    { id: 'pagestoload', min: 1, max: 5, name: 'Pages to load' },
    { id: 'pagestoloadBG', min: 1, max: 3, name: 'Background pages to load' },
    { id: 'delay', min: 5, max: 60, name: 'Delay' },
    { id: 'delayBG', min: 5, max: 60, name: 'Background delay' },
    { id: 'minCost', min: 0, max: 200, name: 'Minimum cost' },
    { id: 'minCostBG', min: 0, max: 200, name: 'Background minimum cost' },
    { id: 'maxCost', min: -1, max: 200, name: 'Maximum cost' },
    { id: 'maxCostBG', min: -1, max: 200, name: 'Background maximum cost' },
    { id: 'pointsToPreserve', min: 0, max: 300, name: 'Points to preserve' },
    { id: 'notifyLimitAmount', min: 0, max: 400, name: 'Notification limit' },
    { id: 'hideLevelsBelow', min: 0, max: 10, name: 'Hide levels below' },
    { id: 'hideLevelsAbove', min: 0, max: 10, name: 'Hide levels above' },
    { id: 'hideCostsBelow', min: 0, max: 50, name: 'Hide costs below' },
    { id: 'hideCostsAbove', min: 0, max: 50, name: 'Hide costs above' },
    { id: 'minLevelBG', min: 0, max: 10, name: 'Background minimum level' },
  ];

  numberInputs.forEach((input) => {
    const element = document.getElementById(input.id);
    if (element) {
      const value = parseFloat(element.value);

      if (isNaN(value) || value < input.min || value > input.max) {
        errors.push(
          `${input.name} must be between ${input.min} and ${input.max}`
        );
        element.style.borderColor = '#dc3545';
      } else {
        element.style.borderColor = '';
      }
    }
  });

  // Validate level ranges
  const hideLevelsBelow = parseInt(
    document.getElementById('hideLevelsBelow')?.value || 0
  );
  const hideLevelsAbove = parseInt(
    document.getElementById('hideLevelsAbove')?.value || 10
  );
  if (hideLevelsBelow > hideLevelsAbove) {
    errors.push('Hide levels below cannot be greater than hide levels above');
    document.getElementById('hideLevelsBelow').style.borderColor = '#dc3545';
    document.getElementById('hideLevelsAbove').style.borderColor = '#dc3545';
  }

  // Validate cost ranges
  const hideCostsBelow = parseInt(
    document.getElementById('hideCostsBelow')?.value || 0
  );
  const hideCostsAbove = parseInt(
    document.getElementById('hideCostsAbove')?.value || 50
  );
  if (hideCostsBelow > hideCostsAbove) {
    errors.push('Hide costs below cannot be greater than hide costs above');
    document.getElementById('hideCostsBelow').style.borderColor = '#dc3545';
    document.getElementById('hideCostsAbove').style.borderColor = '#dc3545';
  }

  // Validate min/max cost ranges
  const minCost = parseInt(document.getElementById('minCost')?.value || 0);
  const maxCost = parseInt(document.getElementById('maxCost')?.value || -1);
  if (maxCost !== -1 && minCost > maxCost) {
    errors.push('Minimum cost cannot be greater than maximum cost');
    document.getElementById('minCost').style.borderColor = '#dc3545';
    document.getElementById('maxCost').style.borderColor = '#dc3545';
  }

  const minCostBG = parseInt(document.getElementById('minCostBG')?.value || 0);
  const maxCostBG = parseInt(document.getElementById('maxCostBG')?.value || -1);
  if (maxCostBG !== -1 && minCostBG > maxCostBG) {
    errors.push(
      'Background minimum cost cannot be greater than background maximum cost'
    );
    document.getElementById('minCostBG').style.borderColor = '#dc3545';
    document.getElementById('maxCostBG').style.borderColor = '#dc3545';
  }

  // Show errors if any
  if (errors.length > 0) {
    if (window.AutoJoinUtils) {
      window.AutoJoinUtils.showNotification(
        'Please fix the following errors:\n• ' + errors.join('\n• '),
        'error'
      );
    } else {
      alert('Please fix the following errors:\n• ' + errors.join('\n• '));
    }
    return false;
  }

  return true;
}

// Fallback save function for old method
async function saveSettingsOld(settings) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, () => {
      resolve(true);
    });
  });
}

// Show notification to user
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.settings-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `settings-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${
        type === 'error' ? 'exclamation-circle' : 'info-circle'
      }"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Add notification styles if not already added
  if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
      .settings-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
      }
      .notification-content {
        background: ${type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'error' ? '#f5c6cb' : '#bee5eb'};
        border-radius: 8px;
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .notification-content i {
        font-size: 1.2rem;
        flex-shrink: 0;
      }
      .notification-content span {
        flex: 1;
        white-space: pre-line;
      }
      .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: ${type === 'error' ? '#721c24' : '#0c5460'};
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
      }
      .notification-close:hover {
        background: ${
          type === 'error' ? 'rgba(114, 28, 36, 0.1)' : 'rgba(12, 84, 96, 0.1)'
        };
      }
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styles);
  }

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  const timeout = setTimeout(() => {
    notification.remove();
  }, 5000);

  // Close button functionality
  notification
    .querySelector('.notification-close')
    .addEventListener('click', () => {
      clearTimeout(timeout);
      notification.remove();
    });
}

/* Show/Hide some settings that don't make sense on their own. */
function processDependentSettings() {
  const AutoJoinButton = document.getElementById('chkAutoJoinButton');
  const EnableBG = document.getElementById('chkEnableBG');
  evalDependent();

  function evalDependent() {
    const DependOnAutoJoinButton = document.querySelectorAll(
      '.dependsOnAutoJoinButton'
    );
    const DependOnBackgroundAutoJoin = document.querySelectorAll(
      '.dependsOnBackgroundAutoJoin'
    );

    DependOnAutoJoinButton.forEach((li) => {
      li.style.display = AutoJoinButton.checked ? 'block' : 'none';
    });

    DependOnBackgroundAutoJoin.forEach((li) => {
      li.style.display = EnableBG.checked ? 'block' : 'none';
    });

    fitSettings();
  }
  AutoJoinButton.addEventListener('change', evalDependent);
  EnableBG.addEventListener('change', evalDependent);

  // Add input validation listeners
  const numberInputs = document.querySelectorAll('input[type="number"]');
  numberInputs.forEach((input) => {
    input.addEventListener('input', function () {
      this.style.borderColor = '';
    });
  });
}
