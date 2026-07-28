# 旋转渐变描边 Conic Border Spin

- **分类**: 悬停交互(按钮/卡片装饰)
- **难度**: ★
- **见于**: [MotionPotion](../../../cases/motionpotion/analysis.md)(`.btn::after` + `@property --mp-angle`);当下 AI 产品站的事实标配
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/hover/conic-border-spin/demo.html)

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

## 并入 flow-border 的补充(2026-07-26 去重)

原 `hover/flow-border` 与本 pattern 是同一机制(逐行几乎相同),已删除并入这里。它多记的几条:

- **扫描数据**:`@property` 在 [773 站扫描](../../../blends/scans/2026-07-awwwards.md)里 **133/691 站在用、总出现 7523 次**,是新特性里普及最快的一个
- **`inherits: false` 不是可选**:不写的话每个子元素都继承 `--angle` 并各自跑一遍动画,白白多算
- **`@property` 必须在样式表顶层**,不能嵌在 `@media` 或选择器里
- **hover 才转的写法**:切 `animation-play-state`(`paused` ↔ `running`)比切整个 `animation` 属性平滑
- **降级要主动设计**:不支持 `@property` 时 `--angle` 是普通字符串,动画不跑、渐变停在初始角——**所以初始角要选一个静止也好看的位置**
- Safari 需要 `-webkit-mask-composite: xor`(标准写法是 `mask-composite: exclude`)
- **强注意力效果,一页一次**:一个持续运行的动画就是一个持续的合成层,列表里每项都加会拖垮页面
