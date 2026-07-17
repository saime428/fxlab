---
name: web-fx-lab
description: 网页动效/炫酷效果选型库。当要给网站、landing page、作品集、官网做动效,给**现成的网站/页面加动效改造**(贴合原设计),或用户提到"要炫/有质感/有动效/高级感/获奖站风格"时使用;也在用户直接提到 web-fx-lab 时使用。提供 21+ 个零依赖 pattern(README 规格 + 单文件 demo)、按场景的组合套餐、存量站改造流程。
---

# web-fx-lab 效果选型

本地效果沉淀库,仓库在 `F:\claude code\web-fx-lab`(在线版 https://github.com/saime428/web-fx-lab ,demo 均可在 https://saime428.github.io/web-fx-lab/ 直接打开)。

## 模式 B:给现有网站加动效(设计已定,只加动效)

用户拿着做好的站来要动效时走这里,**贴合原设计压倒一切**:

1. **先读站,提取设计体系**:配色(computed style / CSS 变量抽色板)、字体、圆角间距、整体气质。读不到就要用户给源码或截图,不许凭想象开工。
2. **动效 token 从原站推导,不从库里带**:所有颜色(遮罩、高亮、描边、粒子)只用原站已有色;节奏按气质定档——内容/文艺站 = 慢而柔(dur-m ≥ .7s),产品/营销站 = 中档,品牌炫技站 = 快而利落。demo 的占位配色一个都不许进项目。
3. **结构盘点 → 动效映射表**:把页面拆成元素类型,每类配一个 pattern,输出清单再动手。默认映射:大标题→split-text-reveal;区块入场→scroll-reveal;章节换色→theme-shift;数字→count-up;图片→image-swap / image-displacement;装饰元素→parallax-cards / floating-stickers;长页分节→scroll-snap-sections;导航→menu-stagger-reveal;页脚/分隔→scroll-marquee。
4. **"加很多"的正确姿势 = 覆盖面广,不是单点堆炫**:每个区块都有入场动效(同一 token 同频),强注意力效果(displacement/粒子/marquee)全站仍然只挑 1-2 处记忆点。
5. **三不改**:不改布局、不改配色、不改字体。动效只做入场、反馈、氛围三类;改到设计本体就是越权。
6. 铁律七条照旧;优先级:用户当次要求 > **原站设计体系** > TASTE.md > 通用套餐。

## 模式 A:从零做页面(默认流程)

1. **读选型索引 + 口味档案**:`F:\claude code\web-fx-lab\INDEX.md` 和同目录 `TASTE.md`(本地不存在时用 https://raw.githubusercontent.com/saime428/web-fx-lab/main/INDEX.md 与 .../main/TASTE.md )。INDEX 管"选什么效果";TASTE 是甲方画像——配色、节奏、密度、黑名单等**用户没明说的决策一律以 TASTE 为准**,冲突时用户当次要求最大。
2. **按场景选,不按炫度选**:先判断项目气质(B 端克制 / 作品集仪式感 / 营销叙事 / 图片型 / 3D 体验),用 INDEX 里的"气质套餐"作起点,再增删。宁少勿多:2-4 个效果 + 1 个记忆点,好过 8 个效果打架。
3. **读选中 pattern 的规格**:`patterns/<分类>/<效果名>/README.md` 的四节就是决策书——设计意图(该不该用)、核心机制(怎么实现)、实现要点(坑)、代价与注意(性能/可访问性/移动端)。
4. **抄机制不抄样式**:demo.html 是参考实现,配色排版是占位。把核心机制移植进项目的技术栈和设计体系;库是零依赖写法,项目里若已有 GSAP/anime.js,用库内 README"变体与延伸"一节给出的等价 API。
5. **旋钮收口(组合 ≥2 个效果时强制)**:时长/缓动收敛到全站 CSS 变量(一套时长阶梯 `--dur-s/m/l` + 一个缓动族;项目已有动效 token 体系则并入它,不另起一套),所有效果从这里取值,禁止各带各的节奏——这是"像一个人做的"的来源;强度类参数(位移强度、噪声频率、stagger 相位)提升到该效果文件顶部常量块,带一句可调范围注释(方向感:窄=利落/宽=互溶这类);全页只做一次 reduced-motion 判断。
6. **守铁律**:INDEX.md"使用铁律"七条(transform/opacity、reduced-motion、触屏键盘等价、声音手势解锁、强注意力效果一页一次、样式跟项目走、旋钮收口)不可省——demo 里这些都有现成写法,别重新发明。

## 回写(闭环,两个去向别混)

- **技术坑**(pattern 文档没覆盖的实现问题)→ 该 pattern README 加"实战笔记"一节(一条一行),commit 格式 `patterns: <效果名> 实战笔记`
- **口味判词**(用户说不满意/不喜欢/改成这样的,为什么)→ `TASTE.md` 对应节或黑名单,commit 格式 `docs: TASTE 更新(<一句话判词>)`

库的价值随使用复利;口味档案越写越准,AI 猜的越少。

## 找不到合适的?

- 先翻 `cases/` 找气质参照(10 个获奖站拆解,各含运行时实测)
- 库里真没有 → 按 `HANDOVER.md` 工作流新增(拆 case → 按 `docs/criteria.md` 判断 → 做 pattern),别在项目里写完就丢
