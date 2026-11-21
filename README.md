# RepliPlate 2.0

Restaurant favorites made at home: copycat clones, AI meal planning, a combined grocery list, and sharing. It's plain HTML, CSS and JS modules with no build step, so you can deploy it through cPanel File Manager.

## What's new in 2.0
- **New design.** A diner palette (basil, mustard, ketchup) built around a kitchen-ticket motif that shows restaurant price vs. your price. Light and dark mode, and a side rail on desktop.
- **One-tap install.** An Install button appears in the header and on the home screen as soon as the browser allows it. iPhone users get a 3-step Add to Home Screen guide instead, since iOS has no install API.
- **Works offline.** The service worker caches the app shell and fonts. Clones, saved plans and the grocery list are stored on the device. Planning still works offline using the on-device planner.
- **AI meal planning.** Choose days, meals, household size, diet, goal, budget and notes, and the AI picks from the clone library and can invent new clones. You can re-roll any slot, send the whole week to the grocery list, and save plans.
- **AI cloning.** Type any dish, or snap a photo of a plate or menu, and the AI builds the recipe, cost and swaps.
- **Sharing.** Share links carry the plan or recipe inside the URL (compressed), so the recipient opens it straight in the app, with no server or account needed. Clones also share as a 1080×1350 ticket image. Lists share as text. Android "Share to RepliPlate" pre-fills the search.
- **Play Store ready.** Includes the TWA config, an assetlinks template, maskable and monochrome icons, a feature graphic, screenshots, a privacy policy, a report button for AI content, and a step-by-step guide in `play/PLAY-STORE.md`.

## Deploy (cPanel)
1. Upload everything in this folder to the web root of `repliplate.app`. Include the hidden files `.htaccess` and `.well-known/`. In File Manager, turn on **Settings → Show hidden files**.
2. Copy `api/config.sample.php` to `api/config.php` and paste your Anthropic API key. The key stays on the server.
3. Edit `js/config.js` if your domain or support email is different.
4. Open the site on Android Chrome. The Install button should appear within a few seconds.
5. **On every release,** bump `VERSION` in `sw.js`. Users then get a "New version ready — Refresh" prompt.

## Files
| Path | What it does |
|---|---|
| `index.html`, `styles.css` | App shell and design system |
| `js/app.js` | Screens, routing, and actions |
| `js/data.js` | Built-in clone library (13 dishes) |
| `js/store.js` | On-device storage |
| `js/planner.js` | Offline planner and plan totals |
| `js/ai.js` | AI client, with response checks and offline fallback |
| `js/share.js` | Share links, share sheet, and ticket images |
| `js/install.js` | One-tap install and the iOS guide |
| `sw.js`, `offline.html` | Offline caching |
| `manifest.webmanifest` | Install metadata: icons, screenshots, shortcuts, share target |
| `api/ai.php` | AI proxy (clone + plan), with rate limiting and origin checks |
| `privacy.html` | Privacy policy (required by Play) |
| `play/` | TWA config, Play guide, and listing copy |
| `assets/store/` | Feature graphic and screenshots |

To add dishes, append to `MEALS` in `js/data.js`, using the same shape as the existing entries.
