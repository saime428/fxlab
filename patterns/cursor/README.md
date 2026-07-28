# 鼠标跟随

自定义光标、拖尾、跟随元素

扫描实测:**19% 的获奖站动了光标**,做法分四条路子([2026-07 扫描](../../blends/scans/2026-07-awwwards.md))。下表按**可用性代价从低到高**排,不是按炫酷程度:

| 效果 | 难度 | 路子 | Demo |
|---|---|---|---|
| [图片光标](image-cursor/) | ★ | `cursor:url()` 换图,零 JS | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/image-cursor/demo.html) |
| [跟随圆环](follower-ring/) | ★ | 不藏原生光标,只叠一个 | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/follower-ring/demo.html) |
| [磁性吸附](magnetic-pull/) | ★★ | 不改光标,改被指的东西 | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/magnetic-pull/demo.html) |
| [反色光标点](blend-dot/) | ★★ | 跟随 + `mix-blend-mode` | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/blend-dot/demo.html) |
| [区域内隐藏光标 + 跟随标签](hide-and-follow/) | ★★ | 藏原生光标,光标变 UI | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/hide-and-follow/demo.html) |
| [自定义光标](custom-cursor/) | ★★ | 双层跟随 + `data-cursor` 委托的四态状态机 | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/custom-cursor/demo.html) |
| [光标拖尾](cursor-trail/) | ★★ | 纯装饰,链式滞后 | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/cursor-trail/demo.html) |
| [光标跟随预览图](image-follow/) | ★★ | 文字列表 hover 出图,图跟着光标 | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/image-follow/demo.html) |
| [光标手电筒](spotlight-mask/) | ★★ | 遮罩挖洞,光标决定你看见哪一层 | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/spotlight-mask/demo.html) |

**选型口径**:只想换个图标形状 → `image-cursor`(一行 CSS);想要质感又不想担可用性风险 → `follower-ring`;深浅背景通吃 → `blend-dot`;要一套带状态的品牌光标(点/放大/文字/媒体四态)→ `custom-cursor`;光标要带文案 → `hide-and-follow`;纯装饰、内容不密集 → `cursor-trail`。

> ⚠ **本分类有三组语义重合,选型前先看清**(2026-07-26 两个会话并行产出后合并):
> - `custom-cursor`(双层跟随 + 四态状态机)是 `follower-ring`(单层圆环)的**完整版**。新项目直接用 `custom-cursor`;只要一个圆环、不要状态机时用 `follower-ring`
> - `cursor/magnetic-pull` 与 `hover/magnetic-button` 是**同一个机制**:前者用 CSS transition 回位,后者用欧拉弹簧回位(有过冲)。要"稳"选前者,要"弹"选后者
> - `hide-and-follow` 与 `image-follow` 都是"hover 列表项 → 跟随物出现",差别只有:藏不藏原生光标、跟随物是文字标签还是图片
>
> 待办:下次整理时考虑合并成同一 pattern 的多个变体。

**要"炸场"的三个**(记忆点级别,一页最多用一个):

- `follower-ring` / `custom-cursor` 的 hover 态——圆环炸开盖满视口并把整页反相,移开缩回
- `spotlight-mask` 手电筒——光标决定你看见哪一层内容,光标本身成了内容的一部分
- `image-follow` 跟随预览图——作品集/代理商站最容易见效的一招

**别叠加**:跟随类(ring / dot / trail / custom-cursor / hide-and-follow / image-follow)一页只能上一个,叠起来是一团乱。`magnetic-pull` 改的是按钮不是光标,可以和任意一个同时用。
