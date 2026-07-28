# 像素化过渡 Pixelate Transition

- **分类**: 页面切换
- **难度**: ★★
- **冲击力**: A(炸场)——两张图之间"碎成马赛克再重组",是数字感最强的一种切换
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/transitions/pixelate-transition/demo.html)
- **来源**: 通用做法,非从某一站实测提炼——[2026-07 扫描](../../../blends/scans/2026-07-awwwards.md)里 image-rendering:pixelated 仅 7/691 站,因为多数站用 canvas 实现探不到。**来源等级低于有 case 支撑的 pattern**

## 设计意图

淡入淡出的中间态是**两张图糊在一起的泥色**——本库 [TASTE](../../../TASTE.md) 里明确记过这条判词:"利落 > 互溶,中间帧必须干净"。

像素化换了个思路:中间态不是"两张图的平均",而是**同一张图的低分辨率版本**。每一帧都是一个自洽的画面,没有叠影。分辨率降到几像素时切换,再升回来——观感是"重新加载",带着强烈的数字/故障感。

## 核心机制

canvas 两步走,关键是**关掉插值**:

```js
// 1. 把原图画到一个很小的临时 canvas 上(丢掉分辨率)
tmp.width  = Math.max(1, Math.round(W * r));
tmp.height = Math.max(1, Math.round(H * r));
tctx.drawImage(src, 0, 0, tmp.width, tmp.height);

// 2. 再放大画回来,插值必须关掉,否则会被平滑成模糊而不是马赛克
ctx.imageSmoothingEnabled = false;
ctx.drawImage(tmp, 0, 0, W, H);
```

`r` 从 1 降到 0.01 再升回 1,**在最低点那一帧换源图**。全部机制就这些。

## 实现要点

- **`imageSmoothingEnabled = false` 是这个效果的全部**。忘了它就是普通模糊,一点马赛克感都没有——而且它是**每次 `drawImage` 前都要设**,某些浏览器在 canvas 尺寸变化后会重置
- `r` 要走**离散档位**(如 `1 → .5 → .25 → .12 → .06 → .03`),连续插值看起来像缩放而不是降分辨率。用 `steps()` 的思路,不要线性
- 临时 canvas 尺寸必须 `Math.max(1, …)`,降到 0 会抛异常
- **在最低分辨率那一帧换图**,不是中途换:低分辨率时人眼分辨不出内容,切换被藏住了
- 高分屏要按 `devicePixelRatio` 放大 canvas 的像素尺寸,否则马赛克块本身是模糊的(讽刺但真实)
- 纯 CSS 也能做近似版:`image-rendering:pixelated` + 动画 `background-size`,但档位控制和换图时机都不如 canvas 干净

## 代价与注意

- **canvas 会丢掉一切语义**:图片的 `alt`、文字的可选中性全没了。真实项目里 canvas 只做过渡层,盖在真实 `<img>`/内容之上,过渡结束后撤掉
- 每帧两次 `drawImage`,大尺寸下有成本。**控制 canvas 的像素尺寸**(不必等于 CSS 尺寸),马赛克效果本来就不需要高分辨率
- 跨域图片会污染 canvas;虽然这里不读像素不受影响,但用到 `getImageData` 的变体要注意 CORS
- `prefers-reduced-motion`:直接换图,不做过程。**故障感/闪烁类效果对光敏感人群风险更高**,这一条不能省
- 帧率低时档位跳变会显得生硬,宁可减少档位数也别拉长时长

## 变体与延伸

- 只降不升 = "信号丢失"的收尾;只升不降 = 加载完成的揭示,可以接在 [loading/entry-preloader](../../loading/entry-preloader/) 后面
- 马赛克块换成**字符**(把每块的平均色映射到一个字符)= ASCII 化过渡,同一套降采样逻辑
- 配 [layout/duotone-blend](../../layout/duotone-blend/):低分辨率 + 双色 = 复古终端质感
- 想要更"故障"的味道:降采样的同时把 RGB 三个通道分别偏移几个像素(色散),是 [transitions/image-displacement](../image-displacement/) 的廉价近亲
