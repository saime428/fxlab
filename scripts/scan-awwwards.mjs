#!/usr/bin/env node
// 批量扫描 Awwwards 获奖站的设计体系。
//
//   node scripts/scan-awwwards.mjs [页数=4] [并发=6]
//
// 两段:
//   1. 抓 awwwards 列表页,从卡片的 data-collectable-model-value 里取
//      站名/外链/奖项/技术标签(不用逐个进详情页)
//   2. 逐站抓 HTML + 其引用的 CSS,用正则统计设计体系
//
// 为什么正则统计 CSS 而不是开浏览器:浏览器一站两次调用,几十站就爆;
// 而且滚动状态机驱动的站在无头/冻结环境里 DOM 是空的,读样式表规则才稳。
// 代价:取不到 CSS-in-JS 和 JS 注入的样式 —— 结果里的 cssBytes=0 就是这种。

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';

const LIST = process.argv[2] || 'scripts/awwwards-2026-07.txt';
const CONC = +(process.argv[3] || 6);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const CSS_CAP = 8;              // 每站最多抓几个 CSS 文件
const BYTE_CAP = 2_000_000;     // 每站 CSS 总量上限,防超大 bundle 拖死

const get = async (url, ms = 15000) => {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    const r = await fetch(url, { signal: ac.signal, redirect: 'follow', headers: { 'User-Agent': UA, 'Accept-Language': 'en' } });
    return r.ok ? await r.text() : '';
  } catch { return ''; }
  finally { clearTimeout(t); }
};

/* ---------- 1. 列表 ----------
   名单来自浏览器注入(node 直连 awwwards 被 Cloudflare 挡,目标站本身能直连),
   重新取名单的一段脚本见 blends/scans/README 里的"重新取名单" */
const listSites = () => readFileSync(LIST, 'utf8').split(/\r?\n/)
  .filter(l => l.trim() && !l.startsWith('#'))
  .map(l => { const [title, url, award, tags, date] = l.split('|');
              return { title, url, award, tags: (tags || '').split('~').filter(Boolean), date }; });

/* ---------- 2. 单站探测 ---------- */
const tally = (map, k, n = 1) => { if (k) map.set(k, (map.get(k) || 0) + n); };
const top = (map, n) => [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

async function probe(site) {
  const html = await get(site.url, 20000);
  if (!html) return { ...site, err: 'fetch failed' };

  const base = new URL(site.url);
  // 内联 <style> + 外链 CSS
  let css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n');
  const hrefs = [...html.matchAll(/<link[^>]+rel=["']?stylesheet["']?[^>]*>/gi)]
    .map(t => (t[0].match(/href=["']([^"']+)["']/) || [])[1]).filter(Boolean);
  let files = 0;
  for (const h of hrefs.slice(0, CSS_CAP)) {
    if (css.length > BYTE_CAP) break;
    try { const t = await get(new URL(h, base).href, 12000); if (t) { css += '\n' + t; files++; } } catch {}
  }

  const vars = new Map(), colors = new Map(), fonts = new Map(),
        durs = new Map(), eases = new Map(), radii = new Map();

  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;}]{1,60})/g)) tally(vars, `${m[1]}: ${m[2].trim()}`);
  for (const m of css.matchAll(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b|rgba?\([^)]{3,40}\)/gi)) tally(colors, m[0].toLowerCase());
  for (const m of css.matchAll(/font-family\s*:\s*["']?([^,;}"']+)/gi)) tally(fonts, m[1].trim());
  for (const m of css.matchAll(/(?:transition|animation)(?:-duration)?\s*:[^;}]*?(\d*\.?\d+m?s)/gi)) tally(durs, m[1]);
  for (const m of css.matchAll(/cubic-bezier\(\s*[\d.\-\s,]+\)/gi)) tally(eases, m[0].replace(/\s+/g, ''));
  for (const m of css.matchAll(/border-radius\s*:\s*([^;}]{1,24})/gi)) tally(radii, m[1].trim());

  const has = re => re.test(html) || re.test(css);
  return {
    ...site,
    cssBytes: css.length, cssFiles: files,
    vars: top(vars, 14).map(([k, n]) => `${k}${n > 2 ? ` ×${n}` : ''}`),
    varCount: vars.size,
    colors: top(colors, 8).map(([k, n]) => `${k} ×${n}`),
    fonts: top(fonts, 5).map(([k, n]) => `${k} ×${n}`),
    durs: top(durs, 6).map(([k, n]) => `${k} ×${n}`),
    eases: top(eases, 5).map(([k, n]) => `${k} ×${n}`),
    radii: top(radii, 3).map(([k]) => k),
    cursorNone: /cursor\s*:\s*none/i.test(css),          // 自定义光标的强信号
    mixBlend: /mix-blend-mode\s*:\s*(difference|exclusion)/i.test(css),
    libs: [
      has(/\bgsap\b/i) && 'GSAP', has(/three(\.min)?\.js|THREE\./) && 'Three',
      has(/\blenis\b/i) && 'Lenis', has(/locomotive/i) && 'Locomotive',
      has(/\bbarba\b/i) && 'Barba', has(/lottie/i) && 'Lottie',
      has(/@keyframes/) && 'CSS-kf',
    ].filter(Boolean),
  };
}

