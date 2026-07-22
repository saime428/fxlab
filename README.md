# web-fx-lab 🧪

> 炫酷网页效果沉淀库:把看到的好网站拆解成可复用的设计方法 + 可运行 Demo。
>
> 🔗 **在线 Demo**: https://saime428.github.io/web-fx-lab/ (所有 demo 链接均可直接点开试玩)
> 🏠 **样板间**: https://saime428.github.io/web-fx-lab/showcase/ (作品集套餐 5 个 pattern 拼装的完整 landing page,铁律 7 token 收口的实装参考)

## 这个仓库怎么用

两个维度沉淀,互相交叉引用:

- **`cases/` 按网站**:每收藏一个好网站,写一篇拆解(它用了哪些效果、什么技术、为什么好看),并链接到对应 pattern。
- **`patterns/` 按效果**:核心资产。每个效果一个文件夹,包含原理文档 `README.md` + 零依赖可直接打开的 `demo.html`。

工作流:发现好网站 → 在 `cases/` 建拆解 → 把其中值得复用的效果抽成 `patterns/` 条目 → 双向链接。

## 效果分类

| 分类 | 目录 | 说明 |
|---|---|---|
| 页面切换 | [`patterns/transitions/`](patterns/transitions/) | 路由过渡、View Transitions、遮罩擦除 |
| 滚动动效 | [`patterns/scroll/`](patterns/scroll/) | 滚动驱动动画、视差、pin/scrub、平滑滚动 |
| 悬停交互 | [`patterns/hover/`](patterns/hover/) | 磁性按钮、图片扭曲、卡片翻转 |
| 文字动效 | [`patterns/text/`](patterns/text/) | 逐字入场、乱码解码、滚动文字带 |
| 3D / WebGL | [`patterns/3d-webgl/`](patterns/3d-webgl/) | Three.js 场景、shader 特效、粒子 |
| 鼠标跟随 | [`patterns/cursor/`](patterns/cursor/) | 自定义光标、拖尾、跟随元素 |
| 加载动画 | [`patterns/loading/`](patterns/loading/) | 进度序章、骨架屏、开场动画 |
| 布局手法 | [`patterns/layout/`](patterns/layout/) | 横向滚动、瀑布流、粘性分层 |

完整分类和判断标准见 [`docs/taxonomy.md`](docs/taxonomy.md)。

## Pattern 索引

