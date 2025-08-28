AutoJoin for SteamGifts
=======================

A small userscript/extension to automatically join SteamGifts giveaways.

Repository layout

- `manifest.json` — extension manifest
- `js/` — core JavaScript source files
- `core/` — modules for giveaway handling and page enhancements
- `html/`, `css/`, `media/` — assets and pages

Getting started

1. Install as an unpacked extension in your browser (Chrome/Edge/Firefox via about:debugging) using the repo root.
2. Or adapt the scripts to a userscript manager (Tampermonkey/Greasemonkey) if you prefer.

Usage

- The extension runs in the page context and tries to detect giveaways to auto-join. Inspect the `js/` and `core/` folders for implementation details.
- A background page is present at `js/backgroundpage.js` and helper pages live under `html/`.

Development

Prerequisites

- Node.js (optional) — used only for developer scripts defined in `package.json` if you add dependencies.

Common tasks

- Run checks (lint/tests):

  npm run check

- Run tests (if/when added):

  npm test

Packaging and publishing

- To distribute the extension locally, build a ZIP of the repository root and load it as an unpacked extension in Chromium-based browsers, or follow each browser's packaging guidelines for store submission.

Branching and pull requests

- This repository has a branch `organize-repo` with documentation and CI scaffolding. To propose changes, create a branch per feature, push it and open a PR against `master`.

Continuous integration

- A basic GitHub Actions workflow is included at `.github/workflows/ci.yml`. It installs Node.js and runs `npm run check`. Extend it to run linters/tests when available.

Contributing

- See `CONTRIBUTING.md` for contribution guidelines and branch/PR instructions.

Notes

- This README is intentionally minimal. I can expand development steps, add tests, or add packaging scripts next — tell me which you'd prefer.
