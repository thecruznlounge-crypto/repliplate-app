import { MEALS, CATEGORIES, AISLES } from './data.js';
import * as S from './store.js';
import { planWeek, cloneFromText, cloneFromPhoto, OfflineError, normalizeMeal } from './ai.js';
import { planTotals, rerollSlot } from './planner.js';
import { mealLink, planLink, shareOut, planText, listText, ticketCard, decode, wayofLink } from './share.js';
import { install, installState, onInstallChange, shouldNudge, snooze, isIOS } from './install.js';
import { CONFIG } from './config.js';

const VERSION = '2.0.1';
const $ = (s, el = document) => el.querySelector(s);
const view = $('#view');
const money = n => '$' + (Math.round(n * 100) / 100).toFixed(2);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pct = m => Math.round((1 - m.homePrice / m.restaurantPrice) * 100);

const ui = { q: '', cat: 'All', tab: 'recipe', busy: false };

// ---------- icons ----------
const I = {
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4.5L5.5 21V4.5a1 1 0 0 1 1-1Z"/></svg>',
  saved: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4.5L5.5 21V4.5a1 1 0 0 1 1-1Z"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h2l1.6 9.2a2 2 0 0 0 2 1.8h7.2a2 2 0 0 0 2-1.6L20 10H7"/><path d="M12 3v4M10 5h4"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7Z"/><path d="M19 16c.2 1.6 1 2.3 2.5 2.5-1.6.2-2.3 1-2.5 2.5-.2-1.6-1-2.3-2.5-2.5 1.6-.2 2.3-1 2.5-2.5Z"/></svg>',
  dice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 8 12l7 7"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/></svg>',
  ios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></svg>',
};

// ---------- small UI helpers ----------
let toastTimer;
function toast(msg, action) {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status');
  t.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button">${esc(action.label)}</button>` : ''}`;
  if (action) t.querySelector('button').onclick = () => { t.remove(); action.run(); };
  document.body.append(t);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), action ? 8000 : 3200);
}
function sheet(html, onMount) {
  closeSheet();
  const s = document.createElement('div');
  s.className = 'scrim'; s.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  s.addEventListener('click', e => { if (e.target === s || e.target.closest('[data-close]')) closeSheet(); });
  document.body.append(s);
  onMount?.(s.firstElementChild);
  s.querySelector('button, a, input')?.focus();
  return s;
}
function closeSheet() { document.querySelector('.scrim')?.remove(); }
addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

function busy(label) {
  return sheet(`<div class="thinking"><i></i><span>${esc(label)}</span></div><p>This usually takes 10–30 seconds.</p>`);
}
const shareResult = r => { if (r === 'copied') toast('Link copied'); else if (r === 'shared') toast('Shared'); };

// ---------- ticket ----------
function ticket(m, { tilt = false, order = '' } = {}) {
  const keep = m.restaurantPrice - m.homePrice;
  return `<div class="ticket-wrap"><div class="ticket ${tilt ? 'tilt' : ''}">
    <div class="t-meta"><span>${order || 'Order #' + String(Math.abs(hash(m.id)) % 9000 + 1000)}</span><span>Clone match ${m.score}%</span></div>
    <span class="t-stamp">−${pct(m)}%</span>
    <div class="t-dish"><span class="t-emoji" aria-hidden="true">${esc(m.emoji)}</span>
      <div><div class="t-name">${esc(m.item)}</div><div class="t-rest">${esc(m.restaurant)}-style</div></div></div>
    <hr>
    <div class="t-line strike"><span>At the restaurant</span><b>${money(m.restaurantPrice)}</b></div>
    <div class="t-line"><span>Made at home</span><b>${money(m.homePrice)}</b></div>
    <div class="t-line"><span>Calories</span><b>${m.homeCal} vs ${m.restaurantCal}</b></div>
    <hr>
    <div class="t-total"><span>You keep</span><b>${money(keep)}</b></div>
  </div></div>`;
}
function hash(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return h; }

