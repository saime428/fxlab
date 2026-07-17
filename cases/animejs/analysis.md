# Anime.js 官网 (v4)

- **URL**: https://animejs.com/
- **收录日期**: 2026-07-15
- **一句话印象**: 库官网本身就是 API 演示场:每个卖点旁边就是活的动画

## 整体气质从哪来

- "代码块 + 对应动画实例"并排,文档即演示
- 大量 stagger(网格波纹扩散)建立节奏
- 交互式 bundle size 可视化,把枯燥数据做成玩具

## 效果清单

| # | 效果描述 | 分类 | 推测技术 | 值得抽成 pattern? |
|---|---|---|---|---|
| 1 | 13×13 网格 stagger 波纹(from center) | text/scroll | anime.js `stagger(grid)` | ✅ |
| 2 | SVG 线条绘制 + 路径跟随(赛车沿赛道) | text | `createDrawable` + `createMotionPath` | ✅ |
| 3 | 可拖拽 + 弹簧回弹元素 | hover | `createDraggable` + spring | ✅ |
| 4 | 滚动同步动画(sync 模式) | scroll | `onScroll({ sync: true })` | ✅ |
| 5 | 时钟表盘 timeline 编排 | text | `createTimeline` 负延迟定位 | ☐ |

## 技术栈侦察

- 动画: anime.js v4 本尊(24.5KB 全家桶,模块化按需引入)
- CMS: 疑似 Kirby(`/media/pages/` URL 特征)
- **开源**: https://github.com/juliangarnier/anime ✅ 完整源码可学

## 借鉴笔记

anime.js v4 的 ScrollObserver + stagger + SVG 三件套覆盖了大部分"非 WebGL 炫酷需求",比 GSAP 轻;做效果沉淀库时可作为 GSAP 的平替对照。
