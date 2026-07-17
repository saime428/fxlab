# 漂浮贴纸物理 Hover Floating Stickers

- **分类**: 悬停交互
- **难度**: ★★
- **见于**: [Shopify Editions W26](../../../cases/shopify-editions-winter-26/analysis.md)(可交互漂浮元素:气泡/贴纸)
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/hover/floating-stickers/demo.html)

## 设计意图

装饰元素不再是死图:平时各自慢悠悠漂着,鼠标扫过被推开、再飘回来。页面获得"空气感"——观众意识到这个页面会回应自己,但又不需要学任何交互。

## 核心机制

每个贴纸 = 一个弹簧粒子,三股力叠加:

```js
target = home + sin(t·speed + 相位) * 振幅    // ① 闲时漂移(错相位=各飘各的)
if (dist(指针) < R)                            // ② 鼠标斥力:半径内线性衰减
  v += 方向 * (1 - dist/R) * F;
v += -(x - target) * k - v * c;                // ③ 回家弹簧
x += v;
```

斥力只改速度不改位置,所以被推开后的轨迹永远是平滑曲线——"物理感"来自这一点。

## 实现要点

- 贴纸 `pointer-events: none`,事件全挂容器上——顺便让 `offsetX/Y` 天然相对容器,省掉 rect 换算
- 容器 `touch-action: none`,手指划过 = 鼠标扫过,触屏同款体验
- home 用百分比存、按容器实际尺寸换算,resize 只重算一次
- 斥力峰值 F 和半径 R 是气质旋钮:F 大 R 小 = 惊跳,F 小 R 大 = 慵懒避让
- 这是常驻 rAF(漂移不停),`visibilitychange` 必须停后台;贴纸多于 ~30 个考虑简化漂移

## 代价与注意

- 性能: 纯 transform,10 个以内无感;常驻循环是本 pattern 唯一"永动"成本
- 可访问性: 纯装饰,容器 `aria-hidden`;`prefers-reduced-motion` 时静态摆放不进循环
- 移动端: pointer events 已覆盖;注意别把可点内容放进贴纸区(贴纸 pointer-events: none 但会视觉遮挡)

## 变体与延伸

- 贴纸换成产品图/头像 = 团队墙、客户 logo 云
- 斥力反转(吸引)= 磁性聚拢;点击给爆发冲量 = 拍散效果
- 加滚动位移就是 [parallax-cards](../../scroll/parallax-cards/) 的合体版:滚动管大位移,指针管微物理
