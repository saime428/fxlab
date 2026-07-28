# 双色调 Duotone

- **分类**: 布局手法 / 质感层
- **难度**: ★★
- **冲击力**: A(炸场)——把一堆来源不一的图片强行统进一套品牌色,是"整站气质统一"最快的一招
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/layout/duotone-blend/demo.html)
- **来源**: [2026-07 扫描](../../../blends/scans/2026-07-awwwards.md),`multiply/screen/overlay` 混合 **55/691 站**

## 设计意图

作品集、活动页、媒体站最常见的困境:图片来自十个不同的摄影师/客户,色温、饱和度、影调全不一样,拼在一起像剪贴板。

双色调把所有图**压成两种颜色的映射**——暗部一个色、亮部一个色。图还是那张图,但整页突然是一套体系了。这是**用一层 CSS 解决一个内容治理问题**,所以它的性价比高得离谱。

## 核心机制

三步,顺序不能乱:

```css
.duo{ position:relative; isolation:isolate; }   /* 关住混合,别泄漏到页面其他部分 */
.duo img{ filter:grayscale(1) contrast(1.15); } /* 1. 先去色 —— 不去色会得到脏的第三种颜色 */
.duo::before{                                    /* 2. 暗部染色:lighten 只抬黑不压白 */
  background:var(--shadow); mix-blend-mode:lighten;
}
.duo::after{                                     /* 3. 亮部染色:multiply 只压白不动黑 */
  background:var(--highlight); mix-blend-mode:multiply;
}
```

**`lighten` 取两者较亮的**:深色图区被抬到 `--shadow` 色,亮区不受影响。
**`multiply` 相乘**:亮区被 `--highlight` 染上,已经是暗部的区域乘完还是暗。
两步夹出来的就是双色映射。

## 实现要点

- **`grayscale(1)` 是前提,不是可选**。原图残留的色相会和染色层混出第三种颜色,整体发脏
- `contrast()` 微调很关键:去色后影调通常发灰,`1.1–1.3` 能把双色的分离感拉开
- **`isolation:isolate` 必须写在容器上**。不写的话 `::before/::after` 会和页面背景混合,颜色完全不对——这是最常见的翻车点
- 两个色的**明度差要够大**(一个明显偏暗、一个明显偏亮),否则出来是一团糊。同明度的两个色做不了双色调
- 要更精确的映射用 SVG `feComponentTransfer` + `feFuncR/G/B` 的 `tableValues`,能控制中间调;CSS 混合版本是快而糙的那条

## 代价与注意

- **图片信息会丢失**。产品图、人像、任何"细节即内容"的图别用——双色调是给氛围图和背景图的
- 两个混合层 = 两个合成层,长列表里每张图都用会明显吃性能。列表用一张预处理好的图,双色调留给 hero
- `mix-blend-mode` 在部分打印路径下不生效,打印会得到灰度图
- 不是动画,`prefers-reduced-motion` 不涉及;但如果做了 hover 恢复原色的过渡,那部分要降级
- 深浅主题切换时两个色都要换,别只换一个

## 变体与延伸

- **hover 恢复原色**:`filter:grayscale(0)` + 两个染色层 `opacity:0`,是画廊里最省的"激活"反馈,和 [hover/image-swap](../../hover/image-swap/) 同类但不用第二张图
- 只用一层 `multiply` + 品牌色 = **单色调(monotone)**,更克制,适合 B 端
- 配 [layout/grain-overlay](../grain-overlay/):双色调 + 颗粒 = 丝网印刷质感
- 滚动时两个色随章节变(配 [transitions/theme-shift](../../transitions/theme-shift/)),同一张图在不同章节是不同气质
