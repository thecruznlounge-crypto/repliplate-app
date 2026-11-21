/* RepliPlate on Cloudflare Workers.
   Static app files are served from this repo; /api/ai.php is the old PHP AI proxy rewritten here,
   same URL and same replies, so the app and WAYOF need no changes.
   Secret: ANTHROPIC_API_KEY.  Optional vars: MODEL, REQUESTS_PER_HOUR, ALLOWED_ORIGINS (comma list). */
import { CLONE_SYSTEM, PLAN_SYSTEM } from './prompts.js';

const ORIGINS = ['https://repliplate.app', 'https://www.repliplate.app', 'https://thewayof.health', 'https://www.thewayof.health', 'https://wayof.health', 'https://www.wayof.health'];
const NO_STORE = /^\/(sw\.js|manifest\.webmanifest|index\.html)?$/;

const ASSETLINKS = [{
  relation: ['delegate_permission/common.handle_all_urls'],
  target: { namespace: 'android_app', package_name: 'app.repliplate.twa', sha256_cert_fingerprints: ['REPLACE_WITH_PLAY_APP_SIGNING_SHA256_FINGERPRINT'] },
}];

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url), p = url.pathname;
    if (url.hostname.startsWith('www.')) return Response.redirect(`https://${url.hostname.slice(4)}${p}${url.search}`, 301);
    if (p === '/api/ai.php') return ai(req, env);
    if (p.startsWith('/api/') || p.startsWith('/worker/') || /^\/(wrangler\.jsonc|\.assetsignore|README\.md)$/.test(p)) return new Response('Not found', { status: 404 });
    if (p === '/.well-known/assetlinks.json')
      return new Response(JSON.stringify(ASSETLINKS, null, 2), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });

    const res = await env.ASSETS.fetch(req);
    const h = new Headers(res.headers);
    h.set('X-Content-Type-Options', 'nosniff');
    h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    h.set('Permissions-Policy', 'geolocation=(), microphone=()');
    if (p.endsWith('.webmanifest')) h.set('Content-Type', 'application/manifest+json');
    if (NO_STORE.test(p)) h.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    else if (/\.(png|svg|woff2)$/.test(p)) h.set('Cache-Control', 'public, max-age=2592000');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  },
};

