// RepliPlate service worker — offline-first app shell.
const VERSION = 'rp-2.0.1';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;
const FONTS = 'rp-fonts'; // kept across versions

const PRECACHE = [
  './', './index.html', './offline.html', './privacy.html', './styles.css', './manifest.webmanifest',
  './js/app.js', './js/data.js', './js/store.js', './js/planner.js', './js/ai.js', './js/share.js', './js/install.js', './js/config.js',
  './assets/logo.svg', './assets/icons/icon-48.png', './assets/icons/icon-96.png', './assets/icons/icon-192.png',
  './assets/icons/icon-512.png', './assets/icons/maskable-192.png', './assets/icons/maskable-512.png', './assets/icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(PRECACHE.map(u => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== SHELL && k !== RUNTIME && k !== FONTS).map(k => caches.delete(k)));
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return; // AI POSTs go straight to the network
  const url = new URL(req.url);

  // Google Fonts: cache-first, so typography survives offline after first visit
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(cacheFirst(req, FONTS)); return;
  }
  if (url.origin !== location.origin) return;
  if (url.pathname.includes('/api/')) return;

  // Page navigations: network first (fresh deploys), fall back to cached shell, then offline page
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const preload = await e.preloadResponse;
        if (preload) return preload;
        const res = await fetchWithTimeout(req, 3500);
        const c = await caches.open(SHELL); c.put('./index.html', res.clone());
        return res;
      } catch (err) {
        return (await caches.match('./index.html', { ignoreSearch: true })) || (await caches.match('./offline.html')) || Response.error();
      }
    })());
    return;
  }

  // Everything else from our origin: stale-while-revalidate
  e.respondWith(staleWhileRevalidate(req, e));
});

async function cacheFirst(req, name) {
  const hit = await caches.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res.ok || res.type === 'opaque') (await caches.open(name)).put(req, res.clone());
    return res;
  } catch (e) { return new Response('', { status: 504 }); }
}

async function staleWhileRevalidate(req, event) {
  const cached = await caches.match(req, { ignoreSearch: true });
  const network = fetch(req).then(async res => {
    if (res.ok) (await caches.open(cached ? SHELL : RUNTIME)).put(req, res.clone());
    return res;
  }).catch(() => null);
  if (cached) { event.waitUntil(network); return cached; }
  return (await network) || new Response('', { status: 504, statusText: 'Offline' });
}

function fetchWithTimeout(req, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    fetch(req).then(r => { clearTimeout(t); resolve(r); }, err => { clearTimeout(t); reject(err); });
  });
}
