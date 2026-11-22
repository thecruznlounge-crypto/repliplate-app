/* Instacart shopping endpoint for RepliPlate and WAYOF: turns a grocery list or a recipe into an Instacart page.
   POST /api/shop  { action: "list",   title, line_items: [...], instructions?, linkback? }
                   { action: "recipe", title, servings?, cooking_time?, ingredients: [...], instructions?, image_url?, linkback? }
   Reply           { url }
   Secret: INSTACART_API_KEY (Instacart Developer Platform).  Var: INSTACART_ENV = "development" | "production" (default production).
   Docs: https://docs.instacart.com/developer_platform_api */
const HEALTH = ['ORGANIC', 'GLUTEN_FREE', 'FAT_FREE', 'VEGAN', 'KOSHER', 'SUGAR_FREE', 'LOW_FAT'];
const UNITS = ['each', 'package', 'packages', 'can', 'cans', 'cup', 'cups', 'tablespoon', 'teaspoon', 'ounce', 'ounces', 'pound', 'pounds', 'gram', 'kilogram', 'bunch', 'head', 'packet', 'lb', 'oz'];
const str = (v, max) => String(v ?? '').replace(/<[^>]*>/g, '').trim().slice(0, max);

function item(li, measKey) {
  if (!li || typeof li !== 'object') return null;
  const name = str(li.name, 100); if (!name) return null;
  const out = { name };
  const dt = str(li.display_text, 140); if (dt) out.display_text = dt;
  const ms = [];
  for (const m of [].concat(li[measKey] || li.line_item_measurements || li.measurements || []).slice(0, 3)) {
    const q = +m?.quantity || 0, u = String(m?.unit || 'each').toLowerCase();
    if (q > 0 && q < 1000 && UNITS.includes(u)) ms.push({ quantity: Math.round(q * 100) / 100, unit: u });
  }
  if (ms.length) out[measKey] = ms;
  const hf = [].concat(li.filters?.health_filters || []).filter(h => HEALTH.includes(h));
  if (hf.length) out.filters = { health_filters: hf };
  return out;
}

export async function shop(req, env, { allowed, underLimit }) {
  const origin = req.headers.get('Origin') || '';
  const head = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  const fail = (code, msg) => new Response(JSON.stringify({ error: msg }), { status: code, headers: head });
  if (origin && !allowed.includes(origin)) return fail(403, 'Origin not allowed.');
  if (origin) { head['Access-Control-Allow-Origin'] = origin; head.Vary = 'Origin'; }
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: Object.assign({}, head, { 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' }) });
  if (req.method !== 'POST') return fail(405, 'Use POST.');
  if (!env.INSTACART_API_KEY) return fail(503, 'Instacart is not connected yet. Add the INSTACART_API_KEY secret in Cloudflare.');
  if (!(await underLimit(req, parseInt(env.SHOP_REQUESTS_PER_HOUR || '60', 10) || 60, 'shop'))) return fail(429, 'Too many shopping links this hour. Try again later.');

  const raw = await req.text(); if (raw.length > 400000) return fail(400, 'That list is too long.');
  let inp; try { inp = JSON.parse(raw); } catch { inp = null; }
  if (!inp || typeof inp !== 'object' || Array.isArray(inp)) return fail(400, 'Send a JSON body.');

  const title = str(inp.title, 120) || 'My grocery list';
  const steps = [].concat(inp.instructions || []).slice(0, 20).map(s => str(s, 500)).filter(Boolean);
  const lp = {};
  try { const lb = new URL(String(inp.linkback || '')); if (lb.protocol === 'https:' && allowed.some(a => new URL(a).host === lb.host)) lp.partner_linkback_url = lb.href.slice(0, 500); } catch { /* no linkback */ }

  let path, body;
  if (inp.action === 'list') {
    const items = [].concat(inp.line_items || []).slice(0, 100).map(li => item(li, 'line_item_measurements')).filter(Boolean);
    if (!items.length) return fail(400, 'The list is empty.');
    body = { title, link_type: 'shopping_list', expires_in: 30, line_items: items };
    if (steps.length) body.instructions = steps;
    if (Object.keys(lp).length) body.landing_page_configuration = lp;
    path = '/idp/v1/products/products_link';
  } else if (inp.action === 'recipe') {
    const items = [].concat(inp.ingredients || []).slice(0, 60).map(li => item(li, 'measurements')).filter(Boolean);
    if (!items.length) return fail(400, 'This recipe has no ingredients.');
    body = { title, ingredients: items, expires_in: 30 };
    if (inp.servings) body.servings = Math.max(1, Math.min(50, parseInt(inp.servings, 10) || 1));
    if (inp.cooking_time) body.cooking_time = Math.max(1, Math.min(600, parseInt(inp.cooking_time, 10) || 1));
    if (inp.author) body.author = str(inp.author, 60);
    if (/^https:\/\//.test(String(inp.image_url || ''))) body.image_url = String(inp.image_url).slice(0, 500);
    if (steps.length) body.instructions = steps;
    body.landing_page_configuration = Object.assign({ enable_pantry_items: true }, lp); // shoppers can tick off what they already have
    path = '/idp/v1/products/recipe';
  } else return fail(400, 'Unknown action.');

  const base = env.INSTACART_BASE || (env.INSTACART_ENV === 'development' ? 'https://connect.dev.instacart.tools' : 'https://connect.instacart.com');
  let r;
  try {
    r = await fetch(base + path, { method: 'POST', headers: { Authorization: 'Bearer ' + env.INSTACART_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
  } catch { return fail(502, 'Could not reach Instacart.'); }
  let j = {}; try { j = await r.json(); } catch { /* not JSON */ }
  if (r.status >= 400 || !j.products_link_url) {
    console.log('Instacart', r.status, JSON.stringify(j).slice(0, 400));
    return fail(502, r.status === 401 ? 'Instacart rejected the API key. Check INSTACART_API_KEY and INSTACART_ENV.' : 'Instacart could not build this page right now.');
  }
  return new Response(JSON.stringify({ url: j.products_link_url }), { headers: head });
}
