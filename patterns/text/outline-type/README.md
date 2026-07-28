# 描边字 Outline Type

- **分类**: 文字动效 / 排版
- **难度**: ★
- **冲击力**: A(炸场)——空心巨字是"这是个设计过的页面"最省的一个信号
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/text/outline-type/demo.html)
- **来源**: [2026-07 扫描](../../../blends/scans/2026-07-awwwards.md),**84/691 站在用** `-webkit-text-stroke`

## 设计意图

同一句话,实心的和空心的是两种重量。空心字**占着大字号的位置,却不抢版面的注意力**——所以它能做超大标题而不压垮其他内容,也能和实心字混排出层次(重复词空心、关键词实心)。

滚动时从空心填充成实心,是零成本的"抵达感"。

## 核心机制

```css
h1{
  color:transparent;
  -webkit-text-stroke:2px currentColor;   /* 注意:没有无前缀版本 */
}
```

填充动画走 `-webkit-text-fill-color`(**它可以过渡,`color` 在这里不行**):

```css
h1{ -webkit-text-fill-color:transparent; transition:-webkit-text-fill-color .6s var(--ease-out); }
h1:hover{ -webkit-text-fill-color:var(--accent); }
```

## 实现要点

- **描边是"骑在"字形轮廓上的**,一半在里一半在外。所以 `2px` 的描边实际只有 1px 露在字外,而里面那 1px 会吃掉字腔——**字号越小、笔画越密,越糊成一团**。这个效果只适合大字号(≥48px)和粗字重
- 中文比拉丁更吃亏:笔画多、字腔小,描边宽度要更克制(大字也别超过 2px)
- `-webkit-text-stroke` **至今没有无前缀版本**,但所有现代浏览器都认这个前缀名,可以直接用
- 描边宽度不要用 `em`:字号变了描边跟着变,大标题会糊。用 `px` 并按断点调
- 想要**只在外侧描边**(不吃字腔),CSS 做不到,得用 SVG 的 `paint-order: stroke fill`
- 别用多层 `text-shadow` 模拟描边——四个方向的阴影在圆角处会露出缺口,而且性能更差

## 代价与注意

- **对比度是真问题**:空心字的可读性远低于实心字,细描边在浅色背景上几乎消失。**正文永远不要用**,标题也要保证描边色和背景有足够对比
- `color:transparent` 在**强制高对比模式**下会让字彻底消失。加 `@media (forced-colors: active){ -webkit-text-fill-color:CanvasText; -webkit-text-stroke:0 }`
- 打印时描边可能丢失 → `@media print` 给实心兜底
- 不是动画,`prefers-reduced-motion` 只影响填充过渡那部分

## 变体与延伸

- **实心 + 空心交替**排版:同一个词重复三次,只有一个实心,做"回声"效果
- 滚动驱动填充:用 [scroll/css-scroll-scrub](../../scroll/css-scroll-scrub/) 把 `-webkit-text-fill-color` 或一个渐变遮罩绑到滚动进度上,字随滚动被"灌满"
- 空心字 + [text/text-mask-media](../text-mask-media/):描边保留,内部填视频
- 描边 + [layout/blend-invert](../../layout/blend-invert/) 的 `difference`,压在图片上永远可读
