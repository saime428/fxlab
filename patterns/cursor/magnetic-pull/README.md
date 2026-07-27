# 磁性吸附 Magnetic Pull

- **分类**: 鼠标跟随
- **难度**: ★★
- **见于**: Awwwards 上按钮/logo 的通用微交互;本库 [2026-07 扫描](../../../blends/scans/2026-07-awwwards.md)的 CSS 侧探测不到它(位移全在 JS 里),**来源等级低于其他 cursor pattern**——机制是通用做法,不是从某一站实测提炼
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/cursor/magnetic-pull/demo.html)

## 设计意图

指针靠近按钮时,**按钮朝指针挪一点**,像被磁铁吸住;移开就弹回。它不改光标,改的是"被指的东西"——所以和任何一种自定义光标都能叠加,不冲突。

价值在**扩大有效点击区的心理感受**:按钮迎上来,用户会觉得"它在等我点",而实际热区一点没变。

## 核心机制

```js
el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width  / 2);   // 指针相对按钮中心的偏移
  const dy = e.clientY - (r.top  + r.height / 2);
  el.style.transform = `translate(${dx * PULL}px, ${dy * PULL}px)`;
});
el.addEventListener('pointerleave', () => { el.style.transform = ''; });
```

`PULL` 是吸附强度(0.2–0.4)。回弹靠 CSS `transition`,不用写弹簧——**离开时清空 `transform`,transition 自己把它送回去**。

## 实现要点

- **感应区要比按钮大**:只在按钮自身上监听,指针碰到边缘才开始吸,几乎看不出效果。用一个透明的 padding 包裹层当感应区,视觉按钮在里面
- 吸附时 `transition` 要短或为 0(跟手),回弹时才需要长 transition。做法:吸附期间加 `.is-pulling` 关掉过渡,`pointerleave` 时移除
- **位移上限**:`dx * PULL` 在大按钮上会拉得太远,`Math.max(-MAX, Math.min(MAX, …))` 夹一下,MAX 取按钮高度的 1/3
- 内部文字可以用更小的 `PULL` 再位移一次(视差),幅度差制造"厚度"
- 只动 `transform`,别动 `left/top`

## 代价与注意

- **触屏完全无效**,`@media (hover:hover) and (pointer:fine)` 里才启用
- **键盘用户拿不到**:焦点态必须有等价的视觉反馈(`:focus-visible` 的描边/位移),不能只有磁性
- `prefers-reduced-motion` 下整个关掉——位移类微交互是前庭敏感的典型触发源
- 每个按钮一个 `pointermove` 监听器。按钮多(>20)时改成在容器上做事件委托,用 `e.target.closest()` 找目标
- **一页别到处都是**。全站按钮都会动 = 没有一个是特别的;留给主 CTA 和 logo

## 变体与延伸

- 吸附 + [follower-ring](../follower-ring/) 的圆环同时缩到按钮尺寸 = "光标吞掉按钮"
- logo 用它,幅度调到很小(`PULL` 0.1),只在鼠标经过时轻微呼吸
- 想要真弹簧回弹(过冲)而不是 ease-out,直接复用 [hover/drag-spring](../../hover/drag-spring/) 的半隐式欧拉积分
