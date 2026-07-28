# 旋转渐变描边 Conic Border Spin

- **分类**: 悬停交互(按钮/卡片装饰)
- **难度**: ★
- **见于**: [MotionPotion](../../../cases/motionpotion/analysis.md)(`.btn::after` + `@property --mp-angle`);当下 AI 产品站的事实标配
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/hover/conic-border-spin/demo.html)

## 设计意图

按钮边缘一圈彩色渐变缓缓转动,像通了电——不打扰阅读,却把"这里可以按"的能量感拉满。它是 hover 高亮的常亮版:不需要用户做任何事,元素自己在呼吸。

## 核心机制

CSS 变量默认不可插值(动画会离散跳变),`@property` 注册成 `<angle>` 后就能平滑过渡;conic-gradient 的起始角吃这个变量,转角度 = 转边框:

```css
@property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
.btn::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  padding: 2px;                                    /* 环的厚度 */
  background: conic-gradient(from var(--angle), #f0f, #0ff, #ff0, #f0f);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;                         /* 中间挖空,只剩环 */
  animation: spin 3s linear infinite;
}
@keyframes spin { to { --angle: 360deg; } }
```

## 实现要点

- **`@property` 是本体**:不注册也能写,但动画会直接跳变/不动——好在这就是天然降级(静态渐变边框,不丑)
- 挖空环的两种流派:mask-composite(上面写法,通用)vs `padding` + 内层盖白底(MotionPotion 写法,需要内容层自带背景)
- 渐变首尾颜色必须相同,否则转到接缝处闪一下
- **常转是有代价的**:每帧重绘。低端机/列表里大量按钮时改成 hover 才转(`animation-play-state: paused` → hover `running`),demo 两种都给了
- 圆角跟随 `border-radius: inherit`,别硬编码

## 代价与注意

- 性能: 单个元素无感;几十个同屏常转会吃绘制,用 hover-play 版或只给主 CTA
- 可访问性: 纯装饰,`aria-hidden` 不需要(伪元素本就不进树);`prefers-reduced-motion` 停转留静态渐变
- 移动端: 无 hover,常转版直接成立;hover-play 版降级为静态

## 变体与延伸

- 转速慢到 20s+ = "微光流动",快到 1s = "充能中",同一机制两种情绪
- 双层反向转(::before 顺 ::after 逆)更华丽,吵一倍,慎用
- 同一个 `--angle` 还能转 `background` 光斑、`box-shadow` 色相——@property 让任何"角度类"属性可动画化