const row = m => `<a class="meal-row" href="#/meal/${esc(m.id)}">
  <span class="plate" aria-hidden="true">${esc(m.emoji)}</span>
  <span><b>${esc(m.item)}</b><small>${esc(m.restaurant)}-style · ${m.minutes} min</small></span>
  <span class="keep">Keep ${money(m.restaurantPrice - m.homePrice)}</span></a>`;

// ---------- views ----------
function installCard() {
  if (!shouldNudge()) return '';
  const ios = installState() === 'ios';
  return `<div class="install-card" id="installCard">
    <img src="assets/icons/icon-192.png" alt="">
    <div><b>Put RepliPlate on your home screen</b><p>Opens instantly and works offline in the kitchen.</p></div>
    <button class="btn block" type="button" data-install>${ios ? 'Show me how' : 'Install app'}</button>
  </div>`;
}

function discover() {
  const all = [...MEALS, ...Object.values(S.get().custom)];
  const featured = MEALS[Math.floor(Date.now() / 864e5) % (MEALS.length - 1)];
  const q = ui.q.trim().toLowerCase();
  let items = all;
  if (ui.cat === 'Plant-based') items = items.filter(m => (m.diets || []).includes('vegan') || (m.tags || []).includes('plant-based'));
  else if (ui.cat !== 'All') items = items.filter(m => m.category === ui.cat);
  if (q) items = items.filter(m => `${m.restaurant} ${m.item} ${m.category} ${(m.tags || []).join(' ')}`.toLowerCase().includes(q) ||
    q.split(/\s+/).every(w => `${m.restaurant} ${m.item}`.toLowerCase().includes(w)));
  const chips = ['All', ...CATEGORIES, 'Plant-based'];
  return `<div class="view split">
    <section class="sticky-col">
      <h1 class="display">What are you craving?</h1>
      <p class="lede">Name a menu item or snap a photo of the plate. RepliPlate shows you how to make it at home, and what you keep.</p>
      <form class="search" id="searchForm" role="search">
        ${I.search}
        <input id="q" type="search" enterkeyhint="search" autocomplete="off" placeholder="Big Mac, orange chicken…" value="${esc(ui.q)}" aria-label="Search clones">
        <button class="scan" type="button" data-scan aria-label="Clone from a photo">${I.camera}<span>Photo</span></button>
      </form>
      ${installCard()}
      <div class="ticket-rail"><a href="#/meal/${featured.id}" style="color:inherit;text-decoration:none" aria-label="Today's pick: ${esc(featured.item)}">${ticket(featured, { tilt: true, order: "Today's pick" })}</a></div>
    </section>
    <section>
      <div class="chips" role="group" aria-label="Filter by category">${chips.map(c => `<button class="chip" type="button" data-cat="${c}" aria-pressed="${ui.cat === c}">${c}</button>`).join('')}</div>
      ${q && !items.some(m => m.item.toLowerCase().includes(q)) ? `<button class="btn ghost block" type="button" data-aiclone>${I.spark}Clone “${esc(ui.q.trim())}” with AI</button>` : ''}
      ${items.length ? `<div class="list">${items.map(row).join('')}</div>` :
        `<div class="empty"><h3>No clones match “${esc(ui.q)}” yet</h3><p>Ask the AI to build this one from scratch. It works out ingredients, steps, and what it costs to make.</p></div>`}
    </section>
  </div>`;
}

