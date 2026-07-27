# Canvas 氛围背景 Ambient Background

- **分类**: 3D / WebGL(canvas 渲染)
- **难度**: ★★
- **见于**: [Hashgraph Ventures](../../../cases/hashgraph-ventures/analysis.md)(实测:主视觉是全屏 2D canvas,不是 WebGL)
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/3d-webgl/canvas-ambient-bg/demo.html)

## 设计意图

内容后面有一层缓慢流动的光,页面就从"文档"变成"空间"。它不抢戏、不叙事,只负责让人觉得"这站有氛围"——高级感的地板价方案:不需要 WebGL、shader、Three.js。

## 核心机制

几个大半径径向渐变圆斑,正弦漂移 + `lighter` 叠加混合,每帧重画:

```js
ctx.globalCompositeOperation = 'lighter';   // 颜色相加,重叠处发光
blobs.forEach(b => {
  const x = b.x + Math.sin(t * b.sx + b.p) * b.ax;   // 无噪声库:正弦叠加即"伪随机漂移"
  const y = b.y + Math.cos(t * b.sy + b.p) * b.ay;
  const g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
  g.addColorStop(0, b.color); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
});
```

## 实现要点

- canvas 尺寸 × `devicePixelRatio`,否则 Retina 上糊;resize 时重设
- 圆斑半径给大(视口的 40%~70%),要的是"光",不是"球"
- 不同圆斑用互质的正弦频率,轨迹永不重复,看起来就是"有机"
- 页面不可见时停 rAF(`visibilitychange`);背景层 `pointer-events: none` + `position: fixed; z-index: -1`
- 想再降一档成本:纯 CSS 大圆 `filter: blur(120px)` + `@keyframes` 位移也能凑合,但 blur 大面积开销反而可能更高

## 代价与注意

- 性能: 每帧 3~5 个渐变 fillRect,桌面无感;移动端把 canvas 分辨率减半(dpr 封顶 1.5)
- 可访问性: `prefers-reduced-motion` 画一帧静态光斑就停
- 对比度: 光斑别飘到正文底下抢对比度,压暗透明度或限制活动区域

## 变体与延伸

- 圆斑颜色接品牌色变量,主题切换时背景跟着换气质
- 鼠标位置作为其中一个圆斑的目标点(lerp 跟随)= 低配版交互光标光晕
- 升级路线:同样的圆斑逻辑搬进 fragment shader(smoothstep 距离场),就是 WebGL 版

## 实战笔记

- **首帧同步画,不要交给 rAF**:`requestAnimationFrame(loop)` 的第一帧在 rAF 被冻结/节流时永远不来,画布就是一块空白 —— 氛围背景退化成纯色底,页面直接"简陋"。在启动循环前先同步 `draw(performance.now())` 一次,成本一帧,收益是最坏情况下还有静态色斑
- 同理适用于任何"用 canvas 铺底"的效果:静态首帧是保底画面,动画是增量

> 来源:[blends/hashgraph-x-lando](../../../blends/hashgraph-x-lando/) 糅合 pilot,2026-07-26
