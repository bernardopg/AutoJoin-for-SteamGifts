/**
 * AutoJoin for SteamGifts - Page Enhancements
 * Consolidated page modification and enhancement functionality
 */

class PageEnhancer {
  constructor() {
    this.settings = {};
    this.initialized = false;
  }

  /**
   * Initialize page enhancements
   */
  async initialize() {
    if (this.initialized) return;

    await this.loadSettings();
    this.applyTheme();
    this.setupSettingsButton();
    this.setupNavigationPin();
    this.setupFooterPin();
    this.setupInfiniteScroll();
    this.setupAccessibilityEnhancements();
    this.setupResponsiveEnhancements();
    this.setupPerformanceOptimizations();

    this.initialized = true;
    console.log('Page enhancements initialized');
  }

  /**
   * Load settings from storage
   */
  async loadSettings() {
    const defaultSettings = {
      NightTheme: false,
      InfiniteScrolling: true,
      ShowPoints: true,
      PreciseTime: false,
    };

    try {
      const data = await chrome.storage.sync.get(defaultSettings);
      this.settings = { ...defaultSettings, ...data };
    } catch (error) {
      console.error('Error loading page enhancement settings:', error);
      this.settings = defaultSettings;
    }
  }

  /**
   * Ensure a Settings button exists in the SteamGifts navbar and wire it up
   */
  setupSettingsButton() {
    const navbar = document.querySelector('.nav__left-container');
    if (!navbar) return;

    // If a button already exists, only (re)bind the handler
    let btn = document.getElementById('btnSettings');
    if (!btn) {
      const container = AutoJoinUtils.createElement('div', {
        className: 'nav__button-container',
      });
      btn = AutoJoinUtils.createElement(
        'a',
        {
          className: 'nav__button',
          id: 'btnSettings',
          href: '#',
          role: 'button',
          tabindex: '0',
          'aria-label': 'Abrir configurações do AutoJoin',
        },
        'AutoJoin Settings'
      );
      container.appendChild(btn);
      navbar.appendChild(container);
    }

    const openOptions = (e) => {
      if (e) e.preventDefault();
      if (chrome?.runtime?.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        // Fallback: open settings.html directly
        const url = chrome.runtime.getURL('html/settings.html');
        window.open(url, '_blank', 'noopener');
      }
    };

    // Avoid duplicate listeners by cloning then replacing
    const freshBtn = btn.cloneNode(true);
    freshBtn.addEventListener('click', openOptions);
    freshBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openOptions(e);
    });
    btn.replaceWith(freshBtn);
  }

  /**
   * Apply theme based on settings
   */
  applyTheme() {
    if (this.settings.NightTheme) {
      document.body.classList.add('night-theme');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove('night-theme');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  /**
   * Setup navigation bar pinning functionality
   */
  setupNavigationPin() {
    const navbar = document.querySelector('.nav__left-container');
    if (!navbar) return;

    let navbarPinned = false;

    // Create pin button
    const navbarPin = AutoJoinUtils.createElement('div', {
      className:
        'nav__button-container nav__button-container--notification nav__button-container--inactive',
      id: 'navbarPin',
      title: 'Fixar barra de navegação',
      role: 'button',
      tabindex: '0',
      'aria-label': 'Fixar barra de navegação',
    });

    const pinIcon = AutoJoinUtils.createElement('i', {
      className: 'fa fa-thumb-tack',
      'aria-hidden': 'true',
    });

    navbarPin.appendChild(pinIcon);
    navbar.prepend(navbarPin);

    // Create buffer element
    const bufferEl = AutoJoinUtils.createElement('div', { id: 'bufferEl' });
    document.body.prepend(bufferEl);

    // Pin functionality
    const togglePin = () => {
      navbarPinned = !navbarPinned;
      chrome.storage.local.set({ pinnedNavbar: navbarPinned });
      this.updateNavbarPinState(navbarPinned, navbarPin, bufferEl);
    };

    // Event listeners
    navbarPin.addEventListener('click', togglePin);
    navbarPin.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePin();
      }
    });

    // Load saved state
    chrome.storage.local.get({ pinnedNavbar: true }, (data) => {
      navbarPinned = data.pinnedNavbar;
      this.updateNavbarPinState(navbarPinned, navbarPin, bufferEl);
    });
  }

  /**
   * Update navbar pin state
   */
  updateNavbarPinState(pinned, pinButton, bufferEl) {
    const header = document.querySelector('header');

    if (pinned) {
      pinButton.classList.remove('nav__button-container--inactive');
      pinButton.classList.add('nav__button-container--active');
      pinButton.title = 'Desfixar barra de navegação';
      bufferEl.classList.add('pinned');
      header?.classList.add('pinned');
    } else {
      pinButton.classList.remove('nav__button-container--active');
      pinButton.classList.add('nav__button-container--inactive');
      pinButton.title = 'Fixar barra de navegação';
      bufferEl.classList.remove('pinned');
      header?.classList.remove('pinned');
    }
  }

  /**
   * Setup footer pinning functionality
   */
  setupFooterPin() {
    const originalFooter = document.querySelector('footer');
    if (!originalFooter) return;

    let footerPinned = false;

    // Create enhanced footer structure
    const ajFooter = AutoJoinUtils.createElement('div', { id: 'ajFooter' });

    const ajFooterArrowWrap = AutoJoinUtils.createElement('div', {
      id: 'ajFooterArrowWrap',
      role: 'button',
      tabindex: '0',
      'aria-label': 'Alternar visibilidade do rodapé',
      title: 'Clique para mostrar/ocultar rodapé',
    });

    const ajFooterArrow = AutoJoinUtils.createElement(
      'div',
      {
        id: 'ajFooterArrow',
        'aria-hidden': 'true',
      },
      '▲'
    );

    ajFooterArrowWrap.appendChild(ajFooterArrow);
    ajFooter.appendChild(ajFooterArrowWrap);

    // Move original footer inside our wrapper
    originalFooter.parentElement.insertBefore(ajFooter, originalFooter);
    ajFooter.appendChild(originalFooter);

    // Toggle functionality
    const toggleFooter = () => {
      footerPinned = !footerPinned;
      chrome.storage.local.set({ pinnedFooter: footerPinned });
      this.updateFooterPinState(footerPinned, ajFooter);
    };

    // Event listeners
    ajFooterArrowWrap.addEventListener('click', toggleFooter);
    ajFooterArrowWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFooter();
      }
    });

    // Load saved state
    chrome.storage.local.get({ pinnedFooter: true }, (data) => {
      footerPinned = data.pinnedFooter;
      this.updateFooterPinState(footerPinned, ajFooter);
    });
  }

  /**
   * Update footer pin state
   */
  updateFooterPinState(pinned, footerElement) {
    if (pinned) {
      footerElement.classList.add('pinned');
    } else {
      footerElement.classList.remove('pinned');
    }
  }

  /**
   * Setup infinite scrolling functionality
   */
  setupInfiniteScroll() {
    if (!this.settings.InfiniteScrolling) return;

    let isLoading = false;
    let currentPage = 1;
    let hasNextPage = true;

    // Remove pagination widget if infinite scroll is enabled
    const paginationWidget = document.querySelector(
      '.widget-container .widget-container--margin-top'
    );
    paginationWidget?.remove();

    // Get pagination info
    const pagination = document.querySelector('.pagination__navigation');
    if (!pagination) return;

    hasNextPage = pagination.textContent.includes('Next');
    if (!hasNextPage) return;

    // Get page URL pattern
    const nextLinks = pagination.querySelectorAll('a');
    const lastLink = nextLinks[nextLinks.length - 1];
    if (!lastLink) return;

    const urlParts = lastLink.href.split('page=');
    const baseUrl = urlParts[0] + 'page=';
    let pageParam = urlParts[1] || '2';
    let extraParams = '';

    if (pageParam.includes('&')) {
      extraParams = pageParam.substring(pageParam.indexOf('&'));
      pageParam = pageParam.substring(0, pageParam.indexOf('&'));
    }

    currentPage = parseInt(pageParam, 10) - 1;

    // Setup scroll listener
    const scrollHandler = AutoJoinUtils.throttle(async () => {
      if (isLoading || !hasNextPage) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load more when near bottom
      if (scrollTop + windowHeight >= documentHeight - 800) {
        await this.loadNextPage(baseUrl, currentPage + 1, extraParams);
        currentPage++;
      }
    }, 250);

    window.addEventListener('scroll', scrollHandler);

    // Load next page function
    this.loadNextPage = async (baseUrl, pageNum, extraParams) => {
      if (isLoading) return;

      isLoading = true;
      const postsContainer =
        document.querySelector('#posts') || this.createPostsContainer();

      // Show loading indicator
      const loadingIndicator = this.createLoadingIndicator();
      const pagination = document.querySelector('.pagination');
      if (pagination) {
        pagination.replaceChildren(loadingIndicator);
      }

      try {
        const url = `${baseUrl}${pageNum}${extraParams}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const pageDOM = parser.parseFromString(html, 'text/html');

        const newGiveaways = pageDOM.querySelectorAll(
          '.giveaway__row-outer-wrap'
        );

        if (newGiveaways.length === 0) {
          hasNextPage = false;
          if (pagination) {
            pagination.innerHTML =
              '<p style="text-align: center; color: var(--text-secondary);">Fim dos giveaways</p>';
          }
          return;
        }

        // Create page separator
        const pageHeader = AutoJoinUtils.createElement(
          'div',
          {
            className: 'page-separator',
            style:
              'text-align: center; padding: var(--spacing-lg); color: var(--text-secondary); font-weight: var(--font-weight-medium);',
          },
          `Página ${pageNum}`
        );

        postsContainer.appendChild(pageHeader);

        // Add new giveaways with enhancements
        newGiveaways.forEach((giveaway) => {
          postsContainer.appendChild(giveaway);
          this.enhanceGiveawayElement(giveaway);
        });

        // Check if there are more pages
        const newPagination = pageDOM.querySelector('.pagination__navigation');
        hasNextPage = newPagination
          ? newPagination.textContent.includes('Next')
          : false;

        if (!hasNextPage && pagination) {
          pagination.innerHTML =
            '<p style="text-align: center; color: var(--text-secondary);">Fim dos giveaways</p>';
        } else if (pagination) {
          pagination.innerHTML = '';
        }
      } catch (error) {
        console.error('Error loading next page:', error);
        if (pagination) {
          pagination.innerHTML =
            '<p style="text-align: center; color: var(--danger-color);">Erro ao carregar mais giveaways</p>';
        }
      } finally {
        isLoading = false;
      }
    };
  }

  /**
   * Create posts container if it doesn't exist
   */
  createPostsContainer() {
    const existingContainer = document.querySelector('#posts');
    if (existingContainer) return existingContainer;

    const giveawayContainer = document.querySelector(
      '.giveaway__row-outer-wrap'
    )?.parentNode;
    if (giveawayContainer) {
      giveawayContainer.id = 'posts';
      return giveawayContainer;
    }

    // Create dummy container
    const dummyContainer = AutoJoinUtils.createElement('div', { id: 'posts' });
    document.body.appendChild(dummyContainer);
    return dummyContainer;
  }

  /**
   * Create loading indicator
   */
  createLoadingIndicator() {
    const container = AutoJoinUtils.createElement('div', {
      style:
        'display: flex; justify-content: center; align-items: center; padding: var(--spacing-xl);',
    });

    const spinner = AutoJoinUtils.createSpinner('lg');
    const text = AutoJoinUtils.createElement(
      'span',
      {
        style: 'margin-left: var(--spacing-md); color: var(--text-secondary);',
      },
      'Carregando mais giveaways...'
    );

    container.appendChild(spinner);
    container.appendChild(text);
    return container;
  }

  /**
   * Enhance individual giveaway elements
   */
  enhanceGiveawayElement(giveawayElement) {
    // Apply precise time if enabled
    if (this.settings.PreciseTime) {
      const timeElement = giveawayElement.querySelector('.fa-clock-o + span');
      if (timeElement?.dataset.timestamp) {
        const endTime = parseInt(timeElement.dataset.timestamp, 10);
        timeElement.textContent = AutoJoinUtils.formatTimeRemaining(endTime);
      }
    }

    // Add accessibility improvements
    this.addAccessibilityAttributes(giveawayElement);

    // Add smooth animations
    giveawayElement.classList.add('smooth-transition');
  }

  /**
   * Add accessibility attributes to giveaway elements
   */
  addAccessibilityAttributes(giveawayElement) {
    // Add ARIA labels to buttons
    const buttons = giveawayElement.querySelectorAll(
      'button, input[type="button"]'
    );
    buttons.forEach((button) => {
      if (!button.getAttribute('aria-label')) {
        const walkState = button.getAttribute('walkState');
        let label = button.textContent || button.value;

        if (walkState === 'join') {
          label = `Participar do giveaway: ${label}`;
        } else if (walkState === 'leave') {
          label = `Sair do giveaway: ${label}`;
        }

        button.setAttribute('aria-label', label);
      }
    });

    // Add ARIA labels to links
    const links = giveawayElement.querySelectorAll('a');
    links.forEach((link) => {
      if (!link.getAttribute('aria-label') && link.href) {
        if (link.href.includes('/giveaway/')) {
          const gameName = giveawayElement.querySelector(
            '.giveaway__heading__name'
          )?.textContent;
          link.setAttribute(
            'aria-label',
            `Ver giveaway: ${gameName || 'Jogo'}`
          );
        } else if (link.href.includes('store.steampowered.com')) {
          link.setAttribute('aria-label', 'Ver na Steam Store');
        }
      }
    });

    // Add role and tabindex for interactive elements
    const descriptions = giveawayElement.querySelectorAll('.description');
    descriptions.forEach((desc) => {
      desc.setAttribute('role', 'button');
      desc.setAttribute('tabindex', '0');
      desc.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * Setup accessibility enhancements
   */
  setupAccessibilityEnhancements() {
    // Add skip links
    this.addSkipLinks();

    // Enhance keyboard navigation
    this.enhanceKeyboardNavigation();

    // Add focus management
    this.setupFocusManagement();

    // Add ARIA live regions for dynamic content
    this.addLiveRegions();
  }

  /**
   * Add skip links for better accessibility
   */
  addSkipLinks() {
    const skipLinks = AutoJoinUtils.createElement('div', {
      className: 'skip-links',
      style:
        'position: absolute; top: -40px; left: 0; background: var(--bg-primary); padding: var(--spacing-sm); z-index: 9999; border: 1px solid var(--border-color);',
    });

    const skipToContent = AutoJoinUtils.createElement(
      'a',
      {
        href: '#main-content',
        style:
          'color: var(--primary-color); text-decoration: none; margin-right: var(--spacing-md);',
      },
      'Pular para conteúdo principal'
    );

    const skipToSettings = AutoJoinUtils.createElement(
      'a',
      {
        href: '#btnSettings',
        style: 'color: var(--primary-color); text-decoration: none;',
      },
      'Pular para configurações'
    );

    skipLinks.appendChild(skipToContent);
    skipLinks.appendChild(skipToSettings);
    document.body.prepend(skipLinks);

    // Show skip links on focus
    [skipToContent, skipToSettings].forEach((link) => {
      link.addEventListener('focus', () => {
        skipLinks.style.top = '0';
      });
      link.addEventListener('blur', () => {
        skipLinks.style.top = '-40px';
      });
    });

    // Add main content landmark
    const mainContent =
      document.querySelector('.page__outer-wrap') ||
      document.querySelector('main');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
      mainContent.setAttribute('role', 'main');
    }
  }

  /**
   * Enhance keyboard navigation
   */
  enhanceKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Global keyboard shortcuts
      if (e.altKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            document.getElementById('btnSettings')?.click();
            break;
          case 'j':
            e.preventDefault();
            this.focusNextGiveaway();
            break;
          case 'k':
            e.preventDefault();
            this.focusPreviousGiveaway();
            break;
          case 't':
            e.preventDefault();
            this.toggleTheme();
            break;
        }
      }

      // Enter key for description toggles
      if (
        e.target.classList.contains('description') &&
        (e.key === 'Enter' || e.key === ' ')
      ) {
        e.preventDefault();
        e.target.click();
      }
    });
  }

  /**
   * Focus next giveaway
   */
  focusNextGiveaway() {
    const giveaways = document.querySelectorAll('.giveaway__row-outer-wrap');
    const currentFocus = document.activeElement;
    let currentIndex = -1;

    giveaways.forEach((giveaway, index) => {
      if (giveaway.contains(currentFocus)) {
        currentIndex = index;
      }
    });

    const nextIndex = (currentIndex + 1) % giveaways.length;
    const nextGiveaway = giveaways[nextIndex];
    const focusTarget =
      nextGiveaway.querySelector('.giveaway__heading__name') || nextGiveaway;
    focusTarget.focus();
  }

  /**
   * Focus previous giveaway
   */
  focusPreviousGiveaway() {
    const giveaways = document.querySelectorAll('.giveaway__row-outer-wrap');
    const currentFocus = document.activeElement;
    let currentIndex = -1;

    giveaways.forEach((giveaway, index) => {
      if (giveaway.contains(currentFocus)) {
        currentIndex = index;
      }
    });

    const prevIndex =
      currentIndex <= 0 ? giveaways.length - 1 : currentIndex - 1;
    const prevGiveaway = giveaways[prevIndex];
    const focusTarget =
      prevGiveaway.querySelector('.giveaway__heading__name') || prevGiveaway;
    focusTarget.focus();
  }

  /**
   * Toggle theme
   */
  async toggleTheme() {
    this.settings.NightTheme = !this.settings.NightTheme;
    await chrome.storage.sync.set({ NightTheme: this.settings.NightTheme });
    this.applyTheme();

    AutoJoinUtils.showNotification(
      `Tema ${this.settings.NightTheme ? 'escuro' : 'claro'} ativado`,
      'info',
      2000
    );
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Trap focus in modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal.show');
        if (modal) {
          this.trapFocus(e, modal);
        }
      }
    });
  }

  /**
   * Trap focus within an element
   */
  trapFocus(event, element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  /**
   * Add ARIA live regions for dynamic content updates
   */
  addLiveRegions() {
    // Create live region for status updates
    const statusRegion = AutoJoinUtils.createElement('div', {
      id: 'status-live-region',
      'aria-live': 'polite',
      'aria-atomic': 'true',
      className: 'sr-only',
    });

    // Create live region for important announcements
    const alertRegion = AutoJoinUtils.createElement('div', {
      id: 'alert-live-region',
      'aria-live': 'assertive',
      'aria-atomic': 'true',
      className: 'sr-only',
    });

    document.body.appendChild(statusRegion);
    document.body.appendChild(alertRegion);
  }

  /**
   * Announce status to screen readers
   */
  announceStatus(message) {
    const statusRegion = document.getElementById('status-live-region');
    if (statusRegion) {
      statusRegion.textContent = message;
    }
  }

  /**
   * Announce alert to screen readers
   */
  announceAlert(message) {
    const alertRegion = document.getElementById('alert-live-region');
    if (alertRegion) {
      alertRegion.textContent = message;
    }
  }

  /**
   * Setup responsive design enhancements
   */
  setupResponsiveEnhancements() {
    // Add viewport meta tag if missing
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = AutoJoinUtils.createElement('meta', {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      });
      document.head.appendChild(viewport);
    }

    // Add responsive classes based on screen size
    const updateResponsiveClasses = () => {
      const width = window.innerWidth;
      document.body.classList.toggle('mobile', width < 768);
      document.body.classList.toggle('tablet', width >= 768 && width < 1024);
      document.body.classList.toggle('desktop', width >= 1024);
    };

    updateResponsiveClasses();
    window.addEventListener(
      'resize',
      AutoJoinUtils.debounce(updateResponsiveClasses, 250)
    );
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Lazy load images
    this.setupLazyLoading();

    // Optimize animations for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-base', '0.01ms');
      document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }

    // Setup intersection observer for performance monitoring
    this.setupIntersectionObserver();
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    if (!AutoJoinUtils.features.supports('intersectionObserver')) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });
  }

  /**
   * Setup intersection observer for visibility tracking
   */
  setupIntersectionObserver() {
    if (!AutoJoinUtils.features.supports('intersectionObserver')) return;

    const giveawayObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const giveaway = entry.target;
          if (entry.isIntersecting) {
            giveaway.classList.add('in-viewport');
            // Trigger any lazy-loaded content
            this.loadGiveawayContent(giveaway);
          } else {
            giveaway.classList.remove('in-viewport');
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    // Observe all giveaways
    document
      .querySelectorAll('.giveaway__row-outer-wrap')
      .forEach((giveaway) => {
        giveawayObserver.observe(giveaway);
      });
  }

  /**
   * Load content for giveaway when it becomes visible
   */
  loadGiveawayContent(giveawayElement) {
    // This could be used for lazy loading descriptions, images, etc.
    // For now, just add a class to indicate it's been seen
    giveawayElement.classList.add('content-loaded');
  }
}

// Initialize page enhancer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const pageEnhancer = new PageEnhancer();
    pageEnhancer.initialize();
  });
} else {
  const pageEnhancer = new PageEnhancer();
  pageEnhancer.initialize();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PageEnhancer;
} else {
  window.PageEnhancer = PageEnhancer;
}
