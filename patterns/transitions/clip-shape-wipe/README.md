# 形状擦除过渡 Clip Shape Wipe

- **分类**: 页面切换
- **难度**: ★
- **见于**: [MotionPotion](../../../cases/motionpotion/analysis.md)(词汇表:wobbly/half circles、3 stripes、dot transition 一整族视频转场)
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/transitions/clip-shape-wipe/demo.html)

## 设计意图

视图切换不硬跳,而是被一个几何形状"擦"过去——圆从点击处涨满、条纹依次落下。视频剪辑用了几十年的转场语言,搬到网页就是 [shader-wipe](../shader-wipe/) 的零门槛平替:纯 CSS,没有 WebGL 税。

## 核心机制

三拍:形状盖住 → 盖满时换内容 → 形状退场。内容层完全无关,和 shader-wipe 同构:

```css
.wipe { clip-path: circle(0% at var(--x) var(--y)); transition: clip-path var(--dur-l) var(--ease-out); }
.wipe.cover { clip-path: circle(150% at var(--x) var(--y)); }
```

```js
wipe.classList.add('cover');                    // ① 涨满
wipe.addEventListener('transitionend', () => {
  swapContent();                                 // ② 观众看不见的瞬间换内容
  wipe.classList.remove('cover');                // ③ 退场
}, { once: true });
```

条纹版不用 clip-path:N 条色带 `translateY(-101%)` → `0` 依次落下(索引 × 错峰),再依次滑出——和 [menu-stagger-reveal](../menu-stagger-reveal/) 是同一个编排思路,对象从菜单项换成色带。

## 实现要点

- **圆心取交互点**(点击坐标写进 `--x/--y`):从"你按的地方"涨开,因果感免费拿
- `circle(150%)` 别写 100%:百分比按短边算,长屏 100% 盖不满角落
- 条纹错峰 60~100ms/条;盖场和退场方向一致(都向下)像"扫过",相反像"开合",两种都成立,选一种别混
- 换内容的时机必须在 `transitionend`(盖满瞬间),提前换会穿帮
- 退场用 `translateY(101%)` 而不是反向 clip-path——条纹是实体色带,位移比裁剪省一次重绘

## 代价与注意

- 性能: clip-path 和 transform 都合成器友好;条纹 N ≤ 5,再多没意义
- 可访问性: `prefers-reduced-motion` 直接 swapContent,不播擦除;换内容后焦点管理同 SPA 路由惯例
- 移动端: 正常;圆心记得用 touch 坐标

## 变体与延伸

- 点阵版(dot transition):网格 N×M 个圆各自 scale 0→1,delay = 到波心距离——就是 [stagger-grid](../../text/stagger-grid/) 的距离公式,盖满后同款三拍
- 形状换菱形/斜条纹:改 clip-path polygon,机制不动
- 要"形状边缘发光/扭曲"的质感 → 升级到 [shader-wipe](../shader-wipe/)(这是两者的分界线)

## 并入 clip-circle-reveal 的补充(2026-07-26 去重)

原 `transitions/clip-circle-reveal` 与本 pattern 是同一机制,已删除并入。

**设计意图上多说一句**:绝大多数转场是"一层东西盖过来",它从哪来、为什么来,和用户刚才干了什么没关系。圆形擦除把两件事绑在一起——**你点的那个点,就是新视图长出来的原点**。这条因果链是它比淡入淡出高级的全部原因,成本却只有一个 `clip-path` 过渡。

**关于半径**:本文用 `circle(150% at var(--x) var(--y))` 是更省的写法——百分比按元素尺寸算,150% 保证从任意点都能覆盖。如果改用像素半径,**必须取"到四角的最大距离"**:

```js
const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
```

用 `innerWidth` 或对角线的一半都会在某些点击位置露出旧内容的边角。

另外三条:

- **键盘触发时没有坐标**:`e.clientX/Y` 是 0,要取按钮自身中心 `getBoundingClientRect()` 兜底,别默认 `(0,0)`
- **`transform` 做不到这个效果**:缩放一个圆会把内容一起缩放,必须是 `clip-path`
- 焦点在转场期间留在触发元素上,**结束后**再移到新内容,别在动画中途改
- 同一个机制也是暗色模式切换最讨喜的做法:新层放的不是新页面,而是同一页面的另一套 CSS 变量,荡开一圈完成换肤
