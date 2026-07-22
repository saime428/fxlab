# Pattern 选型索引(机器友好)

> 给 AI/自动化用的单文件决策索引。人类请看 [README.md](README.md)。
> 每行:路径 | 名称 | 难度 | 一句话机制 | 适用场景。选中后读该 pattern 的 README(规格)+ demo.html(参考实现)。

## 全部 pattern

| Pattern | 名称 | 难度 | 一句话机制 | 适用场景 |
|---|---|---|---|---|
| [scroll/scroll-reveal](patterns/scroll/scroll-reveal/) | 滚动渐显 | ★ | IntersectionObserver 进视口加 class | 任何内容页入场,最保守的默认选择 |
| [scroll/horizontal-gallery](patterns/scroll/horizontal-gallery/) | 横向滚动画廊 | ★★ | sticky 容器把纵向滚动映射为横向位移 | 作品集、时间线、产品线陈列 |
| [scroll/scroll-driven-shader](patterns/scroll/scroll-driven-shader/) | 滚动驱动 Shader | ★★★ | 滚动进度 → shader uniform | 3D 叙事站、WebGL 背景联动 |
| [scroll/parallax-cards](patterns/scroll/parallax-cards/) | 视差漂浮卡片 | ★ | 偏移 = 离视口中心距离 × (speed−1) | 漂浮卡片群、贴纸、装饰元素 |
| [scroll/css-scroll-scrub](patterns/scroll/css-scroll-scrub/) | CSS 滚动擦洗 | ★ | CSS animation-timeline: scroll()/view(),零 JS | 进度条、可倒放的入场,渐进增强场景 |
| [hover/image-swap](patterns/hover/image-swap/) | Hover 双图切换 | ★ | 双图预载 + opacity 切换 | 画廊/头像 hover,成本最低的惊喜 |
| [text/svg-line-draw](patterns/text/svg-line-draw/) | SVG 线条绘制 | ★★ | stroke-dashoffset 从满到零 | logo 入场、签名、路径叙事 |
| [text/stagger-grid](patterns/text/stagger-grid/) | Stagger 网格波纹 | ★ | delay = 到波心距离 × 单位延迟 | 网格/列表的编排入场,波纹注意力 |
| [text/split-text-reveal](patterns/text/split-text-reveal/) | 逐行/逐字拆分入场 | ★ | 拆 span + 索引延迟 + 行遮罩 | 大标题入场,获奖站标配,三站实测撞车 |
| [text/scroll-marquee](patterns/text/scroll-marquee/) | 滚动响应字幕 | ★ | rAF 推进 + lerp 滚动速度反馈 | 品牌字幕带、章节分隔、logo 墙 |
| [text/count-up](patterns/text/count-up/) | 数字滚动 | ★ | IntersectionObserver + rAF easeOut + Intl | 数据统计区,B 端性价比之王 |
| [transitions/theme-shift](patterns/transitions/theme-shift/) | 章节主题突变 | ★ | 滚动触发 data 属性换 CSS 变量 | 长页分章换肤,低成本高感知 |
| [transitions/view-transitions](patterns/transitions/view-transitions/) | View Transitions 过渡 | ★★ | startViewTransition + 同名共享元素 | 列表↔详情、SPA 路由转场 |
| [transitions/menu-stagger-reveal](patterns/transitions/menu-stagger-reveal/) | 全屏菜单 Stagger 展开 | ★ | clip-path 遮罩 + 菜单项索引延迟 | 任何站的导航,泛用性最高 |
| [transitions/image-displacement](patterns/transitions/image-displacement/) | Displacement 图片过渡 | ★★★ | 程序化噪声定每像素切换时机 + 推 UV 变形 | 图片画廊的高级切换,液态质感 |
| [transitions/shader-wipe](patterns/transitions/shader-wipe/) | Shader 遮罩擦除过渡 | ★★★ | 全屏 quad 噪声阈值擦除,盖满换 DOM 再揭开 | 章节/路由切换的"物质感"转场,内容层无关 |
| [transitions/particle-transition](patterns/transitions/particle-transition/) | GPU 粒子过渡 | ★★★ | 顶点着色器无状态粒子:格点+错峰爆发包络 | 图像/logo 的"技术力宣言"切换,记忆点效果 |
| [hover/drag-spring](patterns/hover/drag-spring/) | 可拖拽 + 弹簧回弹 | ★★ | 半隐式欧拉弹簧:v += -kx - cv,松手带初速 | 贴纸/卡片/浮动装饰,把装饰变玩具 |
| [hover/floating-stickers](patterns/hover/floating-stickers/) | 漂浮贴纸物理 Hover | ★★ | 闲时正弦漂移 + 指针斥力 + 回家弹簧 | 装饰元素群的"空气感",营销页点睛 |
| [scroll/scroll-snap-sections](patterns/scroll/scroll-snap-sections/) | 滚动分节锁定 | ★ | CSS scroll-snap mandatory + snap-stop always | 全屏叙事骨架,零 JS 的一站一停 |
| [layout/section-narrative](patterns/layout/section-narrative/) | 章节式滚动叙事 | ★ | 全屏分节 + 编号 + 进退导航 | 宣言页、发布页、故事型官网 |
| [layout/sticky-stack](patterns/layout/sticky-stack/) | 粘性堆叠 | ★ | 每卡 sticky top:0,后者压前者 | 功能列表、服务介绍、案例翻牌 |
| [layout/comment-heading](patterns/layout/comment-heading/) | 注释风标题 | ★ | CSS counter + ::before 注释前缀 | 开发者/极客气质的章节标题 |
| [loading/entry-preloader](patterns/loading/entry-preloader/) | 加载序章 | ★★ | 资源预载 + 进度 + Enter 门 | 重资产站开场,兼做声音手势解锁 |
| [loading/ambient-sound-toggle](patterns/loading/ambient-sound-toggle/) | 氛围音开关 | ★★ | 手势解锁 AudioContext + 全局开关 | 体验型站的氛围音 |
| [3d-webgl/canvas-ambient-bg](patterns/3d-webgl/canvas-ambient-bg/) | Canvas 氛围背景 | ★★ | 渐变圆斑 + lighter 叠加 + 正弦漂移 | 任何站的氛围背景层,高级感地板价 |
| [transitions/clip-shape-wipe](patterns/transitions/clip-shape-wipe/) | 形状擦除过渡 | ★ | clip-path/条纹错峰:盖住→换内容→揭开 | 章节/视图切换的零门槛擦除,shader-wipe 的 CSS 平替 |
| [text/elastic-text](patterns/text/elastic-text/) | 弹性文字入场 | ★ | JS 采样弹簧曲线喂给 CSS linear() 缓动 | 活泼/年轻向标题入场,ease-out 之外的性格档 |
| [3d-webgl/confetti-burst](patterns/3d-webgl/confetti-burst/) | 纸屑爆发 | ★★ | canvas 粒子:重力+阻力+自旋,burst 后自停 | 成功/完成时刻的庆祝反馈,SaaS 标配 |