| 效果 | 分类 | 难度 | Demo |
|---|---|---|---|
| [滚动渐显 Scroll Reveal](patterns/scroll/scroll-reveal/) | 滚动动效 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/scroll/scroll-reveal/demo.html) |
| [横向滚动画廊 Horizontal Gallery](patterns/scroll/horizontal-gallery/) | 滚动动效 | ★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/scroll/horizontal-gallery/demo.html) |
| [Hover 双图切换 Image Swap](patterns/hover/image-swap/) | 悬停交互 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/hover/image-swap/demo.html) |
| [SVG 线条绘制 Line Draw](patterns/text/svg-line-draw/) | 文字动效 | ★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/text/svg-line-draw/demo.html) |
| [滚动驱动 Shader](patterns/scroll/scroll-driven-shader/) | 滚动/WebGL | ★★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/scroll/scroll-driven-shader/demo.html) |
| [章节主题突变 Theme Shift](patterns/transitions/theme-shift/) | 页面切换 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/transitions/theme-shift/demo.html) |
| [章节式滚动叙事](patterns/layout/section-narrative/) | 布局手法 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/layout/section-narrative/demo.html) |
| [氛围音开关](patterns/loading/ambient-sound-toggle/) | 体验层 | ★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/loading/ambient-sound-toggle/demo.html) |
| [Stagger 网格波纹](patterns/text/stagger-grid/) | 编排 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/text/stagger-grid/demo.html) |
| [加载序章 Entry Preloader](patterns/loading/entry-preloader/) | 加载动画 | ★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/loading/entry-preloader/demo.html) |
| [逐行/逐字拆分入场 Split Text](patterns/text/split-text-reveal/) | 文字动效 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/text/split-text-reveal/demo.html) |
| [滚动响应字幕 Scroll Marquee](patterns/text/scroll-marquee/) | 文字动效 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/text/scroll-marquee/demo.html) |
| [数字滚动 Count Up](patterns/text/count-up/) | 文字动效 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/text/count-up/demo.html) |
| [粘性堆叠 Sticky Stack](patterns/layout/sticky-stack/) | 布局手法 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/layout/sticky-stack/demo.html) |
| [注释风标题 Comment Heading](patterns/layout/comment-heading/) | 布局手法 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/layout/comment-heading/demo.html) |
| [视差漂浮卡片 Parallax Cards](patterns/scroll/parallax-cards/) | 滚动动效 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/scroll/parallax-cards/demo.html) |
| [CSS 滚动擦洗 Scroll Scrub](patterns/scroll/css-scroll-scrub/) | 滚动动效 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/scroll/css-scroll-scrub/demo.html) |
| [View Transitions 共享元素过渡](patterns/transitions/view-transitions/) | 页面切换 | ★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/transitions/view-transitions/demo.html) |
| [Canvas 氛围背景 Ambient BG](patterns/3d-webgl/canvas-ambient-bg/) | 3D/WebGL | ★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/3d-webgl/canvas-ambient-bg/demo.html) |
| [全屏菜单 Stagger 展开](patterns/transitions/menu-stagger-reveal/) | 页面切换 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/transitions/menu-stagger-reveal/demo.html) |
| [Displacement 图片过渡](patterns/transitions/image-displacement/) | 页面切换 | ★★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/transitions/image-displacement/demo.html) |
| [Shader 遮罩擦除过渡](patterns/transitions/shader-wipe/) | 页面切换 | ★★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/transitions/shader-wipe/demo.html) |
| [GPU 粒子过渡](patterns/transitions/particle-transition/) | 页面切换 | ★★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/transitions/particle-transition/demo.html) |
| [可拖拽 + 弹簧回弹](patterns/hover/drag-spring/) | 悬停交互 | ★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/hover/drag-spring/demo.html) |
| [滚动分节锁定](patterns/scroll/scroll-snap-sections/) | 滚动动效 | ★ | [demo](https://saime428.github.io/web-fx-lab/patterns/scroll/scroll-snap-sections/demo.html) |
| [漂浮贴纸物理 Hover](patterns/hover/floating-stickers/) | 悬停交互 | ★★ | [demo](https://saime428.github.io/web-fx-lab/patterns/hover/floating-stickers/demo.html) |

## Case 索引

| 网站 | 亮点 | 开源 | 拆解 |
|---|---|---|---|
| [Bruno Simon 2019](https://2019.bruno-simon.com/) | 物理小车探索式导航 | ✅ [源码](https://github.com/brunosimon/folio-2019) | [拆解](cases/bruno-simon-2019/analysis.md) |
| [Igloo Inc.](https://www.igloo.inc/) | 滚动雕刻冰晶,shader 驱动 UI | 官方 case study | [拆解](cases/igloo-inc/analysis.md) |
| [Messenger](https://messenger.abeto.co/) | 5.7MB 多人小星球游戏 | — | [拆解](cases/messenger/analysis.md) |
| [Lando Norris](https://landonorris.com/) | Webflow+Rive+GSAP 拿 SOTM | — | [拆解](cases/lando-norris/analysis.md) |
| [Anime.js](https://animejs.com/) | 文档即演示,stagger 网格 | ✅ [源码](https://github.com/juliangarnier/anime) | [拆解](cases/animejs/analysis.md) |
| [Robin Payot](https://robinpayot.com/) | 滚动=3D 镜头推进 | — | [拆解](cases/robin-payot/analysis.md) |
| [Active Theory](https://activetheory.net/) | 自研引擎全 canvas UI | — | [拆解](cases/active-theory/analysis.md) |
| [Shopify Editions W26](https://www.shopify.com/editions/winter2026) | 发布说明做成滚动叙事 | — | [拆解](cases/shopify-editions-winter-26/analysis.md) |
| [Hashgraph Ventures](https://hashgraphvc.com/) | 章节宣言叙事+氛围音 | — | [拆解](cases/hashgraph-ventures/analysis.md) |
| [infinite imaginations](https://oninross.github.io/infinite-imaginations/) | TweenMax 时代考古 | ✅ [源码](https://github.com/oninross/infinite-imaginations) | [拆解](cases/infinite-imaginations/analysis.md) |
| [MotionPotion](https://motionpotion.co/) | 纯 CSS 交互动效密度天花板,假 UI 自演示 | — | [拆解](cases/motionpotion/analysis.md) |

## 怎么在项目里用

- **AI 选型入口**:[`INDEX.md`](INDEX.md) 是机器友好的单文件决策索引(全部 pattern 一览 + 场景套餐 + 使用铁律)
- **Claude Code skill**:[`skills/web-fx-lab/SKILL.md`](skills/web-fx-lab/SKILL.md),安装 = 复制到 `~/.claude/skills/web-fx-lab/`,之后任何会话说"做个有质感的官网"会自动翻本库选料
- 原则:抄机制不抄样式;真实项目踩坑回写进 pattern 的"实战笔记"

## 模板与规范

- 网站拆解:[`docs/templates/case-analysis.md`](docs/templates/case-analysis.md)
- 效果条目:[`docs/templates/pattern.md`](docs/templates/pattern.md)
- 常用技术雷达:[`docs/tech-radar.md`](docs/tech-radar.md)
- 提炼与收录标准:[`docs/criteria.md`](docs/criteria.md)

## 收录标准

1. 效果必须能说清"为什么好看"(设计意图),不只是"看着炫"。
2. Demo 尽量零依赖、单文件、双击可打开;确需库时在文档中注明版本。
3. 每个 pattern 标注:核心技术、性能注意点、可访问性影响(如 `prefers-reduced-motion`)。

## License

MIT
