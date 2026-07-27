# 文字挖空露媒体 Text Mask Media

- **分类**: 文字动效 / 布局手法
- **难度**: ★★
- **冲击力**: A(炸场)——超大标题里流着视频/渐变,一屏就能立住记忆点
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/text/text-mask-media/demo.html)
- **来源**: `background-clip: text` 在 [2026-07 扫描](../../../blends/scans/2026-07-awwwards.md)里 **78/691 站在用**

## 设计意图

标题不再是"有颜色的字",而是**一扇形状为文字的窗**,后面是流动的东西——视频、渐变、噪声、3D 场景。

它一次拿到两个东西:超大字排版的气势(见 [TASTE](../../../TASTE.md) 里"超大字"的口味)、以及运动的生命感。而且**文字仍然是真文字**——可选中、可搜索、读屏能读,这是它比"直接放一张标题图"高级的关键。

## 核心机制

两条路,**先试第一条**:

**A. `background-clip: text`**(渐变/图片,不能是视频)

```css
h1{
  background-image:linear-gradient(...);   /* 或 url(img.jpg) */
  -webkit-background-clip:text;  background-clip:text;
  color:transparent;
}
```

**B. `mask-image` + SVG 文字**(视频/canvas 用这条)

`background-clip` 吃不了 `<video>`。做法反过来:视频铺底,上面盖一层纯色遮罩层,**用文字形状把遮罩挖穿**。

> ⚠ **最容易踩的坑**:CSS `mask-image` 默认按 **alpha 通道**判定,不是亮度。
> 直接写"白矩形 + 黑文字"两者 alpha 都是 1 → 盖层整块留下 → **一个纯黑方块,什么都看不到**。
> 必须在 SVG **内部**先用 `<mask>` 把字从矩形里扣掉,让最终图形在文字处 `alpha=0`:
>
> ```svg
> <defs><mask id="m">
>   <rect width="800" height="260" fill="white"/>
>   <text … fill="black">MEDIA</text>
> </mask></defs>
> <rect width="800" height="260" fill="black" mask="url(#m)"/>
> ```

```css
.cover{
  background:var(--bg);
  -webkit-mask-image:url("data:image/svg+xml,…<text>标题</text>…");
          mask-image:url("data:image/svg+xml,…");
  -webkit-mask-composite:xor;  mask-composite:exclude;   /* 反相:字的位置被挖掉 */
}
```

## 实现要点

- **`-webkit-` 前缀必须写**,`background-clip:text` 到今天在 Safari 仍需要
- `color:transparent` 之外再加 `-webkit-text-fill-color:transparent`,某些 Safari 版本只认后者
- **字重越粗效果越好**:细字里露不出多少内容,视觉上只剩一点杂色。900 字重 + 大字号是这个效果的前提
- 渐变要**大于文字尺寸**并加动画(`background-position` 平移),静止的渐变看起来只是"彩色字"
- 方案 B 的 SVG 遮罩里,`<text>` 要写死 `font-family/size/weight`——**遮罩里的 SVG 不继承页面 CSS**,也加载不到 webfont,只能用系统字或把字转成 `<path>`
- 方案 B 更稳的做法是**把标题转成 SVG path** 再当遮罩,彻底摆脱字体依赖(代价:文字不可选中,要额外给 `aria-label`)

## 代价与注意

- **可访问性**:方案 A 文字仍在 DOM 里,读屏正常;但 `color:transparent` 在**强制高对比模式**下会让字彻底消失。加 `@media (forced-colors: active){ color:CanvasText; background:none }` 兜底
- 对比度**无法保证**:文字颜色取决于背后的媒体,深色视频段落上的字可能读不清。**别把关键信息只放在这里**,它是标题不是正文
- 视频版本要 `muted playsinline` + `poster`,并遵守自动播放策略;`prefers-reduced-motion` 下暂停视频、换静态首帧
- 遮罩和 `background-clip` 都会创建合成层,超大字号 + 全屏视频在低端机上代价明显。移动端可退回纯色标题
- 打印时会丢失背景 → `@media print` 给一个纯色 fallback

## 变体与延伸

- 背景换成 [layout/grain-overlay](../../layout/grain-overlay/) 的噪声,得到"沙砾质感的字"
- 背景跟着指针移动(`background-position` 由 `pointermove` 驱动)= 文字里的世界会随视角变化
- 反过来做:文字**盖住**媒体而不是露出媒体,配 [layout/blend-invert](../../layout/blend-invert/) 的 `difference`,字永远和背后的图反色
- 滚动时平移背景 = 文字里的内容随滚动流动,和 [scroll/css-scroll-scrub](../../scroll/css-scroll-scrub/) 组合
