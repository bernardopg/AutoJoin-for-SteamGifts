# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AutoJoin for SteamGifts is a browser extension (Manifest V3) that automatically joins giveaways on SteamGifts.com. The extension uses modern JavaScript ES6+ and includes background service workers, content scripts, and offscreen documents for HTML parsing.

## Repository Structure

- `manifest.json` — Extension manifest (Manifest V3)
- `js/` — Core JavaScript source files
  - `backgroundpage.js` — Service worker handling auto-join logic, notifications, and Steam key redemption
  - `autoentry.js` — Content script for auto-join functionality
  - `settings.js` — Settings management
  - `utils-enhanced.js` — Utility functions
  - `offscreen.js` — Offscreen document for DOM parsing and audio
- `js/core/` — Modular components
  - `giveaway.js` — Giveaway class with join/leave/filter logic
  - `page-enhancements.js` — UI enhancements for SteamGifts pages
- `html/` — HTML pages (settings, offscreen)
- `css/` — Stylesheets including night mode and FontAwesome
- `media/` — Extension icons and audio files

## Development Commands

### Initial Setup

```bash
# Install dependencies (currently none, but structure is in place)
npm install

# For ESLint (when dependencies are added)
npm install --save-dev eslint eslint-config-airbnb-base
```

### Linting and Checks

```bash
# Run checks (placeholder - add linters when dependencies installed)
npm run check

# Run tests (placeholder - no tests configured yet)
npm test
```

### Loading the Extension

1. Chrome/Edge: Navigate to chrome://extensions/, enable Developer Mode, click "Load unpacked" and select repository root
2. Firefox: Navigate to about:debugging, click "This Firefox", "Load Temporary Add-on" and select manifest.json

### Building for Distribution

```bash
# Create a ZIP for distribution (manual process currently)
zip -r AutoJoin_$(date +%Y%m%d).zip . -x "*.git*" -x "node_modules/*" -x "*.zip"
```

## Key Technical Details

### Manifest V3 Specifics

- Uses service worker instead of background page
- Offscreen documents for DOM parsing and audio playback (required for MV3)
- Host permissions for steamgifts.com and store.steampowered.com

### Core Functionality Flow

1. Background service worker (`backgroundpage.js`) manages the auto-join logic
2. Content scripts inject UI enhancements and handle page interactions
3. Offscreen document handles HTML parsing and audio notifications
4. Settings stored in chrome.storage

### API Endpoints

- Giveaway join/leave: `https://www.steamgifts.com/ajax.php`
- Uses FormData with XSRF token for authentication
- Supports automatic Steam key redemption via Steam store API

### ESLint Configuration

- Extends airbnb-base
- Browser environment with jQuery and Chrome globals
- Customized rules for extension development (see .eslintrc.json)

## Testing Approach

Currently no automated tests. When implementing:

1. Test extension in multiple browsers (Chrome, Edge, Firefox)
2. Verify auto-join functionality on steamgifts.com
3. Check console for errors
4. Test settings persistence
5. Verify notifications work correctly

## Branch Strategy

- `master` — Main development branch
- Feature branches: `feature/description` or `fix/bug-description`
- `organize-repo` — Contains documentation and CI scaffolding

## CI/CD Pipeline

GitHub Actions workflow at `.github/workflows/ci.yml`:

- Runs on push/PR to main branch
- Sets up Node.js 18
- Runs `npm run check` and `npm test` (placeholders currently)
