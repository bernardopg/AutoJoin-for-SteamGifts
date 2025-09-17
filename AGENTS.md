# Repository Guidelines

## Project Structure & Module Organization
Source lives in `js/`, split by role: `backgroundpage.js` orchestrates extension events, `autoentry.js` handles giveaway logic, and `settings.js` wires the UI. HTML surfaces (`html/settings.html`, `html/offscreen.html`) render the settings and offscreen helpers, while themed styles sit in `css/` with utility fragments such as `css/components.css`. All icons and audio assets are in `media/`, and `manifest.json` declares entry points and permissions. Keep new modules close to their runtime context so future contributors can map browser features to directories quickly.

## Build, Test, and Development Commands
Install the dev toolchain with `npm install` before running scripts. `npm run lint` runs ESLint against `js/`, `npm run format` performs a Prettier check over JS/CSS/HTML/JSON, and `npm run check` chains both for CI. `npm test` executes lightweight `node --test` suites under `tests/`, currently validating that every manifest reference resolves to a real file. For manual validation, load the repository root as an unpacked Chromium extension or run `web-ext run --source-dir .` when you add that dependency.

## Coding Style & Naming Conventions
JavaScript follows the Airbnb Base guide via `.eslintrc.json`, with overrides allowing increment operators and pre-declarations where helpful. Use 2-space indentation, trailing commas where standard, and single quotes (`.prettierrc.json`). File names stay lowercase and descriptive (`autoentry.js`, `night.css`); prefer camelCase for variables/functions and SCREAMING_SNAKE_CASE only for constants exposed across files. Run Prettier or `npm run check` before committing to keep diffs clean.

## Testing Guidelines
The repository ships with a manifest smoke test under `tests/` using Node's built-in runner—extend it with additional files that exercise giveaway logic, DOM helpers, or manifest rules. Place unit tests beside sources using a `__tests__` subfolder (`js/__tests__/autoentry.test.js`) and cross-module or integration scenarios under `tests/`. When you add broader coverage, make sure `npm test` runs them and document manual verification steps (browser, page, expected behavior) in the PR description.

## Commit & Pull Request Guidelines
History favors short, imperative subjects with optional scopes, e.g., `ci: update workflow configuration` or `Add modular CSS structure and settings modal styles`. Reference GitHub issues in the body (`Fixes #42`) and call out user-visible changes. Pull requests should include: a concise summary, screenshots or clips for UI alterations, a note on how you validated the change (`npm run check`, browser manual test), and reminders to update docs or assets when applicable.
