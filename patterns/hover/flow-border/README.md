# 流光边框 Flow Border

- **分类**: 悬停交互 / 质感层
- **难度**: ★★
- **冲击力**: A(炸场)——一道光沿着卡片边缘绕圈跑,是 2026 年最有辨识度的"这个站很新"的信号
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/hover/flow-border/demo.html)
- **来源**: `@property` 在 [2026-07 扫描](../../../blends/scans/2026-07-awwwards.md)里 **133/691 站在用**,总出现 7523 次——是新特性里普及最快的一个

## 设计意图

边框不再是一条静止的线,而是**一束绕着元素跑的光**。它把"这里可以点"从静态提示变成了持续的邀请。

关键在于它**不占空间、不改布局**——纯粹是一层装饰,加在任何卡片/按钮上都不用重排。这是它比"hover 时元素变形"那类效果更容易落地的原因。

## 核心机制

CSS 渐变的角度**本来不能动画**——浏览器不知道 `conic-gradient(from 0deg …)` 到 `from 360deg` 中间该怎么插值,只会瞬间跳变。`@property` 给自定义属性声明类型,浏览器才知道它是角度、可以插值:

```css
@property --a{ syntax:'<angle>'; initial-value:0deg; inherits:false; }

.card::before{
  background:conic-gradient(from var(--a), transparent 0 65%, var(--accent) 80%, transparent 100%);
  animation:spin 4s linear infinite;
}
@keyframes spin{ to{ --a:360deg } }
```

**没有 `@property` 这一行,整个效果不存在**——这就是为什么它到 2024 年才开始流行。

边框的"只有一圈"靠遮罩挖空中间:

```css
mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
mask-composite:exclude;      /* 内容区被排除掉,只剩 padding 那一圈 */
```

## 实现要点

- `@property` 必须写在**样式表顶层**,不能嵌在 `@media` 或选择器里
- `inherits:false` 很重要:否则每个子元素都会继承并各自动画一遍,白白多算
- **遮罩挖空那两行是关键**,否则渐变会填满整个元素变成一块光斑。`mask-composite:exclude` 在 Safari 需要 `-webkit-mask-composite:xor`
- 渐变里用 `transparent 0 65%` 留一大段空,光带才是"一束"而不是"一圈均匀的彩虹"
- **`animation` 而不是 `transition`**:角度要循环,transition 只能单程
- hover 才启动的话,把 `animation-play-state` 从 `paused` 切到 `running`,比切 `animation` 属性平滑

## 代价与注意

- **降级必须显式写**。不支持 `@property` 的浏览器里 `--a` 是普通字符串,动画不会跑,渐变**停在初始角度**——所以初始角度要选一个静止也好看的位置。用 `@supports (background: paint(x))` 之类探测意义不大,直接让静态态可用即可
- 一个持续运行的动画 = 一个持续的合成层。**别在列表里给每一项都加**,列表用 hover 触发
- `prefers-reduced-motion` 下停掉动画(`animation:none`),保留静态渐变边框——它本身就好看
- 光带颜色和背景对比过强时,边缘会有锯齿感,加 1px 的 `blur()` 或让渐变收尾更软
- 这是**强注意力效果**,按库规范一页一次:给主 CTA 或当前选中项,不要满屏都在转

## 变体与延伸

- `--a` 同时驱动多个属性(角度 + 色相 `hsl(var(--h) …)`),一个动画带两个维度
- 光带跟着指针角度走而不是匀速转:`--a` 由 `pointermove` 算出的方位角赋值,变成"光被指针牵着"
- 同样的 `@property` 手法可以动画:渐变位置、`color-mix()` 比例、任意需要插值的自定义值——**这个 pattern 真正的价值是那一行声明,不是边框**
- 静态版本:不动画,只用 conic 渐变做一个"高光在右上角"的拟真描边,零开销
