/**
 * Accessibility and layout sweep over every public and portal route, in both
 * themes.
 *
 * Checks accessible names, alt text, form labels, duplicate ids, heading
 * order, landmarks and computed contrast — then confirms no page scrolls
 * sideways at 320px, the narrowest phone still in real use.
 */
import { makeReporter, signInAdmin } from '../lib/cdp.mjs'

export const name = 'accessibility'

const PUBLIC_ROUTES = ['/', '/live', '/fixtures', '/bracket', '/results', '/about', '/contact', '/login']
const PORTAL_ROUTES = ['/admin', '/admin/teams', '/admin/fixtures', '/admin/live', '/admin/bracket', '/admin/settings']

const AUDIT = String.raw`(() => {
  const issues = [];
  const add = (type, detail) => issues.push(type + ': ' + detail);

  for (const el of document.querySelectorAll('a, button')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const name = (el.getAttribute('aria-label') || el.textContent || '').trim();
    if (!name) add('no-accessible-name', el.tagName + ' ' + String(el.className).slice(0, 50));
  }

  for (const img of document.querySelectorAll('img')) {
    if (!img.hasAttribute('alt')) add('img-no-alt', img.getAttribute('src') || '?');
  }

  for (const f of document.querySelectorAll('input, select, textarea')) {
    const labelled =
      f.getAttribute('aria-label') ||
      f.getAttribute('aria-labelledby') ||
      (f.id && document.querySelector('label[for="' + CSS.escape(f.id) + '"]')) ||
      f.closest('label');
    if (!labelled) add('control-no-label', f.tagName + '#' + (f.id || '(no id)'));
  }

  const ids = {};
  for (const el of document.querySelectorAll('[id]')) ids[el.id] = (ids[el.id] || 0) + 1;
  for (const [k, v] of Object.entries(ids)) if (v > 1) add('duplicate-id', k + ' x' + v);

  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  const h1s = hs.filter((h) => h.tagName === 'H1');
  if (h1s.length === 0) add('heading', 'no h1');
  if (h1s.length > 1) add('heading', h1s.length + ' h1 elements');
  let prev = 0;
  for (const h of hs) {
    const lvl = Number(h.tagName[1]);
    if (prev && lvl > prev + 1) {
      add('heading-skip', 'h' + prev + ' -> h' + lvl + ' "' + h.textContent.trim().slice(0, 30) + '"');
    }
    prev = lvl;
  }

  if (!document.querySelector('main')) add('landmark', 'no <main>');

  const lum = (c) => {
    const s = c.map((v) => {
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
  };
  const parse = (str) => {
    const m = str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
  };
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0.85) return c.rgb;
      n = n.parentElement;
    }
    const c = parse(getComputedStyle(document.body).backgroundColor);
    return c ? c.rgb : [255, 255, 255];
  };

  const seen = new Set();
  for (const el of document.querySelectorAll('p,span,a,h1,h2,h3,h4,li,td,th,dt,dd,button,label,strong,code')) {
    if (!el.textContent.trim()) continue;
    if ([...el.children].some((c) => c.textContent.trim())) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
    if (cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)') continue;
    const fg = parse(cs.color);
    if (!fg) continue;
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const bg = bgOf(el);
    const ratio = (Math.max(lum(fg.rgb), lum(bg)) + 0.05) / (Math.min(lum(fg.rgb), lum(bg)) + 0.05);
    if (ratio < need) {
      const key = cs.color + '|' + size + '|' + weight;
      if (seen.has(key)) continue;
      seen.add(key);
      add('contrast', ratio.toFixed(2) + ':1 (needs ' + need + ') ' + Math.round(size) + 'px w' + weight +
        ' "' + el.textContent.trim().slice(0, 35) + '"');
    }
  }

  return JSON.stringify(issues);
})()`

const OVERFLOW = `(() => {
  const vw = document.documentElement.clientWidth;
  // documentElement.scrollWidth counts descendants that are clipped by an
  // overflow container, so ask whether the page can actually scroll instead.
  window.scrollTo(500, 0);
  const scrolled = window.scrollX;
  window.scrollTo(0, 0);
  return JSON.stringify({ vw, bodyScrollWidth: document.body.scrollWidth, scrolled });
})()`

export async function run(d) {
  const r = makeReporter('accessibility')

  // Sign in once so the gated routes render their real content.
  await d.viewport(1280, 900)
  await signInAdmin(d)

  for (const theme of ['light', 'dark']) {
    r.section(`Semantics and contrast (${theme})`)
    await d.emulate([{ name: 'prefers-color-scheme', value: theme }])

    for (const route of [...PUBLIC_ROUTES, ...PORTAL_ROUTES]) {
      await d.goto(route, 1100)
      const issues = JSON.parse(await d.evaluate(AUDIT))
      r.check(`${route} (${theme})`, issues.length === 0, issues.slice(0, 4).join('; '))
    }
  }

  await d.emulate([])

  r.section('No horizontal overflow at 320px')
  await d.viewport(320, 700)
  for (const route of [...PUBLIC_ROUTES, ...PORTAL_ROUTES]) {
    await d.goto(route, 1000)
    const { vw, bodyScrollWidth, scrolled } = JSON.parse(await d.evaluate(OVERFLOW))
    r.check(route, scrolled === 0 && bodyScrollWidth <= vw + 1,
      `body ${bodyScrollWidth}px in a ${vw}px viewport`)
  }

  await d.viewport(1280, 900)
  return r.finish()
}
