# Awwwards 横截面扫描 2026-07-26

> 124 站(/websites/ 第 1-4 页,2026-06-13 → 07-26),**113 站拿到 CSS**。
> 名单 [scripts/awwwards-2026-07.txt](../../scripts/awwwards-2026-07.txt),脚本 [scripts/scan-awwwards.mjs](../../scripts/scan-awwwards.mjs),原始数据 [raw-2026-07.json](raw-2026-07.json)。
> 重跑:`node scripts/scan-awwwards.mjs scripts/awwwards-2026-07.txt 8`

**这一份的价值在"单站看不出来"**:一个站的缓动是它的选择,113 个站的缓动分布是行业口径。

## 取法

- 名单靠浏览器注入解析 awwwards 卡片的 `data-collectable-model-value`(内含站名/外链/奖项/技术标签)——node 直连 awwwards 被 Cloudflare 挡,但**直连目标站没问题**
- 逐站抓 HTML + 其引用的 CSS(每站最多 8 个文件 / 2MB),正则统计
- 失败 11 站(CSS-in-JS 或防抓):Hiroto Sato、Brunello Cucinelli、Bucks Sauce、POETIC、Diamante、Pahāri、CalArts、ACOR、digitalists、Pil、Cipher Digital

## 一、缓动曲线普查 —— 最值钱的一项

获奖站实际在用的 `cubic-bezier`,按出现次数:

| 曲线 | 次数 | 是什么 |
|---|---|---|
| `cubic-bezier(.19,1,.22,1)` | **801** | easeOutExpo(Penner 版)—— **绝对霸主** |
| `cubic-bezier(.55,.1,.26,.995)` | 295 | 自定义 ease-in-out |
| `cubic-bezier(.215,.61,.355,1)` | 284 | easeOutCubic(Penner) |
| `cubic-bezier(.65,0,.35,1)` | 177 | easeInOutCubic |
| `cubic-bezier(.25,1,.5,1)` | 173 | easeOutQuart |
| `cubic-bezier(.5,0,.2,1)` | 155 | 自定义 ease-in-out |
| `cubic-bezier(.5,0,.75,0)` | 121 | easeInQuart(**ease-in**,用于离场) |
| `cubic-bezier(.785,.135,.15,.86)` | 91 | easeInOutCirc |
| `cubic-bezier(.4,0,.2,1)` | 83 | Material standard |
| `cubic-bezier(.645,.045,.355,1)` | 73 | easeInOutCubic(Penner) |
| `cubic-bezier(.16,1,.3,1)` | 67 | easeOutExpo(easings.net 版) |
| `cubic-bezier(.22,1,.36,1)` | 34 | easeOutQuint |

**结论**:第一名和第十一名是同一条曲线的两个流传版本,合计 868 次——**"高级感"的缓动就是 easeOutExpo**:起步瞬间拉到峰值速度,尾巴拖得极长。

对照:本库 case 里 Hashgraph 的 `(.14,1,.34,1)`(原站 47 次)没进榜,但它和 easeOutExpo 是同一形状的手调版(x1 更小 = 起步更猛)。**所以那条曲线不是 Hashgraph 的私货,是行业通用语言的一个变体。**

可直接抄进项目的一套:

```css
--ease-out:   cubic-bezier(.19, 1, .22, 1);    /* 入场、展开、任何"到位"的动作 */
--ease-in:    cubic-bezier(.5, 0, .75, 0);     /* 离场、收起 */
--ease-inout: cubic-bezier(.65, 0, .35, 1);    /* 位移、遮罩这类要有重量的 */
```

## 二、时长档

| 时长 | 次数 | | 时长 | 次数 |
|---|---|---|---|---|
| `.3s` | 965 | | `.5s` | 379 |
| `.2s` | 618 | | `.7s` | 198 |
| `.4s` | 395 | | `.6s` | 172 |
| `1s` | 289 | | `.8s` | 72 |

**双峰**:`.2–.4s` 是 hover / 微交互档(占绝大多数),`.6–1s` 是入场 / 转场档。中间的 `.5s` 是骑墙值,用得少。

本库铁律 7 的时长阶梯建议按这个校准:`--dur-s: .2s / --dur-m: .3s / --dur-l: .8s`,而不是均匀三档。

## 三、结构性事实

| 事实 | 数字 | 意味着 |
|---|---|---|
| 有 CSS 变量体系(≥10 个 `--var`) | **~90%** | token 化是默认,不是加分项 |
| `cursor: none` | 声明 30 站 → **疑似在用 10 站(9%)** | 见下方更正:声明 ≠ 使用 |
| `mix-blend-mode: difference/exclusion` | 声明 33 站 → **疑似在用 24 站(21%)** | **本库原先完全没有的手法**,已提炼 |
| 引入 Lenis(平滑滚动) | **68/113(60%)** | 比 GSAP(35)还普及,已是事实标准 |
| 引入 GSAP | 35/113 | |
| 有 `@keyframes` | 93/113 | |
| Three.js(能从 CSS/HTML 侧探到的) | 7/113 | 探测偏低,WebGL 多在打包后的 JS 里 |

