#!/usr/bin/env node
/**
 * export-portable.js — produce a markdown-only zip archive of the thesis source.
 *
 * The escape hatch from the toolchain. A user can leave ThesisStudio at any time
 * with their work intact: all body markdown, the BibTeX library, the design tokens,
 * and a README explaining the structure.
 *
 * Output: dist/portable/<thesis-name>.zip
 *
 * Does NOT include compiled outputs (PDF/LaTeX) — those are derivative.
 * Does NOT include node_modules, .git, .devcontainer, or other infra.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(REPO_ROOT, 'dist', 'portable');

// Determine archive name from package.json or fallback
function archiveName() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
    return (pkg.name || 'thesis-studio').replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  } catch {
    return 'thesis-studio';
  }
}

// Source paths to include (relative to repo root)
const INCLUDE_PATHS = [
  '01_PLANNING',
  '02_RESEARCH',
  '03_BODY',
  '04_AGENT_SWARMS',
  '05_CITATIONS',
  '06_REVIEW_RESPONSES',
  '07_APPENDICES',
  '00_DESIGN_SYSTEM/tokens.yaml',
  'CLAUDE.md',
  'README.md',
];

// Skip patterns (within included paths)
const SKIP_PATTERNS = [
  /node_modules/,
  /\.git\//,
  /compiled\//,
  /08_OUTPUT/,
  /\.gitkeep$/,
];

function walk(absPath, results = []) {
  if (!fs.existsSync(absPath)) return results;
  const stat = fs.statSync(absPath);
  if (stat.isFile()) {
    results.push(absPath);
    return results;
  }
  for (const entry of fs.readdirSync(absPath, { withFileTypes: true })) {
    const full = path.join(absPath, entry.name);
    if (SKIP_PATTERNS.some((re) => re.test(full))) continue;
    if (entry.isDirectory()) {
      walk(full, results);
    } else {
      results.push(full);
    }
  }
  return results;
}

function buildPortableReadme(name) {
  return `# ${name} — Portable Export

This is a markdown-only archive of your thesis. The toolchain (Pandoc, LuaLaTeX,
Node scripts, design system compilers) is NOT included — only the source content.

## What's here

| Path | Contents |
| --- | --- |
| 01_PLANNING/ | Proposal, outline, claims map |
| 02_RESEARCH/ | Research notes organized by axis |
| 03_BODY/ | The main writing — chapters or sections |
| 04_AGENT_SWARMS/ | Swarm playbooks (informational only — they require ThesisStudio to dispatch) |
| 05_CITATIONS/ | references.bib + CSL style files |
| 06_REVIEW_RESPONSES/ | Peer review tracking |
| 07_APPENDICES/ | Supplementary materials |
| 00_DESIGN_SYSTEM/tokens.yaml | Your visual design tokens (informational; toolchain needed to render) |
| CLAUDE.md | Persona pillars + technical conventions |
| README.md | Original ThesisStudio README |

## What's NOT here

- Generated outputs (PDFs, LaTeX) — derivative, can be re-rendered from source
- node_modules, .git, build infrastructure
- The render scripts themselves

## Re-importing

To go back to a full ThesisStudio workflow with this content:

1. Fork [ThesisStudio](https://github.com/estevanhernandez-stack-ed/ThesisStudio) fresh.
2. Copy these files into the matching paths in your fork.
3. \`npm install\` and continue from there.
`;
}

function main() {
  const name = archiveName();
  const stagingDir = path.join(OUT_DIR, name);
  const zipPath = path.join(OUT_DIR, `${name}.zip`);

  // Clean staging
  if (fs.existsSync(stagingDir)) fs.rmSync(stagingDir, { recursive: true, force: true });
  fs.mkdirSync(stagingDir, { recursive: true });

  let fileCount = 0;
  for (const inc of INCLUDE_PATHS) {
    const src = path.join(REPO_ROOT, inc);
    if (!fs.existsSync(src)) continue;
    const files = walk(src);
    for (const file of files) {
      const rel = path.relative(REPO_ROOT, file);
      const dst = path.join(stagingDir, rel);
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(file, dst);
      fileCount += 1;
    }
  }

  // Add the portable README
  fs.writeFileSync(path.join(stagingDir, 'PORTABLE_README.md'), buildPortableReadme(name));

  // Zip it (use system zip tool via execFileSync — argument array is safe)
  if (fs.existsSync(zipPath)) fs.rmSync(zipPath);
  try {
    // Try the zip command (Linux/Mac/devcontainer). On Windows users can substitute.
    execFileSync('zip', ['-r', `${name}.zip`, name], { cwd: OUT_DIR, stdio: 'inherit' });
  } catch (e) {
    console.error('zip command failed. On Windows, install Git Bash or WSL, or use 7-Zip manually.');
    console.error(`Staging directory ready at: ${stagingDir}`);
    console.error(`Zip it manually if your platform lacks the zip CLI.`);
    process.exit(1);
  }

  // Cleanup staging
  fs.rmSync(stagingDir, { recursive: true, force: true });

  console.log(`export-portable: wrote ${zipPath}`);
  console.log(`  ${fileCount} source file(s) packaged`);
}

main();
