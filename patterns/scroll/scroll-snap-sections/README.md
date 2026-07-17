# 滚动分节锁定 Scroll Snap Sections

- **分类**: 滚动动效 / 布局手法
- **难度**: ★
- **见于**: [Lando Norris](../../../cases/lando-norris/analysis.md)("tap to lock" 滚动锁定的 CSS 简化版);全屏叙事站的标准骨架
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/scroll/scroll-snap-sections/demo.html)

## 设计意图

把自由滚动变成"一站一站地走"——每屏一个完整画面,松手必然停在整节上。锁定感本身就是叙事节奏:观众没法半途而废。

## 核心机制

内核零 JS,三行 CSS:

```css
.viewport { height: 100dvh; overflow-y: auto; scroll-snap-type: y mandatory; }
section   { height: 100dvh; scroll-snap-align: start;
            scroll-snap-stop: always; }   /* 快速滚也一节节停,不许跳站 */
```

JS 只负责外挂:圆点导航(`scrollIntoView`)+ 一个 IntersectionObserver 标当前节。

## 实现要点

- **`scroll-snap-stop: always` 才是"锁定感"的来源**,没有它快速滚动会连跳几节
- 滚动容器用自建 div 而不是 body,顶栏/导航可以放容器外不受吸附影响
- 高度用 `100dvh` 不是 `100vh`,移动端地址栏收展不破版
- Lando 原版是 JS 滚动状态机(可加"tap to lock"按钮、进度动画),CSS 版保住核心体感、成本 1/10
- **可访问性大坑**:内容可能超过一屏的节,`mandatory` 会让底部内容永远看不到——内容不可控时降级为 `proximity` 或干脆不吸附

## 代价与注意

- 性能: 浏览器原生吸附,零开销
- 可访问性: 键盘 PageDown/空格/方向键原生可用;`prefers-reduced-motion` 关掉 smooth(吸附是定位不是动画,保留无碍)
- 移动端: 原生支持且手感极好——本来就是为触屏设计的 API

## 变体与延伸

- 横向版:`scroll-snap-type: x mandatory` + 横排 = 分页画廊
- 每节配合 [theme-shift](../../transitions/theme-shift/) 换主题 = 章节感翻倍;配合 [section-narrative](../../layout/section-narrative/) 的编号导航是天作之合
- 要滚动进度驱动的动画再加 [css-scroll-scrub](../css-scroll-scrub/),同为零 JS 路线
