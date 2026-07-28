# 精灵图 Hover 预览 Sprite Preview

- **分类**: 悬停交互
- **难度**: ★
- **见于**: [MotionPotion](../../../cases/motionpotion/analysis.md)(`.spell-sprite`:模板卡 hover 即播,600% 背景 + steps(6))
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/hover/sprite-preview/demo.html)

## 设计意图

[image-swap](../image-swap/) 是"换一张",这个是"播一段":hover 时海报变成逐帧动画。不用 video(重)、不用 GIF(色差)、不用 Lottie(依赖)——一张精灵图 + 一行 `steps()`,画廊卡片就有了"动图预览"。

## 核心机制

N 帧横向拼成一张图,背景放大 N 倍,`steps()` 逐帧步进 background-position:

```css
.sprite {
  background-image: var(--sprite);
  background-size: calc(var(--frames) * 100%) 100%;   /* N 帧 → N×100% */
  background-position-x: 0%;
}
.card:hover .sprite, .card:focus-visible .sprite {
  animation: play .9s steps(var(--frames-minus-1), jump-none) infinite;
}
@keyframes play { to { background-position-x: 100%; } }
```

百分比 background-position 的巧处:`background-size: 600%` 时,0%→100% 正好把 6 帧逐个对齐容器——不需要算像素。

## 实现要点

- **`steps(N-1, jump-none)`**:jump-none 让首尾帧都完整出现;步数是帧数减一(6 帧 = 5 步),记错就丢帧
- 帧数收口成 CSS 变量(`--frames`),换素材只改一处;steps() 里不能用 `calc(var()-1)`,demo 用了 5 帧的写法注释标明联动关系
- 静止态就是第 1 帧(position 0%),海报层可以省——精灵图首帧当海报,少一张图
- 触屏无 hover:`:focus-visible` 给键盘,点击 toggle 给触屏(demo 已做);别用 JS 监听 mouseenter 重造 CSS 已有的东西
- 真实项目精灵图注意体积:6 帧 400px 宽 webp 通常 < 100KB,比等价 video 小一个量级

## 代价与注意

- 性能: background-position 动画不在合成器(会重绘),但每秒 ~7 帧的重绘量可忽略;别用在几十个同屏同播的场景
- 可访问性: 精灵层 `aria-hidden`,卡片本体带完整文字标签;`prefers-reduced-motion` 停在首帧
- 移动端: 见触屏 toggle;流量敏感场景给 `loading="lazy"` 等价物(IntersectionObserver 再挂 `--sprite`)

## 变体与延伸

- 帧数多到 24+:考虑换 `<video muted loop>`(解码硬件加速),精灵图的甜区是 4~12 帧
- 纵向精灵图(background-position-y)机制相同,适合宽卡片
- scrub 版:hover 位置映射帧序号(`mousemove` → position),预览变"可搓洗"
