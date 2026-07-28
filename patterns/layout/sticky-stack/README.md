# 粘性堆叠 Sticky Stack

- **分类**: 布局手法
- **难度**: ★
- **见于**: [Lando Norris](../../../cases/lando-norris/analysis.md)(`sticky-track` / `sticky-item`,含滚动到位换主题的变体)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/layout/sticky-stack/demo.html)

## 设计意图

卡片一张压一张地"落"在同一个位置,滚动变成翻牌。它把平铺的并列内容变成有先后、有覆盖关系的叙事——每张卡独占注意力一屏,又始终暗示"下面还有"。

## 核心机制

核心是纯 CSS:每张卡 `position: sticky; top: 0`,后来者自然盖住先到者。JS 只做增强(前一张被盖住时缩小变暗):

```css
.card { position: sticky; top: 0; min-height: 100vh; }
```

```js
// 增强:用下一张卡的进场进度,压缩上一张
const p = 1 - next.getBoundingClientRect().top / innerHeight;  // 0→1
card.style.transform = `scale(${1 - p * 0.06})`;
```

## 实现要点

- 不用 JS 也完全成立——sticky 层叠是布局事实,scale/dim 只是锦上添花
- 每张卡要有**不透明背景**,否则下层透出来穿帮
- 卡片数量 3~6 张合适:太多了"翻不完",疲劳
- 想要 Lando 的主题切换变体:观察哪张卡贴顶(IntersectionObserver),把它的主题色写到 `document.documentElement` 的 CSS 变量上
- z-index 不用手动管,DOM 顺序天然正确

## 代价与注意

- 性能: sticky 本身零成本;scale 增强只动 transform
- 可访问性: 布局手法不受 reduced-motion 约束,但 scale 增强在 demo 里做了降级
- 移动端: iOS Safari 对 sticky 支持良好;注意 100vh 的地址栏问题(可用 100svh)

## 变体与延伸

- 卡片 `top` 依次 +2rem = 露出"牌堆边"的阶梯效果(demo 用法)
- CSS `animation-timeline: view()` 未来可让 scale 增强也零 JS(Chrome 已支持)
- 与 [theme-shift](../../transitions/theme-shift/) 组合就是 Lando 的 `sticky-track-theme-change`
