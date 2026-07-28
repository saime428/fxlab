# 鼠标跟随

自定义光标、拖尾、跟随元素

扫描实测:**19% 的获奖站动了光标**,做法分四条路子([2026-07 扫描](../../blends/scans/2026-07-awwwards.md))。下表按**可用性代价从低到高**排,不是按炫酷程度:

| 效果 | 难度 | 路子 | Demo |
|---|---|---|---|
| [图片光标](image-cursor/) | ★ | `cursor:url()` 换图,零 JS | [demo](https://saime428.github.io/fxlab/patterns/cursor/image-cursor/demo.html) |
| [反色光标点](blend-dot/) | ★★ | 跟随 + `mix-blend-mode` | [demo](https://saime428.github.io/fxlab/patterns/cursor/blend-dot/demo.html) |
| [区域内隐藏光标 + 跟随标签](hide-and-follow/) | ★★ | 藏原生光标,光标变 UI | [demo](https://saime428.github.io/fxlab/patterns/cursor/hide-and-follow/demo.html) |
| [自定义光标](custom-cursor/) | ★★ | 双层跟随 + `data-cursor` 委托的四态状态机 | [demo](https://saime428.github.io/fxlab/patterns/cursor/custom-cursor/demo.html) |
| [光标拖尾](cursor-trail/) | ★★ | 纯装饰,链式滞后 | [demo](https://saime428.github.io/fxlab/patterns/cursor/cursor-trail/demo.html) |
| [光标跟随预览图](image-follow/) | ★★ | 文字列表 hover 出图,图跟着光标 | [demo](https://saime428.github.io/fxlab/patterns/cursor/image-follow/demo.html) |
| [光标手电筒](spotlight-mask/) | ★★ | 遮罩挖洞,光标决定你看见哪一层 | [demo](https://saime428.github.io/fxlab/patterns/cursor/spotlight-mask/demo.html) |

**选型口径**:只想换个图标形状 → `image-cursor`(一行 CSS,零 JS);想要质感/品牌感 → `custom-cursor`(双层跟随 + 四态状态机,不藏原生光标那一版可用性代价最小);深浅背景通吃 → `blend-dot`;光标要带文案、且要藏掉原生光标 → `hide-and-follow`;列表 hover 出图 → `image-follow`;纯装饰、内容不密集 → `cursor-trail`;要"光标决定看见哪一层" → `spotlight-mask`。

> **2026-07-26 去重记录**:两个会话并行补过这个分类,产出了四组同机制重复,已合并——
> `follower-ring` → 并入 `custom-cursor`(后者是含状态机的超集);
> `magnetic-pull` → 并入 [hover/magnetic-button](../hover/magnetic-button/)(taxonomy 里"磁性按钮"本就属 hover)。
> 被删者的独有内容都写进了保留者的"并入…补充"一节,没有丢。
>
> 仍保留但相近的一组:`hide-and-follow` 与 `image-follow` 机制同源(lerp 跟随物),**差别是产物不是手法**——前者藏掉原生光标、跟随物是文字标签(光标变 UI);后者保留原生光标、跟随物是图片(内容预览)。两个别同时用。

**要"炸场"的三个**(记忆点级别,一页最多用一个):

- `custom-cursor` 的 hover 炸场态——圆环炸开盖满视口并把整页反相,移开缩回(见其 README "并入 follower-ring 的补充")
- `spotlight-mask` 手电筒——光标决定你看见哪一层内容,光标本身成了内容的一部分
- `image-follow` 跟随预览图——作品集/代理商站最容易见效的一招

**别叠加**:跟随类(`custom-cursor` / `blend-dot` / `cursor-trail` / `hide-and-follow` / `image-follow` / `spotlight-mask`)一页只能上一个,叠起来是一团乱。[hover/magnetic-button](../hover/magnetic-button/) 改的是按钮不是光标,可以和任意一个同时用。
