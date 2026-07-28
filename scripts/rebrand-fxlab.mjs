import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const skipDirs = new Set([".git", "node_modules"]);

const textExt = new Set([
  ".md",
  ".html",
  ".js",
  ".mjs",
  ".css",
  ".json",
  ".yml",
  ".yaml",
  ".svg",
  ".txt",
  ".toml",
]);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".") && ent.name !== ".github" && ent.name !== ".claude" && ent.name !== ".nojekyll" && ent.name !== ".gitignore") {
      if (ent.name === ".git") continue;
    }
    if (skipDirs.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function transform(content) {
  let t = content;
  // URLs first (order matters)
  t = t.replaceAll("https://saime428.github.io/fxlab", "https://saime428.github.io/fxlab");
  t = t.replaceAll("https://github.com/saime428/fxlab", "https://github.com/saime428/fxlab");
  t = t.replaceAll("https://raw.githubusercontent.com/saime428/fxlab/", "https://raw.githubusercontent.com/saime428/fxlab/");
  t = t.replaceAll("saime428/fxlab", "saime428/fxlab");
  t = t.replaceAll("github.com/saime428/fxlab", "github.com/saime428/fxlab");
  // skill paths
  t = t.replaceAll("skills/fxlab", "skills/fxlab");
  t = t.replaceAll("~/.claude/skills/fxlab", "~/.claude/skills/fxlab");
  t = t.replaceAll(".claude/skills/fxlab", ".claude/skills/fxlab");
  t = t.replaceAll("degit saime428/fxlab/skills/fxlab", "degit saime428/fxlab/skills/fxlab");
  t = t.replaceAll("degit saime428/fxlab/skills/fxlab", "degit saime428/fxlab/skills/fxlab");
  // product name (word-ish boundaries via common patterns)
  t = t.replaceAll("fxlab", "fxlab");
  t = t.replaceAll("fx<em>lab</em>", "fx<em>lab</em>");
  t = t.replaceAll("fx<tspan", "fx<tspan");
  // skill frontmatter name
  t = t.replace(/^name:\s*fxlab\s*$/m, "name: fxlab");
  t = t.replace(/^name:\s*fxlab\s*$/m, "name: fxlab");
  // accidental double
  t = t.replaceAll("fxlab/skills/fxlab", "fxlab/skills/fxlab");
  return t;
}

const files = walk(root).filter((f) => textExt.has(path.extname(f).toLowerCase()) || path.basename(f) === "LICENSE");
let changed = 0;
for (const f of files) {
  const raw = fs.readFileSync(f, "utf8");
  const next = transform(raw);
  if (next !== raw) {
    fs.writeFileSync(f, next);
    changed++;
    console.log("updated", path.relative(root, f));
  }
}
console.log("files changed:", changed);
