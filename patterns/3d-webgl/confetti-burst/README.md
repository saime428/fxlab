# 纸屑爆发 Confetti Burst

- **分类**: 3D / WebGL(canvas 渲染)
- **难度**: ★★
- **见于**: [MotionPotion](../../../cases/motionpotion/analysis.md)(词汇表:Confetti Explosion 模板);SaaS 成功时刻的行业标配
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/3d-webgl/confetti-burst/demo.html)

## 设计意图

用户完成了一件值得庆祝的事(下单、通关、发布),界面替他撒一把纸屑。它是"庆祝反馈"的行业通用语言——和盖章(私货)不同,confetti 全世界都看得懂。一次爆发一秒结束,是强注意力效果里最短命也最讨喜的。

## 核心机制

canvas 2D 粒子:每片纸屑一个状态对象,每帧重力 + 阻力 + 旋转,全部落出画布后 rAF 自停:

```js
// 爆发:从一点向扇形撒出
particles.push({
  x, y,
  vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - LIFT,
  rot: Math.random() * 7, vr: (Math.random() - .5) * .3,   // 自旋
  w: 8, h: 5, color: pick(COLORS),
});
// 每帧
p.vy += GRAVITY; p.vx *= DRAG; p.vy *= DRAG;
p.x += p.vx; p.y += p.vy; p.rot += p.vr;
// 画:旋转的小矩形(rotate 后宽高视觉上会"翻面",免费的 3D 错觉)
```

## 实现要点

- **矩形 + 自旋就够了**:纸屑翻面的 3D 感来自 `rotate` 让宽度视觉变化,不需要真 3D
- 初速度向上(`- LIFT`)再被重力拉回,抛物线比直接下落"喷"得有力
- 颜色从站点 CSS 变量取(demo 读 `--accent` 一族),别带库的占位色进项目——模式 B 铁律
- **粒子清零即 cancelAnimationFrame**:庆祝完不留后台循环;连点按钮是追加粒子,不是新开循环
- canvas 盖全屏时 `pointer-events: none` + `aria-hidden`,庆祝不能挡操作
- 一次 80~150 片;超过 300 视觉上只是"更乱",不是"更喜"

## 代价与注意

- 性能: 150 个 fillRect/帧,任何设备无感;dpr 封顶 1.5
- 可访问性: `prefers-reduced-motion` 时跳过动画,给一个静态替代反馈(demo 显示 🎉 文本)——庆祝的语义要保留,动效才是可选的
- 一页只配一个庆祝时刻:成功弹层、订单完成页;别挂在 hover 上

## 变体与延伸

- 形状换圆点/星星/emoji(`fillText`),机制不变
- 双侧炮筒(左下+右下各一个 burst 朝中央)是颁奖典礼式变体
- 物理升级(空气翻滚、摆动下落)见 canvas-confetti 库的 wobble 实现思路;本 demo 的抛物线版已覆盖 90% 感知
