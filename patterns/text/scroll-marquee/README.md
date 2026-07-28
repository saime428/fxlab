# 滚动响应字幕 Scroll Marquee

- **分类**: 文字动效
- **难度**: ★
- **见于**: [Lando Norris](../../../cases/lando-norris/analysis.md)(实测 110 个 marquee 元素,`data-marquee-scroll-speed` 滚动速度反馈)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/text/scroll-marquee/demo.html)

## 设计意图

无限滚动字幕自带"进行中"的能量;再把用户的滚动速度喂进去——滚得越快字幕越快、反向滚动字幕倒退——页面就从"会动"升级成"跟我互动"。低成本的沉浸感放大器。

## 核心机制

内容复制一份接在后面,rAF 循环推进偏移,滚动增量经 lerp 平滑后叠加到速度上:

```js
let x = 0, vel = 0, target = 0;
addEventListener('scroll', () => { target = scrollY - lastY; lastY = scrollY; });
function tick() {
  vel += (target - vel) * 0.08;          // lerp 平滑,拖尾感的来源
  target *= 0.9;                          // 停止滚动后回落
  x = (x + base + vel * factor) % half;   // half = 单份内容宽度
  track.style.transform = `translate3d(${-(x < 0 ? x + half : x)}px,0,0)`;
  requestAnimationFrame(tick);
}
```

## 实现要点

- 无缝的关键:内容至少两份,偏移对"单份宽度"取模;负速度时模出负数要 `+half` 拉回
- lerp 系数 0.05~0.1:小了拖泥带水,大了没有惯性感
- 基础速度别为 0——静止时也要缓慢爬行,否则像坏了
- 字幕对读屏是噪音:容器 `aria-hidden="true"`,重要信息不要只放在 marquee 里
- 页面不可见时暂停(`visibilitychange`),别在后台空转

## 代价与注意

- 性能: 一条 transform,忽略不计;几十条同屏时共享一个 rAF 循环(Lando 的 110 个就是这么活的)
- 可访问性: `prefers-reduced-motion` 停掉自动滚动(demo 降级为静态一行)
- 移动端: 触摸滚动的增量比滚轮大,factor 要调小或 clamp

## 变体与延伸

- 双条反向(上行左、下行右)是杂志感标配
- 纯 CSS 版(`@keyframes` + `animation`)成本更低,但做不了滚动反馈——不需要交互时用它
- 字幕内容换成 logo 墙 / 图片条,机制不变
