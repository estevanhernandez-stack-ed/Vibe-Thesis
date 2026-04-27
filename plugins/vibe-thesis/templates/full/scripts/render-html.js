#!/usr/bin/env node
/**
 * render-html.js — produces a styled HTML preview of the thesis using Pandoc
 * + the editorial CSS layer. Output: 08_OUTPUT/html/{thesis,article}.html.
 *
 * Pipeline:
 *   1. Ensure compiled tokens are up to date (warn if missing).
 *   2. Discover body files via thesis-mode helpers.
 *   3. Concat body files into a temporary combined.md.
 *   4. Copy editorial CSS files into the output dir so the HTML references
 *      them relatively (no absolute paths leaking into the published artifact).
 *   5. Run Pandoc with the editorial template + citeproc + bibliography.
 *   6. Write manifest sidecar.
 *
 * Phase 2 of the editorial design integration. Phase 3 (LaTeX/PDF preamble
 * translation) is separate.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { getMode, getBodyFiles } = require('./lib/thesis-mode');
const { writeManifest } = require('./lib/manifest');
const { ensurePandocInstalled, runPandoc } = require('./lib/pandoc-runner');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(REPO_ROOT, '08_OUTPUT', 'html');
const COMPILED_DIR = path.join(REPO_ROOT, '00_DESIGN_SYSTEM', 'compiled');
const BRAND_CSS = path.join(REPO_ROOT, '00_DESIGN_SYSTEM', 'brand', 'colors.css');
const EDITORIAL_CSS = path.join(REPO_ROOT, '00_DESIGN_SYSTEM', 'editorial', 'editorial.css');
const TOKENS_CSS = path.join(COMPILED_DIR, 'tokens.css');
const TEMPLATE = path.join(REPO_ROOT, '00_DESIGN_SYSTEM', 'editorial', 'template.html');
const BIB_PATH = path.join(REPO_ROOT, '05_CITATIONS', 'references.bib');
const TOKENS_YAML = path.join(REPO_ROOT, '00_DESIGN_SYSTEM', 'tokens.yaml');

function loadTokens() {
  if (!fs.existsSync(TOKENS_YAML)) {
    console.error(`render-html: tokens.yaml not found at ${TOKENS_YAML}`);
    process.exit(1);
  }
  return yaml.load(fs.readFileSync(TOKENS_YAML, 'utf8'));
}

function ensureCompiledTokens() {
  if (!fs.existsSync(TOKENS_CSS)) {
    console.warn('render-html: compiled/tokens.css not found — run `npm run compile:tokens` first.');
    console.warn('  Continuing without compiled tokens; brand + editorial CSS will still load.');
  }
}

function copyAssets(cssLinks) {
  // Copy CSS files into output dir so the published HTML references them
  // relatively — no absolute paths in the artifact.
  const assets = [
    { src: TOKENS_CSS, name: 'tokens.css' },
    { src: BRAND_CSS, name: 'colors.css' },
    { src: EDITORIAL_CSS, name: 'editorial.css' },
  ];
  for (const a of assets) {
    if (fs.existsSync(a.src)) {
      fs.copyFileSync(a.src, path.join(OUTPUT_DIR, a.name));
      cssLinks.push(a.name);
    }
  }
}

function buildPandocArgs({ mode, tokens, tempMd, outPath, cssLinks }) {
  const cslPath = path.join(REPO_ROOT, tokens.citation.csl_path);
  const args = [
    '--from=markdown+smart+yaml_metadata_block',
    '--to=html5',
    '--standalone',
    '--mathjax',
    `--template=${TEMPLATE}`,
    `--metadata=thesis-mode:${mode}`,
  ];

  // Citations only if bib + CSL both present
  if (fs.existsSync(BIB_PATH) && fs.existsSync(cslPath)) {
    args.push('--citeproc', `--bibliography=${BIB_PATH}`, `--csl=${cslPath}`);
    if (tokens.citation.bibliography_title) {
      args.push(`--metadata=reference-section-title:${tokens.citation.bibliography_title}`);
    }
  } else if (!fs.existsSync(BIB_PATH)) {
    console.warn(`render-html: bibliography not found at ${BIB_PATH} — skipping citation processing.`);
  } else {
    console.warn(`render-html: CSL file not found at ${cslPath} — skipping citation processing.`);
  }

  for (const css of cssLinks) {
    args.push(`--css=${css}`);
  }

  args.push(`--output=${outPath}`, tempMd);
  return args;
}

function main() {
  ensurePandocInstalled();
  ensureCompiledTokens();

  const mode = getMode(REPO_ROOT);
  const tokens = loadTokens();
  const bodyFiles = getBodyFiles(REPO_ROOT);
  if (bodyFiles.length === 0) {
    console.error('render-html: no body files found in 03_BODY/. Add at least one numbered .md file.');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Concat body files for Pandoc — frontmatter from the first numbered file (if
  // present) carries the metadata; subsequent files contribute body content only.
  let combined = '';
  for (const f of bodyFiles) {
    combined += fs.readFileSync(f.path, 'utf8');
    if (!combined.endsWith('\n')) combined += '\n';
    combined += '\n';
  }

  const tempMd = path.join(OUTPUT_DIR, '_combined.md');
  fs.writeFileSync(tempMd, combined);

  const cssLinks = [];
  copyAssets(cssLinks);

  const outName = mode === 'article' ? 'article.html' : 'thesis.html';
  const outPath = path.join(OUTPUT_DIR, outName);

  const args = buildPandocArgs({ mode, tokens, tempMd, outPath, cssLinks });
  console.log('render-html: running Pandoc...');
  runPandoc(args, { cwd: REPO_ROOT });

  // Clean up the temp md — the manifest captures source files separately
  fs.unlinkSync(tempMd);

  writeManifest({
    repoRoot: REPO_ROOT,
    outputPath: outPath,
    thesisMode: mode,
    renderTarget: 'html',
    sourceFiles: [
      ...bodyFiles.map((f) => f.path),
      BIB_PATH,
      TOKENS_YAML,
      EDITORIAL_CSS,
      BRAND_CSS,
      TEMPLATE,
    ].filter((f) => fs.existsSync(f)),
  });

  console.log(`render-html: wrote ${path.relative(REPO_ROOT, outPath).replace(/\\/g, '/')}`);
  console.log(`  mode: ${mode}, body files: ${bodyFiles.length}, stylesheets: ${cssLinks.length}`);
}

main();
