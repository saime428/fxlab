# 加载序章 Entry Preloader

- **分类**: 加载动画
- **难度**: ★★
- **见于**: [Bruno Simon 2019](../../../cases/bruno-simon-2019/analysis.md)、[Robin Payot](../../../cases/robin-payot/analysis.md)(Enter 门)
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/loading/entry-preloader/demo.html)

## 设计意图

重资源站(WebGL/大图)横竖要等,序章把"等"变成"入场仪式":进度数字 → 100% → Enter 按钮 → 幕布拉开。同时 Enter 手势顺便解锁了音频。三件事一个动作:遮加载、造期待、拿授权。

## 核心机制

```js
const assets = [...];                     // 真实项目:贴图/模型/字体
let done = 0;
assets.forEach(a => load(a).then(() => {
  progress(++done / assets.length);       // 驱动数字与进度条
}));
// 100% 后不直接进 → 显示 Enter,等用户手势
```

## 实现要点

- **数字要 lerp**:真实加载是阶跃的,显示值向真实值缓动,观感连续
- 100% 后停一拍(300ms)再亮 Enter,给"完成"一个确认瞬间
- 幕布退场用 clip-path 或 translateY,退场动画本身就是第一个效果
- 内容在幕布后面提前渲染好,拉开即就绪,不能穿帮
- 加载 <1.5s 的站不配序章,直接进——序章是必要之恶的美化,不是装饰

## 代价与注意

- 可访问性: Enter 必须可键盘触达;`prefers-reduced-motion` 时幕布直接消失
- 假进度是行业潜规则,但别太假:资源真没到就进场,后面全是白块
- SEO/首屏指标: 序章会拖 LCP,营销页慎用

## 变体与延伸

- 进度数字超大字号铺满屏(奢侈品牌常用)
- 加载时预热:序章期间偷偷 warm up shader、解码图片

## 实战笔记

- 组合多个入场效果时(样板间实测):Enter 点击就是**全页动效的 t=0**——hero 的 split-text、rAF 常驻循环都挂在这个回调里启动,别让各效果在 DOMContentLoaded 各自抢跑,否则幕布还没揭内容已经演完了
