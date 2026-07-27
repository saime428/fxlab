# 章节式滚动叙事 Section Narrative

- **分类**: 布局手法 / 滚动动效
- **难度**: ★
- **见于**: [Hashgraph Ventures](../../../cases/hashgraph-ventures/analysis.md)(//01 Manifesto)、机构/品牌宣言站
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/layout/section-narrative/demo.html)

## 设计意图

把长页组织成"编号的章"(//01、//02…),配一个常驻进度导航。读者随时知道"我在故事的哪里、还剩多少"——秩序感本身就是高级感,尤其适合 VC/律所/品牌宣言这类要"稳"的客户。

## 核心机制

侧边固定导航 + IntersectionObserver 高亮当前章:

```js
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting)
    nav.querySelector(`[href="#${e.target.id}"]`).classList.add('active');
}), { rootMargin: '-50% 0px -50% 0px' });
```

## 实现要点

- 编号排版(//01 风格)用等宽字体或加宽字距,做出"文件编号"的克制感
- 导航点击用 `scrollIntoView({ behavior:'smooth' })`,免费的平滑滚动
- 可选 `scroll-snap-type: y proximity`(不要 mandatory,会绑架滚轮)
- 章内元素配 scroll-reveal 入场,两个 pattern 天然组合

## 代价与注意

- 可访问性: 导航要是真 `<a href="#id">`,键盘/读屏可用;当前章加 `aria-current`
- 章节数 3~6 最佳,超过 8 个编号就失去"章"的重量感
- 移动端侧导航改为顶部细进度条或隐藏

## 变体与延伸

- 导航项带小标题,hover 展开(Hashgraph 的 Read more 结构)
- 编号联动主题突变(见 theme-shift pattern),一章一色

## 实战笔记(fixed 叠放流派)

Hashgraph 实测用的不是文档流分节,是 **fixed-section 叠放**:所有幕 `position:fixed; inset:0` 重叠,body 高度靠 `calc(N * 100svh)` 撑出滚动距离,滚动位置决定哪一幕 `is-on`,幕间做交叉淡入。和 scroll-snap 是两种流派——这种能做"幕与幕之间整体换气质",scroll-snap 做不到。

- **状态机别挂 `scroll` 事件**:scroll 会被节流、甚至整个不派发(内嵌预览实测 `scrollY` 变了但事件触发 0 次)。fixed 骨架下状态机不动 = 整页只剩一屏可达,退化比普通页严重得多。从已有的 rAF 循环里读 `scrollY` 最省(反正每帧都在跑),顺带满足"单 rAF 调度"
- **非当前幕必须 `inert`**:光靠 `visibility:hidden` 不够——它带过渡延迟,那段时间里看不见的幕仍在无障碍树里、仍能被 Tab 进去。`s.toggleAttribute('inert', !on)` 一步到位且不依赖过渡跑完
- 降级最干净的写法是**回退成普通文档流**:`prefers-reduced-motion` 里把 `.stage` 和 `.scene` 改回 `position:static`、body 高度改 `auto`,fixed 骨架整个消失,内容自然堆叠
- 初始隐藏态挂在 `html.js` 下(head 里一行 `documentElement.classList.add('js')`),JS 没跑时是完整文档,不会白屏

> 来源:[blends/hashgraph-x-lando](../../../blends/hashgraph-x-lando/) 糅合 pilot,2026-07-26
