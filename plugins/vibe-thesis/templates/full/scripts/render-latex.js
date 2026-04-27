#!/usr/bin/env node
/**
 * render-latex.js — Pandoc converts mode-ordered body markdown +
 * BibTeX library + CSL style + tokens.tex preamble into a LaTeX source.
 *
 * Output: 08_OUTPUT/latex/thesis.tex (+ manifest sidecar)
 *
 * The .tex is journal-submission-ready; render-pdf.js compiles it via
 * LuaLaTeX (twice for citation resolution).
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { spawnSync } = require('child_process');
const { getMode, getBodyFiles } = require('./lib/thesis-mode');
const { writeManifest } = require('./lib/manifest');
const { ensurePandocInstalled, runPandoc } = require('./lib/pandoc-runner');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(REPO_ROOT, '08_OUTPUT', 'latex');
const COMPILED_DIR = path.join(REPO_ROOT, '00_DESIGN_SYSTEM', 'compiled');
const TOKENS_TEX = path.join(COMPILED_DIR, 'tokens.tex');
const TOKENS_YAML = path.join(REPO_ROOT, '00_DESIGN_SYSTEM', 'tokens.yaml');
const BIB_PATH = path.join(REPO_ROOT, '05_CITATIONS', 'references.bib');

function ensureTokensCompiled() {
  const COMPILE_TOKENS_SCRIPT = path.join(__dirname, 'compile-tokens.js');

  let needsRun = !fs.existsSync(TOKENS_TEX);
  let reason = 'missing';

  if (!needsRun) {
    // Compiled exists — check whether tokens.yaml or compile-tokens.js is newer.
    // Without this check, edits to tokens.yaml or compile-tokens.js silently no-op
    // because the cached tokens.tex satisfies the existence test alone.
    const compiledMtime = fs.statSync(TOKENS_TEX).mtimeMs;
    const yamlMtime = fs.existsSync(TOKENS_YAML) ? fs.statSync(TOKENS_YAML).mtimeMs : 0;
    const scriptMtime = fs.existsSync(COMPILE_TOKENS_SCRIPT) ? fs.statSync(COMPILE_TOKENS_SCRIPT).mtimeMs : 0;
    if (yamlMtime > compiledMtime || scriptMtime > compiledMtime) {
      needsRun = true;
      reason = 'stale';
    }
  }

  if (needsRun) {
    console.log(`render-latex: compiled tokens ${reason} — running compile-tokens first...`);
    const result = spawnSync('node', [COMPILE_TOKENS_SCRIPT], {
      cwd: REPO_ROOT,
      stdio: 'inherit',
    });
    if (result.status !== 0) {
      console.error('render-latex: compile-tokens failed.');
      process.exit(result.status || 1);
    }
  }
}

function readCslPath() {
  if (!fs.existsSync(TOKENS_YAML)) return null;
  const tokens = yaml.load(fs.readFileSync(TOKENS_YAML, 'utf8'));
  if (!tokens.citation || !tokens.citation.csl_path) return null;
  return path.join(REPO_ROOT, tokens.citation.csl_path);
}

function concatBody(bodyFiles) {
  let combined = '';
  for (const f of bodyFiles) {
    combined += fs.readFileSync(f.path, 'utf8');
    if (!combined.endsWith('\n')) combined += '\n';
    combined += '\n';
  }
  return combined;
}

function main() {
  ensurePandocInstalled();
  ensureTokensCompiled();

  const mode = getMode(REPO_ROOT);
  const bodyFiles = getBodyFiles(REPO_ROOT);
  if (bodyFiles.length === 0) {
    console.error('render-latex: no body files in 03_BODY/.');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const tmpMd = path.join(OUTPUT_DIR, '.thesis.tmp.md');
  fs.writeFileSync(tmpMd, concatBody(bodyFiles));

  const outPath = path.join(OUTPUT_DIR, 'thesis.tex');

  const args = [
    tmpMd,
    '-o', outPath,
    '-f', 'markdown',
    '-t', 'latex',
    '--standalone',
    `--include-in-header=${TOKENS_TEX}`,
  ];

  // Citation handling
  if (fs.existsSync(BIB_PATH)) {
    args.push('--citeproc');
    args.push(`--bibliography=${BIB_PATH}`);
    const csl = readCslPath();
    if (csl && fs.existsSync(csl)) {
      args.push(`--csl=${csl}`);
    } else if (csl) {
      console.warn(`render-latex: CSL file declared but not found: ${csl}`);
      console.warn(`  Citations will use Pandoc's default style.`);
      console.warn(`  See 05_CITATIONS/styles/README.md for download instructions.`);
    }
  }

  runPandoc(args, { cwd: REPO_ROOT });

  // Cleanup temp markdown
  try {
    fs.unlinkSync(tmpMd);
  } catch {
    // best-effort cleanup
  }

  writeManifest({
    repoRoot: REPO_ROOT,
    outputPath: outPath,
    thesisMode: mode,
    renderTarget: 'latex',
    sourceFiles: [
      ...bodyFiles.map((f) => f.path),
      BIB_PATH,
      TOKENS_TEX,
      TOKENS_YAML,
    ].filter((f) => fs.existsSync(f)),
  });

  console.log(`render-latex: wrote ${path.relative(REPO_ROOT, outPath).replace(/\\/g, '/')}`);
  console.log(`  mode: ${mode}, body files: ${bodyFiles.length}`);
}

main();
