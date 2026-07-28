# 噪点颗粒层 Grain Overlay

- **分类**: 布局手法 / 质感层
- **难度**: ★
- **冲击力**: A(炸场)——单看是"加了层灰",但**它是"看起来贵"和"看起来像模板"之间最短的一条路**
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/layout/grain-overlay/demo.html)
- **来源**: `feTurbulence` 在 [2026-07 扫描](../../../blends/scans/2026-07-awwwards.md)的 CSS 侧只探到 4 站——**因为绝大多数站是贴一张噪点 PNG**,不是用滤镜生成。这里给的是零资源版

## 设计意图

纯色和纯渐变是**数字感**的来源:太干净、太平、一眼就是屏幕。铺一层几乎看不见的颗粒,画面立刻有了"介质"——像印在纸上、拍在胶片上。

它不动、不响应交互、不传达信息,**成本是一个伪元素**,却能把一个"配色还行"的页面直接抬一档。这是全库性价比最高的一条。

## 核心机制

SVG 的 `feTurbulence` 生成 Perlin 噪声,当作背景图铺满,压到很低的不透明度:

```css
body::after{
  content:""; position:fixed; inset:0; z-index:9999; pointer-events:none;
  opacity:.055;
  background-image:url("data:image/svg+xml,\
    %3Csvg xmlns='http://www.w3.org/2000/svg'%3E\
    %3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E\
    %3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

**零请求、零依赖、不到 300 字节**,而且分辨率无关——不像贴图会在高分屏上糊掉。

## 实现要点

- `baseFrequency` 是颗粒粗细:`.6` 粗颗粒(胶片感)、`.85` 常用、`1.2` 细到接近电视雪花
- `numOctaves` 越高层次越丰富也越慢,**2-3 足够**,再高看不出差别
- **不透明度是这个效果的全部分寸,而且分深浅两套**:
  - **深色底**(本库默认口味):`.08–.14`,**不要写 `mix-blend-mode`**。overlay 对暗背景的结果约等于 `2×backdrop×blend`,暗的还是暗——叠上去几乎是空操作,再配 `.05` 的透明度就是"完全看不出差别"
  - **浅色底**:`.03–.06` + `mix-blend-mode:overlay` 或 `soft-light`,更自然
  - 超过 `.3` 从"质感"掉进"脏"
- `pointer-events:none` 必须写,否则整页点不动
- `position:fixed` 让颗粒**不跟着滚动**——跟着滚会立刻暴露它是一张图,固定住才像"镜头上的颗粒"
- **动起来要用 `steps()`**:连续平移会看到噪声在"流",电影颗粒是逐帧跳变的。`animation:grain 8s steps(10) infinite` + 每步换 `background-position`

## 代价与注意

- **这是全屏的合成层**,低端机上叠在复杂动画之上会掉帧。移动端可以直接不加(`@media (min-width:768px)`),没人会发现少了
- `mix-blend-mode` 会让它参与整页混合,和 [layout/blend-invert](../blend-invert/) 之类同时用要测——两个混合层叠在一起结果不直观
- 打印时应该关掉:`@media print{ body::after{ display:none } }`
- 动画版本在 `prefers-reduced-motion` 下退回静态一帧(**不要整个去掉**,静态颗粒本身没有运动问题)
- Safari 上 `feTurbulence` 的噪声图案和 Chrome 略有差异,不影响观感但别指望像素级一致

## 变体与延伸

- **扫描线**:把 `feTurbulence` 换成 `repeating-linear-gradient` 的 1px 横线,CRT 味
- **彩色噪点**:`feTurbulence` 后接 `feColorMatrix` 保留色彩通道,得到彩色雪花(默认是灰的)
- 只在 hero 加颗粒、正文区不加,制造"镜头前 vs 纸面"的分区
- 配 [3d-webgl/canvas-ambient-bg](../../3d-webgl/canvas-ambient-bg/):色斑打底 + 颗粒罩面,是"高级感地板"的完整两层
