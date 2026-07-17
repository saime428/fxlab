# Messenger — Abeto 小星球快递游戏

- **URL**: https://messenger.abeto.co/
- **收录日期**: 2026-07-15
- **一句话印象**: 两个人、5.7MB,做出浏览器里的马里奥银河式多人游戏

## 整体气质从哪来

- 卡通渲染(cel-shading)+ 小星球球面世界,Jet Set Radio 气质
- 多人同图但只能用 emoji 交流——社交设计极简却温暖
- "网页即游戏":零下载零安装

## 效果清单

| # | 效果描述 | 分类 | 推测技术 | 值得抽成 pattern? |
|---|---|---|---|---|
| 1 | 球面重力角色控制(小星球行走) | 3d-webgl | Three.js 自定义重力/朝向 | ☐ |
| 2 | 卡通描边渲染 cel-shading | 3d-webgl | 自定义 toon shader | ☐(降级:方法论笔记,见下) |
| 3 | 实时多人同步 | 其他 | WebSocket + Node.js | ☐ |
| 4 | 极限体积优化(全站 5.7MB) | 其他 | 压缩纹理/几何合并 | ✅(方法论) |

## 技术栈侦察

- 渲染: Three.js + three-mesh-bvh(碰撞加速)
- 资产: Houdini/Blender 建模,Substance 贴图
- 后端: WebSocket 多人服务(Node.js)
- 资料: [80.lv 报道](https://80.lv/articles/deliver-mail-on-tiny-colorful-planet-in-this-relaxing-web-game)、[HN 讨论](https://news.ycombinator.com/item?id=45396441)、Awwwards 收录

## 借鉴笔记

体积预算(5.7MB)是被低估的设计约束——它逼出了风格化渲染而非写实。cel-shading 是"低成本高辨识度"的 3D 路线。

**cel-shading 方法论**(按 criteria 复用性否决,不抽 pattern——前提是"已有 Three.js 场景",脱离 3D 语境不成立):色阶量化(光照结果 floor 到 2-4 档)+ 描边(背面外扩法 backface hull 或后处理 sobel)+ 平涂贴图。Three.js 现成起点:`MeshToonMaterial` + `OutlinePass`,自定义 shader 只在需要控制色阶断点时才写。
