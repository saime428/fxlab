#!/usr/bin/env node
// 全库体检:把踩过的坑变成可重复运行的检查。
//
//   node scripts/audit.mjs            只报问题
//   node scripts/audit.mjs -v         连通过项一起列
//
// 检查项来自 HANDOVER"硬性规范" + INDEX"使用铁律" + 本会话实测踩过的坑。
// 只做静态检查;**动画过程中的问题(入场乱序、中途堆叠)静态查不出来**,
// 那类要开浏览器用 el.getAnimations()[0].currentTime 逐帧采样。

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const V = process.argv.includes('-v');
const TMP = (process.env.TEMP || '/tmp') + '/audit.js';

const dirs = [];
for (const c of readdirSync('patterns', { withFileTypes: true })) {
  if (!c.isDirectory()) continue;
  for (const d of readdirSync(`patterns/${c.name}`, { withFileTypes: true }))
    if (d.isDirectory()) dirs.push(`patterns/${c.name}/${d.name}`);
}

const findings = [];
const add = (sev, dir, msg) => findings.push({ sev, dir, msg });

// 逃生口:demo 里写 <!-- audit-ok: 关键词 | 理由 --> 就跳过消息含该关键词的检查。
// 关键词取 | 之前的部分(理由是写给人看的,必须写)。
// 启发式检查一定会有误报,与其把正则越调越复杂(越复杂越难懂、越容易调错),
// 不如留一个需要显式写理由的豁免——写了理由的例外比没人看的噪音强
const skips = new Map();
const skipped = (dir, msg) => (skips.get(dir) || []).some(k => msg.includes(k));

