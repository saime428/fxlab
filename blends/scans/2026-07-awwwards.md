# Awwwards 横截面扫描 2026-07-26

> **773 站**(/websites/ 第 1-25 页),**629 站拿到 CSS**,144 站失败(CSS-in-JS / Framer / 防抓)。
> 名单 [scripts/awwwards-2026-07-full.txt](../../scripts/awwwards-2026-07-full.txt),脚本 [scripts/scan-awwwards.mjs](../../scripts/scan-awwwards.mjs),原始数据 [raw-2026-07-full.json](raw-2026-07-full.json)。

```bash
node scripts/collect.mjs scripts/awwwards-2026-07-full.txt 8766   # 先开收集器
# 再在 awwwards 页面注入抓名单 POST 过来,然后:
node scripts/scan-awwwards.mjs scripts/awwwards-2026-07-full.txt 12
```

**这一份的价值在"单站看不出来"**:一个站的缓动是它的选择,629 个站的缓动分布是行业口径。

## 取法与它的三个坑

名单靠浏览器注入解析 awwwards 卡片的 `data-collectable-model-value`(内含站名/外链/奖项/技术标签),POST 给 [scripts/collect.mjs](../../scripts/collect.mjs) 落盘——node 直连 awwwards 被 Cloudflare 挡,但**直连目标站没问题**。逐站抓 HTML + 其引用的 CSS(每站最多 8 个文件 / 2MB),正则统计。

踩过的三个坑,都已修:

1. **样本量会抖**。同一批 124 站跑三轮分别拿到 113 / 116 / 87 站,同一个问题问三次得三个答案。已加重试 + 800ms 退避
2. **声明 ≠ 使用**。Tailwind 之类把没用上的工具类整个打进 bundle。现在抓规则的选择器,查类名是否出现在 HTML 的 `class` 属性里,输出"声明/疑似在用"两个数。**残留偏差:JS 运行时加的类会被低估**,所有"在用"数是下限
3. **一个机制别只查一种写法**。首轮查自定义光标只查了 `cursor:none`,把"不藏原生光标只加跟随元素"和"`cursor:url()` 换图"两整类漏光了,得出"只有 10 站"的错误结论(真值 112 站)

## 一、缓动曲线普查

| 曲线 | 次数 | 是什么 |
|---|---|---|
| `cubic-bezier(.19,1,.22,1)` | 1198 | easeOutExpo(Penner) |
| `cubic-bezier(.215,.61,.355,1)` | 1191 | easeOutCubic(Penner) |
| `cubic-bezier(.4,0,.2,1)` | 821 | Material standard |
| `cubic-bezier(.645,.045,.355,1)` | 803 | easeInOutCubic |
| `cubic-bezier(.5,0,0,1)` | 767 | 强 ease-in-out |
| `cubic-bezier(.42,0,.58,1)` | 576 | = CSS `ease-in-out` 的显式写法 |
| `cubic-bezier(.16,1,.3,1)` | 488 | easeOutExpo(easings.net 版) |
| `cubic-bezier(.165,.84,.44,1)` | 595(两种写法合计) | easeOutQuart(Penner) |
| `cubic-bezier(.23,1,.32,1)` | 253 | easeOutQuint |
| `cubic-bezier(.785,.135,.15,.86)` | 230 | easeInOutCirc |

**合并同一曲线的不同写法**(`.19,1,.22,1` / `0.19,1,0.22,1` / `.16,1,.3,1`)后,**easeOutExpo 族约 2000 次,是第一名**;但 easeOutCubic 单条就 1191 次,**咬得很紧**。

> 更正:上一轮基于 113 站说 easeOutExpo 是"绝对霸主"(801 次,第二名 295),样本扩到 629 站后差距大幅收窄。**小样本会把第一名的领先幅度放大**,那个说法过头了。

可直接抄进项目的一套:

```css
--ease-out:   cubic-bezier(.19, 1, .22, 1);    /* 入场、展开、任何"到位"的动作 */
--ease-in:    cubic-bezier(.5, 0, .75, 0);     /* 离场、收起 */
--ease-inout: cubic-bezier(.645, .045, .355, 1); /* 位移、遮罩这类要有重量的 */
```

