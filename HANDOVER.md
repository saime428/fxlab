# 交接文档 HANDOVER

> 给下一个接手者(人或 AI 会话)。读完这份 + `docs/criteria.md`,就能按同样口径继续干活。

## 一、这个仓库是什么

炫酷网页效果沉淀库。输入是"看着很好看的网站 URL",输出是两类资产:

- `cases/<站名>/analysis.md` —— 按网站拆解:气质来源、效果清单(含 ✅ 标记)、技术栈侦察、借鉴笔记
- `patterns/<分类>/<效果名>/` —— 按效果沉淀:README(设计意图/核心机制/实现要点/代价)+ 零依赖单文件 demo.html

**cases 是矿,patterns 是提炼出的金属。** 效果清单里标 ✅ 的就是待提炼项。

## 二、当前状态(2026-07-16)

- 10 个 case(见 README 索引),其中 Igloo、Active Theory、Lando、Shopify、Hashgraph、Robin 做过运行时实测(结论在各自 analysis.md 的"运行时实测"一节)
- 34 个 pattern,全部零依赖、过了 node --check 和链接检查;八分类全部开张(cursor/ 由 custom-cursor 补上,2026-07-22);motionpotion 6 个 ✅ 已全部提炼(验证脚本思路:抽 `<script>` 内容 node --check + md 相对链接/Pages 链接映射回本地存在性)
- 已推 GitHub 并开通 Pages
- 2026-07-16 口径调整:可复现性放宽为"保住核心机制的简化版即可",新增分类覆盖度排序项(见 docs/criteria.md)
- 消费层已建:INDEX.md(AI 选型索引,含中文名列,新增/改 pattern 时**必须同步更新**,画廊自动跟上)+ TASTE.md(口味档案/甲方画像:用户未明说的决策以它为准;口味判词回写它,技术坑回写 pattern README)+ skills/web-fx-lab/SKILL.md(Claude Code skill,装在 ~/.claude/skills/web-fx-lab/,改了记得重新复制过去)
- 画廊首页 index.html **四切片全部完成 ✅**:1 fetch INDEX 渲染 21 卡+只读缩放 iframe 预览+点卡全屏+fetch 兜底+.nojekyll+修复根 404;2 筛选 chips+URL 状态(`?cat=`/`?level=`/`?set=` 互斥、再点取消、刷新回放);3 自动演示引擎(iframe load capture 探测 scrollHeight+scroll-snap 双查,余弦往复 scrollTo,只滚可见卡);4 狗粮化(canvas 氛围背景 opacity .55、hero 纯 CSS 自动播放行遮罩入场、卡片 scroll-reveal 仅 opacity 避 hover 冲突)。**注意**:内嵌浏览器 pane 冻结所有时间轴动画(rAF/CSS 动画/transition 全停,IO 报不相交),时间型效果只能靠垫片或读线上验证——真机/Pages 正常。
- 样板间 `showcase/index.html` ✅:作品集套餐 5 个 pattern(entry-preloader/split-text/menu-stagger/scroll-marquee/image-displacement)拼装的完整 landing page,铁律 7 实装(token 阶梯 + KNOB 常量块 + 单 rAF 调度 + 一次 reduced-motion 判断);Enter 手势是全页动效的 t=0

- 2026-07-26 新增 **`blends/` 层**(与 patterns 平行,不是替代):patterns 沉淀动效机制,blends 沉淀 pattern 铁律 6"抄机制不抄样式"扔掉的**设计本体**(色板/字号阶梯/间距/运动节奏)。取法是浏览器注入遍历 `document.styleSheets` 统计,产物写进 `cases/<站>/design-system.md`。**blend 不继承"零依赖单文件"铁律**——那条只管可移植的 pattern demo,blend 的产物是页面,页面本来就该带字体和材质。结论与方法见 [blends/README.md](blends/README.md)
- 同日新增**批量扫描**:`scripts/scan-awwwards.mjs` 抓一批站的 HTML+CSS 做横截面统计(单站看不出来的行业口径)。结果 [blends/scans/2026-07-awwwards.md](blends/scans/2026-07-awwwards.md),**773 站 / 629 成功**。管线是两段:`scripts/collect.mjs` 起一个本地 HTTP 接收端 → 浏览器在 awwwards 页面注入抓名单并 POST 过来落盘 → node 逐站抓 CSS。**node 直连 awwwards 被 Cloudflare 挡,名单只能在浏览器里取;目标站本身 node 能直连**。有了 collect.mjs 之后名单不用人肉抄,扫描规模不再受限
- **扫描方法的三条教训**(都踩过,都已修,别再踩):① 样本量会抖(同批 124 站三轮拿到 113/116/87)→ 必须重试退避;② 声明 ≠ 使用(工具类框架把没用上的类打进 bundle)→ 查选择器类名是否出现在 HTML `class` 属性里;③ **一个机制别只查一种写法**——首轮查自定义光标只查 `cursor:none`,漏掉"只加跟随元素"和"`cursor:url()` 换图"两整类,得出 10 站的错误结论,真值 112 站

### 未完成(按优先级)

