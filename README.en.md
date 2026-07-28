# fxlab 🧪

> **Copy-paste · zero-deps demos · AI-readable INDEX**  
> A lab of web motion patterns for landings that should feel expensive—not animation spam.

[中文 README](README.md) · [Live demos](https://saime428.github.io/fxlab/) · [Showcase](https://saime428.github.io/fxlab/showcase/) · [INDEX](INDEX.md) · [TASTE](TASTE.md)

```text
Curated motion patterns with live demos, taste rules, and a Claude/agent skill.
```

## 30-second start

| You are… | Do this |
|----------|---------|
| **Dev / designer** | Open [Live demos](https://saime428.github.io/fxlab/) → click a card → read the pattern README |
| **Need a full page** | Open [Showcase](https://saime428.github.io/fxlab/showcase/) |
| **Claude / agent** | Install the skill (below) → ask for tasteful motion that matches existing design |

## Featured 8

| Pattern | Why it travels | Demo |
|---------|----------------|------|
| [scroll-driven-shader](patterns/scroll/scroll-driven-shader/) | Scroll → shader; “expensive” look | [demo](https://saime428.github.io/fxlab/patterns/scroll/scroll-driven-shader/demo.html) |
| [image-displacement](patterns/transitions/image-displacement/) | Distortion image transitions | [demo](https://saime428.github.io/fxlab/patterns/transitions/image-displacement/demo.html) |
| [particle-transition](patterns/transitions/particle-transition/) | GPU particle state change | [demo](https://saime428.github.io/fxlab/patterns/transitions/particle-transition/demo.html) |
| [shader-wipe](patterns/transitions/shader-wipe/) | Full-screen shader wipe | [demo](https://saime428.github.io/fxlab/patterns/transitions/shader-wipe/demo.html) |
| [split-text-reveal](patterns/text/split-text-reveal/) | Landing-page text entrance | [demo](https://saime428.github.io/fxlab/patterns/text/split-text-reveal/demo.html) |
| [horizontal-gallery](patterns/scroll/horizontal-gallery/) | Sticky horizontal product story | [demo](https://saime428.github.io/fxlab/patterns/scroll/horizontal-gallery/demo.html) |
| [view-transitions](patterns/transitions/view-transitions/) | Native shared-element transitions | [demo](https://saime428.github.io/fxlab/patterns/transitions/view-transitions/demo.html) |
| [drag-spring](patterns/hover/drag-spring/) | Spring physics drag | [demo](https://saime428.github.io/fxlab/patterns/hover/drag-spring/demo.html) |

Full catalog (Chinese table + links): **[README.md](README.md#完整-pattern-目录)** · machine-friendly list: **[INDEX.md](INDEX.md)**

## Why not just CodePen?

| Typical dump | fxlab |
|--------------|------------|
| Random snippets | Taxonomy, difficulty, scene, gotchas |
| Screenshots only | Runnable `demo.html` + design intent |
| AI spam-animates | INDEX + **TASTE.md** → 2–4 effects max by default |
| Library-locked tutorials | Demos stay openable with zero deps |

## Use with Claude Code / agents

```bash
cp -r skills/fxlab ~/.claude/skills/fxlab
# or
npx --yes degit saime428/fxlab/skills/fxlab ~/.claude/skills/fxlab
```

Then:

> Add tasteful motion to this landing. Match existing design. Don’t stack eight animations.

Agents should load:

- [INDEX.md](https://raw.githubusercontent.com/saime428/fxlab/main/INDEX.md) — what to pick  
- [TASTE.md](https://raw.githubusercontent.com/saime428/fxlab/main/TASTE.md) — defaults when the user is silent  
- [skills/fxlab/SKILL.md](skills/fxlab/SKILL.md) — workflow (greenfield vs retrofit)

## Repo layout

- `patterns/<category>/<name>/` — `README.md` + `demo.html`  
- `cases/` — site teardowns linked to patterns  
- `showcase/` — multi-pattern landing reference  
- `docs/templates/` — PR templates  
- `CONTRIBUTING.md` — how to add a pattern  

## License

[MIT](LICENSE)
