# 图片光标 Image Cursor

- **分类**: 鼠标跟随
- **难度**: ★(全库成本最低的自定义光标)
- **见于**: Apechain(`url(/cursor/default.svg) 16 16`)、Object & Archive(内联 data-URI)、Raw House(`url(/images/cursor.webp), auto`)、Grain & Mortar(`url(../img/arrow-right-orange.svg), auto`)、NVRMND Studio
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/cursor/image-cursor/demo.html)
- **来源**: [2026-07 扫描](../../../blends/scans/2026-07-awwwards.md),21/691 站

## 设计意图

**一行 CSS 换掉光标图形**,零 JS、零 rAF、零跟随延迟——因为它就是系统光标,由合成器画,永远不掉帧。

跟随类光标([custom-cursor](../custom-cursor/)、[hide-and-follow](../hide-and-follow/))再顺滑也有滞后;这条路子没有滞后的概念。代价是**不能动画、不能有状态过渡**——想要放大/变形就得换另一条路。

## 核心机制

```css
.zone{ cursor: url("data:image/svg+xml,%3Csvg…%3E") 16 16, auto; }
```

`16 16` 是**热点坐标**(图内哪个像素算"指针尖"),不写默认左上角 `0 0`——十字/圆形光标不写热点会整体偏移半个图。末尾的 `auto` 是**必需的兜底**:图加载失败或格式不支持时回落到系统光标,不写整条声明作废。

## 实现要点

- **优先内联 data-URI 的 SVG**:不多一次请求、不会有"光标闪一下才出现"、能用 `%23` 写颜色。Object & Archive 就是这么做的
- **尺寸上限**:浏览器普遍拒绝超过 **128×128** 的光标图(Chrome/Firefox 都是),超了整条声明被忽略,悄无声息地失效。实用尺寸 24–48px
- SVG 光标要**写死 `width`/`height` 属性**,只有 `viewBox` 的 SVG 在光标上下文里尺寸不确定
- 按区域/状态换图就是多写几条 CSS:`.zone--drag{cursor:url(grab.svg) 12 12,grab}`,状态切换靠加 class
- 深浅背景通吃:给 SVG 描一圈 1px 反色描边(系统光标就是这么做的),比换两套图省

## 代价与注意

- **不能动画**。光标图是静态的,没有过渡、没有 hover 放大。要这些就换 [custom-cursor](../custom-cursor/)
- **触屏完全无效**(没有指针),但也无害——不用像跟随类那样特意 `@media` 关掉
- 换掉箭头会丢失系统的 text / resize / not-allowed 等语义提示。**只在内容区换**,表单和链接留给系统
- 高分屏:提供 2× 图并用 `image-set()`,否则光标发虚
- `prefers-reduced-motion` 不涉及(没有动画)

## 变体与延伸

- 拖拽区域用 `grab` / `grabbing` 两张图,配 [hover/drag-spring](../../hover/drag-spring/)
- 画廊左右半区换成左右箭头光标(`:hover` + 两个半宽热区),零 JS 做出"点这边翻页"的提示
- 需要文字标签(如 "VIEW")就上 [hide-and-follow](../hide-and-follow/),图片光标塞不下文字
