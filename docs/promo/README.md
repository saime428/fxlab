# 传播物料 · Promo

## 已有

| 文件 | 用途 |
|------|------|
| [`social-card.svg`](social-card.svg) | GitHub Social preview / OG 图源（1280×640） |

### 设置 GitHub Social preview

1. 把 `social-card.svg` 导出为 PNG（浏览器打开 → 截图，或任意 SVG→PNG 工具，目标 **1280×640**）  
2. 仓库 → **Settings → General → Social preview** → Upload  

也可临时把 SVG 链到 README 顶栏（部分客户端不渲染 SVG 为 OG，仍以 PNG 为准）。

## 建议补录（本地录屏，不进强制 PR）

| 文件名 | 内容 | 规格 |
|--------|------|------|
| `hero-showcase.gif` | [Showcase](https://saime428.github.io/fxlab/showcase/) 滚动 5–8s | ≤3MB |
| `p0-displacement.gif` | displacement 切换循环 3–5s | ≤2MB |
| `p0-shader.gif` | scroll-driven-shader 滚动 3–5s | ≤2MB |

工具：Windows 可用 [ScreenToGif](https://www.screentogif.com/) 或 OBS → ffmpeg。

录完放到本目录，并在根 `README.md` 顶栏加：

```markdown
![showcase](docs/promo/hero-showcase.gif)
```

## 发帖短链

- 主链（推荐）：https://saime428.github.io/fxlab/showcase/  
- 全库：https://saime428.github.io/fxlab/  
- 仓库：https://github.com/saime428/fxlab  

## 中文帖模板

```text
做了个可抄的网页动效实验室 fxlab：
• 每个效果双击就能跑的 demo（零依赖向）
• INDEX 给 AI 选型，附 Claude Code skill
• Showcase 是整页拼装，不是散装 CodePen

在线试：https://saime428.github.io/fxlab/
仓库：https://github.com/saime428/fxlab
```

## English blurb

```text
fxlab: copy-paste motion patterns with live demos.

Zero-deps demos · AI-readable INDEX · Claude skill
for landings that should feel expensive (not animation spam).

Demo → https://saime428.github.io/fxlab/
```