对照:本库 case 里 Hashgraph 的 `(.14,1,.34,1)` 没进榜,但它和 easeOutExpo 是同一形状的手调版(x1 更小 = 起步更猛)。**那条曲线不是它的私货,是通用语言的变体。**

## 二、时长档

| 时长 | 次数 | | 时长 | 次数 |
|---|---|---|---|---|
| `.3s` | 7091 | | `.6s` | 1304 |
| `.2s` | 5795 | | `.8s` | 1229 |
| `.4s` | 2441 | | `.15s` | 930 |
| `.5s` | 2128 | | `.1s` | 588 |
| `1s` | 1340 | | `.7s` | 435 |

**双峰**:`.2–.4s` 是 hover / 微交互档(压倒性多数),`.6–1s` 是入场 / 转场档。

本库铁律 7 的时长阶梯按这个校准:`--dur-s: .2s / --dur-m: .3s / --dur-l: .8s`,而不是均匀三档。

## 三、结构性事实(629 站)

| 事实 | 数字 | 意味着 |
|---|---|---|
| 有 CSS 变量体系(≥10 个 `--var`) | **554/629(88%)** | token 化是默认,不是加分项 |
| **动了光标(任一路子)** | **112/629(18%)** | 见下方专节 |
| `mix-blend-mode: difference/exclusion` | 声明 187 → **在用 130/629(21%)** | 已提炼为 [layout/blend-invert](../../patterns/layout/blend-invert/) |
| Lenis | **303/629(48%)** | 仍是最普及的动效相关库 |
| GSAP | 211/629(34%) | |
| Lottie | 102/629(16%) | |
| Barba | 58/629(9%) | |
| Three.js(CSS/HTML 侧可探到的) | 22/629 | 严重偏低,WebGL 多在打包后的 JS 里 |

> 更正:上一轮基于 113 站报 Lenis 60%,大样本是 **48%**。结论方向不变(比 GSAP 普及),幅度收窄。

## 四、自定义光标:四条路子,合计 18%

这是首轮结论错得最离谱的一项。自定义光标**不是一种做法而是四种**:

| 路子 | 做法 | 声明 | 疑似在用 |
|---|---|---|---|
| 藏光标 + JS 跟随 | `cursor:none` + fixed 跟随元素 | 142 | **67** |
| **只加跟随元素** | 不藏原生光标,叠一个圆点/圆环 | — | **35** |
| 换成图 | `cursor: url(...)` 贴 SVG/PNG | 22 | **16** |
| JS 直接写 | `el.style.cursor = ...` | — | **21** |
| **合计(去重)** | | | **112/629 = 18%** |

**首轮只查了第一条**,还是在 87–124 站的小样本上,得出"10 站"——双重低估。

现成案例候选(类名直接暴露做法):

| 站 | 选择器 | 看点 |
|---|---|---|
| Lemaire | `.silhouette-cursor` | 时装站的"剪影"光标 |
| Salo Creative | `.Cursor__name` `.HomeHero__ambientCursor--topLeft` | 光标带名字 + 分区氛围光标 |
| Juan Mora | `.cursor-jm-icon` `.text-jm-cursor` `.icon-cursor` | 图标 / 文字两种形态 |
| Olive® | `.olive-ts__cursor` `#olive-cursor` | |
| Blit Studio / Tenity | `#cursor` | 最朴素的一版 |

`cursor: url()` 那一路的实际写法(值得单独记):`url(../img/arrow-right-orange.svg), auto`(Grain & Mortar,外链 SVG)、`url("data:image/svg+xml,...")`(Object & Archive,内联 data-URI,不多一次请求)。

## 五、圆角

`0` ×267 与 `50%` ×243 领跑——**要么直角要么正圆**,中间值(`4px` ×66、`8px` ×34)少得多。"高级感"在圆角上是二元的,不是连续调节的。

## 六、这次仍然没能回答的

- **动效节奏在 JS 里的站取不到**(GSAP 编排、Webflow interactions):CSS 侧看起来"没动效"
- **颜色的角色**(底色 / 强调 / 边框)分不出来,要开浏览器算渲染面积
- **光标长什么样**取不到,只知道动了它——做 pattern 必须真开站看
- 144 站抓不到 CSS,基本是 CSS-in-JS / Framer / 有防抓