1. ~~高门槛 ✅ 欠账~~ **全部清零**:shader-wipe ✅、particle-transition ✅、cel-shading 已降级为 Messenger case 的方法论笔记(复用性否决:前提是已有 3D 场景)
2. ~~翻案候选~~ ✅ 全部完成:hover/drag-spring、scroll/scroll-snap-sections、hover/floating-stickers
3. Messenger 还没做运行时深挖(方法见下)
4. ~~cursor/ 分类空缺~~ ✅ **已开张,而且是两个会话并行补的**(2026-07-26 合并):一路是 cuberto/dennis-snellenberg 两 case → `custom-cursor`/`magnetic-button`;另一路是 773 站扫描 → `image-cursor`/`follower-ring`/`blend-dot`/`magnetic-pull`/`cursor-trail`/`hide-and-follow`/`spotlight-mask`/`image-follow`。**合并后有三组语义重合,已在 [patterns/cursor/README.md](patterns/cursor/README.md) 顶部标注**,待办:整理成同一 pattern 的多个变体
5. 遗留 ✅:弧形章节边缘(dennis,rounded-div 随滚动绷平)
6. ~~Lenis 没进 tech-radar~~ ✅ [docs/tech-radar.md](docs/tech-radar.md) 加了专节:逐条列了本库 7 个滚动相关 pattern 在 Lenis 项目里的接法,其中 **scroll-snap-sections 是硬冲突**(二选一),marquee / parallax-cards / section-narrative fixed 变体要并进 Lenis 的循环
7. ~~扫描的"声明 ≠ 使用"盲区~~ ✅ 已修:脚本改成查选择器类名是否出现在 HTML `class` 属性里,输出"声明/疑似在用"两个数(`cursor:none` 30→10,`mix-blend` 33→24)。**残留偏差:JS 运行时加的类会被低估**,要准数仍需开浏览器查计算样式
8. **B 档 30 个主库效果只做完 10 个**(A 档全部)。剩下按 [docs/criteria.md](docs/criteria.md) 新口径(冲击力第一)排:毛玻璃(299 站)/ 焦点虚化(295)/ 边缘渐隐(158)/ 可变字重变形(233)/ 斜切分区(88)/ `:has()` 联动(236)/ oklch 单色生成主题(179)…完整清单见会话记录
9. ~~cases/_example 占位可删;根目录 testfile 是空文件可删~~ ✅ 已删

## 三、工作流(新网站进来时)

1. `web_fetch` 抓 HTML:看 meta、script src、CDN 特征(website-files=Webflow、cdn.sanity=Sanity、/media/pages/=Kirby)
2. 抓不到内容(纯客户端渲染)→ 用 Chrome 打开真实页面注入 JS 探测:
   - 全局变量试探:`window.THREE / gsap / Hydra / anime`
   - `performance.getEntriesByType('resource')` 看资源清单(chunk 名、纹理格式、体积)
   - fetch 主 bundle 后正则数特征:`WebGLRenderer`、`void main(` 计数、`Lenis` 等
   - **样式表全量普查(必做,别只做上面三条)**:枚举全部 `@keyframes`(名字+动的属性)、`CSSPropertyRule`(@property 注册)、`:hover` 规则数——手写站的动效大头是**交互触发**的,静止时"谁在动"的 census 和类名 grep 都探不到(教训:MotionPotion 28 个 keyframes 静止时只有 4 个元素在动,第一轮误判为"没料",2026-07-22)
3. 搜 Awwwards/FWA/Codrops 拿制作方、官方 case study、开源仓库地址
4. 按 `docs/templates/case-analysis.md` 写入 `cases/`,效果清单逐条按 `docs/criteria.md` 四条标准标 ✅/☐
5. ✅ 项按 `docs/templates/pattern.md` 做成 pattern(README + demo)
6. 更新三处索引:根 README 两张表 + 对应分类 `patterns/<分类>/README.md`
7. 验证(JS 语法 + 相对链接存在性)→ commit → push

## 四、硬性规范

- demo 必须:零依赖、单文件、双击可开、`prefers-reduced-motion` 降级、hover 类效果给触屏和键盘(`:focus-visible`)留降级
- 目录名一律 kebab-case;文档中文,代码注释可中英混排
- 颜色走 CSS 变量;动画只碰 transform/opacity
- commit message 风格:`cases: ...` / `patterns: ...` / `docs: ...`,一句话说清增量
- 提炼口径以 `docs/criteria.md` 为准;要改口径,先改那份文档再干活

## 五、已沉淀的关键认知(别重新发现一遍)

- Igloo 顺滑的秘密:滚动动画数据预烘焙成 KTX2 数据纹理(scroll-datatexture),shader 按进度采样,运行时 O(1)
- Active Theory 是自研 Hydra 引擎 + 8 Worker 线程 + 全 GL 渲染 UI(54 个 DOM 节点),属"上限路线",学过渡语言别学架构
- Webflow + Rive + GSAP 也能拿 Awwwards SOTM(Lando Norris),炫酷 ≠ 必须手写工程
- 声音必须用户手势解锁,所以 Enter 门/声音开关是技术必需包装成的仪式
- 体积预算是设计约束:Messenger 全站 5.7MB 逼出了 cel-shading 风格化路线

## 六、环境备注(Cowork 会话)

- GitHub 连接器的工具在**会话开始时**注入,会话中途连接无效——没有就让用户开新会话
- Chrome 插件需浏览器运行且侧边栏登录同账号,连不上时先查这两点
- 纯客户端渲染站 web_fetch 只能拿壳,别浪费重试,直接走 Chrome 注入
