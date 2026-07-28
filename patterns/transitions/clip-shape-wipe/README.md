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
