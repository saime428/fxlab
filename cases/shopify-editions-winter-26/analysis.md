# Shopify Editions | Winter '26

- **URL**: https://shopify-editions-winter-26.pages.dev/ (官方: https://www.shopify.com/editions/winter2026)
- **收录日期**: 2026-07-15
- **一句话印象**: 150+ 条产品更新做成一场滚动叙事,"发布说明"的天花板

## 整体气质从哪来

- 每季 Editions 都是一次主题化包装,本季 "The RenAIssance Edition"
- 滚动长卷叙事,穿插可交互的聊天气泡、漂浮文字、内嵌演示
- 信息架构极强:海量更新按人群/主题分章,炫而不乱

## 效果清单

| # | 效果描述 | 分类 | 推测技术 | 值得抽成 pattern? |
|---|---|---|---|---|
| 1 | 全页滚动驱动章节叙事 | scroll | 滚动进度编排 + 章节 pin | ✅ |
| 2 | 可交互漂浮元素(气泡/贴纸) | hover | 物理感 hover + 拖拽 | ✅ |
| 3 | 章节主题切换(配色/风格突变) | transitions | 滚动触发主题变量切换 | ✅ |
| 4 | 内嵌产品 UI 动画演示 | layout | 12 个 video(实测确认) | ☐ |
| 5 | 视差漂浮卡片 | scroll | 不同滚动速率 translate | ✅ |
| 6 | 数字滚动 counter | text | IntersectionObserver + rAF | ✅ |

## 技术栈侦察

- 完全客户端渲染(裸 HTML 只有一个挂载点),pages.dev = Cloudflare Pages 部署
- 拿到 [One Page Love 奖](https://onepagelove.com/shopify-editions-winter-2026)
- 建议后续用浏览器 DevTools 深挖 bundle(fetch 拿不到运行时)

## 借鉴笔记

"产品发布页做成叙事长卷"是 B 端内容炫酷化的最佳范式;章节主题突变(配色整体翻转)是低成本高感知的手法。

## 运行时实测(浏览器注入探测,2026-07-16)

- 无全局动画库(React + Tailwind 打包),2 canvas + 12 video + 40 个 SVG SMIL 动画(`<animate>`)
- 主题切换是**三层 data 属性**:`data-nav-theme` / `data-sidebar-theme` / `data-title-theme`,导航、侧栏、标题各自跟随章节换肤——比单一根变量更细,可反哺 theme-shift pattern 文档
- `cloud-card-parallax`(视差漂浮卡片)、`counter`(数字滚动)是清单外新发现
- 内嵌产品演示的实现比预想朴素:就是 video,没有 Lottie/实时 DOM