function detail(id) {
  const m = S.getMeal(id);
  if (!m) return `<div class="view"><div class="empty"><h3>This clone isn't on this device</h3><p>It may have been removed. Find another one to make.</p><a class="btn" href="#/discover">Browse clones</a></div></div>`;
  const saved = S.isSaved(id);
  const tab = ui.tab;
  const servings = S.get().prefs.household;
  const body = tab === 'recipe'
    ? `<ol class="steps">${m.steps.map(s => `<li><p>${esc(s)}</p></li>`).join('')}</ol>`
    : tab === 'ingredients'
      ? `<div>${m.ingredients.map(x => `<div class="ing"><span>${esc(x.name)}<br><small>${esc(x.qty)}</small></span><span class="cost">${money(x.cost)}</span></div>`).join('')}</div>
         <button class="btn block" type="button" data-addlist>${I.cart}Add for ${servings} to grocery list</button>`
      : (m.swaps.length ? m.swaps.map(([a, b]) => `<div class="swap"><b>${esc(a)}</b><p>${esc(b)}</p></div>`).join('') : '<p class="muted">No swaps for this one yet.</p>');
  return `<div class="view split">
    <section class="sticky-col">
      <a class="link row" href="#/discover" style="gap:4px;width:max-content"><span style="width:20px">${I.back}</span>All clones</a>
      ${ticket(m)}
      <div class="detail-actions">
        <button class="btn ghost small" type="button" data-save aria-pressed="${saved}">${saved ? I.saved : I.save}${saved ? 'Saved' : 'Save'}</button>
        <button class="btn ghost small" type="button" data-share>${I.share}Share</button>
        <button class="btn small" type="button" data-addlist>${I.cart}List</button>
        ${CONFIG.WAYOF_URL ? `<button class="btn ghost small" type="button" data-wayof title="Log this meal's calories and protein in WAYOF">${I.heart}Log in WAYOF</button>` : ''}
      </div>
    </section>
    <section>
      <div class="facts">
        <div class="fact"><small>Protein</small><b>${m.protein} g</b></div>
        <div class="fact"><small>Time</small><b>${m.minutes} min</b></div>
        <div class="fact"><small>Per serving</small><b>${money(m.homePrice)}</b></div>
      </div>
      ${m.source ? `<div class="ai-note"><span>${m.source === 'photo' ? 'Cloned by AI from your photo.' : 'Cloned by AI.'} Check allergens and cooking temperatures.</span><button class="link" type="button" data-report>Report this result</button></div>` : ''}
      <div class="tabs" role="tablist">
        ${[['recipe', 'Recipe'], ['ingredients', 'Ingredients'], ['swaps', 'Swaps']].map(([k, l]) => `<button role="tab" type="button" data-tab="${k}" aria-selected="${tab === k}">${l}</button>`).join('')}
      </div>
      <div role="tabpanel" style="display:grid;gap:12px">${body}</div>
    </section>
  </div>`;
}

