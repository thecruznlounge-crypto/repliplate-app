// On-device meal planner. Used when offline or when the AI service is unavailable,
// and as the scorer the AI plan is checked against.
import { MEALS } from './data.js';
import { get, getMeal, uid } from './store.js';
import './shopkit.js'; // shared with WAYOF: package-level grocery costing + budget planner (sets globalThis.SHOPKIT)
const K = globalThis.SHOPKIT;

// RepliPlate meal → ShopKit meal
export const toShopMeal = m => m && ({ id: m.id, name: m.item, kcal: m.homeCal, protein: m.protein, minutes: m.minutes, restPrice: m.restaurantPrice, score: m.score,
  steps: m.steps || [], ingredients: (m.ingredients || []).map(i => ({ name: i.name, qty: i.qty, cost: i.cost, aisle: i.aisle })) });
// The weekly budget slider covers 7 days; shorter plans get their share of it.
export const budgetFor = prefs => Math.round((prefs.budget || 90) * (prefs.days || 7) / 7 * 100) / 100;

/** Grocery-cart estimate for any plan (device or AI): whole packages, shared ingredients counted once. */
export function planShop(plan) {
  const prefs = plan.prefs || {}, meals = [];
  plan.days.forEach((d, di) => d.meals.forEach(s => meals.push({ day: d.day, d: di, slot: s.slot, id: s.id })));
  const budget = budgetFor(prefs);
  const sh = get().shop || {};
  return K.recost({ meals, household: prefs.household || 1, budget, target: Math.round(budget * 0.88 * 100) / 100, store: sh.store || '' }, id => toShopMeal(getMeal(id)), { basics: true, storeBrand: !!sh.storeBrand });
}

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function pool() {
  return [...MEALS, ...Object.values(get().custom)].filter(m => !['Drinks', 'Desserts', 'Sides', 'Breakfast'].includes(m.category));
}

function fitsDiet(meal, diet) {
  if (diet === 'any') return { ok: true, swap: null };
  const native = (meal.tags || []).includes('plant-based') || (diet === 'vegetarian' && meal.category === 'Soups');
  if (native) return { ok: true, swap: null };
  if ((meal.diets || []).includes(diet)) return { ok: true, swap: diet === 'vegan' ? 'Vegan' : 'Vegetarian' };
  return { ok: false };
}

function excluded(meal, notes) {
  const words = [...notes.toLowerCase().matchAll(/(?:no|without|avoid|skip)\s+([a-z][a-z\s]{2,20}?)(?=[,.;]|\s+and\b|$)/g)].map(m => m[1].trim());
  if (!words.length) return false;
  const hay = (meal.item + ' ' + meal.ingredients.map(i => i.name).join(' ')).toLowerCase();
  return words.some(w => hay.includes(w.replace(/s$/, '')));
}

function score(meal, goal, notes) {
  let s = meal.score / 100;
  const save = meal.restaurantPrice - meal.homePrice;
  if (goal === 'save') s += save / 8;
  if (goal === 'lighter') s += (900 - meal.homeCal) / 300;
  if (goal === 'protein') s += meal.protein / 30;
  if (goal === 'quick') s += (45 - meal.minutes) / 15;
  if (/kid|child|picky/i.test(notes) && (meal.tags || []).includes('kid-friendly')) s += 0.8;
  if (/prep|leftover/i.test(notes) && (meal.tags || []).includes('meal-prep')) s += 0.6;
  return s + Math.random() * 0.5; // a little variety between runs
}

export function buildLocalPlan(prefs) {
  const slots = prefs.slots === 'both' ? ['lunch', 'dinner'] : ['dinner'];
  const candidates = pool()
    .map(m => ({ m, d: fitsDiet(m, prefs.diet) }))
    .filter(x => x.d.ok && !excluded(x.m, prefs.notes || ''))
    .map(x => ({ ...x, s: score(x.m, prefs.goal, prefs.notes || '') }))
    .sort((a, b) => b.s - a.s);

  // ShopKit plans to the budget (minus a cushion), buying whole packages and reusing ingredients across meals
  const swapOf = new Map(candidates.map(c => [c.m.id, c.d.swap]));
  const sk = K.plan({ budget: budgetFor(prefs), days: prefs.days, slots, household: prefs.household, goal: prefs.goal,
    pool: candidates.map(c => Object.assign(toShopMeal(c.m), { weight: 0.3 * (c.s - c.m.score / 100) })), basics: true, store: (get().shop || {}).store || '', storeBrand: !!(get().shop || {}).storeBrand });
  const days = [];
  for (let d = 0; d < prefs.days; d++) days.push({ day: DAY_NAMES[d], meals: sk.meals.filter(x => x.d === d && x.id).map(x => ({ slot: x.slot, id: x.id, swap: swapOf.get(x.id) || null })) });
  return {
    id: uid('plan'), source: 'device', created: Date.now(), prefs: { ...prefs },
    name: `${prefs.days}-day ${prefs.goal === 'save' ? 'budget' : prefs.goal === 'lighter' ? 'lighter' : prefs.goal === 'protein' ? 'high-protein' : 'quick'} plan`,
    summary: candidates.length ? '' : 'No clones match those filters yet. Loosen the diet or notes and try again.',
    days, tips: [],
  };
}

export function planTotals(plan) {
  const h = plan.prefs?.household || 1;
  let home = 0, out = 0, cal = 0, n = 0;
  for (const d of plan.days) for (const s of d.meals) {
    const m = getMeal(s.id); if (!m) continue;
    home += m.homePrice * h; out += m.restaurantPrice * h; cal += m.homeCal; n++;
  }
  return { home, out, keep: out - home, avgCal: n ? Math.round(cal / n) : 0, count: n };
}

export function rerollSlot(plan, dayIdx, slotIdx) {
  const taken = new Set(plan.days.flatMap(d => d.meals.map(s => s.id)));
  const prefs = plan.prefs;
  const options = pool().map(m => ({ m, d: fitsDiet(m, prefs.diet) }))
    .filter(x => x.d.ok && !taken.has(x.m.id) && !excluded(x.m, prefs.notes || ''));
  const list = options.length ? options : pool().map(m => ({ m, d: fitsDiet(m, prefs.diet) })).filter(x => x.d.ok);
  const pick = list[Math.floor(Math.random() * list.length)];
  if (pick) plan.days[dayIdx].meals[slotIdx] = { ...plan.days[dayIdx].meals[slotIdx], id: pick.m.id, swap: pick.d.swap, note: '' };
  return plan;
}