for (const dir of dirs) {
  const rp = `${dir}/README.md`, dp = `${dir}/demo.html`;
  if (!existsSync(rp)) { add('ERR', dir, '缺 README.md'); continue; }
  if (!existsSync(dp)) { add('ERR', dir, '缺 demo.html'); continue; }
  const R = readFileSync(rp, 'utf8'), H = readFileSync(dp, 'utf8');
  skips.set(dir, [...H.matchAll(/audit-ok:\s*([^|\n]+?)\s*\|/g)].map(m => m[1].trim()));

  /* ---- demo:硬性规范 ---- */
  // 零依赖(铁律:单文件双击可开)。blends/ 不受此限,patterns 受
  if (/<script[^>]+\bsrc=/i.test(H)) add('ERR', dir, 'demo 有外部 <script src>,违反零依赖');
  if (/<link[^>]+href=["']https?:/i.test(H)) add('ERR', dir, 'demo 外链样式表,违反零依赖');

  // JS 语法
  const js = [...H.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join('\n');
  if (js.trim()) {
    try { writeFileSync(TMP, js); execSync(`node --check "${TMP}"`, { stdio: 'pipe' }); }
    catch (e) { add('ERR', dir, 'demo 内联 JS 语法错误:' + String(e.stderr || e).split('\n')[1]); }
  }

  // 铁律 2:reduced-motion。**只在有"运动"时要求**——该 media query 针对的是
  // 前庭触发(位移/缩放/旋转/滚动驱动),纯 color/background 过渡不算,
  // 一律要求会让检查变成噪音,噪音多了整份报告就没人看了
  const hasMotion = /@keyframes|requestAnimationFrame|animation\s*:\s*\w/.test(H)
    || /transition[^;]*\b(transform|scale|rotate|translate|clip-path|offset-distance|width|height|top|left|letter-spacing)\b/.test(H)
    || /transition\s*:\s*(all|[^;]*\ball\b)/.test(H);
  if (hasMotion && !/prefers-reduced-motion/.test(H))
    add('ERR', dir, '有位移类动画但没有 prefers-reduced-motion 降级(铁律 2)');
  else if (!hasMotion && /transition\s*:/.test(H) && !/prefers-reduced-motion/.test(H))
    add('INFO', dir, '只有 color/background 过渡,按前庭标准无需 reduced-motion(不算问题)');

  // 铁律 3:hover/指针类要给触屏降级
  // 判 hover 交互时要剔除 @media (hover: hover) 里的 :hover —— 那是能力查询不是样式
  const Hnomedia = H.replace(/@media[^{]*hover\s*:\s*hover[^{]*\{/g, '@media{');
  // 只有**可交互元素**上的 hover 才要求键盘等价物;标题/装饰上的 hover 无处可聚焦
  const interactiveHover = /\b(a|button|\[tabindex\]|\.btn)[^{},]*:hover|:hover[^{]*\{[^}]*\}/.test(Hnomedia)
    && /<(a|button)\b/i.test(H);
  const pointerDriven = /pointermove|pointerenter|mousemove/.test(H) || interactiveHover;
  // 拖拽类(有 pointerdown / touch-action)在触屏上本来就能用,不需要 hover 守卫。
  // 只有"纯 hover 跟随"才必须显式关掉——否则触屏上是个永远不触发的死循环
  const isDrag = /pointerdown|touchstart|touch-action/.test(H);
  const jsPointer = /pointermove|mousemove/.test(js);
  if (jsPointer && !isDrag && !/hover\s*:\s*hover|pointer\s*:\s*fine/.test(H))
    add('ERR', dir, 'JS 监听指针移动但没有 (hover:hover)/(pointer:fine) 触屏降级(铁律 3)');
  if (pointerDriven && !/:focus-visible|:focus-within|tabindex/.test(H))
    add('WARN', dir, 'hover 类效果没看到键盘等价物(:focus-visible / tabindex)(铁律 3)');

  // 铁律 6:demo 配色是占位,要写明
  if (!/铁律\s*6|配色排版是占位/.test(H))
    add('WARN', dir, 'demo 没写"配色排版是占位"声明(铁律 6)');

  // 铁律 7:强度参数收口到 KNOB 说明块。
  // **旋钮 = 赋数值的大写常量**;媒体查询结果(REDUCED)、内容数据(COLORS/WORDS/
  // SCENES)都不是旋钮,一起算进来会让这条检查变成纯噪音
  const knobs = [...js.matchAll(/const\s+([A-Z_][A-Z_0-9]{2,})\s*=\s*-?[\d.]+\s*[;,]/g)].map(m => m[1]);
  if (knobs.length && !/KNOB/.test(H))
    add('WARN', dir, `有数值型强度常量(${knobs.join(', ')})但没有 KNOB 说明块(铁律 7)`);

  // rAF 常驻但没有 visibilitychange → 后台空转。
  // 排除两类不算问题的:① 有 cancelAnimationFrame(自己管着循环生命周期)
  // ② rAF 调用全都带条件(if (p<1) rAF(...) 这种一次性动画,会自己停)
  if (/requestAnimationFrame/.test(js) && !/visibilitychange|cancelAnimationFrame/.test(js)) {
    const calls = js.split('\n').filter(l => /requestAnimationFrame\s*\(/.test(l));
    const unconditional = calls.filter(l => !/\bif\s*\(|\?|&&/.test(l));
    // 首次启动那一行本来就是无条件的,循环体内还有无条件调用才算常驻
    if (unconditional.length > 1)
      add('WARN', dir, 'rAF 常驻循环但没有 visibilitychange / cancelAnimationFrame,后台会空转');
  }

  /* ---- README:taxonomy 要求必答三问 ---- */
  for (const [k, re] of [['设计意图', /##\s*设计意图/], ['核心机制', /##\s*核心机制/], ['代价', /##\s*代价/]])
    if (!re.test(R)) add('WARN', dir, `README 缺"${k}"一节(taxonomy 必答三问)`);
  if (!/-\s*\*\*Demo\*\*/.test(R)) add('WARN', dir, 'README 缺 Demo 链接行');
  if (!/-\s*\*\*难度\*\*/.test(R)) add('WARN', dir, 'README 缺难度标注');
  // 来源:criteria 第 1 条要求从 case 提炼,至少写清见于哪里
  if (!/-\s*\*\*见于\*\*|-\s*\*\*来源\*\*/.test(R))
    add('WARN', dir, 'README 没写"见于/来源",无法追溯是从哪个 case/扫描提炼的');
}

/* ---- 索引一致性 ---- */
const idx = readFileSync('INDEX.md', 'utf8');
const rme = readFileSync('README.md', 'utf8');
const rows = s => new Set([...s.matchAll(/\]\((patterns\/[\w-]+\/[\w-]+)\/?\)/g)].map(m => m[1]));
for (const [name, set] of [['INDEX.md', rows(idx)], ['README.md', rows(rme)]]) {
  for (const d of dirs) if (!set.has(d)) add('ERR', name, `漏收 ${d}`);
  for (const r of set) if (!dirs.includes(r)) add('ERR', name, `幽灵行 ${r}(目录已不存在)`);
}

/* ---- 全仓相对链接 ---- */
const walk = d => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!/^(\.git|node_modules)$/.test(e.name)) walk(p); }
    else if (e.name.endsWith('.md') && !p.includes('templates')) {
      for (const m of readFileSync(p, 'utf8').matchAll(/\]\((?!https?:)([^)#]+)\)/g))
        if (!existsSync(path.resolve(path.dirname(p), m[1].split('#')[0])))
          add('ERR', p, `死链 → ${m[1]}`);
    }
  }
};
walk('.');

/* ---- 输出 ---- */
// 应用逃生口
const live = findings.filter(f => !skipped(f.dir, f.msg));
const muted = findings.length - live.length;
const errs = live.filter(f => f.sev === 'ERR');
const warns = live.filter(f => f.sev === 'WARN');
const shown = V ? live : live.filter(f => f.sev !== 'INFO');
const byDir = new Map();
for (const f of shown) { if (!byDir.has(f.dir)) byDir.set(f.dir, []); byDir.get(f.dir).push(f); }

console.log(`体检 ${dirs.length} 个 pattern:${errs.length} 个 ERR / ${warns.length} 个 WARN`
  + (muted ? ` (另有 ${muted} 条被 audit-ok 豁免)` : '') + '\n');
for (const [dir, fs_] of byDir) {
  if (!V && !fs_.length) continue;
  console.log(dir);
  for (const f of fs_) console.log(`  [${f.sev}] ${f.msg}`);
}
if (V) console.log('\n无问题的:', dirs.filter(d => !byDir.has(d)).join(', ') || '(无)');
process.exitCode = errs.length ? 1 : 0;
