# 全屏菜单 Stagger 展开 Menu Stagger Reveal

- **分类**: 页面切换
- **难度**: ★
- **见于**: [Lando Norris](../../../cases/lando-norris/analysis.md)(菜单展开多图错位入场)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/transitions/menu-stagger-reveal/demo.html)

## 设计意图

菜单不是"弹出个下拉框",而是"换了个场景":整屏遮罩揭开,菜单项一条条错落到位。它把网站最普通的组件变成最先展示品味的地方——而且每个站都有菜单,这是本库泛用性最高的条目。

## 核心机制

两层动画:遮罩用 clip-path 揭示,菜单项用索引换延迟(和 [split-text-reveal](../../text/split-text-reveal/) 同一个思路,对象从字换成链接):

```css
.menu { clip-path: inset(0 0 100% 0); transition: clip-path .6s cubic-bezier(.22,1,.36,1); }
.menu.open { clip-path: inset(0); }
.menu a { opacity: 0; transform: translateY(40px); }
.menu.open a { opacity: 1; transform: none; transition: .5s; }
```

```js
links.forEach((a, i) => a.style.transitionDelay = open ? `${150 + i * 70}ms` : '0ms');
```

## 实现要点

- **可访问性是本体,不是附加**:按钮挂 `aria-expanded` + `aria-controls`;关闭态菜单加 `inert`(移出 tab 序和读屏);Escape 关闭;打开聚焦第一项,关闭焦点还给按钮
- 打开有 stagger,关闭一律 0 延迟快速收场——出场磨蹭是负体验
- 遮罩曲线用 ease-out 家族(减速抵达);clip-path 方向决定"从哪来"的叙事(上→下 = 幕布)
- 菜单打开时锁页面滚动:`document.body.style.overflow = 'hidden'`
- 同一套编排可平移到任何 overlay:购物车、筛选面板、搜索层

## 代价与注意

- 性能: clip-path + transform,合成器友好;背景加 `backdrop-filter: blur()` 时注意低端机
- 可访问性: `prefers-reduced-motion` 时无过渡直接切换;上述焦点管理不可省
- 移动端: 100dvh 处理地址栏;触屏无 hover,交互全靠点击本来就成立

## 变体与延伸

- Lando 版:菜单项旁配图,hover 哪项亮哪张(图片也参与 stagger)
- clip-path 换圆形 `circle(0% at 按钮位置)` = 从按钮"炸开"的变体
- 双层遮罩(深色条先行、内容层跟进)更有"幕布"仪式感
