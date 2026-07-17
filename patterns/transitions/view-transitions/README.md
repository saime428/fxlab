# View Transitions 共享元素过渡

- **分类**: 页面切换
- **难度**: ★★
- **见于**: [infinite imaginations](../../../cases/infinite-imaginations/analysis.md)(hash 路由过渡的 2026 原生等价物);taxonomy 页面切换类点名技术
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/transitions/view-transitions/demo.html)

## 设计意图

列表里的缩略图"长大"成详情页主图,而不是旧页消失新页出现——共享元素在两个视图之间连续存在,用户的空间感不断线。以前要 FLIP 手算(记位置→改布局→反向变换→回放),现在浏览器原生一步。

## 核心机制

给过渡前后的"同一个元素"配同名 `view-transition-name`,DOM 更新包进 `startViewTransition`:

```js
thumb.style.viewTransitionName = 'hero';          // 旧视图:这张缩略图
document.startViewTransition(() => {
  renderDetail();                                  // 任意方式改 DOM
  bigImg.style.viewTransitionName = 'hero';        // 新视图:详情大图
});
// 浏览器自动补间两者的位置/尺寸,其余部分交叉淡化
```

## 实现要点

- 同一时刻一个 name 只能存在一个元素,列表页要在点击时才给目标元素赋 name,别全列表都挂
- 不支持的浏览器直接调用更新函数即可——**渐进增强天然免费**:`if (!document.startViewTransition) { update(); return; }`
- 过渡细节可用 CSS 定制:`::view-transition-old(hero)` / `::view-transition-new(hero)` 上写 animation
- 跨文档版(MPA)只要 CSS `@view-transition { navigation: auto; }`,零 JS
- 过渡期间整页会截图合成,避免在回调里做慢操作(网络请求先行,拿到数据再开过渡)

## 代价与注意

- 性能: 合成器上跑截图补间,主线程压力小;超大页面截图有一次性成本
- 可访问性: 浏览器自动尊重 `prefers-reduced-motion`(跳过动画),无需额外代码;但自定义 animation 时要自己加降级
- 兼容性: Chrome/Edge 已稳,Safari 18+ 支持,Firefox 落后——所以必须按渐进增强写

## 变体与延伸

- 主题切换时用它做全屏 clip-path 扩散揭示(墨滴换肤)
- 配合 Navigation API / 框架路由 = SPA 路由转场的原生方案,替代 Barba.js
- FLIP 原理仍值得懂:不支持的浏览器上想要同款效果,手写 FLIP 是唯一路径

## 实战笔记

- root 冻结(`::view-transition-old/new(root) { animation: none }`)+ 只命名内容元素时,**状态容器的外观变化会硬切**(用户判词:"咔咔")——`background-image`/`box-shadow` 不可插值,给容器写 `transition: background` 是空转。修法:容器本身也 `view-transition-name` 入组,被推移的兄弟区块同样入组,VT 才能接管整体形变与让位(living-life-lore 抽屉,2026-07-17)
- 命名的后代不会进入祖先的快照(spec 行为),所以"壳一个组、内容一个组"可以安全嵌套,内容组自然叠在壳组之上
