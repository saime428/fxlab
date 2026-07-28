# 视差漂浮卡片 Parallax Cards

- **分类**: 滚动动效
- **难度**: ★
- **见于**: [Shopify Editions W26](../../../cases/shopify-editions-winter-26/analysis.md)(`cloud-card-parallax`,更新卡片以不同速率漂浮)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/scroll/parallax-cards/demo.html)

## 设计意图

同一屏的元素以不同速度移动,平面立刻有了纵深——快的近、慢的远。比起正经 3D,这是"假立体"里成本最低的一档,群组卡片/贴纸/云朵尤其吃这套。

## 核心机制

每个元素标一个速度系数,偏移 = (元素中心离视口中心的距离) × (系数 - 1):

```js
// data-speed: 1 = 正常随页面滚,>1 更快(显得近),<1 更慢(显得远)
const rect = el.getBoundingClientRect();
const fromCenter = rect.top + rect.height / 2 - innerHeight / 2;
el.style.transform = `translate3d(0, ${fromCenter * (speed - 1)}px, 0)`;
```

以"视口中心"为零点,元素滚到屏幕正中时回到原位——排版在关键位置是所见即所得的。

## 实现要点

- 系数区间 0.8~1.3 就够;超过 1.5 元素会飞出自己的区域,要么给足 margin 要么 clamp
- scroll 里只标脏,rAF 里统一算(demo 写法),避免高频 rephaint
- 以视口中心为零点这个细节很关键:零点取页面顶部的话,越往下偏移越大,排版不可控
- 元素别参与文档流布局的关键路径(绝对定位或独立区块),transform 不会影响别人
- CSS 原生替代:`animation-timeline: view()` + 一条位移 keyframes,零 JS(Chrome 系已可用,Firefox/Safari 还在路上)

## 代价与注意

- 性能: 只动 transform;几十个元素共享一个 rAF 无压力
- 可访问性: `prefers-reduced-motion` 全部回到静态排版
- 移动端: 有效,但幅度减半更舒服(视口小,同样偏移显得剧烈)

## 变体与延伸

- 横向视差(x 轴)配 [横向画廊](../horizontal-gallery/) 用
- 鼠标视差(mousemove 代替 scroll 作输入)是同一个公式,换个输入源
- 加一点 `rotate(fromCenter * 0.01deg)` 卡片会"飘"而不只是"滑"
