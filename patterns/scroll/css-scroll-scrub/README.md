# CSS 滚动擦洗 Scroll Scrub

- **分类**: 滚动动效
- **难度**: ★
- **见于**: [Anime.js 官网](../../../cases/animejs/analysis.md)(`onScroll({ sync: true })` 的同款体验);taxonomy 滚动类点名 `animation-timeline: scroll()`
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/scroll/css-scroll-scrub/demo.html)

## 设计意图

动画进度 = 滚动进度:往下滚动画前进,往回滚动画倒放,像手指擦洗(scrub)时间轴。和"进视口触发一次"(scroll-reveal)相比,scrub 把控制权完全交给用户——这是滚动叙事的地基,而现在纯 CSS 就能做。

## 核心机制

一条普通 `@keyframes`,把驱动它的时间轴从"时钟"换成"滚动条":

```css
.progress {
  animation: grow linear;
  animation-timeline: scroll();        /* 整页滚动进度驱动 */
}
.photo {
  animation: reveal linear both;
  animation-timeline: view();          /* 自己在视口中的位置驱动 */
  animation-range: entry 0% cover 45%; /* 从开始进入到盖住视口 45% */
}
@keyframes reveal { from { opacity: 0; transform: translateY(60px) scale(.92); } }
```

## 实现要点

- `scroll()` 是"页面滚了多少",适合进度条/全局背景;`view()` 是"我在视口哪儿",适合逐个元素入场
- `animation-range` 决定映射区间,`entry`/`cover`/`exit` 关键字比百分比好读
- keyframes 用 `linear`——缓动感来自用户手速,再叠 easing 会打架
- 渐进增强:`@supports (animation-timeline: scroll())` 包住,老浏览器退回静态(或退回 IntersectionObserver 版)
- JS 一行都没有,也就没有滚动监听的性能议题,浏览器在合成器上跑

## 代价与注意

- 性能: 合成器驱动,比 JS scroll handler 更顺;只动 transform/opacity 仍是铁律
- 可访问性: 包进 `@media (prefers-reduced-motion: no-preference)`,默认静态
- 兼容性: Chrome/Edge 稳定,Safari 26 起支持,Firefox 需开关——**必须**按渐进增强写,这也是它排 ★ 的原因:降级就是"没动画",无伤

## 变体与延伸

- 需要跨浏览器一致时上 GSAP ScrollTrigger(`scrub: true`)或 anime.js `onScroll({ sync: true })`——机制同款
- scrub 驱动 shader uniform 就是 [scroll-driven-shader](../scroll-driven-shader/)(JS 版滚动进度)
- 水平进度条 + 阅读场景 = 最被低估的实用款
