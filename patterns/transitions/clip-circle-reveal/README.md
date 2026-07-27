# 圆形揭开转场 Clip Circle Reveal

- **分类**: 页面切换
- **难度**: ★
- **冲击力**: A(炸场)——换页从"点击处"长出来,**转场有了因果关系**,而不是凭空盖一层
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/transitions/clip-circle-reveal/demo.html)
- **来源**: `clip-path: circle()/inset()` 在 [2026-07 扫描](../../../blends/scans/2026-07-awwwards.md)里 **160/691 站在用**

## 设计意图

绝大多数转场是"一层东西盖过来"——它从哪来、为什么来,和用户刚才干了什么没关系。

圆形揭开把两件事绑在一起:**你点的那个点,就是新页面长出来的原点**。手指落下,世界从指尖展开。这一条因果链是它比淡入淡出高级的全部原因,成本却只有一个 `clip-path` 过渡。

同一个机制也是暗色模式切换最讨喜的做法:从开关处荡开一圈,整页换肤。

## 核心机制

```css
.incoming{
  clip-path:circle(0px at var(--x) var(--y));
  transition:clip-path .9s var(--ease-out);
}
.incoming.on{ clip-path:circle(var(--r) at var(--x) var(--y)); }
```

```js
// 半径必须够到最远的那个角,否则边缘会露出旧内容
const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
```

`--x/--y` 取点击坐标,`--r` 按上式算。**全部机制就这三行。**

## 实现要点

- **半径公式别偷懒**:用 `innerWidth` 或对角线的一半都会在某些点击位置露馅。要取"到四角的最大距离",也就是上面那个 `hypot(max(x, W−x), max(y, H−y))`
- 新层要 `position:fixed; inset:0` 盖住整个视口,并且 `z-index` 高于旧内容
- 转场结束后**把新层的内容真正换成主内容**,别一直留着两层——用 `transitionend` 收尾
- `clip-path` 的圆是**硬边**。想要软边就改用 [cursor/spotlight-mask](../../cursor/spotlight-mask/) 的 `mask-image: radial-gradient`,代价是遮罩比裁剪贵
- 键盘触发时没有坐标:取按钮自身的中心 `getBoundingClientRect()`,别默认 `(0,0)`
- 用 `transform` 无法实现这个效果——缩放一个圆会把内容一起缩放。**必须是 `clip-path`**

## 代价与注意

- `clip-path` 动画在低端设备上会掉帧,尤其新层内容复杂时。**新层尽量只放一张背景/一个纯色**,内容在揭开完成后再填
- **可访问性**:转场期间焦点应该留在触发元素上,结束后再移到新内容;别在动画中途改焦点
- `prefers-reduced-motion`:直接切换,不做揭开(`transition:none` + 立刻到终态)。这类"从一点扩张"的运动对前庭敏感人群不友好
- Safari 对 `clip-path` 动画支持正常,但**和 `filter` 同时用在一个元素上**会出现裁剪边缘抖动,别叠
- 圆的原点在视口坐标系里,页面滚动后要重新取——别缓存

## 变体与延伸

- **View Transitions API 版**:`document.startViewTransition()` 里用 `::view-transition-new(root)` 的 `clip-path` 关键帧,同一个观感但由浏览器接管新旧快照,配合 [transitions/view-transitions](../view-transitions/) 用
- 收起用反向的 `circle(r → 0)`,原点取"关闭按钮"的位置,形成开合闭环
- 形状换成 `inset()` 就是幕布式上滑,换成 `polygon()` 可以做斜切扫过(和 [layout](../../layout/) 的斜切分区同源)
- 暗色模式切换:新层放的不是新页面而是**同一页面的另一套 CSS 变量**,荡开一圈完成换肤
