#!/usr/bin/env node
// Concatenates the modular src/ (engine/, data/, App.jsx) into a single flat
// ascent.jsx suitable for the Claude.ai artifact — which needs one file with
// no import/export statements between local modules. Run after any change
// to src/ and before copying to /mnt/user-data/outputs/ascent.jsx.
//
// Order matters: each module must appear before anything that uses it.
// Dependency order (least-dependent first): data -> engine (in the order
// below, since e.g. finance.js uses playerGen's marketValue helpers) -> the
// App.jsx shell last (it depends on everything else).
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MODULE_ORDER = [
  "src/data/rosters.js",
  "src/engine/constants.js",
  "src/engine/playerGen.js",
  "src/engine/worldBuild.js",
  "src/engine/matchSim.js",
  "src/engine/leagueSim.js",
  "src/engine/cups.js",
  "src/engine/finance.js",
  "src/engine/board.js",
];

function stripLocalImportsAndExports(text) {
  // Remove `import { ... } from "./relative/path";` lines (local modules
  // only — this codebase never imports an npm package from an engine/data
  // module, only from the App.jsx shell).
  let out = text.replace(/^import\s*\{[^}]*\}\s*from\s*["']\.[^"']*["'];?\s*$/gm, "");
  // Strip a leading `export ` from `export function` / `export const`.
  out = out.replace(/^export\s+(function|const)\s/gm, "$1 ");
  return out;
}

function stripAppShellImports(text) {
  // Remove import lines that pull from local engine/data modules (keep the
  // react / lucide-react npm imports as-is). Also strip the trailing
  // module-level `export { ... } from "./engine/..."` re-export block if
  // present (test-only, not needed in the artifact).
  let out = text.replace(/^import\s*\{[^}]*\}\s*from\s*["']\.\/(engine|data)\/[^"']*["'];?\s*$/gm, "");
  out = out.replace(/^export\s*\{[^}]*\}\s*from\s*["']\.\/(engine|data)\/[^"']*["'];?\s*$/gm, "");
  return out;
}

let combined = "";
for (const modPath of MODULE_ORDER) {
  const full = path.join(ROOT, modPath);
  const raw = fs.readFileSync(full, "utf8");
  combined += `/* ---- from ${modPath} ---- */\n` + stripLocalImportsAndExports(raw) + "\n\n";
}

const shellRaw = fs.readFileSync(path.join(ROOT, "src/App.jsx"), "utf8");
combined += `/* ---- from src/App.jsx ---- */\n` + stripAppShellImports(shellRaw);

const outPath = path.join(ROOT, "dist-artifact/ascent.jsx");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, combined);
console.log("Wrote", outPath, "(", combined.length, "bytes )");
