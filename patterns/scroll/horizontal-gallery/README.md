# 横向滚动画廊 Horizontal Scroll Gallery

- **分类**: 滚动动效 / 布局手法
- **难度**: ★★
- **见于**: [Lando Norris](../../../cases/lando-norris/analysis.md)(照片长廊)、大量 Awwwards 站
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/scroll/horizontal-gallery/demo.html)

## 设计意图

打破"网页只能往下滚"的预期:纵向滚动到某一段时内容开始横向移动,像镜头横摇。适合时间线、作品集、照片叙事——横向天然带"前进/回顾"的方向感。

## 核心机制

外层 section 高度撑到 300vh,内层 sticky 定住;用纵向滚动进度映射横向位移,rAF + lerp 加惯性:

```js
function onScroll() {
  const r = section.getBoundingClientRect();
  const p = clamp(-r.top / (r.height - innerHeight), 0, 1); // 0~1 进度
  target = p * (track.scrollWidth - innerWidth);
}
function loop() {
  cur += (target - cur) * 0.08;           // lerp 惯性
  track.style.transform = `translate3d(${-cur}px,0,0)`;
  requestAnimationFrame(loop);
}
```

## 实现要点

- 外层高度 = 想要的滚动"里程";内层 `position: sticky; top: 0; height: 100vh` 定住视口
- 只动 `transform: translate3d`,GPU 合成,不碰 left/margin
- lerp 系数 0.06~0.12:越小越"重",质感越像 Lenis
- 卡片上加基于位移的次级动画(轻微 parallax/倾斜)会立刻高级很多
- GSAP 等价物: `ScrollTrigger` 的 `pin: true, scrub: 1`,需求复杂时直接换

## 代价与注意

- 性能: rAF 常驻但计算量极小;注意 track 里图片要懒加载
- 可访问性: demo 已做 `prefers-reduced-motion` 降级为原生横向滚动条
- 移动端: 触摸滚动惯性与 lerp 疉加可能过滑,建议移动端减小惯性或降级

## 变体与延伸

- 进度条/计数器与横移联动(Lando 的年份标注)
- 横移中某卡片放大接管全屏 → 进入详情的转场
