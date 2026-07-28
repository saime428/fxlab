import fs from "node:fs";

// ---------- showcase: distinct work covers ----------
const showPath = "showcase/index.html";
let show = fs.readFileSync(showPath, "utf8");

const oldPal = `  const PAL = [
    ['#1a2210', '#c5f542', '#8b7cf6', 'WIPE'],
    ['#14101f', '#8b7cf6', '#47d8ff', 'FLOW'],
    ['#101820', '#47d8ff', '#c5f542', 'TYPE'],
    ['#1a1018', '#ff7c5c', '#8b7cf6', 'SPRING'],
  ];
  function makeCover(i) {
    const [bg1, bg2, fg, label] = PAL[i % PAL.length];
    const c = document.createElement('canvas'); c.width = 640; c.height = 800;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 640, 800);
    g.addColorStop(0, bg1); g.addColorStop(1, bg2);
    x.fillStyle = g; x.fillRect(0, 0, 640, 800);
    x.fillStyle = fg;
    for (let k = 0; k < 8; k++) {
      x.beginPath();
      x.arc(80 + (k % 4) * 150, 180 + Math.floor(k / 4) * 220 + Math.sin(k * 1.7) * 40, 48 + k * 3, 0, 7);
      x.globalAlpha = 0.55; x.fill();
    }
    x.globalAlpha = 1;
    x.fillStyle = '#fff'; x.font = '800 72px system-ui,sans-serif';
    x.textAlign = 'center'; x.fillText(label, 320, 420);
    x.font = '600 22px ui-monospace,monospace';
    x.fillStyle = 'rgba(255,255,255,.55)';
    x.fillText('FXLAB · ' + String(i + 1).padStart(2, '0'), 320, 470);
    return c;
  }
  const covers = PAL.map((_, i) => makeCover(i));`;

