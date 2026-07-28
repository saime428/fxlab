# Stagger 网格波纹 Stagger Grid

- **分类**: 文字动效 / 通用编排
- **难度**: ★
- **见于**: [Anime.js 官网](../../../cases/animejs/analysis.md)(13×13 网格 from center)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/text/stagger-grid/demo.html)

## 设计意图

一群元素不同时动,而是按"离波心的距离"依次动——瞬间产生物理直觉上的涟漪。这是编排(orchestration)最基础也最万能的一课:同样的动画,加上空间化的 delay 就活了。

## 核心机制

delay = 到波心的距离 × 每单位延迟:

```js
const d = Math.hypot(col - cx, row - cy);      // 网格距离
el.style.transitionDelay = `${d * 60}ms`;      // 距离→时间
```

anime.js 一行等价: `stagger(60, { grid: [13,13], from: 'center' })`

## 实现要点

- 波心可以是中心、角落、鼠标点击处(demo 支持点击换波心)
- 每单位 40~80ms:太小看不出波,太大像卡了
- 动画本体越简单越好(scale/opacity 二选一),复杂动画 × 波纹会乱
- 同理可用于:文字逐字入场(距离=字符序号)、卡片列表、像素画

## 代价与注意

- 性能: 200 个以内元素随便玩;上千个改用 canvas/WebGL
- 可访问性: `prefers-reduced-motion` 直接显示终态
- 波纹是强注意力效果,一页用一次,别当壁纸

## 变体与延伸

- delay 加噪声(±20ms)更有机
- 反向波(from: 'edges' 向心收拢)适合"聚合成 logo"的叙事
