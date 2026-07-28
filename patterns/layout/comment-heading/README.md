# 注释风标题 Comment Heading

- **分类**: 布局手法(排版)
- **难度**: ★
- **见于**: [infinite imaginations](../../../cases/infinite-imaginations/analysis.md)(`// about`)、[Hashgraph Ventures](../../../cases/hashgraph-ventures/analysis.md)(`//01 Manifesto` 编号变体)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/layout/comment-heading/demo.html)

## 设计意图

把章节标题写成代码注释(`// 01 — About`),一眼确立"工程师做的、给懂行的人看的"身份。同时编号自带秩序感——2016 年的站在用,2026 年的站还在用,是罕见的十年不过时排版手法。

## 核心机制

CSS 计数器自动编号,`::before` 输出注释前缀,一行内容都不用改:

```css
main { counter-reset: sec; }
h2::before {
  counter-increment: sec;
  content: "// " counter(sec, decimal-leading-zero) " — ";
  color: var(--accent);
  font-family: ui-monospace, monospace;
}
```

## 实现要点

- 前缀用等宽字体、弱化色;标题本体可以继续用无衬线粗体——对比就是层次
- `decimal-leading-zero` 补零(01、02)比裸数字有"目录"感
- 编号是纯装饰,读屏用户不需要:`::before` 内容大多数读屏会念,介意的话改用 `<span aria-hidden>` 手写前缀
- 配套小动作:hover 时前缀变亮/标题右移 2px,克制但有反馈
- 别整页都是注释风,它是"署名",不是"字体主题"

## 代价与注意

- 性能: 纯 CSS,零成本
- 可访问性: 见上,前缀语义噪音问题
- 移动端: 正常;窄屏注意前缀 + 长标题的折行

## 变体与延伸

- `/* about */` 块注释风、`#` Markdown 风、`<about/>` 标签风——同一思路换方言
- Hashgraph 的编号变体(`//01 Manifesto`)+ 章节导航(prev/next)= 把注释风升级成叙事骨架
- 和 [section-narrative](../section-narrative/) 组合:每章一个注释编号,天然目录
