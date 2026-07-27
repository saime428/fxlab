# 覆盖层自动反色 Blend Invert

- **分类**: 布局手法 / 图层合成
- **难度**: ★
- **见于**: [sakazuki](https://sakazuki.io/)(fixed header + bottomBar + 飞行 logo)、[Lama Lama](https://lamalama.com/)(hero section + 压在视频上的图标按钮,用 exclusion)、[Sui](https://www.sui.io/)(标题里的强调词 `.custom-span.invert`)
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/layout/blend-invert/demo.html)
- **来源**: [2026-07 Awwwards 横截面扫描](../../../blends/scans/2026-07-awwwards.md),**130/629 站在用(21%)**

## 设计意图

固定的 header、logo、光标这类覆盖层,压在明暗不定的内容上(白色区块 → 深色区块 → 视频 → 图片),要**一直可读**。

常规做法是 JS 监听滚动,进到深色区块就给 header 加 `.is-dark` 换色——要维护一张"区块→主题"的表,内容一改就漏。`mix-blend-mode: difference` 是**零 JS 的替代**:白色覆盖层在白底上自动变黑,在黑底上保持白,连视频和 canvas 都一起算。

扫描里 **21% 的获奖站在用(130/629)**,三个尺度都有:固定层(sakazuki 的 header)、整块 section(Lama Lama 的 hero)、行内强调词(Sui)。

## 核心机制

```css
.overlay {
  color: #fff;                    /* 必须是纯白,difference 才得到完整反色 */
  mix-blend-mode: difference;
  pointer-events: none;           /* 覆盖层别挡点击(sakazuki header 就是这么做的)*/
}
```

`difference` 逐通道算 `|背景 − 前景|`:前景纯白时结果就是背景的反相。白底 → 黑字,黑底 → 白字,红底 → 青字。

## 实现要点

- **别被 stacking context 切断**:覆盖层和它要混合的背景必须在同一个层叠上下文里。父级带 `isolation: isolate`、`opacity < 1`、`transform`、`filter`、`will-change` 都会切断混合,元素会退化成普通白色。**这是这个效果最常见的"不生效"原因**
- 文字用纯 `#fff`。有色文字得到的是补色,通常不是你想要的
- 覆盖层里如果有图标,用 `currentColor` 的 SVG,别用彩色位图(位图会被整张反相)
- Safari 上 `position: fixed` + `mix-blend-mode` 历史上有渲染残留,加 `transform: translateZ(0)` 一般能绕过
- 混合对象是**下方所有内容**,包括 `<video>` 和 `<canvas>`——这正是 Lama Lama 把它用在视频上的原因

## 代价与注意

- **中灰硬伤**:背景是 `#808080` 附近时,`|128−255| = 127`,结果还是中灰 → **对比度归零,文字消失**。这是这招不可回避的失效区,灰底页面不能用
- **可访问性**:因此它不能作为对比度的唯一保障。关键文字(导航、按钮)要么避开灰底,要么加兜底(半透明 backdrop / `text-shadow`)。WCAG 对比度得按实际渲染结果验,不能假设
- `exclusion` 是更柔和的版本(中间调对比更低),Lama Lama 用它;要对比强烈用 `difference`
- 不是动画,`prefers-reduced-motion` 不涉及
- 部分打印和截图路径不支持混合模式,会退化成纯白

## 变体与延伸

- **行内强调**(Sui 用法):`<span class="invert">` 包住标题里的一个词,压在渐变/图片上自动反色,成本一行 CSS
- **配自定义光标**:光标元素加 difference,在任何背景上都可见——和 [cursor/hide-and-follow](../../cursor/hide-and-follow/) 天然组合
- **替代 [theme-shift](../../transitions/theme-shift/) 的轻量选项**:theme-shift 是主动换一整套色板(能换品牌色),blend-invert 只保证可读性但零维护。长页分章换肤用前者,固定 header 用后者
- 想避开中灰失效又要零 JS:`backdrop-filter: invert(1)` 是另一条路,但性能开销大得多
