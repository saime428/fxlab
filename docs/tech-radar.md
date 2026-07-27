# 技术雷达

拆解网站时常遇到的技术,按"先学哪个"排序。

## 必会(大多数炫酷效果的地基)

| 技术 | 用途 | 备注 |
|---|---|---|
| CSS transform / transition / @keyframes | 一切动画的基础 | 只动 transform 和 opacity,不触发重排 |
| IntersectionObserver | 滚动渐显、懒加载触发 | 零依赖滚动动效首选 |
| requestAnimationFrame + lerp | 平滑跟随、惯性 | `x += (target - x) * 0.1` 是无数拖尾效果的核心 |
| View Transitions API | 页面/状态切换 | 原生共享元素过渡,渐进增强使用 |
| CSS scroll-driven animations | `animation-timeline: scroll()` | 新特性,可替代部分 ScrollTrigger 场景 |

## 高频库

| 库 | 场景 | 何时用 |
|---|---|---|
| GSAP (+ ScrollTrigger) | 复杂时间线、滚动驱动 | 效果编排超过 3 个关键帧时 |
| Lenis | 平滑滚动 | **实测 303/629 获奖站在用(48%)**,比 GSAP(34%)普及,见下方专节 |
| Three.js / OGL | WebGL 3D | 有 3D 或 shader 需求 |
| SplitType | 文字拆分 | 逐字动画前置步骤 |
| Lottie | 设计师产出的矢量动画 | AE 动画落地 |
| Swup / Barba.js | MPA 页面过渡 | 非 SPA 项目的转场 |

## Lenis:项目已经有它时,本库的滚动 pattern 怎么接

[2026-07 扫描](../blends/scans/2026-07-awwwards.md)显示 **48% 的获奖站在用 Lenis**(303/629)。它不是效果,是基础设施——接管滚动之后,所有滚动驱动效果的时间基准都变了。进这类项目前先确认接法。

**前提**:Lenis v1 滚的是真实文档(内部用 rAF 反复 `scrollTo`),所以 `window.scrollY` 依然准确,只是**滞后于输入**。这决定了下面的分野。

| 本库 pattern | 在 Lenis 项目里 | 怎么接 |
|---|---|---|
| [scroll-reveal](../patterns/scroll/scroll-reveal/) | ✅ 直接能用 | IntersectionObserver 读的是真实位置,不受影响 |
| [sticky-stack](../patterns/layout/sticky-stack/) | ✅ 直接能用 | `position: sticky` 是原生排版,与 Lenis 无关 |
| [css-scroll-scrub](../patterns/scroll/css-scroll-scrub/) | ✅ 直接能用 | `animation-timeline: scroll()` 走真实滚动位置 |
| [scroll-marquee](../patterns/text/scroll-marquee/) | ⚠️ 要并循环 | 自带 rAF + 监听 `scroll`,会和 Lenis 的循环打架 |
| [section-narrative](../patterns/layout/section-narrative/) fixed 叠放变体 | ⚠️ 要并循环 | 同上,状态机在自己的 rAF 里读 `scrollY` |
| [parallax-cards](../patterns/scroll/parallax-cards/) | ⚠️ 要并循环 | 同上 |
| [scroll-snap-sections](../patterns/scroll/scroll-snap-sections/) | ❌ 冲突 | CSS `scroll-snap` 和平滑滚动互相抢滚动位置,Lenis 官方也标这个冲突。二选一:要 snap 就别上 Lenis |

**并循环的做法**:别自己再开一个 rAF,挂到 Lenis 的循环上——

```js
lenis.on('scroll', ({ scroll, velocity }) => {
  // scroll 就是当前位置,velocity 直接可用(marquee 的速度反馈不用自己差分了)
});
```

**三个必查项**:

- CSS 里的 `scroll-behavior: smooth` 必须去掉,和 Lenis 抢控制权
- 锚点跳转要换成 `lenis.scrollTo(target)`,原生 `#hash` 会瞬移
- `prefers-reduced-motion` 下应该直接不初始化 Lenis(平滑滚动本身就是运动),本库铁律 2 在这一层同样适用

## 侦察工具(怎么看别人用了什么)

- DevTools → Network → JS 文件名里搜 `gsap`、`three`、`lenis`
- Console 输入 `window.gsap`、`window.THREE` 试探全局变量
- Elements 里看 canvas 元素 → 有 WebGL context 基本就是 Three.js/OGL/shader
- [Wappalyzer](https://www.wappalyzer.com/) 浏览器插件识别框架

## 灵感来源

- [Awwwards](https://www.awwwards.com/) / [Godly](https://godly.website/) / [Minimal Gallery](https://minimal.gallery/)
- [Codrops](https://tympanus.net/codrops/) — 大量效果教程 + 源码
- [CodePen](https://codepen.io/) — 搜效果关键词直接看实现
