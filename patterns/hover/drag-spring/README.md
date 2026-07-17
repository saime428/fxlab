# 可拖拽 + 弹簧回弹 Drag Spring

- **分类**: 悬停交互
- **难度**: ★★
- **见于**: [Anime.js](../../../cases/animejs/analysis.md)(`createDraggable` + spring);获奖站的贴纸/卡片/浮动装饰常客
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/hover/drag-spring/demo.html)

## 设计意图

元素能被拽走、还会"自己弹回家",页面瞬间有了物性——用户会忍不住多玩两下。这是把"装饰"变成"玩具"的最低成本手法。

## 核心机制

半隐式欧拉弹簧,四行就是全部物理:

```js
v += -k * x - c * v;   // k 刚度=回家多快,c 阻尼=晃几下停
x += v;
// 拖拽中:x 直接钉在指针上,物理暂停
// 松手时:指尖最后一帧的位移差 = 初速度,"甩"是免费的
```

k 大 c 大 = 硬(工具感);k 大 c 小 = 弹(玩具感);k 小 = 软(慵懒)。demo 三个贴纸就是三组参数。

## 实现要点

- `setPointerCapture` + pointer events 一套代码通吃鼠标/触屏;元素上 `touch-action: none` 否则移动端手势被浏览器截走
- 松手初速度直接取拖拽最后一帧的位移差(`v = new - old`),不用额外测速
- 收敛(位移和速度都 < 0.3px)就停 rAF 并清 transform,别让弹簧永远算下去
- 键盘等价物:聚焦后方向键给冲量轻推,弹簧自动拉回——交互闭环不依赖鼠标
- `prefers-reduced-motion`:松手直接归位,不弹

## 代价与注意

- 性能: 纯 transform,任何设备无感;多元素共享一个 rAF
- 可访问性: 可聚焦 + `aria-label` 说明玩法;reduced-motion 已降级
- 移动端: pointer events 天然支持;注意拖拽区域别和页面滚动冲突(`touch-action: none` 只加在贴纸上,不加容器)

## 变体与延伸

- 加边界碰撞反弹 = 桌面玩具;加重力 = 掉落物理
- 拖拽进度映射别的属性(旋转/缩放)= 拟物旋钮
- 批量管理/复杂手势直接上 anime.js v4 `createDraggable`(见 case),spring 参数一一对应