/* ---------- 跑 ---------- */
const pool = async (items, n, fn) => {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) {
      const k = i++;
      out[k] = await fn(items[k], k);
      process.stderr.write(`\r${out.filter(Boolean).length}/${items.length}`);
    }
  }));
  return out;
};

const sites = listSites();
const res = await pool(sites, CONC, probe);
mkdirSync('blends/scans', { recursive: true });
writeFileSync('blends/scans/raw-2026-07.json', JSON.stringify(res, null, 1));
process.stderr.write('\n');

const ok = res.filter(r => r && !r.err && r.cssBytes > 500);
console.log(`探测 ${res.length} 站,拿到 CSS 的 ${ok.length} 站`);

/* ---------- 3. 横截面统计:单站看不出来的东西 ---------- */
const census = (key, n = 20) => {
  const m = new Map();
  for (const r of ok) for (const s of r[key] || []) {
    const [v, c] = s.split(' ×');
    m.set(v, (m.get(v) || 0) + (+c || 1));
  }
  return top(m, n);
};
const sitesWith = (key, pred) => ok.filter(r => pred(r[key])).length;

console.log('\n=== 缓动曲线普查(获奖站实际在用的 cubic-bezier)===');
for (const [k, n] of census('eases', 18)) console.log(`  ${k}  ×${n}`);
console.log('\n=== 时长档普查 ===');
for (const [k, n] of census('durs', 14)) console.log(`  ${k}  ×${n}`);
console.log('\n=== 圆角 ===');
for (const [k, n] of census('radii', 10)) console.log(`  ${k}  ×${n}`);
console.log('\n=== 结构 ===');
console.log(`  有 CSS 变量体系(≥10 个 --var)  ${sitesWith('varCount', v => v >= 10)}/${ok.length}`);
console.log(`  有 cursor:none(自定义光标强信号) ${ok.filter(r => r.cursorNone).length}`);
console.log(`  ↳ ${ok.filter(r => r.cursorNone).map(r => r.title).join(', ') || '(无)'}`);
console.log(`  用 mix-blend-mode: difference/exclusion  ${ok.filter(r => r.mixBlend).length}`);
console.log(`  ↳ ${ok.filter(r => r.mixBlend).map(r => r.title).slice(0, 12).join(', ')}`);
const libCount = new Map();
for (const r of ok) for (const l of r.libs) libCount.set(l, (libCount.get(l) || 0) + 1);
console.log('\n=== 库 ===');
for (const [k, n] of top(libCount, 10)) console.log(`  ${k}  ${n}/${ok.length}`);
console.log('\n=== 失败 ===');
console.log(' ', res.filter(r => r && (r.err || r.cssBytes <= 500)).map(r => r.title).join(', ') || '(无)');
