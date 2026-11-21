// Sharing: compact links that open straight into the app, native share sheet, and image cards.
import { CONFIG } from './config.js';
import { getMeal, get } from './store.js';
import { planTotals } from './planner.js';
import { AISLES } from './data.js';

const money = n => '$' + (Math.round(n * 100) / 100).toFixed(2);
const base = () => (CONFIG.SITE_URL && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1' ? CONFIG.SITE_URL : location.origin + location.pathname.replace(/index\.html$/, '').replace(/\/$/, '')) + '/';

// ---------- compact encoding (deflate + base64url when supported) ----------
const b64u = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

async function pipe(bytes, Stream, mode) {
  const s = new Blob([bytes]).stream().pipeThrough(new Stream(mode));
  return new Uint8Array(await new Response(s).arrayBuffer());
}
export async function encode(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  if ('CompressionStream' in window) {
    try { return 'z' + b64u(await pipe(bytes, CompressionStream, 'deflate-raw')); } catch (e) { /* fall through */ }
  }
  return 'j' + b64u(bytes);
}
export async function decode(str) {
  const kind = str[0], bytes = unb64u(str.slice(1));
  const out = kind === 'z' ? await pipe(bytes, DecompressionStream, 'deflate-raw') : bytes;
  return JSON.parse(new TextDecoder().decode(out));
}

// strip a meal to what a recipient needs
const slim = m => ({ restaurant: m.restaurant, item: m.item, emoji: m.emoji, category: m.category, restaurantPrice: m.restaurantPrice,
  homePrice: m.homePrice, restaurantCal: m.restaurantCal, homeCal: m.homeCal, protein: m.protein, minutes: m.minutes, score: m.score,
  diets: m.diets, tags: m.tags, ingredients: m.ingredients, steps: m.steps, swaps: m.swaps });

export async function mealLink(meal) {
  if (!meal.id.startsWith('ai-')) return `${base()}#/meal/${meal.id}`;
  return `${base()}#/m/${await encode(slim(meal))}`;
}

// WAYOF health app: opens the meal in WAYOF (Nourish → Copycat) ready to log
export async function wayofLink(meal) {
  return `${(CONFIG.WAYOF_URL || 'https://thewayof.health').replace(/\/$/, '')}/#import=repli:${await encode(slim(meal))}`;
}

export async function planLink(plan) {
  const custom = {};
  for (const d of plan.days) for (const s of d.meals) if (s.id.startsWith('ai-')) { const m = getMeal(s.id); if (m) custom[s.id] = slim(m); }
  const payload = { n: plan.name, s: plan.summary, p: plan.prefs, d: plan.days.map(d => d.meals.map(s => [s.id, s.slot === 'lunch' ? 1 : 0, s.swap || 0])), c: custom };
  return `${base()}#/p/${await encode(payload)}`;
}

// ---------- native share with graceful fallbacks ----------
export async function shareOut({ title, text, url, file }) {
  const data = { title, text, url };
  if (file && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ ...data, files: [file] }); return 'shared'; } catch (e) { if (e.name === 'AbortError') return 'cancelled'; }
  }
  if (navigator.share) {
    try { await navigator.share(data); return 'shared'; } catch (e) { if (e.name === 'AbortError') return 'cancelled'; }
  }
  try { await navigator.clipboard.writeText([text, url].filter(Boolean).join('\n')); return 'copied'; }
  catch (e) { prompt('Copy this link', url || text); return 'copied'; }
}

export function planText(plan) {
  const t = planTotals(plan);
  const lines = plan.days.map(d => `${d.day}: ` + d.meals.map(s => { const m = getMeal(s.id); return m ? `${m.item}${s.swap ? ` (${s.swap.toLowerCase()})` : ''}` : ''; }).join(' + '));
  return `${plan.name} — ${money(t.home)} at home vs ${money(t.out)} eating out (keep ${money(t.keep)}).\n\n${lines.join('\n')}`;
}

export function listText() {
  const items = Object.values(get().list).filter(i => !i.checked);
  const groups = {};
  for (const it of items) (groups[it.aisle] ||= []).push(it);
  return Object.entries(groups).map(([a, arr]) => `${AISLES[a] || a}\n` + arr.map(i => `☐ ${i.name} — ${i.parts.map(p => p.qty + (p.times > 1 ? ` ×${p.times}` : '')).join(', ')}`).join('\n')).join('\n\n');
}

