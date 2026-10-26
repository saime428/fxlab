# 打字标题交接 Typed Title Handoff

- **分类**: 加载动画
- **难度**: ★★
- **见于**: [claude.dev](https://claude.dev/) 首页(站名打字揭开,再落到左侧真标题;2026-10)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/loading/typed-title-handoff/demo.html)

## 设计意图

编辑站、文档站、工具站的开场要安静。标题先像终端一样逐字露出来,打完揭开的就是页面上那一行真标题,而不是再播一段跟版面无关的片头。每天看一次就够,刷新不该再演。

## 核心机制

整词一开始就在 DOM 里。一块同色遮罩用 `step-end` 按 `1ch` 往右挪,字被揭开,而不是一个一个插节点。等宽字体下 `1ch` 等于一个字。打完后遮罩淡出,浮动的那一行藏掉,底下的 `h1` 出现在同一位置。

```css
#live { anchor-name: --live; }
#ghost { position-anchor: --live; top: anchor(top); left: anchor(left); }
#ghost .cover { animation: pre-cover var(--pre-typed) step-end forwards; }
@keyframes pre-cover { 0% { transform: none } 100% { transform: translateX(10ch) } }
```

步数按字数生成(demo 里写进临时 stylesheet)。不支持 `anchor-name` 时,用真标题的 `getBoundingClientRect()` 把浮动行摆到同一点。

## 实现要点

- 标题必须等宽。比例字体的 `1ch` 是「0」的宽度,遮罩和字对不齐
- 光标 `position: absolute`,不参与行盒,否则浮动行比真标题宽,锚点对上了字还是歪的
- 真 `h1` 用 `opacity` 藏,不用 `visibility: hidden`,读屏从第一帧就能读到标题
- 遮罩和页面底是同一个 `--bg`。字打在遮罩上面,页面在底下提前排好,淡出时不会空一拍
- `ONCE_H` 用 `localStorage` 做门。本 demo 设 `0`(每次都播,方便看机制);画廊用 `24`
- 标签页在后台时不要开播。等 `visibilitychange` 再加 `intro-on`,否则用户回来只看见尾帧
- `prefers-reduced-motion` 直接终态:没有遮罩,标题在它的版心位置

## 代价与注意

- 性能:一段短 CSS 动画,没有常驻 rAF。字数只影响关键帧条数
- 可访问性:降级后没有计时器;重播是一颗按钮,`:focus-visible` 有下划线。浮动行 `aria-hidden`,避免标题被读两遍
- 移动端:标题 `nowrap`。超过大约 12 个等宽字就要缩小字号,否则遮罩的 `ch` 步长还在,字已经换行
- 刷新体验:真站如果忘记做「每天一次」,这个效果会从舒服变成挡路

## 变体与延伸

- 交接目标可以是导航里的字标,不一定是 hero 的 `h1`。两边字体、字号、字重必须是同一套,否则落点会跳
- 列表错峰入场(每行 70ms、上移 12px)是伴奏,机制在 [stagger-grid](../../text/stagger-grid/)。强注意力效果不要再加一条
- 跟 [entry-preloader](../entry-preloader/) 的差别:那边是进度和 Enter 门,给重资源站用;这边没有门,打完就变成页面自己的标题
