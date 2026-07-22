# 假 UI 自演示 Fake UI Demo

- **分类**: 布局手法(产品叙事)
- **难度**: ★★
- **见于**: [MotionPotion](../../../cases/motionpotion/analysis.md)(假 AE 时间线自己"导入图层、长出滑块、蹦出关键帧");[Shopify Editions](../../../cases/shopify-editions-winter-26/analysis.md) 同需求用了 12 个 video——本 pattern 就是那笔账的 DOM/CSS 解法
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/layout/fake-ui-demo/demo.html)

## 设计意图

产品落地页说服力的性价比之王:不放截图(死的)、不放录屏(几 MB、文案锁死、改版重录),而是搭一个**假产品界面让它自己演**——图层滑入、进度生长、结果打勾,循环往复。体积≈0,文案可改可本地化,改版只改 CSS。

## 核心机制

职责切干净:**JS 只做状态机(切 class),编排全在 CSS**。关键技巧是阶段类**累加**而不是替换——已播过的动画选择器持续匹配,computed animation 不变就不会重播:

```js
stage.classList.add('s1');                        // 幕1:图层导入
setTimeout(() => stage.classList.add('s2'), T.KEYS);   // 幕2:滑块生长+关键帧(s1 还在,行不重播)
setTimeout(() => stage.classList.add('s3'), T.DONE);   // 幕3:完成打勾
setTimeout(() => stage.classList.remove('s1','s2','s3'), T.CLEAR);  // 清场(元素回到隐藏基态)
setTimeout(cycle, T.LOOP);                        // 下一轮:重新匹配=动画重播
```

```css
.row { opacity: 0; }                              /* 基态隐藏:清场即空舞台,无闪跳 */
.s1 .row { animation: rowIn .45s var(--ease) both; }
.s1 .row:nth-child(2) { animation-delay: 90ms; }  /* 错峰同 stagger 家族 */
```

## 实现要点

- **基态=隐藏、动画=入场、fill 用 both**:三者配套,清场时舞台自然空,不闪最终帧
- 累加类的原因:换类会让已匹配的动画被移除(元素跳回基态);累加保证幕 1 的元素在幕 2 里稳住
- 剧本时长进 KNOB 常量;单轮 4~6 秒、循环间隔 ≥ 800ms,比真软件慢 30%——观众在"看懂",不是在"用"
- 假 UI 是纯装饰:容器 `role="img"` + 一句话 `aria-label` 说明演的是什么,内部全部 `aria-hidden`
- 别做真交互(可点的假按钮是欺骗);要交互演示,那是产品 sandbox,另一个物种

## 代价与注意

- 性能: 全 CSS 动画 + 几个 setTimeout,忽略不计;后台标签 CSS 动画自动暂停
- 可访问性: `prefers-reduced-motion` 停循环,静态展示完成态(信息完整,只是不演)
- 维护: 假 UI 会随真产品改版过时——把它当截图一样列进改版检查单

## 变体与延伸

- 剧本换成"输入命令→输出结果"(终端)、"拖块→连线"(流程图),机制不变
- 滚动触发单次播放(IntersectionObserver 挂 s1)替代无限循环,长页多个演示时更克制
- 幕间配 count-up / 打字机效果,都是库内现成件
