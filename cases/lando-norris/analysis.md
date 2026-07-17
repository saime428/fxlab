# Lando Norris 官网

- **URL**: https://landonorris.com/
- **收录日期**: 2026-07-15
- **一句话印象**: F1 的速度感翻译成网页语言:荧光绿 × 深色 × 横向冲刺式滚动

## 整体气质从哪来

- 品牌色(McLaren 荧光绿)+ 深底,大面积超大字排版
- 摄影素材统一调色,图片即内容
- 滚动方向变化(纵向→横向画廊→纵向)制造"赛道"节奏

## 效果清单

| # | 效果描述 | 分类 | 推测技术 | 值得抽成 pattern? |
|---|---|---|---|---|
| 1 | 横向滚动照片画廊(带年份标注) | scroll/layout | GSAP ScrollTrigger pin + 水平位移 | ✅ |
| 2 | 头盔画廊 hover 双图切换(base/hover 图对) | hover | 双 webp 预载 + opacity 切换 | ✅ |
| 3 | "tap to lock" 滚动劫持交互 | scroll | 自定义滚动状态机 | ✅(CSS scroll-snap 简化版) |
| 4 | Rive 矢量动画(合作伙伴/页脚) | loading/text | Rive runtime | ☐(工具依赖→tech-radar) |
| 5 | 菜单展开多图错位入场 | transitions | GSAP stagger | ✅ |
| 6 | 逐行/逐字遮罩入场(全站标题) | text | SplitType + clip 遮罩 | ✅ |
| 7 | 滚动方向响应 marquee(110 处) | text/scroll | 滚动速度→字幕速度/方向 | ✅ |
| 8 | sticky 堆叠轨道(含主题切换) | layout | position: sticky 分层 | ✅ |
| 9 | hero 真 3D 文字与模型 | 3d-webgl | MSDF 文字 + Draco/Basis | ☐(超纲) |

## 技术栈侦察

- 平台: **Webflow**(cdn.prod.website-files.com 实锤)+ 自定义代码
- 动画: GSAP + Rive + WebGL 点缀
- 制作方: [OFF+BRAND](https://www.itsoffbrand.com/our-work/lando-norris),Awwwards SOTD/SOTM + FWA
- 资料: [Awwwards 页面](https://www.awwwards.com/sites/lando-norris)

## 借鉴笔记

证明 Webflow + 自定义 GSAP/Rive 也能拿 SOTM——"炫酷"不一定要从零手写工程。头盔 hover 双图切换是成本极低但效果极好的手法。

## 运行时实测(浏览器注入探测,2026-07-16)

- 21 个 canvas(Rive 动画遍布全站)+ hero 是真 WebGL:MSDF 文字渲染(Brier/MonaSans msdf.json)+ Draco/Basis 压缩 3D 模型
- **110 个 marquee 元素**,带 `data-marquee-scroll-direction-target` / `data-marquee-scroll-speed`——滚动方向和速度都会反馈到字幕,是清单外的高频效果
- 文字入场全站统一走 SplitType:`css-split-type` / `char` / `line` / `high-line-reveal` / `text-clip-w`(逐行 clip 遮罩)
- 布局侧:`sticky-track` / `sticky-item` / `sticky-track-theme-change`(粘性堆叠 + 滚动到位换主题)、`horizontal-pin-*`(横向 pin)、`is-locked/is-unlocked`(tap-to-lock 状态机)、`is-home-flip`(FLIP 过渡)
- 动画数据属性系统:`data-anim` / `data-anim-high` / `data-hero-animation` / `data-oval-scroll`,Webflow 之上盖了一层自定义编排层
