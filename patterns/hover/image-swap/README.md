# Hover 双图切换 Image Swap

- **分类**: 悬停交互
- **难度**: ★
- **见于**: [Lando Norris](../../../cases/lando-norris/analysis.md) 头盔画廊(每个头盔 base/hover 两张 webp)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/hover/image-swap/demo.html)

## 设计意图

hover 时"同一物体换了一种状态"(转个角度/亮起/上色),比单纯放大或加阴影信息量大得多——它在暗示"这个东西有更多面,点进来看"。成本极低:就是两张图。

## 核心机制

两张图叠放,hover 切换透明度;配合轻微 scale 制造"活"感:

```css
.swap img.hover { opacity: 0; }
.swap:hover img.hover { opacity: 1; }
.swap:hover img { transform: scale(1.04); }
img { transition: opacity .35s ease, transform .6s cubic-bezier(.22,1,.36,1); }
```

## 实现要点

- 两张图必须同尺寸同构图,只有"状态"不同(角度/光照/颜色),否则切换会跳
- hover 图要预加载(同时插入 DOM 即可),否则第一次 hover 会闪白
- 触屏没有 hover:用 `@media (hover: hover)` 包裹,触屏降级为点击切换或直接显示 hover 态
- 加 0.35s 的 opacity + 更慢的 0.6s scale,两个时长错开更有层次

## 代价与注意

- 性能: 双倍图片流量,列表长时务必懒加载 + 现代格式(webp/avif)
- 可访问性: 信息不能只存在于 hover 态;键盘焦点(`:focus-visible`)要有同样效果
- 移动端: 见上,必须设计降级

## 变体与延伸

- 三态:default / hover / active(按下再换一张)
- hover 视频:第二层换成静音 `<video>`,鼠标进入播放
- WebGL 位移贴图过渡(液态扭曲)是本效果的"氪金版"
