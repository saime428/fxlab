# 跟随圆环 Follower Ring

- **分类**: 鼠标跟随
- **难度**: ★
- **见于**: Blit Studio(`#cursor`)、Tenity(`#cursor`)、FURO Web(`.custom-cursor`)、Lunchlab(`.cursor`)、NVRMND Studio(`.is--cursor .cursor`)
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/cursor/follower-ring/demo.html)
- **来源**: [2026-07 扫描](../../../blends/scans/2026-07-awwwards.md),33/691 站,是四条光标路子里**最常用的一条**

## 设计意图

**不动原生光标**,只在它旁边叠一个滞后跟随的圆环。系统光标还在,该有的 text/pointer 语义提示一个不少;圆环只负责"有人在操作"的质感。

这是自定义光标里**可用性代价最小**的一条路——比 [hide-and-follow](../hide-and-follow/) 保守得多,适合全站常驻。扫描里 33 站在用,比藏光标那条路子更常见。

## 核心机制

```css
.ring{ position:fixed; top:0; left:0; width:32px; height:32px;
       margin:-16px 0 0 -16px;              /* 圆心对准指针 */
       border:1px solid currentColor; border-radius:50%;
       pointer-events:none; }
```

```js
let tx=0,ty=0,x=0,y=0;
addEventListener('pointermove',e=>{ tx=e.clientX; ty=e.clientY; });
const tick=()=>{ x+=(tx-x)*LERP; y+=(ty-y)*LERP;
  ring.style.transform=`translate3d(${x}px,${y}px,0)`; requestAnimationFrame(tick); };
```

滞后是**唯一的效果来源**:圆环追不上光标,追赶的过程就是质感。`LERP` 越小越粘。

## 实现要点

- **首帧瞬移**:第一次 `pointermove` 时把 `x,y` 直接设成指针位置,否则圆环从 `(0,0)` 飞过来
- 圆环用 `border` 不用 `background`,中间要透,不然挡住原生光标
- hover 可交互元素时放大 + 降透明度:`document.querySelectorAll('a,button')` 上挂 `pointerenter/leave` 切一个 class 就够,别对每个元素单独算
- 只动 `transform`,`margin` 负值做居中(比每帧算 `-16` 省)
- 触屏用 `@media (hover:hover) and (pointer:fine)` 整个关掉

## 代价与注意

- 常驻全站的效果,**一定要给 `prefers-reduced-motion` 关掉**——持续跟随的动画对前庭敏感人群不友好
- rAF 全程在跑。页面隐藏时用 `visibilitychange` 停掉,别后台空转
- 圆环颜色跟不上深浅背景 → 配 [layout/blend-invert](../../layout/blend-invert/) 的 `mix-blend-mode: difference`,见 [cursor/blend-dot](../blend-dot/)
- 不要同时上这个和 [hide-and-follow](../hide-and-follow/),两套光标叠一起是灾难

## 变体与延伸

- 双层(外圈滞后大、内点滞后小)= 经典双环,成本翻倍,一页最多一处
- hover 链接时圆环吸附到链接矩形上(读 `getBoundingClientRect` 插值 width/height/圆角)—— Awwwards 上常见的"光标吞掉按钮"
- 圆环换成文字标签就是 [hide-and-follow](../hide-and-follow/)
