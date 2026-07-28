# 磁性按钮 Magnetic Button

- **分类**: 悬停交互
- **难度**: ★★
- **见于**: [Dennis Snellenberg](../../../cases/dennis-snellenberg/analysis.md)(`.magnetic`,被复刻最多的一颗);taxonomy 点名多年的欠账
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/hover/magnetic-button/demo.html)

## 设计意图

按钮迎向手指——"可点"从视觉暗示升级成物理暗示,交互半径大于按钮本身。它是"手感"类效果的代表作:没有颜色变化、没有图形,只靠位移就让人觉得这个站"做工好"。

## 核心机制

磁场里:偏移 = (指针 − 按钮中心) × 强度;松手:欧拉弹簧带初速弹回(和 [drag-spring](../drag-spring/) 同一颗弹簧):

```js
// 吸附(mousemove in 磁场)
const r = field.getBoundingClientRect();
tx = (e.clientX - r.left - r.width / 2) * PULL;    // PULL 0.3~0.5
ty = (e.clientY - r.top - r.height / 2) * PULL;
// 回位(mouseleave 起弹簧,复用 drag-spring 的半隐式欧拉)
vx += -K * x; vx *= DAMP; x += vx;
```

高级感的一半在**内层文字二级强度**:外壳拉 1×,文字再拉 0.5×——一颗按钮内部有视差(Dennis 的招牌细节)。

## 实现要点

- **磁场 ≠ 按钮**:监听挂在外层 wrapper(比按钮大一圈 padding),指针进入磁场按钮就开始迎,贴到按钮上之前手感已经发生
- 吸附时直接写目标值(跟手要快),回位才用弹簧——全程弹簧会"追不上"指针,肉一拍
- 弹簧参数即性格:K .12 / DAMP .82 是"利落弹一下";DAMP 调低会晃很多下,按钮不是玩具,克制
- 触屏 no-op(`pointer: fine`);键盘 `:focus-visible` 给等价反馈(demo 用轻微 scale),磁吸信息不丢
- transform 只写 translate,别动 layout;文字层用 CSS 变量接偏移,一次 rAF 写两层

## 代价与注意

- 性能: mousemove 高频 → 标脏 + rAF 合帧写(demo 写法);多颗按钮共享一个 rAF
- 可访问性: `prefers-reduced-motion` 禁用位移,保留原生 hover/focus 样式——磁吸是增强,不是按钮语义的一部分
- 移动端: no-op,正确行为

## 变体与延伸

- 与 [custom-cursor](../../cursor/custom-cursor/) 联动:进磁场时光标一起被吸向按钮中心,手感闭环
- 强度为负 = "躲避按钮"(愚人节玩具,别上生产)
- GSAP 等价一行:`gsap.to(btn, { x, y, ease: 'elastic.out(1, 0.3)' })`(回位)

## 并入 magnetic-pull 的补充(2026-07-26 去重)

原 `cursor/magnetic-pull` 与本 pattern 是同一机制,回位方式不同(CSS transition vs 欧拉弹簧),已删除并入这里。

**两种回位怎么选**:要"稳"(干脆到位、不过冲)用 CSS transition——`pointerleave` 时清空 `transform`,让 transition 自己送回去,零 JS 状态;要"弹"(有过冲、更有玩具感)用本文的欧拉弹簧。**按钮不是玩具,B 端场景优先选前者。**

CSS transition 版的关键:**吸附期间必须关掉位移过渡**(加一个 `.is-pulling` 类只保留颜色过渡),否则跟手会肉一拍;`pointerleave` 移除该类,transition 才接管回位。

另外两条实现细节:

- **位移要夹上限**:`dx * PULL` 在大按钮上会拉得太远,用按钮高度的 1/3 左右做 clamp
- 按钮多(>20)时把 `pointermove` 改成容器上事件委托 + `e.target.closest()`,别每个按钮一个监听器
- **一页别到处都是**:全站按钮都会动 = 没有一个是特别的,留给主 CTA 和 logo
