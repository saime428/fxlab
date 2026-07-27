# Lando Norris — 设计体系快照

> 取样日期 2026-07-26,方式:浏览器注入遍历 `document.styleSheets`(18 张表 / 1987 条规则,0 张跨域被挡)。
> 用途:糅合原料。与 pattern 库的"抄机制不抄样式"互补——这份专门记被那条铁律扔掉的东西。

## 取法备注

- Webflow 站,**设计体系以 CSS 变量完整暴露**,40+ token 一次全拿到,是最理想的取样对象。
- **动效节奏取不到**:CSS 侧只剩 `0.1s linear` 这类 hover 微交互,全站编排在 GSAP 里(见 [analysis.md](analysis.md))。想拿节奏得读 JS 或实测,读 CSS 会得出"这站没动效"的错误结论。

## 色板(原样 token)

| Token | Hex | 角色 |
|---|---|---|
| `--color--lime` | `#d2ff00` | 品牌荧光绿,唯一强调色 |
| `--color--lime-off` | `#b2c73a` | 荧光绿的哑光态(hover/失焦) |
| `--color--lime-zero` | `#d2ff0000` | 透明版,专供渐变收边 |
| `--color--dark-green` | `#282c20` | 主底(**不是黑,是暗橄榄**) |
| `--color--dark-green-tint-1/2` | `#3b3c38` / `#535450` | 底色两级抬升 |
| `--color--black` | `#111112` | 纯黑区块(**带一点蓝**) |
| `--color--white` | `#f4f4ed` | 主文字(**暖白,不是 #fff**) |
| `--color--green-off-white-1/2` | `#dde1d2` / `#b4b8a5` | 次级/三级文字 |
| `--color--grey-on-track` | `#b9bbad` | 赛道灰 |
| `--color--grey-1/2`,`--color--green-light` | `#ebeee0` / `#c8cbbd` | 浅色区块 |
| `--color--orange` | `#ff6b00` | 备用第二强调 |

**结构**:暗橄榄底 + 暖白字 + **一个高饱和荧光绿**。关键不是绿,是**黑白都被染了色**(#282c20 不是 #000,#f4f4ed 不是 #fff)——整页在一个色温里,这是"贵"的来源。

## 字号阶梯(原样 token,根 16px)

| Token | 值 | 换算 |
|---|---|---|
| `--text--impact` | `7.9375rem` | 127px |
| `--text--h2` | `4.5rem` | 72px(**比 h1 大**) |
| `--text--h1` | `4rem` | 64px |
| `--text--h3` | `2rem` | 32px |
| `--text--h4` | `1.5rem` | 24px |
| `--text--h5` | `1.2rem` | 19px |
| `--text--h6` / `--text--btn-primary` | `1rem` | 16px |
| `--text--eyebrow` | `.578125rem` | **9.25px** |

**极端对比比 = 127 : 9.25 ≈ 13.7×**。这是速度感的排版来源:超大字和微小标签直接并置,中间档很少用。

- 字体:`Brier`(展示,21 次主导)+ `Mona Sans Variable`(正文)
- 字距:大字负得狠 —— `-0.1875rem` / `-0.125rem` / `-0.0625rem`(字越大挤越紧),小字 `+0.05rem`

## 间距与圆角(原样 token)

- padding 阶梯:`mini 1rem / small 2rem / med 3rem / large 4rem / xlarge 5rem`(16/32/48/64/80px)
- gap:`--gap 1.25rem`、`--gap--med 2rem`
- **圆角很大**:`small 1rem / med 3rem / large 6.25rem`(16/48/100px)
- 栅格:`--grid-col 25.4375rem`、`--grid-spacer 31.51vh`、`--oval-side-offset 3rem`
- 移动端视口修正:`--vh: 1vh` / `--max-vh: 100vh`(JS 会改写)

## 可糅合性

- ✅ **搬得走**:整套色板(hex 直接可用)、字号极端对比策略、"黑白都染色温"的手法、padding 阶梯
- ⚠️ **有陷阱**:rem 基准 16px,和 Hashgraph 的 10px 流式根**不能混用数值**
- ❌ **搬不走**:节奏(在 GSAP 里)、Brier 是商业字体、hero 的 MSDF 3D 文字
