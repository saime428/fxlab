# SVG 线条绘制 Line Draw

- **分类**: 文字动效 / 加载动画
- **难度**: ★★
- **见于**: [Anime.js 官网](../../../cases/animejs/analysis.md)(赛道绘制)、无数签名/logo 入场
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/text/svg-line-draw/demo.html)

## 设计意图

"被一只看不见的手画出来"——把静态图形变成过程,天然适合签名、logo、地图路线、图表。观众会不自觉等它画完,是极强的注意力锚。

## 核心机制

`stroke-dasharray` 设为路径总长,`stroke-dashoffset` 从总长动画到 0:

```js
const len = path.getTotalLength();
path.style.strokeDasharray = len;
path.style.strokeDashoffset = len;          // 全隐藏
path.style.transition = 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)';
requestAnimationFrame(() => path.style.strokeDashoffset = 0); // 画出来
```

## 实现要点

- 必须是 `stroke` 描边图形;填充型 logo 要先转"描边版"再叠加填充淡入
- `getTotalLength()` 动态取长,别硬编码——改路径就断
- 多条路径用递增 delay(stagger),"先画轮廓再画细节"
- 触发时机交给 IntersectionObserver,进视口再画
- anime.js v4 等价物: `createDrawable()` + `draw: '0 1'`;GSAP 用 DrawSVGPlugin(付费)

## 代价与注意

- 性能: dashoffset 动画在多数浏览器走合成层,但超复杂路径(几千锚点)会卡,先简化路径
- 可访问性: `prefers-reduced-motion` 时直接显示成品
- 长路径的视觉速度不均:dashoffset 线性变化,曲线密集处显得慢,重要作品用 easing 或分段补偿

## 变体与延伸

- 画完后 `fill` 淡入(签名 → 实体 logo)
- 和滚动 scrub 绑定:滚多少画多少(`animation-timeline: view()` 纯 CSS 可做)
- 虚线滚动流动(dashoffset 无限循环)做"行进路线"