const newPal = `  // 五张封面：构图/色板/图形语言刻意不同，避免“五个一样的圆”
  const COVERS = [
    { id: 0, label: 'WIPE', sub: 'SHADER EDGE' },
    { id: 1, label: 'FIELD', sub: 'PARTICLE DUST' },
    { id: 2, label: 'TYPE', sub: 'SPLIT REVEAL' },
    { id: 3, label: 'SPRING', sub: 'MAGNETIC PULL' },
    { id: 4, label: 'MORPH', sub: 'VIEW TRANSIT' },
  ];
  function makeCover(i) {
    const c = document.createElement('canvas'); c.width = 640; c.height = 800;
    const x = c.getContext('2d');
    const w = 640, h = 800;
    const stamp = (label, sub, y = 640) => {
      x.textAlign = 'left';
      x.fillStyle = 'rgba(255,255,255,.92)';
      x.font = '800 56px system-ui,sans-serif';
      x.fillText(label, 40, y);
      x.font = '600 16px ui-monospace,monospace';
      x.fillStyle = 'rgba(255,255,255,.55)';
      x.fillText(sub, 42, y + 32);
      x.fillText('0' + (i + 1) + ' / FXLAB', 42, y + 56);
    };
    // style 0: diagonal hard wipe / crystal shards
    if (i === 0) {
      const g = x.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#0c1208'); g.addColorStop(1, '#1f2a10');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.fillStyle = '#c5f542';
      x.beginPath(); x.moveTo(0, 120); x.lineTo(w * .55, 0); x.lineTo(w, 0); x.lineTo(w, 280); x.closePath(); x.fill();
      x.globalAlpha = .9; x.fillStyle = '#8b7cf6';
      x.beginPath(); x.moveTo(0, h); x.lineTo(0, 420); x.lineTo(w * .7, h); x.closePath(); x.fill();
      x.globalAlpha = 1;
      for (let k = 0; k < 6; k++) {
        x.strokeStyle = 'rgba(197,245,66,.45)'; x.lineWidth = 2;
        x.beginPath(); x.moveTo(40 + k * 90, 200); x.lineTo(120 + k * 90, 520); x.stroke();
      }
      stamp('WIPE', 'SHADER EDGE');
      return c;
    }
    // style 1: particle field / constellation
    if (i === 1) {
      x.fillStyle = '#0a0814'; x.fillRect(0, 0, w, h);
      const rg = x.createRadialGradient(w * .5, h * .35, 20, w * .5, h * .4, 420);
      rg.addColorStop(0, 'rgba(139,124,246,.55)'); rg.addColorStop(1, 'transparent');
      x.fillStyle = rg; x.fillRect(0, 0, w, h);
      for (let k = 0; k < 160; k++) {
        const px = (Math.sin(k * 12.9898) * 43758.5453) % 1;
        const py = (Math.sin(k * 78.233) * 12345.678) % 1;
        const r = 1 + (k % 5);
        x.fillStyle = k % 7 === 0 ? '#47d8ff' : k % 5 === 0 ? '#c5f542' : 'rgba(255,255,255,.75)';
        x.beginPath(); x.arc(Math.abs(px) * w, Math.abs(py) * h * .85, r, 0, 7); x.fill();
      }
      // a few connecting lines
      x.strokeStyle = 'rgba(71,216,255,.25)'; x.lineWidth = 1;
      for (let k = 0; k < 12; k++) {
        x.beginPath();
        x.moveTo((k * 53) % w, (k * 97) % (h * .7));
        x.lineTo((k * 91 + 120) % w, (k * 41 + 80) % (h * .7));
        x.stroke();
      }
      stamp('FIELD', 'PARTICLE DUST');
      return c;
    }
    // style 2: big type slabs
    if (i === 2) {
      x.fillStyle = '#0e141c'; x.fillRect(0, 0, w, h);
      x.fillStyle = '#47d8ff'; x.fillRect(0, 0, w, 18);
      x.fillStyle = 'rgba(197,245,66,.15)'; x.fillRect(0, 180, w, 120);
      x.fillStyle = '#f2f1f7';
      x.font = '900 120px system-ui,sans-serif';
      x.textAlign = 'left';
      x.fillText('Aa', 36, 280);
      x.font = '800 64px system-ui,sans-serif';
      x.fillStyle = '#47d8ff'; x.fillText('SPLIT', 40, 400);
      x.fillStyle = 'rgba(242,241,247,.2)';
      x.font = '900 96px system-ui,sans-serif';
      x.fillText('文字', 40, 520);
      // rising bars like line masks
      for (let k = 0; k < 5; k++) {
        x.fillStyle = k % 2 ? 'rgba(71,216,255,.35)' : 'rgba(242,241,247,.12)';
        x.fillRect(40, 560 + k * 28, 200 + k * 40, 14);
      }
      stamp('TYPE', 'SPLIT REVEAL', 720);
      return c;
    }
    // style 3: spring / orbital rings + magnet blob
    if (i === 3) {
      const g = x.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#1a0e12'); g.addColorStop(1, '#2a1218');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.strokeStyle = 'rgba(255,124,92,.55)'; x.lineWidth = 3;
      for (let k = 1; k <= 5; k++) {
        x.beginPath(); x.ellipse(w * .5, h * .38, 40 + k * 42, 28 + k * 36, -0.4, 0, 7); x.stroke();
      }
      x.fillStyle = '#ff7c5c';
      x.beginPath(); x.arc(w * .55, h * .4, 54, 0, 7); x.fill();
      x.fillStyle = '#8b7cf6';
      x.beginPath(); x.arc(w * .38, h * .48, 28, 0, 7); x.fill();
      // spring coil simplified
      x.strokeStyle = '#c5f542'; x.lineWidth = 4; x.beginPath();
      for (let t = 0; t < 12; t++) {
        const xx = 80 + t * 40, yy = 620 + Math.sin(t * 1.2) * 28;
        t ? x.lineTo(xx, yy) : x.moveTo(xx, yy);
      }
      x.stroke();
      stamp('SPRING', 'MAGNETIC PULL', 720);
      return c;
    }
    // style 4: morph / soft shapes dual state
    {
      x.fillStyle = '#100e18'; x.fillRect(0, 0, w, h);
      // left blob
      x.fillStyle = '#8b7cf6';
      x.beginPath(); x.moveTo(80, 200);
      x.bezierCurveTo(40, 360, 180, 520, 260, 480);
      x.bezierCurveTo(340, 440, 300, 180, 80, 200); x.fill();
      // right blob
      x.fillStyle = '#c5f542';
      x.beginPath(); x.moveTo(360, 240);
      x.bezierCurveTo(520, 160, 600, 400, 520, 520);
      x.bezierCurveTo(440, 640, 280, 560, 360, 240); x.fill();
      x.globalAlpha = .5; x.fillStyle = '#47d8ff';
      x.beginPath(); x.arc(320, 380, 90, 0, 7); x.fill();
      x.globalAlpha = 1;
      x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 2;
      x.setLineDash([8, 10]);
      x.strokeRect(48, 140, w - 96, h - 320);
      x.setLineDash([]);
      stamp('MORPH', 'VIEW TRANSIT', 700);
      return c;
    }
  }
  const covers = COVERS.map((_, i) => makeCover(i));`;

