# Publishing RepliPlate to Google Play

RepliPlate ships to Play as a **Trusted Web Activity (TWA)**: a thin Android app that opens your live site full-screen, with no browser bar. You keep deploying through cPanel as usual. Updates to the site reach Play users instantly, with no new app review.

## Before you start
- The site is live at `https://repliplate.app` over HTTPS, with this folder at the web root.
- Chrome's Lighthouse "Installable" check passes (DevTools → Lighthouse → PWA, or DevTools → Application → Manifest shows no errors).
- A Google Play developer account ($25 one-time). New personal accounts must run a **closed test with at least 12 testers for 14 days** before production access opens. Start that clock early.

## Option A — PWABuilder (no tools to install)
1. Go to pwabuilder.com, enter `https://repliplate.app`, and choose **Package for stores → Android**.
2. Set **Package ID** to `app.repliplate.twa` and **App name** to `RepliPlate`. Leave signing as "New" (PWABuilder creates a key).
3. Download the zip. It contains `app-release-bundle.aab`, your `signing.keystore` and its passwords, and an `assetlinks.json`.
4. **Back up the keystore and passwords somewhere safe.** You need them for every future update.
5. Continue at "Link the app to the site" below.

## Option B — Bubblewrap CLI (repeatable builds)
```bash
npm i -g @bubblewrap/cli
mkdir repliplate-android && cd repliplate-android
cp ../play/twa-manifest.json .
bubblewrap init --manifest https://repliplate.app/manifest.webmanifest   # accept defaults; it reads twa-manifest values
bubblewrap build                                                         # outputs app-release-bundle.aab
```
To ship an update to the wrapper later, raise `appVersionCode` in `twa-manifest.json`, then run `bubblewrap update && bubblewrap build`.

## Link the app to the site (removes the browser bar)
1. Upload the `.aab` in Play Console → your app → **Test and release → Testing → Closed testing**.
2. Open **Test and release → App integrity → App signing**. Copy the **SHA-256 certificate fingerprint** under "App signing key certificate."
3. Paste it into `.well-known/assetlinks.json`, replacing `REPLACE_WITH_PLAY_APP_SIGNING_SHA256_FINGERPRINT`. To test a locally signed build too, add your upload key's fingerprint as a second entry in the same array.
4. Upload `.well-known/assetlinks.json` to the site root. It must load at `https://repliplate.app/.well-known/assetlinks.json`. In cPanel File Manager, turn on **Settings → Show hidden files** to see the `.well-known` folder.
5. Check it with Google's tester: `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://repliplate.app&relation=delegate_permission/common.handle_all_urls`

If the app still shows a URL bar, the fingerprint doesn't match. Re-copy it from **App signing**, not from your upload key.

## Store listing assets (in `assets/store/`)
| Play field | File |
|---|---|
| App icon (512×512) | `assets/icons/icon-512.png` |
| Feature graphic (1024×500) | `assets/store/feature-graphic.png` |
| Phone screenshots (1080×1920) | `assets/store/screen-1…4-*.png` |
| Privacy policy URL | `https://repliplate.app/privacy.html` |

Listing copy is in `play/store-listing.md`.

## Play policy checklist
- **Data safety form.** Data collected: *Photos* (optional, processed for the AI clone feature, not stored) and *Other user-generated content* (meal-planner text, processed, not stored). Not shared with third parties for advertising. No account, so no account deletion is needed. Data is encrypted in transit.
- **AI-generated content.** The app has a "Report this result" button on every AI clone and AI plan, which Play requires for generative AI apps.
- **Trademarks.** Restaurant names are used descriptively ("Chipotle-style") with a non-affiliation notice in the app and the privacy page. Don't use restaurant logos in screenshots or the listing.
- **Target audience:** 13+. **Content rating:** complete the questionnaire (no objectionable content). **Ads:** none.
- **Category:** Food & Drink.
