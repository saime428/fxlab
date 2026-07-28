# 卡片翻转 Flip Card

- **分类**: 悬停交互 / 3D
- **难度**: ★★
- **冲击力**: A(炸场)——页面上第一次出现"厚度",而且是纯 CSS
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/hover/flip-card/demo.html)
- **来源**: [2026-07 扫描](../../../blends/scans/2026-07-awwwards.md),`preserve-3d` **82/691 站**、`perspective` 47 站

## 设计意图

一张卡有正反两面,翻过去看背面。它解决的是**信息密度**问题:正面只放最少的东西(名字、一张图),细节藏在背面——列表因此保持克制,而信息一个没少。

比"hover 展开"高级的地方在于**它是有物理意义的**:纸有两面,翻转是所有人都懂的动作,不需要学习。

## 核心机制

三层,各司其职:

```css
.scene { perspective:1000px; }                  /* 透视在**祖先**上,不在翻转元素上 */
.card  { transform-style:preserve-3d;           /* 让子元素活在 3D 空间里 */
         transition:transform .8s var(--ease-out); }
.scene:hover .card{ transform:rotateY(180deg); }
.face  { position:absolute; inset:0;
         backface-visibility:hidden; }          /* 背对镜头时隐藏自己 */
.back  { transform:rotateY(180deg); }           /* 背面先转过去,翻过来才是正的 */
```

**`perspective` 必须在祖先上**。写在翻转元素自己身上,每个面各自算透视,翻起来是平的、没有近大远小。

## 实现要点

- 两个面都 `position:absolute` 叠在一起,容器要用 `aspect-ratio` 或写死高度撑开,否则塌成 0
- **背面要预先 `rotateY(180deg)`**,不然翻过来是镜像的
- Safari 上 `backface-visibility` 与嵌套 3D 变换有历史 bug:给 `.face` 加 `transform:translateZ(0.1px)`(正面)和 `rotateY(180deg) translateZ(0.1px)`(背面),把两个面在 Z 轴上错开一点,比依赖 backface 剔除稳
- 阴影/圆角要加在 `.face` 上,加在 `.card` 上会在 3D 空间里被压扁
- 想要**点击翻转**而不是 hover:用 `<button>` 包住并切 class,别用 `:focus` 硬撑——`:focus` 在触屏上行为不一致

## 代价与注意

- **可访问性是这个 pattern 最大的坑**:两个面都在 DOM 里,读屏会把背面内容一起念出来,键盘 Tab 会跳进看不见的那一面。必须给当前不可见的面加 `inert`(或 `aria-hidden` + `tabindex="-1"`),翻转后再换过来
- 触屏没有 hover。**必须提供点击翻转**,否则背面内容在手机上永远看不到——那等于内容丢失,不是效果降级
- `prefers-reduced-motion`:改成**淡入淡出换面**,不要 3D 旋转。旋转类运动对前庭敏感人群不友好
- 每张卡都是一个合成层。长列表里全部用会吃内存,列表用"点击翻转"而不是全部常驻
- 背面内容如果很长,卡片高度对不上——两面高度必须一致,否则翻过去会溢出

## 变体与延伸

- 沿 X 轴翻(`rotateX`)= 翻页而不是翻卡,配合垂直列表更自然
- 翻转到一半时切换内容(`transitionrun` 中点),可以做"三面"效果
- 只做倾斜不做翻转 = 卡片 3D 倾斜(tilt):`rotateX/rotateY` 由指针位置插值,幅度 ≤10°,比翻转克制得多,适合作品集网格
- 配 [cursor/magnetic-pull](../../cursor/magnetic-pull/):卡片既迎向指针又轻微倾斜,两个都调到很小才不油腻
