# Shader 遮罩擦除过渡 Shader Wipe

- **分类**: 页面切换
- **难度**: ★★★
- **见于**: [Igloo Inc.](../../../cases/igloo-inc/analysis.md)(shader 驱动的 UI 过渡);[Active Theory](../../../cases/active-theory/analysis.md) 的页面转场是它的全 GL 上限版
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/transitions/shader-wipe/demo.html)

## 设计意图

页面切换不走透明度,而是一层"物质"漫过屏幕:盖满的那一帧换内容,再退去。DOM 层完全不知情——shader 只负责遮罩,所以**任何内容切换都能套**,这是它和 displacement(必须拿到两张纹理)的本质区别。

## 核心机制

全屏 quad 上跑一个"阈值擦除":每个像素的吞没时机 = 方向进度 + 噪声扰动,进度 uniform 一推,遮罩就从一角漫到全屏:

```glsl
float n   = noise(q*5.)*.5 + noise(q*11.)*.25;  // 程序化 value noise,零纹理
float dir = (vUv.x + vUv.y) * .5;               // 对角推进;改这行换方向
float t   = uP * 2.2 - dir - n * .55;           // uP=1 时必然全盖
float m   = smoothstep(0., .08, t);             // 遮罩本体
float edge = m - smoothstep(.08, .38, t);       // 前沿亮带
gl_FragColor = vec4(mix(uMask, uGlow, edge), m);
```

JS 侧是个三拍编排:`tween(0→1, easeIn)` 盖上 → 换 DOM(`hidden` 切换)→ `tween(1→0, easeOut)` 揭开。

## 实现要点

- **噪声和方向是"转场签名"**:改 `dir` 一行换推进方向(纵向 `vUv.y`、径向 `length(vUv-.5)`),改噪声频率换质感(低频=大块吞没,高频=碎边缘)
- 阈值系数(demo 是 2.2)必须 > 1 + 噪声最大值,否则 p=1 时盖不满、换内容会穿帮
- canvas 定位 `fixed` + `pointer-events: none`,常驻但不挡交互;进度收敛就停 rAF
- 遮罩色/亮边色从 CSS 变量读进 uniform,和页面主题一个来源
- 盖上用 easeIn(冲进来)、揭开用 easeOut(缓缓退),节奏感全在这两条曲线
- `busy` 锁防连点;无 WebGL 或 `prefers-reduced-motion` 直接 `show()`,等价普通切换

## 代价与注意

- 性能: 全屏单 pass,noise 两个八度共 8 次 hash,任何 GPU 无感;idle 时零消耗(rAF 已停)
- 可访问性: 按钮驱动,键盘天然可用;`prefers-reduced-motion` 跳过动画直接换内容;换内容后 `aria-current` 同步
- 移动端: 无 hover 依赖;注意 `devicePixelRatio` 上限(demo capped 2),别在高分屏画 3x 全屏

## 变体与延伸

- 真实站点里"换 DOM"那一拍换成路由跳转(盖满时 `location.href` / SPA navigate),就是无缝页面转场
- 遮罩层里再画点东西(logo、噪点、进度)= 品牌化转场;Igloo 是把 UI 本身也 shader 化的极端版
- 和 [view-transitions](../view-transitions/) 互补:VT 管共享元素连续性,shader wipe 管"整屏物质感";displacement 管图片内容互溶
- 参考:Awwwards Igloo case study、Codrops《Page Transitions with Shaders》系
