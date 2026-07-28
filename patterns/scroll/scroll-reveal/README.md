# 滚动渐显 Scroll Reveal

- **分类**:滚动动效
- **难度**:★
- **见于**:几乎所有 Awwwards 获奖站
- **Demo**:[demo.html](https://saime428.github.io/fxlab/patterns/scroll/scroll-reveal/demo.html)

## 设计意图

内容不是"已经在那",而是"随着你的探索逐渐出现"——给页面建立节奏感,把长页面变成有序的叙事。

## 核心机制

IntersectionObserver 监听元素进入视口,加一个 class,剩下交给 CSS transition。

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target); // 只播放一次
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
```

## 实现要点

- 初始态 `opacity: 0; transform: translateY(40px)`,只动 opacity/transform,不触发重排
- 同组元素用 `transition-delay` 做 stagger(逐个错开),比同时出现高级得多
- `threshold: 0.15` 让元素露出 15% 再触发,避免"刚露头就播完"
- 触发一次后 `unobserve`,省性能

## 代价与注意

- 性能:几乎零开销,IntersectionObserver 是异步的
- 可访问性:demo 中已加 `prefers-reduced-motion` 降级,直接显示无动画
- 移动端:表现一致,无需特殊处理

## 变体与延伸

- 逐字/逐行文字入场:先用 SplitType 拆字,再对每个字符做 reveal
- 与 CSS `animation-timeline: view()` 对比:纯 CSS 方案,但兼容性还在铺开
