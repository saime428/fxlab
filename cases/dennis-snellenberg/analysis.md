# Dennis Snellenberg — 独立设计师/开发者作品集

- **URL**: https://dennissnellenberg.com/
- **收录日期**: 2026-07-22
- **一句话印象**: 被复刻最多的磁性按钮 + 弧形章节边缘,SOTD 作品集"手感"的标本

## 整体气质从哪来

- 一切交互都带物理感:按钮迎向手指、章节边缘像布一样绷平——"手感"是它的品牌
- 圆是母题:圆按钮、圆形展开的导航、弧形分割,几何语言统一
- 2022 Awwwards SOTD;个人站证明"手感"不需要 WebGL

## 效果清单

| # | 效果描述 | 分类 | 推测技术 | 值得抽成 pattern? |
|---|---|---|---|---|
| 1 | 磁性按钮(.magnetic,含内层文字视差) | hover | mousemove 偏移×强度 + GSAP 弹性回位 | ✅ |
| 2 | 弧形章节边缘随滚动绷平(rounded-div-wrap) | scroll/layout | 高度受滚动压缩的圆弧 div | ✅(待做) |
| 3 | 圆形展开导航(btn-round + fixed-nav-rounded-div) | transitions | 圆形遮罩展开 | ☐(clip-shape-wipe 圆形版已覆盖机制) |

## 技术栈侦察

- GSAP + ScrollTrigger 全局实锤;8 个 @keyframes
- 磁性按钮教程全网泛滥皆源于此站,机制公开度极高

## 借鉴笔记

磁性按钮的高级感一半来自**内层文字的二级强度**(外壳拉 1×,文字拉 0.5×,一颗按钮里有视差);另一半来自松手的弹性回位——不是 transition 回去,是带初速弹回去。

## 运行时实测(浏览器注入探测,2026-07-22)

- `.magnetic` 挂在 `.btn-click` 上,transform 有 GSAP 驱动的残留微旋转(1.7e-05 rad)——磁吸由 JS 每帧写 transform 实锤
- `rounded-div-wrap` / `rounded-div` / `fixed-nav-rounded-div` / `footer-rounded-div`:弧形边缘是一族复用组件
- 探测环境零视口,磁吸动态行为未能激活实测;pattern 按公开机制原理实现,不依赖逆向
