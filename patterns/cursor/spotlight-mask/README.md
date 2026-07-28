# 光标手电筒 Spotlight Mask

- **分类**: 鼠标跟随
- **难度**: ★★
- **见于**: 体验型站与作品集的"揭示"交互;机制基于 `mask-image`,[2026-07 扫描](../../../blends/scans/2026-07-awwwards.md)里 158/691 站在用 `mask-image`(不限于光标场景)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/cursor/spotlight-mask/demo.html)

## 设计意图

光标变成一束手电筒:**它照到哪,哪里就露出藏在下面的另一层内容**。

和其他光标效果的根本区别——别的光标是"加了一个装饰物",这个是**光标本身成了内容的一部分**。页面有两层真实内容,光标决定你能看见哪一层。用在 hero 上一次,记忆点就立住了。

## 核心机制

两层叠放,上层被一个跟着光标走的径向渐变遮罩挖洞:

```css
.layer-top{
  position:absolute; inset:0;
  -webkit-mask-image:radial-gradient(circle var(--r) at var(--mx) var(--my),
                                     transparent 55%, #000 100%);
          mask-image:radial-gradient(circle var(--r) at var(--mx) var(--my),
                                     transparent 55%, #000 100%);
}
```

```js
el.style.setProperty('--mx', x + 'px');
el.style.setProperty('--my', y + 'px');
```

**遮罩里 `transparent` 的地方上层被挖掉,下层露出来。** 渐变的软边(55% → 100%)就是光斑的羽化。

## 实现要点

- **只写两个 CSS 变量,不动 DOM 结构**。位置更新走 `--mx/--my`,不是改 `mask-position`——后者会触发遮罩重算,前者在合成层就能处理
- `mask-image` 必须**同时写 `-webkit-` 前缀**,Safari 到现在仍需要
- 直接在 `pointermove` 里赋值就能用;**要顺滑就上 rAF + lerp**,让光斑滞后于指针(和 [custom-cursor](../custom-cursor/) 同一套滞后手法)
- 光斑半径 `--r` 做成可变的:静止时收小、移动时放大,一行插值就有"呼吸"
- 下层内容**必须在无 JS / 无 hover 时也能被看到**——否则触屏和键盘用户永远读不到它。做法:触屏下把上层整个隐藏,或给一个"全部显示"的切换

## 代价与注意

- **可访问性是这个效果最大的坑**:被遮住的内容对读屏是存在的(遮罩不影响无障碍树),但对**低视力用户**、**触屏用户**、**键盘用户**可能永远看不到。凡是"必读"的信息不能只放在下层
- `prefers-reduced-motion`:光斑跟随要停,但**不要把效果整个关掉**——直接展示下层(或上层)的静态终态,别留一个什么都看不见的页面
- 遮罩会让上层脱离普通合成路径,大面积图片/视频上有性能代价。别在长列表的每一项上都用
- 触屏没有指针:整段用 `@media (hover:hover) and (pointer:fine)`,触屏直接给静态终态

## 变体与延伸

- 下层放**反相版本**的同一内容 = 光标走到哪哪里反色,比 [blend-dot](../blend-dot/) 的整点反色更有戏剧性
- 遮罩形状换成 `conic-gradient` 或图片(`mask-image:url(shape.svg)`)= 任意形状的光斑
- 点击时把 `--r` 一路放大到盖满视口 = 用手电筒完成整页转场,和 [transitions/shader-wipe](../../transitions/shader-wipe/) 是同一类"揭开"叙事的零依赖版
- 多光源:多写几组 `radial-gradient` 用逗号并列,遮罩支持叠加
