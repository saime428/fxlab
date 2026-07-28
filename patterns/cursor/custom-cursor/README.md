# 自定义光标 Custom Cursor

- **分类**: 鼠标跟随
- **难度**: ★★
- **见于**: [Cuberto](../../../cases/cuberto/analysis.md)(`.cb-cursor` 四态状态机,行业原型)
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/cursor/custom-cursor/demo.html)

## 设计意图

光标是用户注视时间最长的元素——把它从系统箭头换成品牌的一部分,整站气质立刻"定制"。进阶玩法是状态机:能点的地方它放大、有说明的地方它开口、有预览的地方它变成窗口,一个元素承载全站交互语言。

## 核心机制

fixed 层 lerp 逼近真实指针(滞后感是"活"的来源),状态用事件委托切换——元素声明 `data-cursor`,光标读它变身:

```js
x += (mx - x) * EASE;                       // lerp:系数即人格,.1 慵懒 .3 跟手
dot.style.transform = `translate(${x}px, ${y}px)`;

addEventListener('mouseover', e => {        // 委托:别给每个元素绑 listener
  const t = e.target.closest('[data-cursor]');
  cursor.dataset.state = t ? t.dataset.cursor : '';
  cursor.querySelector('.cursor-label').textContent = t?.dataset.cursorText || '';
});
```

```css
.cursor { position: fixed; top: 0; left: 0; pointer-events: none; z-index: 999; }
.cursor[data-state="grow"] .dot { scale: 3.5; }
```

## 实现要点

- **触屏整机 no-op(本分类铁律)**:`matchMedia('(pointer: fine)')` 不匹配就不初始化、不隐藏系统光标——触屏上渲染一个跟不了手的点是 bug 不是效果
- `cursor: none` 只在自定义层就绪后再加(JS 挂 class),否则脚本失败 = 用户没有任何光标
- 双层结构(小点 1× 速度 + 大环 0.65× 速度)一行成本,拖尾感免费
- 反色变体:光标纯白 + `mix-blend-mode: difference`,任何背景上都可读(Cuberto 经典版手法)
- 键盘用户没有光标:文字态是增强不是唯一标签,`data-cursor-text` 的信息必须在元素本体也可得
- 鼠标离开窗口(`mouseleave` on documentElement)光标缩零,别留一个孤儿点

## 代价与注意

- 性能: 一个常驻 rAF,两次 transform 写入;收敛检测可停轮,但光标场景移动频繁,意义不大
- 可访问性: 光标层 `aria-hidden` + `pointer-events: none`;`prefers-reduced-motion` 去掉 lerp 滞后(直接贴指针)或整体不启用
- 移动端: no-op,见第一条——这不是降级,是正确行为

## 变体与延伸

- 媒体预览态(Cuberto 玩法):光标盒里塞 `<img>/<video>`,hover 作品项时展开——机制仍是"状态机 + 容器变形"
- 拖尾:N 个层递减 lerp 系数,就是彗星
- 与 [magnetic-button](../../hover/magnetic-button/) 联动:进磁场时光标被一起吸向按钮中心,手感闭环

## 并入 follower-ring 的补充(2026-07-26 去重)

原 `cursor/follower-ring`(单层圆环,不藏原生光标)是本 pattern 的子集,已删除并入。它多记的几条:

- **不藏原生光标是可用性代价最小的一条路**。扫描实测 33 站这么做,比 `cursor:none` 那条更常见:系统光标还在,text/pointer 语义提示一个不少,圆环只负责质感。**全站常驻优先选这个模式**,`cursor:none` 留给作用域化的交互区
- **圆环用 `border` 不用 `background`**,中间要透,否则挡住原生光标

### 炸场变体:hover 时炸开盖满视口

hover 可交互元素时,别只放大一点点——那会让圆环看起来"没跟上、挂在页面上"。要么不动,要么做满:

```css
.ring{ mix-blend-mode:difference; }            /* ← 常开,不能只写在 hover 态 */
.ring.hot{ scale:var(--burst); background:#fff; border-color:#fff; }
```
```js
// 圆环 32px,要从视口任意一点盖满,直径得 ≥ 2×对角线
root.style.setProperty('--burst', Math.ceil(2 * Math.hypot(innerWidth, innerHeight) / 32));
```

盖满后填纯白 + `difference` 让整页反相,**文字仍然可读**,不是糊一层色块。两个坑:

- **`mix-blend-mode` 不可动画**,只会瞬间跳变。只写在 hover 态上,进出时颜色会硬翻一次,观感是"原来那个被删掉了、另一个飞进来"——必须两个状态都常开
- **展开期间要停止写 `transform`**。一个盖满屏幕的圆再跟着指针平移,观感同样是"从外面飞进来"而不是"原地放大";锚住即可,缩回后位置自己追上
- 倍率必须按视口算并在 `resize` 时更新,写死的数字在超宽屏上会露边
