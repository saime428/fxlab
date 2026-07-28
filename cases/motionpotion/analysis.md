# MotionPotion — AE/Figma 动效模板插件官网

- **URL**: https://motionpotion.co/
- **收录日期**: 2026-07-22
- **一句话印象**: 卖动效的站用纯 CSS 把自己变成演示:按钮描边在转、模板 hover 即播、假 AE 界面自己填时间线

## 整体气质从哪来

- "法术书"世界观贯穿:模板叫 spell、按钮叫 Steal This Spell、成功叫施法仪式——文案和动效共用一套隐喻
- 全站无 WebGL 无 GSAP,28 个 `@keyframes` + 56 条 hover 规则手写完成,零依赖路线的天花板示范
- 动效几乎全部**交互触发**:静止时页面很安静,hover/点击/滚动才逐层点亮

## 效果清单

| # | 效果描述 | 分类 | 推测技术 | 值得抽成 pattern? |
|---|---|---|---|---|
| 1 | 旋转渐变描边(按钮常亮) | hover | `@property <angle>` + conic-gradient 动画化 | ✅ |
| 2 | 精灵图 hover 预览(海报→6帧动画) | hover | `steps(6)` 步进 background-position | ✅ |
| 3 | 假 AE 界面自演示(图层导入/滑块生长/关键帧弹出) | layout | 状态机切 class + rowIn/barGrow/kfPop 编排 | ✅(简化版) |
| 4 | 施法成功仪式(光环+描边+星辉+火花) | transitions | 10 个 keyframes 编排,stroke-dashoffset 画符 | ☐(编排参考,盖章的豪华版) |
| 5 | 计数卡 + 拖尾装饰 | text | data-count-target,同款 count-up | ✓ 已有(频率+1) |
| 6 | reveal/split 入场、页脚 marquee | scroll/text | IO + 拆分,同库内 | ✓ 已有(频率+1) |
| 7 | 漂浮/闪烁装饰(floatY/twinkle)、印章旋转 | hover | 正弦漂浮,floating-stickers 思路 | ☐ |
| 8 | 【词汇表】形状擦除过渡(圆/条纹/点阵一族) | transitions | clip-path / 条纹错峰,视频转场→网页 wipe | ✅ |
| 9 | 【词汇表】弹性文字(elastic/pop text) | text | 弹簧曲线缓动,CSS `linear()` 可零 JS | ✅ |
| 10 | 【词汇表】纸屑爆发 Confetti Explosion | 3d-webgl | canvas 粒子:重力+阻力,burst 自停 | ✅ |

> 8-10 来自它货架陈列的模板(动效词汇表):只取**效果概念**零依赖重实现,不碰其模板文件/Lottie 资产(商业产品)。其余模板多为具体图形表演,离开视频语境不成立(复用性否决)。

## 技术栈侦察

- 滚动: Lenis;其余全手写(mp-app.js 118KB 主要是 Lottie 播放器管理,experience.js 17KB)
- 模板预览:30 个 Lottie(工具依赖 → tech-radar 口径);后端 Supabase
- 非获奖站,但"产品即演示"的执行密度高于多数获奖站

## 借鉴笔记

**卖什么就用什么演示**:与 Anime.js 官网同课,但这里更极端——连"产品工作过程"都用 DOM/CSS 假 UI 演出来(推翻了 Shopify case 里"内嵌产品演示只能靠 video"的旧判断)。效果 3 是产品落地页说服力的性价比之王:不用录屏、可改文案、体积≈0。

## 运行时实测(浏览器注入探测,2026-07-22)

- **28 个 `@keyframes` / 56 条 hover 规则**,但静止 census 只有 4 个元素在动(floatY×3、sealSpin×1)——动效全部藏在交互触发里,类名 grep 和"当前谁在动"都探不到,**必须全量枚举样式表**(本条已回写 HANDOVER 工作流)
- 旋转描边:`@property --mp-angle { syntax: '<angle>' }` 注册后,`mp-border-spin` 直接动画化该变量,`conic-gradient(from var(--mp-angle), …)` 铺在 `::after` 上,`padding: 2px` 露出环
- 精灵图:`--sprite` 变量携图,`background-size: 600% 100%`,hover 时 `steps(6, jump-none)` 0.9s infinite 步进 `background-position-x`
- 假 UI 自演示宿主:`.stage.is-importing .track-row span` / `.stage[data-state="casting"] .status-dot` / `.spell-card-wrap.is-visible .spell-bar`——JS 只切状态 class,编排全在 CSS
- 施法仪式:`.spell-cast.is-on` 一个开关点亮 10 个 keyframes(glyph 双伪元素 conic 光环、ring-rune stroke-dashoffset 描边、shine 旋转、star text-shadow 呼吸、spark 迸发)
