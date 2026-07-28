# 光标拖尾 Cursor Trail

- **分类**: 鼠标跟随
- **难度**: ★★
- **见于**: Awwwards 上体验型/作品集站的常见装饰;CSS 侧探测不到(轨迹全在 JS/canvas 里),**来源等级低于其他 cursor pattern**——机制是通用做法,不是从某一站实测提炼
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/cursor/cursor-trail/demo.html)

## 设计意图

指针后面拖一串越来越小、越来越淡的点。它不传达任何信息,**纯粹是"这个页面是活的"的信号**——所以只适合体验型站、作品集、活动页,B 端页面上它是噪音。

## 核心机制

**链式 lerp**:第一个点追指针,第二个点追第一个点,第 n 个追第 n−1 个。不用存历史轨迹,不用数组滑窗。

```js
const pts = [...Array(N)].map(() => ({ x: 0, y: 0 }));
const tick = () => {
  let px = mouseX, py = mouseY;
  for (const p of pts) {
    p.x += (px - p.x) * LERP; p.y += (py - p.y) * LERP;
    px = p.x; py = p.y;                       // 下一个追这一个
    p.el.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
  }
  requestAnimationFrame(tick);
};
```

尾巴的形状是**链式滞后自然长出来的**,不是画出来的。改 `N` 改长度,改 `LERP` 改松紧。

## 实现要点

- **点数 4-6 是甜点区,不是越多越长越好**。链式 lerp 是一串串联的一阶滤波器,每多一节延迟就叠一层:`N=14` 时最后几个点的收敛时间长到肉眼看就是**钉在原地不动**,尾端永远挂在页面上某个位置。这不是 bug,是点数太多的必然结果。**点少反而对**——尾端跟着鼠标走,只是滞后一点,那才叫"尾巴"
- **DOM 点比 canvas 省事**:N 个 `<i>`,每帧写 `transform`。这个量级 DOM 完全够用,canvas 的收益要到几百个粒子才体现
- 大小和透明度按索引递减,直接写在初始化里,不用每帧算:`el.style.scale = 1 - i/N`
- **单 rAF**。N 个点共用一个循环,别每个点一个
- 页面隐藏时停 rAF(`visibilitychange`),否则后台空转 20 个 transform
- 点要 `pointer-events:none`,而且挂在 `body` 直属子级(想配 `mix-blend-mode` 的话必须,见 [blend-dot](../blend-dot/))
- **光标从哪进页面,尾巴就从哪开始**。只把 `p.x/p.y` 设成指针位置**不够**——`transform` 要等下一个 rAF 才写,那一帧里元素还在 `(0,0)` 而淡入已经开始,于是能看到一串点从左上角甩过来。首次 `pointermove` 里**必须同步写一次 `transform`**,别交给 rAF

## 代价与注意

- **`prefers-reduced-motion` 必须整个关掉**。持续的拖尾运动是前庭敏感的强触发源,比单个跟随点严重
- **触屏无效**,`@media (hover:hover) and (pointer:fine)` 里才启用
- 不传达信息 = 纯装饰。**它和页面上任何"要读的东西"抢注意力**,内容密集的页面别用
- N 一大就适得其反(见上):尾端不再跟随,变成一个挂在页面上的静止点
- 和 [custom-cursor](../custom-cursor/) / [hide-and-follow](../hide-and-follow/) 二选一,叠加就是一团乱

## 变体与延伸

- 点换成品牌 logo / 字母,每个点一个字 = "拖出一个词"
- 全部点加 `mix-blend-mode: difference`(见 [blend-dot](../blend-dot/)),深浅背景通吃
- 要真正的连续曲线(不是离散点)得上 canvas 画 polyline,并按速度调线宽——那是另一个量级的成本
- 速度越快尾巴越长:把 `LERP` 做成指针速度的函数,静止时尾巴收拢
