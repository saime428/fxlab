# GPU 粒子过渡 Particle Transition

- **分类**: 页面切换
- **难度**: ★★★
- **见于**: [Active Theory](../../../cases/active-theory/analysis.md)(GPU 粒子过渡,本 pattern 是其无状态简化版)
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/transitions/particle-transition/demo.html)

## 设计意图

图像不是切走的,是**炸成上万个粒子再落回来**——内容在过渡中短暂变成"物质",这是获奖站里最强的"技术力宣言"效果。Active Theory 把它用在页面转场;简化版保住核心观感,砍掉粒子间物理。

## 核心机制

**无状态 GPU 粒子**:不用 FBO ping-pong,每个粒子的位置是顶点着色器里的解析函数——静止在格点,中途被种子驱动的方向炸开,包络归零时落回:

```glsl
float lp  = clamp((uP - aSeed * .35) / .65, 0., 1.);  // 每粒子错峰出发
float env = sin(3.14159 * lp);                         // 两端归零的爆发包络
vec2 pos  = aUv * 2. - 1. + dir * amp * env;           // 格点 + 风暴偏移
gl_PointSize = uSize * (1. + env * 1.6);               // 飞行中变大
```

CPU 只做一次:把两张源图按格点采样,颜色塞进顶点属性(aColA/aColB);之后每帧只更新一个进度 uniform,运动全在 GPU。

## 实现要点

- **错峰(stagger)是灵魂**:所有粒子同步起跳像"缩放滤镜",按种子错开 35% 相位才有"风暴"感
- **静止态点径要盖住格子对角缝**:圆点直径 = 格距 × 1.5(半径 ≥ 格距 × √2/2),否则静止时漏底色、读不成完整图像
- 颜色在中段(vP 0.35~0.65)crossfade,正好被风暴掩护,切换不可见
- 粒子数 128×80 ≈ 1 万,任何 GPU 无感;要更细腻加格数,顶点属性是一次性开销
- 全程 tween 走完(easeInOutCubic),别用 lerp 逼近——风暴在中段,半途收敛会吃掉高潮
- `// ponytail: 无状态解析运动,天花板是粒子间无交互;要漩涡/引力场再上 FBO ping-pong(GPGPU)`

## 代价与注意

- 性能: 1 万顶点 + 单 pass POINTS,静止时可不重绘(demo 收敛即停);移动端注意 `gl_PointSize` 上限(规范只保证 1,实测普遍 ≥64,demo 最大 12px 安全)
- 可访问性: 点击/Enter/空格触发,canvas 带 `role="button"`;`prefers-reduced-motion` 跳终态 = 普通图片切换
- 移动端: 无 hover 依赖,点击即切;源图程序化生成避开 file:// CORS

## 变体与延伸

- 源图换成 logo/文字 = 品牌粒子签名;方向场换成 `curl noise` = 烟雾感
- 粒子终点换成**另一张图的非透明像素坐标**(而非同格点)= "飞行重组"版,需要 CPU 侧配对
- 进度接滚动 = 滚动驱动的粒子雕刻,即 [scroll-driven-shader](../../scroll/scroll-driven-shader/) 的粒子版
- 上限版:FBO ping-pong 存位置/速度纹理(GPGPU),粒子间可加引力/碰撞——Active Theory 的 Hydra 引擎路线,见 case 运行时实测
