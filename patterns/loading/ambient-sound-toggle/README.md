# 氛围音开关 Ambient Sound Toggle

- **分类**: 加载动画 / 体验层
- **难度**: ★★
- **见于**: [Hashgraph Ventures](../../../cases/hashgraph-ventures/analysis.md)(SOUND ON/OFF)、[Robin Payot](../../../cases/robin-payot/analysis.md)(Enter 即授权)
- **Demo**: [demo.html](https://saime428.github.io/fxlab/patterns/loading/ambient-sound-toggle/demo.html)

## 设计意图

一层低音量氛围音把网页从"文档"变成"场所"。右上角的 SOUND ON/OFF 开关本身就是宣言:这是一场体验,不是一页资料。

## 核心机制

浏览器规定 AudioContext 必须由用户手势解锁——所以"Enter 按钮"或"声音开关"不只是仪式,是技术必需:

```js
let ctx, gain;
button.addEventListener('click', () => {        // 手势内创建
  ctx ??= new AudioContext();
  gain.gain.linearRampToValueAtTime(on ? 0.15 : 0, ctx.currentTime + 1.2);
});
```

## 实现要点

- **开关音量必须渐变**(linearRamp 1~2s),瞬间开关很廉价
- demo 用两个失谐正弦波 + 缓慢 LFO 直接合成氛围音,零音频文件;生产环境换成 loop 音频时注意无缝接缝
- 记住用户选择(localStorage),回访时保持关闭状态、只显示开关
- 音量控制在 -20dB 左右(gain ≈ 0.1~0.15),氛围音是闻不是喝

## 代价与注意

- 可访问性: 必须有清晰可见的关闭开关;自动播放音频对读屏用户是灾难,默认应为 OFF
- 性能: WebAudio 合成几乎零开销;音频文件则注意体积
- 移动端: iOS 静音键状态下 WebAudio 可能不出声,属预期行为

## 变体与延伸

- 交互音效同管线:hover/点击的细小声音走同一个 AudioContext
- 音量与滚动深度联动(越往下越安静)
