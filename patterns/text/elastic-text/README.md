# 弹性文字入场 Elastic Text

- **分类**: 文字动效
- **难度**: ★
- **见于**: [MotionPotion](../../../cases/motionpotion/analysis.md)(词汇表:elastic text / pop up text 模板)
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/text/elastic-text/demo.html)

## 设计意图

[split-text-reveal](../split-text-reveal/) 是"到场",这个是"蹦上台":每个字冲过头再弹回来坐稳。库里所有入场都是 ease-out 家族(减速抵达=庄重),弹性是缺失的另一档性格——活泼、年轻、玩具感,营销页和产品吉祥物文案的调味料。

## 核心机制

弹簧曲线没法用 cubic-bezier 表达(要过冲再回摆),但 CSS `linear()` 可以装下任意采样曲线。JS 把阻尼弹簧采样成 `linear()` 字符串,一次生成,之后全是纯 CSS:

```js
// 阻尼弹簧 x(t),采样 24 个点 → linear(0, 1.32 20%, 0.93 45%, …, 1)
const spring = (stiffness, damping) => { /* 标准欠阻尼解析解 */ };
const pts = Array.from({ length: 24 }, (_, i) => spring(i / 23));
el.style.setProperty('--spring', `linear(${pts.join(',')})`);
```

```css
.char { animation: pop var(--dur-l) var(--spring) backwards; }
@keyframes pop { from { translate: 0 .6em; scale: .6; opacity: 0; } }
```

关键认知:**过冲量在曲线里,不在 keyframes 里**——keyframes 只写"从哪来到哪去",弹几下、弹多大全由缓动函数决定,换个 `--spring` 就换个性格。

## 实现要点

- 刚度/阻尼是仅有的两个旋钮:stiffness 高=弹得快,damping 低=晃得久;demo 顶部 KNOB 给了推荐区间
- 逐字错峰 30~50ms,弹性动画比 ease-out 长(总时长含回摆),`--dur-l` 建议 ≥ .8s
- `backwards` 填充 + 不支持 `linear()` 的浏览器降级 `cubic-bezier(.34,1.56,.64,1)`(backOut 单次过冲,80% 的味道)——`CSS.supports` 一行判断
- aria 处理同 split-text-reveal:原文进 `aria-label`,拆分层 `aria-hidden`
- 弹性入场自带喜剧感,严肃内容(法务、医疗、悼念)禁用——性格档位要配内容

## 代价与注意

- 性能: 只动 transform/opacity;曲线生成是一次性字符串拼接,零运行时成本
- 可访问性: `prefers-reduced-motion` 直接显示终态;弹跳幅度大,前庭敏感用户更需要这条降级
- 移动端: 正常;字号小时过冲不明显,小于 16px 不值得用

## 变体与延伸

- 同一条 `--spring` 曲线喂给按钮 hover 的 scale、菜单展开的 translate——全站共享一个"弹性人格"(铁律 7 的弹簧版)
- JS 物理版(逐帧积分)见 [drag-spring](../../hover/drag-spring/):要跟手交互用它,只要入场用本条(CSS 版便宜一个数量级)
- `linear()` 还能装 bounce、anticipation(先蹲后跳)任意曲线,生成器思路不变
