// Local-first persistence. Everything lives on the device so the app works offline.
import { byId } from './data.js';

const KEY = 'rp.state.v2';
const defaults = () => ({
  saved: [],            // meal ids
  custom: {},           // id -> meal (AI clones, imported meals)
  plans: [],            // saved plans
  draftPlan: null,      // last generated plan
  list: {},             // grocery items keyed by name
  prefs: { days: 7, slots: 'dinner', household: 2, diet: 'any', budget: 90, goal: 'save', notes: '' },
  installDismissedAt: 0,
  shop: { store: '' },  // store name for price learning (ShopKit)
});

let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    return { ...defaults(), ...JSON.parse(raw) };
  } catch (e) { return defaults(); }
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked: keep in memory */ }
  listeners.forEach(fn => fn(state));
}

export const get = () => state;
export const onChange = fn => listeners.add(fn);
export function update(fn) { fn(state); persist(); }

export const getMeal = id => byId(id) || state.custom[id] || null;
export const isSaved = id => state.saved.includes(id);
export function toggleSaved(id) {
  update(s => { s.saved = s.saved.includes(id) ? s.saved.filter(x => x !== id) : [id, ...s.saved]; });
  return isSaved(id);
}
export function addCustom(meal) { update(s => { s.custom[meal.id] = meal; }); return meal; }

// ---------- grocery list ----------
const keyOf = name => name.trim().toLowerCase();
export function addMealToList(meal, servings = 1) {
  update(s => {
    for (const ing of meal.ingredients) {
      const k = keyOf(ing.name);
      const item = s.list[k] || { name: ing.name, aisle: ing.aisle || 'pantry', cost: 0, parts: [], from: [], checked: false };
      item.cost = +(item.cost + (Number(ing.cost) || 0) * servings).toFixed(2);
      const part = item.parts.find(p => p.qty === ing.qty);
      if (part) part.times += servings; else item.parts.push({ qty: ing.qty, times: servings });
      if (!item.from.includes(meal.id)) item.from.push(meal.id);
      item.checked = false;
      s.list[k] = item;
    }
  });
}
export function toggleItem(k) { update(s => { if (s.list[k]) s.list[k].checked = !s.list[k].checked; }); }
export function clearChecked() { update(s => { for (const k in s.list) if (s.list[k].checked) delete s.list[k]; }); }
export function clearList() { update(s => { s.list = {}; }); }
export const listCount = () => Object.values(state.list).filter(i => !i.checked).length;

// ---------- plans ----------
export function savePlan(plan) {
  update(s => {
    const existing = s.plans.findIndex(p => p.id === plan.id);
    if (existing >= 0) s.plans[existing] = plan; else s.plans.unshift(plan);
  });
}
export function deletePlan(id) { update(s => { s.plans = s.plans.filter(p => p.id !== id); }); }
export const uid = (p = 'id') => p + '-' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
