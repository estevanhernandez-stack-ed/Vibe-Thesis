#!/usr/bin/env node
/**
 * render-pdf.js — produces 08_OUTPUT/pdf/thesis.pdf.
 *
 * Pipeline:
 *   1. Ensure compiled tokens + LaTeX render are up to date.
 *   2. Run render-latex.js to produce 08_OUTPUT/latex/thesis.tex.
 *   3. Run LuaLaTeX twice on the .tex (second pass resolves citations + cross-refs).
 *   4. Move the resulting PDF into 08_OUTPUT/pdf/.
 *   5. Write manifest sidecar.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { getMode, getBodyFiles } = require('./lib/thesis-mode');
const { writeManifest } = require('./lib/manifest');
const { ensureLuaLatexInstalled, runLuaLatex } = require('./lib/pandoc-runner');

const REPO_ROOT = path.resolve(__dirname, '..');
const LATEX_DIR = path.join(REPO_ROOT, '08_OUTPUT', 'latex');
const PDF_DIR = path.join(REPO_ROOT, '08_OUTPUT', 'pdf');
const TOKENS_YAML = path.join(REPO_ROOT, '00_DESIGN_SYSTEM', 'tokens.yaml');
const BIB_PATH = path.join(REPO_ROOT, '05_CITATIONS', 'references.bib');

function runLatexRender() {
  console.log('render-pdf: running render-latex first...');
  const result = spawnSync('node', [path.join(__dirname, 'render-latex.js')], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    console.error('render-pdf: render-latex failed; cannot proceed to PDF.');
    process.exit(result.status || 1);
  }
}

function main() {
  ensureLuaLatexInstalled();
  runLatexRender();

  const texPath = path.join(LATEX_DIR, 'thesis.tex');
  if (!fs.existsSync(texPath)) {
    console.error(`render-pdf: expected ${texPath} after render-latex; not found.`);
    process.exit(1);
  }

  fs.mkdirSync(PDF_DIR, { recursive: true });

  // Run LuaLaTeX in the latex dir (so aux/log files stay there)
  console.log('render-pdf: running LuaLaTeX (two passes for citation resolution)...');
  runLuaLatex(texPath, LATEX_DIR);

  // Move the resulting PDF into 08_OUTPUT/pdf/
  const generatedPdf = path.join(LATEX_DIR, 'thesis.pdf');
  if (!fs.existsSync(generatedPdf)) {
    console.error(`render-pdf: LuaLaTeX did not produce ${generatedPdf}.`);
    process.exit(1);
  }
  const finalPdf = path.join(PDF_DIR, 'thesis.pdf');
  fs.copyFileSync(generatedPdf, finalPdf);

  const mode = getMode(REPO_ROOT);
  const bodyFiles = getBodyFiles(REPO_ROOT);
  writeManifest({
    repoRoot: REPO_ROOT,
    outputPath: finalPdf,
    thesisMode: mode,
    renderTarget: 'pdf',
    sourceFiles: [...bodyFiles.map((f) => f.path), BIB_PATH, TOKENS_YAML].filter((f) =>
      fs.existsSync(f)
    ),
  });

  console.log(`render-pdf: wrote ${path.relative(REPO_ROOT, finalPdf).replace(/\\/g, '/')}`);
  console.log(`  mode: ${mode}, body files: ${bodyFiles.length}`);
}

main();
