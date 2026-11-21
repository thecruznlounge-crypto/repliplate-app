// One-tap install: captures the browser's install prompt and fires it from a single button.
// iOS has no install API, so iPhone/iPad users get a short Add to Home Screen guide instead.
import { get, update } from './store.js';

let deferred = null;
const listeners = new Set();

export const isStandalone = () =>
  matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches ||
  navigator.standalone === true || document.referrer.startsWith('android-app://'); // Play Store (TWA) build
export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function installState() {
  if (isStandalone()) return 'installed';
  if (deferred) return 'ready';
  if (isIOS()) return 'ios';
  return 'unavailable';
}
export const onInstallChange = fn => listeners.add(fn);
const emit = () => listeners.forEach(fn => fn(installState()));

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; emit(); });
window.addEventListener('appinstalled', () => { deferred = null; emit(); });
matchMedia('(display-mode: standalone)').addEventListener?.('change', emit);

// Returns 'accepted' | 'dismissed' | 'ios' | 'unavailable' | 'installed'
export async function install() {
  const s = installState();
  if (s !== 'ready') return s;
  deferred.prompt();
  const { outcome } = await deferred.userChoice.catch(() => ({ outcome: 'dismissed' }));
  deferred = null; emit();
  if (outcome === 'dismissed') update(st => { st.installDismissedAt = Date.now(); });
  return outcome;
}

// Show the install card again only if it wasn't dismissed in the last 3 days.
export const shouldNudge = () => ['ready', 'ios'].includes(installState()) && Date.now() - (get().installDismissedAt || 0) > 3 * 864e5;
export const snooze = () => update(st => { st.installDismissedAt = Date.now(); });
