# 贡献指南 · Contributing

谢谢你愿意给 fxlab 加一块砖。目标不是「动画越多越好」，而是 **可抄、有品味、能给人和 AI 选型**。

[English summary below](#english)

## 你可以贡献什么

| 类型 | 说明 |
|------|------|
| 新 pattern | `patterns/<分类>/<英文短名>/` + README + demo |
| 修 demo | 崩了、移动端炸了、reduced-motion 缺失 |
| 实战笔记 | 某 pattern README 底部「实战笔记」补一条真实坑 |
| Case 拆解 | `cases/<site>/analysis.md`，链到已有或新建 pattern |
| 文档 / 翻译 | README、INDEX、TASTE 的澄清与英文补全 |
| 传播素材 | `docs/promo/` 下 GIF / 短视频说明 |

先开 [Issue](https://github.com/saime428/fxlab/issues)（`pattern request` 或说明意图）再大改，避免撞车。

## 新增一个 Pattern（清单）

1. **读** [`docs/criteria.md`](docs/criteria.md) 与 [`docs/taxonomy.md`](docs/taxonomy.md)，选对分类目录。  
2. **复制模板** [`docs/templates/pattern.md`](docs/templates/pattern.md) →  
   `patterns/<分类>/<name>/README.md`  
3. **写 `demo.html`**  
   - 零依赖、双击可开（`file://` 或 GitHub Pages）  
   - 深色默认背景优先（与 lab 一致）；颜色当占位，README 写清如何换成项目色  
   - 实现 `prefers-reduced-motion: reduce` 时降级或关掉非必要动画  
4. **README 必含**  
   - 设计意图（为什么好看）  
   - 核心机制 + 关键代码片  
   - 实现要点、性能、无障碍、移动端  
5. **登记**  
   - [`INDEX.md`](INDEX.md) 全量表加一行  
   - [`README.md`](README.md) 完整目录表加一行（中文名 + demo 链接）  
   - 若值得进「镇馆 8 式」，在 PR 里说明，由维护者决定是否替换  
6. **自检**  
   - 本地打开 demo，桌面 + 窄屏各看一遍  
   - 链接在 README / INDEX 无 404  

### 命名

- 目录：`kebab-case` 英文（如 `drag-spring`）  
- 分类：已有 `scroll` / `hover` / `text` / `transitions` / `cursor` / `loading` / `layout` / `3d-webgl`  
- 难度：`★` / `★★` / `★★★`（与 INDEX 一致）

### Commit 建议

```text
patterns: add <name> (<one-line why>)
patterns: <name> 实战笔记
docs: TASTE 更新(<一句话教训>)
fix(demo): <name> reduced-motion
```

## 品味红线（PR 会卡）

见 [`TASTE.md`](TASTE.md)。摘要：

- 默认 **2–4 个效果 + 1 个氛围**，不要在一个 demo 里炫技堆满  
- 状态切换优先 **交叉溶解 / 连续阴影**，避免「死」的硬切中间帧  
- 强注意类效果（粒子 / marquee / displacement）**一页一个焦点**  
- 炫酷优先于「最简可复用」——但 demo 仍必须能直接打开  

## 本地预览站点

GitHub Pages 用仓库根目录。本地可用任意静态服，例如：

```bash
# Python
python -m http.server 8080

# Node
npx --yes serve .
```

然后打开 `http://localhost:8080/`（需能 `fetch INDEX.md`，不要只靠错误的 `file://` 路径假设）。

## Code of Conduct

善意沟通；不粘贴他人非授权商业站的完整资产；demo 用占位图/几何形即可。

---

## English

**PRs welcome** for new patterns, demo fixes, case studies, and docs.

**New pattern checklist**

1. Follow `docs/criteria.md` + `docs/taxonomy.md`.  
2. `patterns/<category>/<kebab-name>/README.md` from `docs/templates/pattern.md`.  
3. Zero-deps `demo.html`; honor `prefers-reduced-motion`.  
4. Register in `INDEX.md` and the full table in `README.md`.  
5. Design intent in the README (“why it looks good”), not only how.

Taste defaults: **TASTE.md**. Agent install path: **skills/fxlab/**.  
Open an issue before large redesigns.