## 气质套餐(场景 → 组合)

| 场景 | 推荐组合 | 口径 |
|---|---|---|
| B 端 / 机构 / 金融 | comment-heading + count-up + css-scroll-scrub + theme-shift + canvas-ambient-bg | 克制;动效为信息服务,Hashgraph 是参照 |
| 作品集 / 个人站 | entry-preloader + split-text-reveal + menu-stagger-reveal + image-displacement + scroll-marquee | 仪式感;开场和菜单是两大记忆点 |
| 产品发布 / 营销长页 | section-narrative + theme-shift + sticky-stack + parallax-cards + count-up | 滚动叙事;Shopify Editions 是参照 |
| 电商 / 图片画廊 | image-swap + image-displacement + horizontal-gallery + parallax-cards | 图片即内容,动效只加在图上 |
| 3D / 体验型 | scroll-driven-shader + entry-preloader + ambient-sound-toggle + canvas-ambient-bg + shader-wipe | 重开场重氛围;Robin/Igloo 是参照 |

## 使用铁律(从库规范继承,不可省)

1. 动画只碰 transform / opacity(clip-path、filter 谨慎)
2. `prefers-reduced-motion` 必须降级到静态终态
3. hover 效果给触屏(点击)和键盘(`:focus-visible`)等价物
4. 声音必须用户手势解锁
5. 强注意力效果(波纹/marquee/displacement)一页一次,别当壁纸
6. 抄机制不抄样式:demo 的配色排版是占位,进项目要跟项目的设计体系走
7. 旋钮收口(组合 ≥2 个效果时):时长/缓动一律走全站 CSS 变量(一套时长阶梯 `--dur-s/m/l` + 一个缓动族 `--ease-*`;项目已有动效 token 体系则并入它,不另起一套),禁止每个效果自带节奏;强度类参数(位移强度、噪声频率、stagger 相位等)提升到该效果文件顶部常量块并注释可调范围,不许埋在函数体里;全页一次 `prefers-reduced-motion` 判断,rAF 尽量共用一个调度

## 灵感源(cases)

拆解了 10 个获奖站,按气质找参照:[cases/](cases/) — Bruno Simon(游戏化)、Igloo(shader 叙事)、Lando Norris(品牌动效密度)、Hashgraph(克制的机构感)、Shopify Editions(发布页叙事)、Active Theory(上限参考)等,各篇末尾有"运行时实测"。
