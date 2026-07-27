# 光标跟随预览图 Image Follow

- **分类**: 鼠标跟随
- **难度**: ★★
- **见于**: 代理商/作品集站的项目列表通杀做法(Awwwards 上 Portfolio / Design Agencies 分类的高频手法);机制在 JS 里,CSS 侧探测不到
- **Demo**: [demo.html](https://saime428.github.io/web-fx-lab/patterns/cursor/image-follow/demo.html)

## 设计意图

一列**纯文字**的项目名,hover 哪一条,那条的预览图就跟着光标浮出来。

它一次解决两个问题:列表保持排版的克制(没有一堆缩略图打架),同时每一项都能被"看见"。**图片只在被问到的时候才出现**——这是它比缩略图网格高级的地方,也是作品集站最容易见效的一招。

## 核心机制

一个共用的图片容器跟随光标,hover 时换图 + 淡入:

```js
list.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
item.addEventListener('pointerenter', () => {
  img.src = item.dataset.img;          // 换图
  box.classList.add('on');             // 淡入
});
// rAF 里 lerp,并按水平速度给一点倾斜
const tick = () => {
  x += (tx - x) * LERP; y += (ty - y) * LERP;
  const skew = clamp((tx - x) * TILT, -12, 12);
  box.style.transform = `translate3d(${x}px,${y}px,0) rotate(${skew}deg)`;
};
```

**倾斜角来自"目标位与当前位的差"**,也就是滞后量本身——不用另外测速度,追得越急摆得越狠,松手自动回正。

## 实现要点

- **一个容器复用,不是每项一张图**。N 个项目只需要一个 `<img>`,换 `src` 即可;每项一张会把 N 张图全下载
- 图片要**预载**:`pointerenter` 才开始下载会看到白框。列表渲染后用 `new Image().src = …` 把它们悄悄拉下来,或给 `<link rel="prefetch">`
- 图片容器 `pointer-events:none`,否则它会挡住列表项自己的 hover,导致疯狂闪烁
- 换图瞬间加一点 `scale(.94) → 1` 的过渡,盖住 `src` 切换的硬边
- 倾斜角要**夹上限**(±12° 左右),否则快速划过列表时会转成风车
- 列表项本身也要有 hover 反馈(位移/变色)——图片是奖励,不是唯一反馈

## 代价与注意

- **触屏完全没有这个交互**。列表在触屏上必须自带缩略图或进入详情页,不能指望这个效果传达信息。用 `@media (hover:hover) and (pointer:fine)` 包住,并给触屏一套独立布局
- **键盘用户同理**:`:focus-visible` 时应当在项目旁边**静态**显示预览图,不要让图跟着跑
- `prefers-reduced-motion`: 去掉 lerp 和倾斜,图片直接出现在固定位置(比如列表右侧),别整个砍掉
- 图片体积是这个效果的真实成本。列表 12 项 = 12 张大图,记得上 `loading`/尺寸约束,别让首屏被拖垮

## 变体与延伸

- 图片换成**视频**(`<video muted playsinline>`),hover 才 `play()`,离开 `pause()` —— 代理商站最常见的升级版
- 同时显示 2-3 张错位堆叠的图,滞后量依次加大 = "一叠照片被拖着走"
- 配 [layout/blend-invert](../../layout/blend-invert/):图上叠一层 difference 的项目编号,压在任何图上都可读
- 列表项配 [cursor/magnetic-pull](../magnetic-pull/) 的吸附,hover 时文字迎上来
