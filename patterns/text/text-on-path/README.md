# 文字沿路径 Text on Path

- **分类**: 文字动效 / 排版
- **难度**: ★★
- **冲击力**: A(炸场)——文字脱离横平竖直的基线,是网页排版里最少见、也最像"平面设计"的一步
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/text/text-on-path/demo.html)

## 设计意图

网页上的字永远躺在一条水平线上。让它绕着圆、沿着弧、顺着一条自由曲线跑,**一眼就跳出"网页"的默认观感**。

两个最常见的落地场景:圆形徽章式的旋转文字(常驻在角落做品牌印记),和沿弧线排布的大标题。

## 核心机制

两条路,**用途不同别混**:

**A. SVG `<textPath>`** —— 静态排布的正解

```html
<svg viewBox="0 0 700 200">
  <path id="arc" d="M 20,150 C 200,20 500,20 680,150" fill="none"/>
  <text><textPath href="#arc" startOffset="50%" text-anchor="middle">沿着弧线走</textPath></text>
</svg>
```

文字**仍是一段完整文本**:可选中、可搜索、读屏正常。想要静态的沿路径排版,这条就够了。

**B. CSS `offset-path`** —— 需要逐字动画时

```css
.char{
  position:absolute; top:0; left:0;
  offset-path:path("M 20,150 C 200,20 500,20 680,150");
  offset-distance:calc(var(--i) * 100% / var(--n));   /* 每个字一个位置 */
  offset-rotate:auto;                                  /* 跟着路径转向 */
}
```

动画 `offset-distance` 就是"文字沿路径流动"。**代价是每个字必须是独立元素**——文本被拆碎了。

## 实现要点

- `offset-path` 的坐标原点是元素**自身的盒位置**。所以要把所有字 `position:absolute; top:0; left:0` 放在同一个定位容器里,路径坐标才和容器坐标对齐
- `offset-rotate:auto` 让字跟着切线转;不想转就写 `offset-rotate:0deg`
- **拆字之后文本就没了**:容器加 `aria-label` 写原文,每个字 `aria-hidden="true"`。不做这一步等于把这段内容从读屏用户那里删掉
- 路径用 `viewBox` 尺寸写死,容器用相同宽高比 + `transform:scale()` 做响应式,比重算路径省
- **`offset-distance` 在开放路径上钳制到 100%,只有闭合路径才环绕**。这条决定了你能做什么:
  - **开放路径(弧线)** → 只能做**一次性入场**(各字从起点滑到自己的位置)。硬做无限循环的话,后半个周期所有字都堆在路径末端
  - **闭合路径(圆)** → 才能无限流动。画圆时**结尾一定要写 `Z`**,`M 95,15 A 80,80 0 1,1 94.99,15` 看着是个圆但没闭合,照样钳制
- 圆形徽章直接用闭合 `path` 画整圆,`offset-distance` 加匀速动画就是旋转印记——**别用 `rotate` 转整个容器**,那样每个字的朝向不对
- 中文沿路径比拉丁好看:方块字等宽,间距天然均匀

## 代价与注意

- **可访问性**:方案 B 拆字后必须补 `aria-label`(见上)。方案 A 无此问题,这是它的主要优势
- 拆字 = N 个绝对定位元素 + N 个 `offset-path` 计算。一句话十几个字没问题,**别拿它排段落**
- `offset-path` 的浏览器支持在 2023 年后才齐;老环境降级成普通横排(`@supports (offset-path: path("M0,0"))`)
- **入场绝对不要动画 `offset-distance`**。每个字动画时长相同,但 travel 距离不同——第 n 个字要走 `n/N` 的路径,同样时间等于**它的速度是第 1 个字的 n 倍**,半路就会超过前面的字。结果:**动画过程中文字是乱序的**,静止后才恢复正常,所以只看终态查不出来。
  正确做法:字始终待在自己的路径位置上,入场只做 `opacity` / `transform`(`offset-path` 先算位置,`transform` 叠在它上面,两者不冲突)
- **验的时候要验过程,不是终态**。`el.getAnimations()[0].currentTime = t` 可以手动拨时间轴逐帧采样,浏览器冻结 rAF 时也有效
- **终态必须写在基础规则里,不能只写在 `@keyframes` 的 `to{}` 里**。入场动画用 `animation-fill-mode: backwards`(延迟期间套用 `from`),**别用 `both`**——`both` 会在动画结束后继续钉住 `to`,于是动画一旦没跑(低电量节流、载入时祖先 `display:none`、被冻结),所有字永远堆在路径起点。排版不该依赖动画运行
- **字数要配得上路径长度**。约 700px 的弧线放 30px 的字,10 个刚好(实测字间距 53–74px);塞 20 个就会挤在一起
- **弧度别太大**。两端陡峭处 `offset-rotate: auto` 会把字转得东倒西歪;把控制点压平(纵向跨度控制在 50px 上下)观感稳定得多
- 弧度大的路径上字与字的视觉间距会被压缩/拉开,需要手工调 `--i` 分布,均分不一定好看
- `prefers-reduced-motion`:停掉流动动画,保留静态的沿路径排布

## 变体与延伸

- 圆形徽章 + 匀速旋转 = 常驻角落的品牌印记,配 [cursor/magnetic-pull](../../cursor/magnetic-pull/) 让它被指针吸引
- `offset-distance` 绑滚动进度(配 [scroll/css-scroll-scrub](../../scroll/css-scroll-scrub/)),文字随滚动沿路径前进
- 路径用 [text/svg-line-draw](../svg-line-draw/) 的 `stroke-dashoffset` 同时画出来,字跟着线一起长
- 每个字再叠一点 `--i` 相关的延迟,就是沿路径的 stagger 入场(见 [text/split-text-reveal](../split-text-reveal/))
