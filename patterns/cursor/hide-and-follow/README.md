# 区域内隐藏光标 + 跟随标签 Hide and Follow

- **分类**: 鼠标跟随
- **难度**: ★★
- **见于**: [sakazuki](https://sakazuki.io/)(Journey 段:`cursor:none` 挂在 `.stepHideCursor`,配一个 84×33 的 `viewDetailCursorButton` 跟随)、[PP Neue Montreal](https://neuemontreal.com/)、[Dragonfly Redux](https://www.dragonfly.xyz/)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/cursor/hide-and-follow/demo.html)
- **来源**: [2026-07 Awwwards 横截面扫描](../../../blends/scans/2026-07-awwwards.md)

## 设计意图

在**特定交互区**(作品网格、地图、可拖动的画廊)把原生光标换成一个说明标签——"查看详情""拖动""播放"。光标从系统部件变成 UI 的一部分,顺带把"这里能点"这件事说清楚,省掉一层 hover 提示。

关键词是**区域内**。扫描到的站里,`cursor: none` 基本都挂在段落级的 class 上(`.stepHideCursor` / `.hero-mask`),很少全局——全局藏光标在表单和链接上是可用性灾难。

## 这只是四条路子里的一条

[扫描](../../../blends/scans/2026-07-awwwards.md#四自定义光标四条路子合计-18)显示 **18% 的获奖站动了光标(112/629)**,但做法分四种:

| 路子 | 在用 | 本库 |
|---|---|---|
| 藏光标 + JS 跟随(**本 pattern**) | 67 站 | ✅ |
| **只加跟随元素,不藏原生光标** | 35 站 | ☐ 候选:Lemaire `.silhouette-cursor`、Salo Creative `.Cursor__name`、Juan Mora `.cursor-jm-icon` |
| `cursor: url(...)` 换成图 | 16 站 | ☐ 成本最低的一条,`url("data:image/svg+xml,...")` 内联不多一次请求 |
| JS 直接写 `el.style.cursor` | 21 站 | —— 实现细节,不单独成 pattern |

选哪条:**要"光标变成 UI"(带文案/图标/状态)就藏 + 跟随**;只想加点质感,第二条(留着原生光标叠一个圆环)可用性代价最小;纯粹换个图标形状,第三条一行 CSS 就够,别上 JS。

## 核心机制

```css
.zone      { cursor: none; }                       /* 只在交互区 */
.follower  { position: fixed; pointer-events: none;
             opacity: 0; transition: opacity .3s, visibility 0s linear .3s; }
.follower.on { opacity: 1; visibility: visible; transition-delay: 0s; }
```

```js
let tx = 0, ty = 0, x = 0, y = 0;                  // 目标位 / 当前位
zone.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
const tick = () => {
  x += (tx - x) * LERP; y += (ty - y) * LERP;      // 一阶低通,LERP≈.15
  follower.style.transform = `translate3d(${x}px,${y}px,0)`;
  requestAnimationFrame(tick);
};
```

`visibility 0s linear .3s` 那一条是重点:延迟切 visibility,让元素在淡出的 300ms 里还留在画面上,淡完才真正移出无障碍树。sakazuki 原样就是这么写的。

## 实现要点

- **进区第一帧要瞬移**:不先把 `x, y` 设成当前指针位置,标签会从 `(0,0)` 一路飞过来。`pointerenter` 里 `x = tx = e.clientX` 直接同步一次,再开 lerp
- `LERP` 是唯一的手感旋钮:`.08` 很粘很奢侈,`.15` 是常见值,`1` 等于硬跟随(廉价感)。跟原生光标差太远会晕,别低于 `.06`
- 标签只动 `transform`,别动 `left/top`
- 触屏没有光标:整段用 `@media (hover: hover) and (pointer: fine)` 包起来,触屏上原生光标和标签都不出现
- 键盘用户拿不到 `pointermove`:卡片必须有正常的 `:focus-visible` 焦点环,**不要**试图用跟随标签替代它
- 标签配 [layout/blend-invert](../../layout/blend-invert/) 的 `mix-blend-mode: difference`,在深浅不定的图片上都可见——两个 pattern 天然组合

## 代价与注意

- **可访问性**:隐藏原生光标会丢掉系统给的 text/pointer/grab 语义提示。所以只在"内容是图像、交互只有一种"的区域用;有表单、有多种可点元素的区域别用
- `prefers-reduced-motion`: 关掉 lerp(直接赋值),或干脆不隐藏原生光标——库里选后者,最保守
- rAF 循环只在指针进区时跑,离开就停,别全程空转
- 标签里的文字要短(1-2 个词)。sakazuki 那个是 84×33,再大就挡住内容了
- 移动端不是"降级成静态",是**整个效果不存在**——这不是遗憾,触屏本来就没有 hover 这个状态

## 变体与延伸

- 标签换成放大镜/播放键图标,同一套机制
- 加一层滞后更大的外圈(两个 follower 不同 LERP)= 经典"双环光标",但成本翻倍且容易显廉价,一页最多一处
- 拖动场景把文案换成 `DRAG`,配 [hover/drag-spring](../../hover/drag-spring/)
- 想要拖尾:把历史位置存成数组画在 canvas 上,成本高一档,属于另一个 pattern