**修正一条旧结论**:糅合 pilot 时基于两个站说过"有的站有 token 体系有的没有",横截面看是 **90% 都有**,Hashgraph 那种手写 CSS 反而是少数派。

## 四、色彩(弱证据,只作参考)

- 亮色主导 66 站 / 暗色主导 47 站 —— **不是"获奖站都是暗色"**
- 高频色里同时出现纯黑和纯白的:74/113(65%)

> 局限:这个指标只看颜色是否出现在高频色里,**不看它的角色**(可能只是 `border` 或图标)。所以它推翻不了 Lando"把黑白都染色温"的观察,只能说那不是普遍做法。要判角色得看渲染面积,得开浏览器。

## 五、字体

169 次落到 `var(--...)` —— 字体也走 token,统计不到真名。唯一有效信号:**Inter 出现在 20 站**,是最普及的具名字体;其余 Satoshi / Geist / Space Mono / Instrument Sans / Manrope / Outfit / Newsreader 各 3 站左右。

## 六、可直接开工的三条线

### ⚠️ 更正(2026-07-26 当天实测推翻)

上面 `cursor:none` 的 30 站是**声明数,不是使用数**。开站验了 3 个:

| 站 | CSS 里声明在哪 | 实际生效元素数 |
|---|---|---|
| Lama Lama | `.cursor-none`(Tailwind 工具类) | **0** —— 打进 bundle 但没用上 |
| sakazuki | `.Journey-module__stepHideCursor` | 0(段内作用域,进到 Journey 段才生效) |
| Sui | `.hero-mask` | 0(同上) |

两条教训:

1. **Tailwind / 工具类框架会把没用上的类打进 CSS**,`cursor:none` 这种统计必须查计算样式,不能查规则存在性
2. 即使真在用,**`cursor:none` 永远是段内作用域的**——扫到的每个站都挂在一个段落级 class 上,没有一个全局。这本身就是个设计结论:全局藏光标在表单和链接上是可用性灾难

**脚本已修**:现在抓规则的选择器,查它的类名是否出现在 HTML 的 `class` 属性里,输出"声明 / 疑似在用"两个数。重跑结果 `cursor:none` **30 → 10**、`mix-blend` **33 → 24**,上面三个假阳性全部被正确剔除。

粗筛的已知偏差(写在脚本注释里):**JS 运行时加的类会被低估**——sakazuki 就是这种,它确实在用,只是那个 CSS-module 类名不在初始 HTML 里。所以 10 站是下限,真值在 10–30 之间。要准数只能开浏览器查 `getComputedStyle`。

已按实测做成 [cursor/hide-and-follow](../../patterns/cursor/hide-and-follow/)(sakazuki 的 Journey 段是唯一拿到完整实现细节的样本:84×33 标签、`opacity .3s` + `visibility 0s linear .3s`)。

### 1. 已提炼:`mix-blend-mode: difference` 覆盖层自动反色

这条**实测全部坐实**,三站三个尺度用的是同一个机制:

| 站 | 用在哪 | 尺度 |
|---|---|---|
| sakazuki | fixed `header` / `bottomBar` / 飞行 logo(全带 `pointer-events:none`) | 固定层 |
| Lama Lama | hero `<section>` + 压在视频上的图标按钮(用 `exclusion`) | 区块 |
| Sui | 标题里的强调词 `.custom-span.invert` | 行内 |

已做成 [layout/blend-invert](../../patterns/layout/blend-invert/)。它是 [theme-shift](../../patterns/transitions/theme-shift/) 的零维护替代:后者要维护"区块→主题"表,前者零 JS,代价是**中灰背景上对比度归零**。

### 3. 新 pattern 候选 / tech-radar:Lenis

60% 普及率,本库从未提及。它不是效果是基础设施(接管滚动 → 所有滚动驱动效果的时间基准都变了)。至少该进 tech-radar,说明"项目已有 Lenis 时,本库的滚动类 pattern 该怎么接"。

## 七、这次扫描没能回答的

- **动效节奏在 JS 里的站取不到**(GSAP 编排、Webflow interactions):CSS 侧看起来"没动效"
- **颜色的角色**(底色 / 强调 / 边框)分不出来,要开浏览器算渲染面积
- **光标长什么样**取不到,只知道换掉了系统光标 —— 要做 pattern 必须真开站看
