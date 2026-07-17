---
name: web-fx-lab
description: 网页动效/炫酷效果选型库。当要给网站、landing page、作品集、官网做动效,或用户提到"要炫/有质感/有动效/高级感/获奖站风格"时使用;也在用户直接提到 web-fx-lab 时使用。提供 21+ 个零依赖 pattern(README 规格 + 单文件 demo)和按场景的组合套餐。
---

# web-fx-lab 效果选型

本地效果沉淀库,仓库在 `F:\claude code\web-fx-lab`(在线版 https://github.com/saime428/web-fx-lab ,demo 均可在 https://saime428.github.io/web-fx-lab/ 直接打开)。

## 流程

1. **读选型索引**:`F:\claude code\web-fx-lab\INDEX.md`(本地不存在时用 https://raw.githubusercontent.com/saime428/web-fx-lab/main/INDEX.md )。一个文件包含:全部 pattern 的机制/场景一览、按气质的组合套餐、使用铁律。
2. **按场景选,不按炫度选**:先判断项目气质(B 端克制 / 作品集仪式感 / 营销叙事 / 图片型 / 3D 体验),用 INDEX 里的"气质套餐"作起点,再增删。宁少勿多:2-4 个效果 + 1 个记忆点,好过 8 个效果打架。
3. **读选中 pattern 的规格**:`patterns/<分类>/<效果名>/README.md` 的四节就是决策书——设计意图(该不该用)、核心机制(怎么实现)、实现要点(坑)、代价与注意(性能/可访问性/移动端)。
4. **抄机制不抄样式**:demo.html 是参考实现,配色排版是占位。把核心机制移植进项目的技术栈和设计体系;库是零依赖写法,项目里若已有 GSAP/anime.js,用库内 README"变体与延伸"一节给出的等价 API。
5. **旋钮收口(组合 ≥2 个效果时强制)**:时长/缓动收敛到全站 CSS 变量(一套时长阶梯 `--dur-s/m/l` + 一个缓动族;项目已有动效 token 体系则并入它,不另起一套),所有效果从这里取值,禁止各带各的节奏——这是"像一个人做的"的来源;强度类参数(位移强度、噪声频率、stagger 相位)提升到该效果文件顶部常量块,带一句可调范围注释(方向感:窄=利落/宽=互溶这类);全页只做一次 reduced-motion 判断。
6. **守铁律**:INDEX.md"使用铁律"七条(transform/opacity、reduced-motion、触屏键盘等价、声音手势解锁、强注意力效果一页一次、样式跟项目走、旋钮收口)不可省——demo 里这些都有现成写法,别重新发明。

## 回写(闭环)

真实项目里踩到 pattern 文档没覆盖的坑,在该 pattern 的 README 加"实战笔记"一节回写(一条一行),commit 格式 `patterns: <效果名> 实战笔记`。库的价值随使用复利。

## 找不到合适的?

- 先翻 `cases/` 找气质参照(10 个获奖站拆解,各含运行时实测)
- 库里真没有 → 按 `HANDOVER.md` 工作流新增(拆 case → 按 `docs/criteria.md` 判断 → 做 pattern),别在项目里写完就丢