/* ---------------- AI proxy (was api/ai.php) ---------------- */
async function ai(req, env) {
  const allowed = ORIGINS.concat(String(env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean));
  const origin = req.headers.get('Origin') || '';
  const head = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  const fail = (code, msg) => new Response(JSON.stringify({ error: msg }), { status: code, headers: head });

  if (origin && !allowed.includes(origin)) return fail(403, 'Origin not allowed.');
  if (origin) { head['Access-Control-Allow-Origin'] = origin; head.Vary = 'Origin'; }
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: Object.assign({}, head, { 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' }) });
  if (req.method !== 'POST') return fail(405, 'Use POST.');
  if (!env.ANTHROPIC_API_KEY) return fail(503, 'AI is not configured on the server yet. Add the ANTHROPIC_API_KEY secret in Cloudflare.');

  const raw = await req.text();
  if (raw.length > 6_000_000) return fail(400, 'That photo is too large or not a JPEG.');
  let inp; try { inp = JSON.parse(raw); } catch { inp = null; }
  if (!inp || typeof inp !== 'object' || Array.isArray(inp)) return fail(400, 'Send a JSON body.');

  if (!(await underLimit(req, parseInt(env.REQUESTS_PER_HOUR || '30', 10) || 30))) return fail(429, 'You have reached the hourly AI limit. Try again later.');

  const ask = async (system, content, max) => {
    let r;
    try {
      r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: env.MODEL || 'claude-sonnet-5-5', max_tokens: max, system, messages: [{ role: 'user', content }] }),
        signal: AbortSignal.timeout(55000),
      });
    } catch { return { fail: fail(502, 'Could not reach the AI service.') }; }
    if (r.status === 429 || r.status === 529) return { fail: fail(503, 'The AI is busy. Try again in a minute.') };
    if (r.status >= 400) return { fail: fail(502, 'The AI service returned an error.') };
    let data; try { data = await r.json(); } catch { data = {}; }
    let text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    text = text.trim().replace(/^```(?:json)?|```$/gm, '');
    let out = null; try { out = JSON.parse(text); } catch {}
    if (!out || typeof out !== 'object') { const a = text.indexOf('{'), b = text.lastIndexOf('}'); if (a >= 0 && b > a) try { out = JSON.parse(text.slice(a, b + 1)); } catch {} }
    if (!out || typeof out !== 'object') return { fail: fail(502, 'The AI reply could not be read. Try again.') };
    return { out };
  };
  const ok = obj => new Response(JSON.stringify(obj), { headers: head });

  if (inp.action === 'clone') {
    const query = String(inp.query ?? '').slice(0, 200).trim();
    const image = String(inp.image ?? '');
    if (!query && !image) return fail(400, 'Type a dish name or add a photo.');
    if (image && (image.length > 5_500_000 || !/^[A-Za-z0-9+/=]+$/.test(image))) return fail(400, 'That photo is too large or not a JPEG.');
    const content = [];
    if (image) content.push({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } });
    content.push({ type: 'text', text: image ? 'Identify the restaurant dish in this photo (a plate of food or a menu) and clone it.' + (query ? ` Hint: ${query}` : '') : `Clone this restaurant dish: ${query}` });
    const { out, fail: f } = await ask(CLONE_SYSTEM, content, 2500); if (f) return f;
    if (out.error) return fail(422, String(out.error));
    if (!out.meal) return fail(502, 'The AI reply was incomplete. Try again.');
    return ok({ meal: out.meal });
  }

  if (inp.action === 'plan') {
    const pr = inp.prefs && typeof inp.prefs === 'object' ? inp.prefs : {};
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const clean = {
      days: clamp(parseInt(pr.days ?? 7, 10) || 0, 1, 7),
      slots: pr.slots === 'both' ? 'lunch and dinner' : 'dinner only',
      household: clamp(parseInt(pr.household ?? 2, 10) || 0, 1, 10),
      diet: ['any', 'vegetarian', 'vegan'].includes(pr.diet ?? 'any') ? (pr.diet ?? 'any') : 'any',
      goal: ['save', 'lighter', 'protein', 'quick'].includes(pr.goal ?? 'save') ? (pr.goal ?? 'save') : 'save',
      weekly_budget_usd: clamp(parseFloat(pr.budget ?? 90) || 0, 10, 1000),
      notes: String(pr.notes ?? '').replace(/<[^>]*>/g, '').slice(0, 300),
    };
    const library = (Array.isArray(inp.library) ? inp.library : []).slice(0, 80);
    const msg = 'Planner settings:\n' + JSON.stringify(clean, null, 4) + '\n\nClone library (prefer these ids):\n' + JSON.stringify(library);
    const { out, fail: f } = await ask(PLAN_SYSTEM, [{ type: 'text', text: msg }], 6000); if (f) return f;
    if (!out.plan) return fail(502, 'The AI reply was incomplete. Try again.');
    return ok({ plan: out.plan });
  }
  return fail(400, 'Unknown action.');
}

/* Per-visitor hourly cap, kept in Cloudflare's edge cache (no database needed). */
async function underLimit(req, perHour) {
  const ip = req.headers.get('CF-Connecting-IP') || '0';
  const hour = new Date().toISOString().slice(0, 13);
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + hour));
  const key = 'https://rl.repliplate.internal/' + [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
  const cache = caches.default;
  const hit = await cache.match(key);
  const n = hit ? parseInt(await hit.text(), 10) || 0 : 0;
  if (n >= perHour) return false;
  await cache.put(key, new Response(String(n + 1), { headers: { 'Cache-Control': 'max-age=3600' } }));
  return true;
}