function seg(name, value, options) {
  return `<div class="seg" role="group" data-pref="${name}">${options.map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${String(value) === String(v)}">${l}</button>`).join('')}</div>`;
}

function planView() {
  const p = S.get().prefs;
  const plan = S.get().draftPlan;
  const form = `<form class="card" id="planForm">
    <label class="field"><span>How many days?</span>${seg('days', p.days, [[3, '3 days'], [5, '5 days'], [7, '7 days']])}</label>
    <label class="field"><span>Which meals?</span>${seg('slots', p.slots, [['dinner', 'Dinners'], ['both', 'Lunch + dinner']])}</label>
    <div class="field"><span>Who's eating?</span>
      <div class="stepper"><button type="button" data-step="-1" aria-label="Fewer people">−</button><output id="hh">${p.household} ${p.household === 1 ? 'person' : 'people'}</output><button type="button" data-step="1" aria-label="More people">+</button></div></div>
    <label class="field"><span>Diet</span>${seg('diet', p.diet, [['any', 'Anything'], ['vegetarian', 'Vegetarian'], ['vegan', 'Vegan']])}</label>
    <label class="field"><span>Goal</span>${seg('goal', p.goal, [['save', 'Savings'], ['lighter', 'Lighter'], ['protein', 'Protein'], ['quick', 'Quick']])}</label>
    <label class="field"><span>Weekly grocery budget <small id="budgetOut">${money(p.budget)}</small></span>
      <input type="range" id="budget" min="30" max="300" step="5" value="${p.budget}" aria-label="Weekly grocery budget"></label>
    <label class="field"><span>Anything else? <small>optional</small></span>
      <textarea id="notes" rows="2" maxlength="300" placeholder="No seafood, kid-friendly, leftovers for lunch…">${esc(p.notes)}</textarea></label>
    <button class="btn mustard block" type="submit">${I.spark}${plan ? 'Build a new plan' : 'Build my plan'}</button>
    ${!navigator.onLine ? '<p class="muted" style="margin:0;font-size:.9rem">You’re offline. Plans will be built on your device from the clone library.</p>' : ''}
  </form>`;
  return `<div class="view split">
    <section class="sticky-col">
      <h1 class="display">Plan the week</h1>
      <p class="lede">Tell the AI who's eating and what matters. It picks restaurant favorites that fit, totals the savings, and builds one grocery list.</p>
      ${form}
    </section>
    <section id="planOut">${plan ? planResult(plan) : `<div class="empty"><h3>No plan yet</h3><p>Set your options and build a plan. You can swap any meal, then share it with whoever's cooking.</p></div>`}</section>
  </div>`;
}

function planResult(plan) {
  const t = planTotals(plan);
  const isSaved = S.get().plans.some(p => p.id === plan.id);
  return `
    ${plan.shared ? `<div class="install-card" style="grid-template-columns:1fr"><div><b>Someone shared this plan with you</b><p>Save it to keep it on this device, or add the week to your grocery list.</p></div></div>` : ''}
    ${plan.fallback ? `<p class="muted" style="margin:0">${esc(plan.fallback)}</p>` : ''}
    <div class="ticket-wrap week-ticket"><div class="ticket">
      <div class="t-meta"><span>${plan.source === 'ai' ? 'AI plan' : plan.shared ? 'Shared plan' : 'Device plan'}</span><span>${t.count} meals · for ${plan.prefs.household}</span></div>
      <div class="t-dish"><div><div class="t-name">${esc(plan.name)}</div>${plan.summary ? `<div class="t-rest" style="margin-top:6px">${esc(plan.summary)}</div>` : ''}</div></div>
      <hr>
      <div class="t-line strike"><span>Eating out</span><b>${money(t.out)}</b></div>
      <div class="t-line"><span>Cooking at home</span><b>${money(t.home)}</b></div>
      <div class="t-line"><span>Avg per plate</span><b>${t.avgCal} cal</b></div>
      <hr>
      <div class="t-total"><span>You keep</span><b>${money(t.keep)}</b></div>
    </div></div>
    <div class="detail-actions">
      <button class="btn ghost small" type="button" data-saveplan ${isSaved ? 'disabled' : ''}>${isSaved ? I.saved + 'Saved' : I.save + 'Save'}</button>
      <button class="btn ghost small" type="button" data-shareplan>${I.share}Share</button>
      <button class="btn small" type="button" data-planlist>${I.cart}List</button>
    </div>
    <div class="days">${plan.days.map((d, di) => `<div class="day"><span class="dname">${d.day}</span><div class="slots">${d.meals.map((s, si) => {
      const m = S.getMeal(s.id); if (!m) return '';
      return `<div class="slot"><span class="plate" aria-hidden="true">${esc(m.emoji)}</span>
        <a class="open" href="#/meal/${esc(m.id)}" style="text-decoration:none"><b>${esc(m.item)}${s.swap ? `<span class="tag">${esc(s.swap)}</span>` : ''}</b>
        <small>${plan.prefs.slots === 'both' ? (s.slot === 'lunch' ? 'Lunch · ' : 'Dinner · ') : ''}${esc(m.restaurant)}-style · ${money(m.homePrice * plan.prefs.household)}</small>
        ${s.note ? `<small style="display:block">${esc(s.note)}</small>` : ''}</a>
        <button class="icon-btn" type="button" data-reroll="${di}:${si}" aria-label="Swap ${esc(m.item)} for another meal">${I.dice}</button></div>`;
    }).join('')}</div></div>`).join('')}</div>
    ${plan.tips?.length ? `<div class="swap"><b>Cook-ahead tips</b>${plan.tips.map(t => `<p>${esc(t)}</p>`).join('')}</div>` : ''}
    ${plan.source === 'ai' ? `<div class="ai-note"><span>Made by AI. Check allergens before cooking.</span><button class="link" type="button" data-reportplan>Report this result</button></div>` : ''}`;
}

function listView() {
  const items = Object.entries(S.get().list);
  if (!items.length) return `<div class="view"><section>
    <h1 class="display">Grocery list</h1>
    <div class="empty"><h3>Your list is empty</h3><p>Add a clone's ingredients, or send a whole week from your plan. Items with the same name are combined.</p>
    <div class="row"><a class="btn" href="#/plan">Plan my week</a><a class="btn ghost" href="#/discover">Browse clones</a></div></div></section></div>`;
  const done = items.filter(([, i]) => i.checked).length;
  const total = items.reduce((a, [, i]) => a + i.cost, 0);
  const groups = {};
  for (const [k, it] of items.sort((a, b) => a[1].checked - b[1].checked)) (groups[it.aisle] ||= []).push([k, it]);
  const order = Object.keys(AISLES);
  return `<div class="view"><section>
    <div class="sec-head"><h1 class="display">Grocery list</h1></div>
    <div class="row between"><span class="muted">${done} of ${items.length} in the cart · about ${money(total)}</span></div>
    <div class="progress" aria-hidden="true"><i style="width:${(done / items.length) * 100}%"></i></div>
    <div class="row"><button class="btn ghost small" type="button" data-sharelist>${I.share}Share</button>
      <button class="btn ghost small" type="button" data-clearchecked ${done ? '' : 'disabled'}>Remove done</button>
      <button class="btn ghost small" type="button" data-clearall aria-label="Clear list">${I.trash}</button></div>
  </section>
  ${order.filter(a => groups[a]).map(a => `<section class="aisle"><h3>${AISLES[a]}</h3><div class="list">${groups[a].map(([k, it]) => `
    <label class="g-item ${it.checked ? 'done' : ''}"><input type="checkbox" data-item="${esc(k)}" ${it.checked ? 'checked' : ''}>
      <span>${esc(it.name)}<small>${esc(it.parts.map(p => p.qty + (p.times > 1 ? ` ×${p.times}` : '')).join(', '))}</small></span>
      <span class="cost">${money(it.cost)}</span></label>`).join('')}</div></section>`).join('')}
  </div>`;
}

function savedView() {
  const st = S.get();
  const saved = st.saved.map(S.getMeal).filter(Boolean);
  const mine = Object.values(st.custom).sort((a, b) => (b.created || 0) - (a.created || 0));
  const theme = document.documentElement.dataset.theme || 'system';
  const inst = installState();
  return `<div class="view split">
    <section>
      <h1 class="display">Saved</h1>
      <h2>Clones</h2>
      ${saved.length ? `<div class="list">${saved.map(row).join('')}</div>` : `<div class="empty"><p>Tap Save on any clone to keep it here, ready offline.</p></div>`}
      <h2 style="margin-top:12px">Plans</h2>
      ${st.plans.length ? `<div class="list">${st.plans.map(p => { const t = planTotals(p); return `<div class="meal-row" style="grid-template-columns:1fr auto auto">
        <button class="open" type="button" data-openplan="${p.id}" style="border:0;background:none;text-align:left;padding:0"><b>${esc(p.name)}</b><small>${t.count} meals · keep ${money(t.keep)} · ${new Date(p.created).toLocaleDateString()}</small></button>
        <button class="icon-btn" type="button" data-shareplanid="${p.id}" aria-label="Share ${esc(p.name)}">${I.share}</button>
        <button class="icon-btn" type="button" data-delplan="${p.id}" aria-label="Delete ${esc(p.name)}">${I.trash}</button></div>`; }).join('')}</div>` : `<div class="empty"><p>Plans you save show up here.</p><a class="btn small" href="#/plan">Plan my week</a></div>`}
      ${mine.length ? `<h2 style="margin-top:12px">Your AI clones</h2><div class="list">${mine.map(row).join('')}</div>` : ''}
    </section>
    <section>
      <h2>Settings</h2>
      <div class="settings">
        <div><span>Appearance</span>${seg('theme', theme, [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']])}</div>
        <div><span>App</span>${inst === 'installed' ? '<span class="muted">Installed</span>' : `<button class="btn small" type="button" data-install>${inst === 'ios' ? 'How to install' : 'Install app'}</button>`}</div>
        <div><span>Your data</span><span class="muted" style="text-align:right">Stored on this device only</span></div>
      </div>
      <p class="footer-note">RepliPlate ${VERSION} · <a href="privacy.html">Privacy</a> · <a href="mailto:${CONFIG.SUPPORT_EMAIL}">Contact</a><br>Not affiliated with any restaurant named. Prices and calories are estimates.</p>
    </section>
  </div>`;
}

// ---------- router ----------
async function route() {
  const [, name = 'discover', arg = ''] = (location.hash || '#/discover').split('/');
  closeSheet();
  if (name === 'p' && arg) return importPlan(arg);
  if (name === 'm' && arg) return importMeal(arg);
  if (name !== 'meal') ui.tab = 'recipe';
  const html = name === 'meal' ? detail(decodeURIComponent(arg)) : name === 'plan' ? planView() : name === 'list' ? listView() : name === 'saved' ? savedView() : discover();
  view.innerHTML = html;
  view.dataset.route = name; view.dataset.id = arg;
  document.querySelectorAll('.nav a').forEach(a => { if (a.dataset.tab === (name === 'meal' ? 'discover' : name)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  badge();
}
function rerender() {
  const y = scrollY; const focus = document.activeElement?.id;
  route().then(() => { scrollTo(0, y); if (focus) { const el = document.getElementById(focus); if (el) { el.focus(); if (el.setSelectionRange && el.value) el.setSelectionRange(el.value.length, el.value.length); } } });
}
const go = h => { if (location.hash === h) rerender(); else { location.hash = h; scrollTo(0, 0); } };

async function importPlan(data) {
  try {
    const p = await decode(data);
    const map = {};
    for (const [oldId, meal] of Object.entries(p.c || {})) map[oldId] = findOrAdd(meal).id;
    const plan = {
      id: S.uid('plan'), source: 'shared', shared: true, created: Date.now(), name: String(p.n || 'Shared plan').slice(0, 60), summary: String(p.s || '').slice(0, 300),
      prefs: { ...S.get().prefs, ...(p.p || {}) },
      days: (p.d || []).slice(0, 7).map((meals, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], meals: meals.map(([id, l, w]) => ({ id: map[id] || id, slot: l ? 'lunch' : 'dinner', swap: w || null })).filter(s => S.getMeal(s.id)) })),
      tips: [],
    };
    S.update(s => { s.draftPlan = plan; });
    history.replaceState(null, '', '#/plan'); route();
  } catch (e) { toast("That plan link is incomplete. Ask the sender to share it again."); history.replaceState(null, '', '#/plan'); route(); }
}
function findOrAdd(raw) {
  const ex = Object.values(S.get().custom).find(c => c.item === raw.item && c.restaurant === raw.restaurant);
  return ex || S.addCustom({ ...normalizeMeal(raw, 'ai') });
}
async function importMeal(data) {
  try { const m = findOrAdd(await decode(data)); history.replaceState(null, '', '#/meal/' + m.id); route(); }
  catch (e) { toast("That clone link is incomplete."); history.replaceState(null, '', '#/discover'); route(); }
}

function badge() {
  const n = S.listCount(), b = $('#listBadge');
  b.hidden = !n; b.textContent = n > 99 ? '99+' : n;
}

// ---------- actions ----------
async function runAIClone(fn, label) {
  if (!navigator.onLine) { toast('AI cloning needs a connection. Your saved clones still work offline.'); return; }
  busy(label);
  try { const m = await fn(); closeSheet(); go('#/meal/' + m.id); toast('Clone ready'); }
  catch (e) { closeSheet(); toast(e instanceof OfflineError ? "Can't reach the AI right now. Check your connection and try again." : e.message); }
}

async function buildPlan() {
  const out = $('#planOut');
  out.innerHTML = `<div class="thinking"><i></i><span>${navigator.onLine ? 'Planning your week…' : 'Building your plan on this device…'}</span></div>`;
  if (innerWidth < 960) out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const plan = await planWeek({ ...S.get().prefs });
  S.update(s => { s.draftPlan = plan; });
  rerender();
  if (innerWidth < 960) setTimeout(() => $('#planOut')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

function report(subject, body) {
  location.href = `mailto:${CONFIG.SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + '\n\nWhat was wrong with it?\n')}`;
}

function iosSheet() {
  sheet(`<h2>Add RepliPlate to your home screen</h2>
    <ol class="ios-steps"><li>Tap the Share button ${I.ios} in Safari's toolbar.</li><li>Scroll and tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>. RepliPlate opens full-screen and works offline.</li></ol>
    <button class="btn block" type="button" data-close>Got it</button>`);
}

async function doInstall() {
  const r = await install();
  if (r === 'ios') iosSheet();
  else if (r === 'accepted') toast('Installing RepliPlate');
  else if (r === 'unavailable') toast('Use your browser menu and choose “Install app” or “Add to Home screen”.');
  rerender();
}

document.addEventListener('click', async e => {
  const t = e.target.closest('button, [data-cat]'); if (!t) return;
  const d = t.dataset;
  const id = view.dataset.route === 'meal' ? decodeURIComponent(view.dataset.id) : null;
  const meal = id && S.getMeal(id);

  if ('scan' in d) return $('#photoInput').click();
  if ('install' in d) return doInstall();
  if (d.cat) { ui.cat = d.cat; return rerender(); }
  if ('aiclone' in d) return runAIClone(() => cloneFromText(ui.q.trim()), `Cloning “${ui.q.trim()}”…`);
  if (d.tab && view.dataset.route === 'meal') { ui.tab = d.tab; return rerender(); }
  if ('save' in d && meal) { const now = S.toggleSaved(meal.id); toast(now ? 'Saved to this device' : 'Removed from saved'); return rerender(); }
  if ('addlist' in d && meal) {
    const n = S.get().prefs.household; S.addMealToList(meal, n);
    return toast(`Added ${meal.ingredients.length} items for ${n}`, { label: 'View list', run: () => go('#/list') });
  }
  if ('share' in d && meal) {
    const url = await mealLink(meal);
    const file = await ticketCard(meal).catch(() => null);
    return shareResult(await shareOut({ title: `${meal.item} at home`, text: `${meal.restaurant}-style ${meal.item}: ${money(meal.homePrice)} at home vs ${money(meal.restaurantPrice)} out.`, url, file }));
  }
  if ('wayof' in d && meal) { window.open(await wayofLink(meal), '_blank', 'noopener'); return; }
  if ('report' in d && meal) return report(`Report AI clone: ${meal.item}`, JSON.stringify({ item: meal.item, restaurant: meal.restaurant, steps: meal.steps }, null, 1));

  // planner form
  const segEl = t.closest('.seg');
  if (segEl && d.v) {
    const key = segEl.dataset.pref;
    if (key === 'theme') {
      try { d.v === 'system' ? localStorage.removeItem('rp.theme') : localStorage.setItem('rp.theme', d.v); } catch (err) {}
      if (d.v === 'system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = d.v;
      return rerender();
    }
    S.update(s => { s.prefs[key] = key === 'days' ? +d.v : d.v; });
    segEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === t));
    return;
  }
  if (d.step) {
    S.update(s => { s.prefs.household = Math.min(10, Math.max(1, s.prefs.household + +d.step)); });
    const n = S.get().prefs.household; $('#hh').textContent = `${n} ${n === 1 ? 'person' : 'people'}`; return;
  }
  const plan = S.get().draftPlan;
  if (d.reroll && plan) { const [a, b] = d.reroll.split(':').map(Number); S.update(s => { rerollSlot(s.draftPlan, a, b); }); return rerender(); }
  if ('saveplan' in d && plan) { S.savePlan({ ...plan, shared: false }); S.update(s => { s.draftPlan.shared = false; }); toast('Plan saved'); return rerender(); }
  if ('planlist' in d && plan) {
    for (const day of plan.days) for (const s of day.meals) { const m = S.getMeal(s.id); if (m) S.addMealToList(m, plan.prefs.household); }
    badge(); return toast('Week added to your grocery list', { label: 'View list', run: () => go('#/list') });
  }
  if ('shareplan' in d && plan) return shareResult(await shareOut({ title: plan.name, text: planText(plan), url: await planLink(plan) }));
  if ('reportplan' in d && plan) return report(`Report AI plan: ${plan.name}`, planText(plan));
  if (d.openplan) { const p = S.get().plans.find(x => x.id === d.openplan); S.update(s => { s.draftPlan = p; }); return go('#/plan'); }
  if (d.shareplanid) { const p = S.get().plans.find(x => x.id === d.shareplanid); return shareResult(await shareOut({ title: p.name, text: planText(p), url: await planLink(p) })); }
  if (d.delplan) { const p = S.get().plans.find(x => x.id === d.delplan); S.deletePlan(d.delplan); rerender(); return toast('Plan deleted', { label: 'Undo', run: () => { S.savePlan(p); rerender(); } }); }

  // list
  if ('sharelist' in d) return shareResult(await shareOut({ title: 'Grocery list', text: listText() }));
  if ('clearchecked' in d) { S.clearChecked(); return rerender(); }
  if ('clearall' in d) { const prev = structuredClone(S.get().list); S.clearList(); rerender(); return toast('List cleared', { label: 'Undo', run: () => { S.update(s => { s.list = prev; }); rerender(); } }); }
});

document.addEventListener('change', e => {
  if (e.target.matches('[data-item]')) { S.toggleItem(e.target.dataset.item); rerender(); }
  if (e.target.id === 'photoInput' && e.target.files[0]) { const f = e.target.files[0]; e.target.value = ''; runAIClone(() => cloneFromPhoto(f), 'Reading your photo…'); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'q') { ui.q = e.target.value; clearTimeout(ui.qt); ui.qt = setTimeout(rerender, 120); }
  if (e.target.id === 'budget') { S.update(s => { s.prefs.budget = +e.target.value; }); $('#budgetOut').textContent = money(+e.target.value); }
  if (e.target.id === 'notes') S.update(s => { s.prefs.notes = e.target.value.slice(0, 300); });
});
document.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.id === 'planForm') buildPlan();
  if (e.target.id === 'searchForm') $('#q').blur();
});

// ---------- install button in the top bar ----------
const topInstall = $('#installBtn');
function syncInstall() { const s = installState(); topInstall.hidden = !(s === 'ready' || s === 'ios'); }
topInstall.onclick = doInstall;
onInstallChange(() => { syncInstall(); if (view.dataset.route === 'discover' || view.dataset.route === 'saved') rerender(); });
syncInstall();
document.addEventListener('click', e => { if (e.target.closest('#installCard') && !e.target.closest('[data-install]')) snooze(); });

// ---------- online / offline ----------
function net() { $('#net').hidden = navigator.onLine; }
addEventListener('online', () => { net(); toast('Back online'); });
addEventListener('offline', () => { net(); toast('Offline. Saved clones, plans, and your list still work.'); });
net();

// ---------- incoming shares (Android share sheet → RepliPlate) & shortcuts ----------
const params = new URLSearchParams(location.search);
if (params.has('go')) { location.hash = '#/' + params.get('go').replace(/[^a-z]/g, ''); history.replaceState(null, '', location.pathname + location.hash); }
if (params.has('text') || params.has('title') || params.has('url')) {
  const shared = [params.get('title'), params.get('text')].filter(Boolean).join(' ').replace(/https?:\/\/\S+/g, '').trim().slice(0, 80);
  ui.q = shared; history.replaceState(null, '', location.pathname + '#/discover');
}

// ---------- service worker + update prompt ----------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    const prompt = w => toast('A new version is ready', { label: 'Refresh', run: () => w.postMessage('SKIP_WAITING') });
    if (reg.waiting && navigator.serviceWorker.controller) prompt(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing;
      w?.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) prompt(w); });
    });
    setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
  }).catch(() => {});
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
}
navigator.storage?.persist?.().catch(() => {});

S.onChange(badge);
addEventListener('hashchange', () => { route(); scrollTo(0, 0); });
route();
