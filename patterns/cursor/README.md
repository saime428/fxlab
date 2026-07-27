# 鼠标跟随

自定义光标、拖尾、跟随元素

扫描实测:**19% 的获奖站动了光标**,做法分四条路子([2026-07 扫描](../../blends/scans/2026-07-awwwards.md#四自定义光标四条路子合计-18))。下表按**可用性代价从低到高**排,不是按炫酷程度:

| 效果 | 难度 | 路子 | Demo |
|---|---|---|---|
| [图片光标](image-cursor/) | ★ | `cursor:url()` 换图,零 JS | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/image-cursor/demo.html) |
| [跟随圆环](follower-ring/) | ★ | 不藏原生光标,只叠一个 | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/follower-ring/demo.html) |
| [磁性吸附](magnetic-pull/) | ★★ | 不改光标,改被指的东西 | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/magnetic-pull/demo.html) |
| [反色光标点](blend-dot/) | ★★ | 跟随 + `mix-blend-mode` | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/blend-dot/demo.html) |
| [区域内隐藏光标 + 跟随标签](hide-and-follow/) | ★★ | 藏原生光标,光标变 UI | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/hide-and-follow/demo.html) |
| [光标拖尾](cursor-trail/) | ★★ | 纯装饰,链式滞后 | [demo](https://saime428.github.io/web-fx-lab/patterns/cursor/cursor-trail/demo.html) |

**选型口径**:只想换个图标形状 → `image-cursor`(一行 CSS);想要质感又不想担可用性风险 → `follower-ring`;深浅背景通吃 → `blend-dot`;光标要带文案/状态 → `hide-and-follow`;纯装饰、内容不密集 → `cursor-trail`。

**别叠加**:跟随类(ring / dot / trail / hide-and-follow)一页只能上一个,叠起来是一团乱。`magnetic-pull` 改的是按钮不是光标,可以和任意一个同时用。
