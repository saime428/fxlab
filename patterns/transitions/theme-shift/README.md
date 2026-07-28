# 章节主题突变 Theme Shift

- **分类**: 页面切换 / 滚动动效
- **难度**: ★
- **见于**: [Shopify Editions](../../../cases/shopify-editions-winter-26/analysis.md)(章节换装)、大量长页叙事站
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/transitions/theme-shift/demo.html)

## 设计意图

长页面滚到某章时整页配色瞬间翻转(深→浅、蓝→红),像翻到新一章的扉页。感知极强、成本极低,是"让长页不闷"性价比最高的一招。

## 核心机制

主题全部走 CSS 变量,IntersectionObserver 在章节进入时改 `data-theme`,transition 负责渐变:

```css
:root { --bg:#0d0d0d; --fg:#f2f2ee; --accent:#c5f542; }
[data-theme="warm"] { --bg:#f5ede2; --fg:#1a1208; --accent:#e05c2a; }
body { background:var(--bg); color:var(--fg); transition: background .8s, color .8s; }
```

```js
new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) document.body.dataset.theme = e.target.dataset.theme;
}), { threshold: 0.5 }).observe(section);
```

## 实现要点

- 所有颜色一律走变量,任何一个硬编码色值都会在切换时"漏"出来
- `threshold: 0.5`:章节过半才切,避免边界抖动;更稳的做法是用 `rootMargin: "-50% 0px -50% 0px"` 检测视口中线
- transition 0.6~0.9s 比瞬切高级;但品牌想要"啪"的一下也可以 0s,是风格选择
- 顺手把 `<meta name="theme-color">` 也同步了,移动端浏览器条一起变

## 代价与注意

- 性能: background/color 过渡会重绘,但整页也就一次,无所谓
- 可访问性: 每套主题都要过对比度检查;`prefers-reduced-motion` 可去掉过渡直接切
- 图片/插画不会跟着变量走,每章素材要提前按主题准备

## 变体与延伸

- 变量不止颜色:圆角、字重、字体一起换,章节"性格"更完整
- 配合滚动进度做 HSL 连续插值(而非离散切换)
