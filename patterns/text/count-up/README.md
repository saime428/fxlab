# 数字滚动 Count Up

- **分类**: 文字动效
- **难度**: ★
- **见于**: [Shopify Editions W26](../../../cases/shopify-editions-winter-26/analysis.md)(`counter`,统计数字进场即滚)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/text/count-up/demo.html)

## 设计意图

"150+ 条更新"直接写出来是陈述,从 0 滚上去是炫耀。数字滚动把统计值变成一个小事件,让用户亲眼看着它"涨到"这么大——B 端数据页性价比最高的动效,没有之一。

## 核心机制

进视口后 rAF 插值,ease-out 让最后几个数"咬合到位":

```js
const ease = t => 1 - Math.pow(1 - t, 3);          // easeOutCubic
function frame(now) {
  const t = Math.min((now - t0) / dur, 1);
  el.textContent = fmt.format(Math.round(target * ease(t)));
  if (t < 1) requestAnimationFrame(frame);
}
new IntersectionObserver(([e]) => e.isIntersecting && start(), { threshold: .6 }).observe(el);
```

## 实现要点

- 千分位交给 `Intl.NumberFormat`,别手写正则
- **必须 ease-out**:线性滚动像老虎机没停稳;结尾减速才有"落定"感
- 数字宽度会跳:`font-variant-numeric: tabular-nums` 让每个数字等宽,布局不抖
- 时长 1~2s;值越大不等于滚越久,统一时长靠 ease 拉开层次
- 只播一次(observer 触发后 unobserve),回滚页面重看会腻

## 代价与注意

- 性能: 每帧改一次 textContent,单个元素无感;几十个同屏考虑共享一个 rAF
- 可访问性: `prefers-reduced-motion` 直接显示终值;滚动过程对读屏是噪音,可加 `aria-live="off"` 且终值即原文
- 移动端: 正常

## 变体与延伸

- 加前后缀("$"、"+"、"%")时只滚数字部分
- 老虎机式逐位翻滚(每位一个纵向条带)是重装版,成本高一档
- CSS 也能做:`@property --n` + `counter()`,但兼容性和格式化不如 JS 省心

## 实战笔记

- **rAF 被冻结时数字会永远停在 0**:元素进视口时若标签在后台/系统低电量/页面被内嵌预览,rAF 不跑;而"只播一次"的 `done` 标记已经置位,回到前台也不会重跑。真机可复现,不是环境怪癖
- 兜底用**另一个时钟源**:`setTimeout(() => { if (!landed) render(to) }, dur + 500)`。setTimeout 在后台只被节流不被停,能保证终值一定落地。别用第二个 rAF 兜底 —— 同一个时钟停了就都停了
- 推论:凡是"只播一次 + 用 rAF 推进"的效果,都要问一句"rAF 不跑时停在哪一帧",停在错误状态的就得兜底

> 来源:[blends/hashgraph-x-lando](../../../blends/hashgraph-x-lando/) 糅合 pilot,2026-07-26
