# 反色光标点 Blend Dot

- **分类**: 鼠标跟随
- **难度**: ★★
- **见于**: 是 [cursor/custom-cursor](../custom-cursor/) 与 [layout/blend-invert](../../layout/blend-invert/) 的交集用法;扫描里 147 站用 `mix-blend-mode: difference`,33 站有跟随元素,重合的那批就是这一类
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/cursor/blend-dot/demo.html)

## 设计意图

自定义光标最烦的问题:**页面有深有浅,光标要么在白底上看不见,要么在黑底上看不见**。常规解法是监听光标下方元素换颜色——要维护一张映射表,内容一改就漏。

`mix-blend-mode: difference` 让光标**自己反相**:白点在白底变黑,在黑底保持白,压在图片和视频上一样成立。零维护。

## 核心机制

```css
.dot{
  position:fixed; width:18px; height:18px; margin:-9px 0 0 -9px;
  border-radius:50%; background:#fff;      /* 必须纯白 */
  mix-blend-mode:difference;
  pointer-events:none; z-index:9999;
}
```

位置照常 rAF + lerp 写 `transform`。全部机制就是把 `blend-invert` 那一行加在光标元素上。

## 实现要点

- **`z-index` 高不代表能混合**:混合只发生在**同一层叠上下文内**。光标挂在 `<body>` 直属子级,中间任何祖先带 `transform` / `filter` / `opacity<1` / `isolation:isolate` 都会切断,光标退化成纯白圆点
- 因此光标元素**必须挂在 `document.body` 上**,不要塞进任何组件容器里
- 点必须是纯白 `#fff`。有色的点得到的是补色,通常很脏
- **中灰失效**:背景 `#808080` 附近时反色结果还是中灰,光标基本消失。这是 `difference` 不可回避的硬伤,灰底为主的页面别用这条路
- 想同时藏原生光标就加 `cursor:none`(作用域化,见 [hide-and-follow](../hide-and-follow/));只做叠加就别藏,可用性代价更小

## 代价与注意

- 继承 [blend-invert](../../layout/blend-invert/) 的全部代价:中灰失效、层叠上下文敏感、部分截图路径不支持
- 继承 [custom-cursor](../custom-cursor/) 的全部代价:`prefers-reduced-motion` 必须关掉、后台停 rAF、触屏整个关掉
- Safari 上 `position:fixed` + `mix-blend-mode` 有渲染残留,加 `transform:translateZ(0)` 一般能绕过——但光标本来就在写 `transform`,天然满足

## 变体与延伸

- `exclusion` 比 `difference` 柔和(中间调对比更低),想要"存在感弱一点"用它
- 点 + 滞后更大的环两层,环也用 difference —— 双环反色,是 Awwwards 上辨识度最高的一种
- hover 图片时点放大到覆盖住图 = "反相放大镜",成本只是改 `scale`