if (!show.includes(oldPal)) {
  console.error("PAL block not found exactly — try looser match");
  process.exit(1);
}
show = show.replace(oldPal, newPal);

// works section copy
show = show.replace(
  `横向画廊 = sticky + 纵向滚动映射。每张卡是独立的 displacement 画布——点一下，封面互相推过去。`,
  `横向画廊 = sticky + 纵滚映射。五张卡是五种完全不同的封面语言（硬切 / 粒子 / 大字 / 弹簧 / 变形）；悬停或点击时，再用 displacement 过渡到另一套封面。`
);

show = show.replace(
  `<article class="hcard" data-a="0" data-b="1"><canvas></canvas><div class="meta"><b>Shader Wipe</b><span>TRANSITIONS · ★★★</span></div></article>
        <article class="hcard" data-a="1" data-b="2"><canvas></canvas><div class="meta"><b>Particle Field</b><span>GPU · ★★★</span></div></article>
        <article class="hcard" data-a="2" data-b="3"><canvas></canvas><div class="meta"><b>Split Type</b><span>TEXT · ★</span></div></article>
        <article class="hcard" data-a="3" data-b="0"><canvas></canvas><div class="meta"><b>Spring Drag</b><span>HOVER · ★★</span></div></article>
        <article class="hcard" data-a="0" data-b="2"><canvas></canvas><div class="meta"><b>View Morph</b><span>NATIVE · ★★</span></div></article>`,
  `<article class="hcard" data-a="0" data-b="1"><canvas></canvas><div class="meta"><b>Shader Wipe</b><span>硬切边缘 · TRANSITIONS</span></div></article>
        <article class="hcard" data-a="1" data-b="2"><canvas></canvas><div class="meta"><b>Particle Field</b><span>星尘粒子 · GPU</span></div></article>
        <article class="hcard" data-a="2" data-b="3"><canvas></canvas><div class="meta"><b>Split Type</b><span>大字拆行 · TEXT</span></div></article>
        <article class="hcard" data-a="3" data-b="4"><canvas></canvas><div class="meta"><b>Spring Drag</b><span>磁吸弹簧 · HOVER</span></div></article>
        <article class="hcard" data-a="4" data-b="0"><canvas></canvas><div class="meta"><b>View Morph</b><span>双态变形 · NATIVE</span></div></article>`
);

// agent wording in showcase
show = show.replace(
  `给人抄 demo，给 AI 选型。Claude skill 装上就能说「要有质感」。`,
  `给人抄 demo，给 Agent 选型。装上 skill 后，任意支持 skill 的 Agent 都能说「要有质感」。`
);
show = show.replace(
  `这一页是 fxlab 的验收现场：序章、全屏菜单、拆行入场、光标拖尾、滚动字幕、横向画廊、液态图片过渡、磁性按钮、主题突变——同一套 token，像一个人做的。`,
  `这一页是 fxlab 的验收现场：序章、全屏菜单、拆行入场、光标拖尾、滚动字幕、五种封面语言的横向画廊、液态图片过渡、磁性按钮、主题突变——同一套 token，像一个人做的。`
);

fs.writeFileSync(showPath, show);
console.log("showcase updated");

