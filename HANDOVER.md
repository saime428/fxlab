# 交接文档 HANDOVER

> 给下一个接手者(人或 AI 会话)。读完这份 + `docs/criteria.md`,就能按同样口径继续干活。

## 一、这个仓库是什么

炫酷网页效果沉淀库。输入是"看着很好看的网站 URL",输出是两类资产:

- `cases/<站名>/analysis.md` —— 按网站拆解:气质来源、效果清单(含 ✅ 标记)、技术栈侦察、借鉴笔记
- `patterns/<分类>/<效果名>/` —— 按效果沉淀:README(设计意图/核心机制/实现要点/代价)+ 零依赖单文件 demo.html

**cases 是矿,patterns 是提炼出的金属。** 效果清单里标 ✅ 的就是待提炼项。

## 二、当前状态(2026-07-16)

- 10 个 case(见 README 索引),其中 Igloo、Active Theory、Lando、Shopify、Hashgraph、Robin 做过运行时实测(结论在各自 analysis.md 的"运行时实测"一节)
- 26 个 pattern,全部零依赖、过了 node --check 和链接检查(验证脚本思路:抽 `<script>` 内容 node --check + md 相对链接/Pages 链接映射回本地存在性)
- 已推 GitHub 并开通 Pages
- 2026-07-16 口径调整:可复现性放宽为"保住核心机制的简化版即可",新增分类覆盖度排序项(见 docs/criteria.md)
- 消费层已建:INDEX.md(AI 选型索引,含中文名列,新增/改 pattern 时**必须同步更新**,画廊自动跟上)+ skills/web-fx-lab/SKILL.md(Claude Code skill,装在 ~/.claude/skills/web-fx-lab/,改了记得重新复制过去)
- 画廊首页 index.html **四切片全部完成 ✅**:1 fetch INDEX 渲染 21 卡+只读缩放 iframe 预览+点卡全屏+fetch 兜底+.nojekyll+修复根 404;2 筛选 chips+URL 状态(`?cat=`/`?level=`/`?set=` 互斥、再点取消、刷新回放);3 自动演示引擎(iframe load capture 探测 scrollHeight+scroll-snap 双查,余弦往复 scrollTo,只滚可见卡);4 狗粮化(canvas 氛围背景 opacity .55、hero 纯 CSS 自动播放行遮罩入场、卡片 scroll-reveal 仅 opacity 避 hover 冲突)。**注意**:内嵌浏览器 pane 冻结所有时间轴动画(rAF/CSS 动画/transition 全停,IO 报不相交),时间型效果只能靠垫片或读线上验证——真机/Pages 正常。
- 样板间 `showcase/index.html` ✅:作品集套餐 5 个 pattern(entry-preloader/split-text/menu-stagger/scroll-marquee/image-displacement)拼装的完整 landing page,铁律 7 实装(token 阶梯 + KNOB 常量块 + 单 rAF 调度 + 一次 reduced-motion 判断);Enter 手势是全页动效的 t=0

### 未完成(按优先级)

1. ~~高门槛 ✅ 欠账~~ **全部清零**:shader-wipe ✅、particle-transition ✅、cel-shading 已降级为 Messenger case 的方法论笔记(复用性否决:前提是已有 3D 场景)
2. ~~翻案候选~~ ✅ 全部完成:hover/drag-spring、scroll/scroll-snap-sections、hover/floating-stickers
3. Messenger 还没做运行时深挖(方法见下)
4. cursor/ 分类仍是空的——现有 10 个 case 都没有自定义光标,需要收新 case(建议找 Awwwards 上 cursor 出彩的站)
5. ~~cases/_example 占位可删;根目录 testfile 是空文件可删~~ ✅ 已删

## 三、工作流(新网站进来时)

1. `web_fetch` 抓 HTML:看 meta、script src、CDN 特征(website-files=Webflow、cdn.sanity=Sanity、/media/pages/=Kirby)
2. 抓不到内容(纯客户端渲染)→ 用 Chrome 打开真实页面注入 JS 探测:
   - 全局变量试探:`window.THREE / gsap / Hydra / anime`
   - `performance.getEntriesByType('resource')` 看资源清单(chunk 名、纹理格式、体积)
   - fetch 主 bundle 后正则数特征:`WebGLRenderer`、`void main(` 计数、`Lenis` 等
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
