# 滚动驱动 Shader Scroll-driven Shader

- **分类**: 滚动动效 / 3D-WebGL
- **难度**: ★★★
- **见于**: [Igloo Inc.](../../../cases/igloo-inc/analysis.md)(冰晶生长)、几乎所有 WebGL 叙事站
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/scroll/scroll-driven-shader/demo.html)

## 设计意图

滚动条不再翻页,而是"推进一场物质变化"——形态、颜色、密度全由滚动进度雕刻。这是 3D 叙事站的核心管线:页面内容和 GPU 画面共享同一个进度值。

## 核心机制

滚动进度归一化成 0~1,喂给 fragment shader 的 uniform,画面完全由 GPU 计算:

```js
// JS 侧:只算一个数
const p = clamp(scrollY / (docHeight - innerHeight), 0, 1);
gl.uniform1f(uProgress, p);   // 每帧传给 shader
```

```glsl
// GLSL 侧:进度驱动一切
float r = mix(0.1, 0.45, uProgress);        // 形状随进度生长
vec3 col = mix(colA, colB, uProgress);      // 颜色随进度过渡
```

## 实现要点

- JS 只负责传 uniform,所有视觉计算在 GPU——这就是 Igloo 顺滑的原因
- 进度要 lerp 平滑(`cur += (target-cur)*0.1`),否则滚轮的阶跃会直接抖在画面上
- Igloo 的进阶版:把复杂动画烘焙成**数据纹理**(scroll-datatexture.ktx2),shader 按进度采样,再复杂的动画运行时也是 O(1)
- demo 用原生 WebGL 写了个最小噪声形变,看懂后换成 Three.js 的 `ShaderMaterial` 即可上生产

## 代价与注意

- 性能: fragment shader 全屏跑,移动端注意降分辨率(`renderer.setPixelRatio` 限 2)
- 可访问性: `prefers-reduced-motion` 时固定 progress 为终态静帧
- 门槛: 需要 GLSL 基础;先玩 demo 里的 uniform 再看 Book of Shaders

## 变体与延伸

- 进度分段:0~0.3 生长、0.3~0.7 变色、0.7~1 消散(piecewise remap)
- 配合 [Awwwards Igloo case study](https://www.awwwards.com/igloo-inc-case-study.html) 学数据纹理烘焙