// ---------- text rewrites across repo ----------
const rewrites = [
  ["index.html", [
    ['Claude skill · Featured 8', 'Agent skill · Featured 8'],
    ['安装 Claude skill', '安装 Agent skill'],
    ['#给-agent--claude-code-用', '#给-agent-用'],
  ]],
  ["README.md", [
    ['并附 AI 选型索引与 Claude skill。', '并附 AI 选型索引与通用 Agent skill。'],
    ['| **Claude / Agent** | 安装 skill（见下）→ 说「给这个 landing 加有质感的动效，贴合现有设计」 |',
     '| **任意 Agent** | 安装 skill（见下）→ 说「给这个 landing 加有质感的动效，贴合现有设计」 |'],
    ['## 给 Agent / Claude Code 用\n\n1. 复制 skill 目录到本机 Claude skills：\n\n```bash\n# 任选其一\ncp -r skills/fxlab ~/.claude/skills/fxlab\n\n# 或 degit（无需整仓 clone）\nnpx --yes degit saime428/fxlab/skills/fxlab ~/.claude/skills/fxlab\n```\n\nWindows (PowerShell):\n\n```powershell\nCopy-Item -Recurse skills\\fxlab $env:USERPROFILE\\.claude\\skills\\fxlab\n```',
     `## 给 Agent 用\n\n\`skills/fxlab/\` 是一份标准 skill 包（\`SKILL.md\` + 仓库内 INDEX/TASTE）。**不绑定某一家 Agent**：只要你的工具支持 skill / 规则文件 / 可粘贴系统提示，都可以装。\n\n### 安装（按你的 Agent 选路径）\n\n\`\`\`bash\n# 通用：clone 后把 skills/fxlab 拷到该 Agent 的 skills 目录\n# Claude Code 示例\ncp -r skills/fxlab ~/.claude/skills/fxlab\n\n# 或 degit（无需整仓）\nnpx --yes degit saime428/fxlab/skills/fxlab ~/.claude/skills/fxlab\n\`\`\`\n\nWindows (PowerShell，Claude Code 路径示例):\n\n\`\`\`powershell\nCopy-Item -Recurse skills\\fxlab $env:USERPROFILE\\.claude\\skills\\fxlab\n\`\`\`\n\n其他 Agent：把同一目录放到其文档要求的 skills / rules 位置；或直接让 Agent 读取仓库根的 \`INDEX.md\` + \`TASTE.md\` + \`skills/fxlab/SKILL.md\`。`],
  ]],
  ["README.en.md", [
    ['taste rules, and a Claude/agent skill.', 'taste rules, and an agent-agnostic skill pack.'],
    ['| **Claude / agent** | Install the skill (below) → ask for tasteful motion that matches existing design |',
     '| **Any agent** | Install the skill (below) → ask for tasteful motion that matches existing design |'],
    ['## Use with Claude Code / agents\n\n```bash\ncp -r skills/fxlab ~/.claude/skills/fxlab\n# or\nnpx --yes degit saime428/fxlab/skills/fxlab ~/.claude/skills/fxlab\n```',
     `## Use with any agent\n\n\`skills/fxlab/\` is a portable skill pack (\`SKILL.md\` + INDEX/TASTE). Not tied to one vendor.\n\n\`\`\`bash\n# Example path for Claude Code — use your agent's skills dir for others\ncp -r skills/fxlab ~/.claude/skills/fxlab\n# or\nnpx --yes degit saime428/fxlab/skills/fxlab ~/.claude/skills/fxlab\n\`\`\`\n\nOr point any agent at \`INDEX.md\`, \`TASTE.md\`, and \`skills/fxlab/SKILL.md\` in the repo.`],
  ]],
  ["docs/promo/README.md", [
    ['• INDEX 给 AI 选型，附 Claude Code skill', '• INDEX 给 AI 选型，附通用 Agent skill'],
    ['Zero-deps demos · AI-readable INDEX · Claude skill', 'Zero-deps demos · AI-readable INDEX · agent skill'],
  ]],
  ["docs/promo/social-card.svg", [
    ['>Claude skill</text>', '>Agent skill</text>'],
    ['Copy-paste motion · live demos · AI skill', 'Copy-paste motion · live demos · agent skill'],
  ]],
  ["HANDOVER.md", [
    ['skills/fxlab/SKILL.md(Claude Code skill,装在 ~/.claude/skills/fxlab/,改了记得重新复制过去)',
     'skills/fxlab/SKILL.md(通用 Agent skill 包,可装到任意支持 skill 的工具;Claude Code 示例路径 ~/.claude/skills/fxlab/,改了记得重新复制)'],
  ]],
  ["CHANGELOG.md", [
    ['Zero-deps demos, AI-friendly INDEX + Claude skill.', 'Zero-deps demos, AI-friendly INDEX + agent skill.'],
  ]],
];

for (const [file, pairs] of rewrites) {
  if (!fs.existsSync(file)) {
    console.warn("skip missing", file);
    continue;
  }
  let t = fs.readFileSync(file, "utf8");
  let n = 0;
  for (const [a, b] of pairs) {
    if (t.includes(a)) {
      t = t.split(a).join(b);
      n++;
    } else {
      console.warn("miss in", file, ":", a.slice(0, 60));
    }
  }
  fs.writeFileSync(file, t);
  console.log(file, "rewrites applied:", n);
}

// repo description via note only — user can update gh later
console.log("done");
