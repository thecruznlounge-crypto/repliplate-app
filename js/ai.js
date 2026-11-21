// Talks to the server-side AI proxy (api/ai.php). Falls back to on-device logic when offline.
import { CONFIG } from './config.js';
import { MEALS, AISLES, CATEGORIES } from './data.js';
import { get, addCustom, uid } from './store.js';
import { buildLocalPlan, DAY_NAMES } from './planner.js';

export class OfflineError extends Error {}

async function call(action, payload) {
  if (!navigator.onLine) throw new OfflineError('offline');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), CONFIG.AI_TIMEOUT_MS);
  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload }), signal: ctrl.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (data.offline) throw new OfflineError('offline');
    if (!res.ok || data.error) throw new Error(data.error || `AI service returned ${res.status}`);
    return data;
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('The AI took too long to answer. Try again.');
    if (e instanceof TypeError) throw new OfflineError('network');
    throw e;
  } finally { clearTimeout(t); }
}

const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
const str = (v, d = '') => (typeof v === 'string' ? v.trim().slice(0, 400) : d);

// Make any AI-produced meal safe and complete before it touches the UI or storage.
export function normalizeMeal(raw, source = 'ai') {
  const m = raw || {};
  const ingredients = (Array.isArray(m.ingredients) ? m.ingredients : []).slice(0, 25).map(x => ({
    name: str(x.name, 'Ingredient'), qty: str(x.qty, ''), cost: Math.max(0, num(x.cost)),
    aisle: AISLES[x.aisle] ? x.aisle : 'pantry',
  }));
  const homePrice = num(m.homePrice) || +ingredients.reduce((a, b) => a + b.cost, 0).toFixed(2);
  return {
    id: uid('ai'), source,
    restaurant: str(m.restaurant, 'Restaurant-style'), item: str(m.item, 'Copycat clone'),
    emoji: str(m.emoji, '🍽️').slice(0, 4), category: CATEGORIES.includes(m.category) ? m.category : 'Bowls',
    restaurantPrice: num(m.restaurantPrice, homePrice * 2.5), homePrice,
    restaurantCal: Math.round(num(m.restaurantCal, 800)), homeCal: Math.round(num(m.homeCal, 650)),
    protein: Math.round(num(m.protein, 25)), minutes: Math.round(num(m.minutes, 30)),
    score: Math.min(99, Math.max(50, Math.round(num(m.score, 80)))),
    diets: (Array.isArray(m.diets) ? m.diets : []).filter(d => d === 'vegan' || d === 'vegetarian'),
    tags: (Array.isArray(m.tags) ? m.tags : []).map(t => str(t)).slice(0, 5),
    ingredients,
    steps: (Array.isArray(m.steps) ? m.steps : []).map(s => str(s)).filter(Boolean).slice(0, 12),
    swaps: (Array.isArray(m.swaps) ? m.swaps : []).slice(0, 5).map(s => Array.isArray(s) ? [str(s[0]), str(s[1])] : [str(s.label), str(s.text)]),
    created: Date.now(),
  };
}

// ---------- clone a dish from words or a photo ----------
export async function cloneFromText(query) {
  const data = await call('clone', { query: query.slice(0, 200) });
  return addCustom(normalizeMeal(data.meal));
}

export async function cloneFromPhoto(file) {
  const image = await shrink(file, 1024);
  const data = await call('clone', { image });
  return addCustom(normalizeMeal(data.meal, 'photo'));
}

async function shrink(file, max) {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.82).split(',')[1];
}

// ---------- AI meal plan ----------
export async function planWeek(prefs) {
  const library = [...MEALS, ...Object.values(get().custom)].map(m => ({
    id: m.id, name: `${m.restaurant} ${m.item}`, cat: m.category, home: m.homePrice, out: m.restaurantPrice,
    cal: m.homeCal, protein: m.protein, min: m.minutes, diets: m.diets, tags: m.tags,
  }));
  try {
    const data = await call('plan', { prefs, library });
    return normalizePlan(data.plan, prefs);
  } catch (e) {
    const plan = buildLocalPlan(prefs);
    plan.fallback = e instanceof OfflineError
      ? "You're offline, so this plan was built on your device from the clone library."
      : "AI planning isn't available right now, so this plan was built on your device. Try again later for an AI plan.";
    return plan;
  }
}

function normalizePlan(raw, prefs) {
  const known = id => MEALS.some(m => m.id === id) || get().custom[id];
  const days = (Array.isArray(raw?.days) ? raw.days : []).slice(0, 7).map((d, di) => ({
    day: DAY_NAMES[di],
    meals: (Array.isArray(d.meals) ? d.meals : []).slice(0, 3).map(s => {
      let id = s.id;
      if (!known(id) && s.meal) id = addCustom(normalizeMeal(s.meal)).id;
      if (!known(id)) return null;
      return { slot: s.slot === 'lunch' ? 'lunch' : 'dinner', id, swap: ['Vegan', 'Vegetarian', 'Lighter', 'High protein'].includes(s.swap) ? s.swap : null, note: str(s.note) };
    }).filter(Boolean),
  })).filter(d => d.meals.length);
  if (!days.length) {
    const p = buildLocalPlan(prefs); p.fallback = 'The AI reply was incomplete, so this plan was built on your device.'; return p;
  }
  return {
    id: uid('plan'), source: 'ai', created: Date.now(), prefs: { ...prefs },
    name: str(raw.name, `${days.length}-day plan`).slice(0, 60), summary: str(raw.summary),
    tips: (Array.isArray(raw.tips) ? raw.tips : []).map(t => str(t)).filter(Boolean).slice(0, 4), days,
  };
}