// ---------- image card (1080×1350) of the kitchen ticket ----------
export async function ticketCard(meal) {
  await document.fonts?.ready;
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#1E5B43'; g.fillRect(0, 0, W, H);
  // rail
  g.fillStyle = '#174634'; g.fillRect(0, 120, W, 34);
  // paper with torn teeth
  const x = 130, y = 150, w = 820, h = 1000, t = 20;
  g.save(); g.translate(W / 2, H / 2); g.rotate(-0.02); g.translate(-W / 2, -H / 2);
  g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 40; g.shadowOffsetY = 16;
  g.beginPath(); g.moveTo(x, y);
  for (let i = 0; i < w; i += t * 2) { g.lineTo(x + i + t, y + t); g.lineTo(x + i + t * 2, y); }
  g.lineTo(x + w, y + h);
  for (let i = w; i > 0; i -= t * 2) { g.lineTo(x + i - t, y + h - t); g.lineTo(x + i - t * 2, y + h); }
  g.closePath(); g.fillStyle = '#FFFEFB'; g.fill(); g.restore();
  g.save(); g.translate(W / 2, H / 2); g.rotate(-0.02); g.translate(-W / 2, -H / 2);
  const ink = '#1D1B16', soft = '#6B6455', mono = '"JetBrains Mono", monospace', disp = '"Bricolage Grotesque", sans-serif';
  g.fillStyle = soft; g.font = `500 30px ${mono}`;
  g.fillText('REPLIPLATE', x + 60, y + 100); g.textAlign = 'right'; g.fillText(`CLONE ${meal.score}%`, x + w - 60, y + 100); g.textAlign = 'left';
  g.font = `110px serif`; g.fillText(meal.emoji, x + 60, y + 260);
  g.fillStyle = ink; g.font = `800 76px ${disp}`;
  wrap(g, meal.item, x + 60, y + 360, w - 120, 78, 2);
  g.fillStyle = soft; g.font = `500 32px ${mono}`; g.fillText(`${meal.restaurant}-style`, x + 60, y + 530);
  dashed(g, x + 60, y + 580, w - 120);
  const line = (label, val, yy, strike) => {
    g.font = `500 36px ${mono}`; g.fillStyle = ink; g.textAlign = 'left'; g.fillText(label, x + 60, yy);
    g.textAlign = 'right'; g.fillStyle = strike ? soft : ink; g.fillText(val, x + w - 60, yy);
    if (strike) { const tw = g.measureText(val).width; g.strokeStyle = '#C8321F'; g.lineWidth = 5; g.beginPath(); g.moveTo(x + w - 60 - tw, yy - 12); g.lineTo(x + w - 60, yy - 12); g.stroke(); }
    g.textAlign = 'left';
  };
  line('At the restaurant', money(meal.restaurantPrice), y + 660, true);
  line('Made at home', money(meal.homePrice), y + 720);
  line('Calories', `${meal.homeCal} vs ${meal.restaurantCal}`, y + 780);
  dashed(g, x + 60, y + 830, w - 120);
  g.font = `500 34px ${mono}`; g.fillStyle = soft; g.fillText('YOU KEEP', x + 60, y + 930);
  g.textAlign = 'right'; g.fillStyle = '#1E5B43'; g.font = `800 130px ${disp}`; g.fillText(money(meal.restaurantPrice - meal.homePrice), x + w - 60, y + 940);
  g.restore();
  g.textAlign = 'center'; g.fillStyle = '#F4B71E'; g.font = `700 38px ${disp}`; g.fillText('Make it at home with RepliPlate', W / 2, H - 70);
  const blob = await new Promise(r => c.toBlob(r, 'image/png'));
  return new File([blob], `${meal.id}.png`, { type: 'image/png' });
}
function dashed(g, x, y, w) { g.save(); g.setLineDash([14, 10]); g.strokeStyle = '#CFC8B8'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.stroke(); g.restore(); }
function wrap(g, text, x, y, maxW, lh, maxLines) {
  const words = text.split(' '); let line = '', n = 0;
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (g.measureText(test).width > maxW && line) { g.fillText(line, x, y + n * lh); line = w; if (++n >= maxLines - 1) { /* last line */ } }
    else line = test;
  }
  g.fillText(line, x, y + n * lh);
}
