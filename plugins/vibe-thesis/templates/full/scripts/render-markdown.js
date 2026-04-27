#!/usr/bin/env node
/**
 * render-markdown.js — concatenate 03_BODY/*.md (mode-aware ordering) into
 * a single 08_OUTPUT/markdown/thesis.md.
 *
 * The simplest output target — no Pandoc required. Citations remain as
 * [@authorYear] (no resolution); bibliography appended as a list at end.
 *
 * Use this for: working-draft archive, version control diffs, sharing source
 * with collaborators who don't run the full toolchain.
 */

const fs = require('fs');
const path = require('path');
const { getMode, getBodyFiles } = require('./lib/thesis-mode');
const { writeManifest } = require('./lib/manifest');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(REPO_ROOT, '08_OUTPUT', 'markdown');
const APPENDICES_DIR = path.join(REPO_ROOT, '07_APPENDICES');
const BIB_PATH = path.join(REPO_ROOT, '05_CITATIONS', 'references.bib');

function readBibAsList(bibPath) {
  if (!fs.existsSync(bibPath)) return '';
  const content = fs.readFileSync(bibPath, 'utf8');
  // Strip line comments
  const stripped = content.replace(/^%.*$/gm, '');
  const entries = [];
  // Match @TYPE{key, ... } blocks (basic — sufficient for human-readable list)
  const entryStart = /@(\w+)\s*\{\s*([^,\s]+)\s*,/g;
  for (const match of stripped.matchAll(entryStart)) {
    entries.push({ type: match[1], key: match[2] });
  }
  if (entries.length === 0) return '';
  const lines = ['', '## References', ''];
  for (const e of entries) {
    lines.push(`- [@${e.key}] (entry type: ${e.type})`);
  }
  return lines.join('\n') + '\n';
}

function findAppendices(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && /^[A-Z][-_].*\.md$/.test(e.name))
    .map((e) => path.join(dir, e.name))
    .sort();
}

function main() {
  const mode = getMode(REPO_ROOT);
  const bodyFiles = getBodyFiles(REPO_ROOT);

  if (bodyFiles.length === 0) {
    console.error('render-markdown: no body files found in 03_BODY/. Add at least one numbered .md file.');
    process.exit(1);
  }

  const sourceFiles = [...bodyFiles.map((f) => f.path)];

  let output = '';
  for (const f of bodyFiles) {
    output += fs.readFileSync(f.path, 'utf8');
    if (!output.endsWith('\n')) output += '\n';
    output += '\n';
  }

  // Append bibliography reference list (unresolved — markdown output doesn't run citeproc)
  output += readBibAsList(BIB_PATH);
  if (fs.existsSync(BIB_PATH)) sourceFiles.push(BIB_PATH);

  // Append appendices
  const appendices = findAppendices(APPENDICES_DIR);
  if (appendices.length > 0) {
    output += '\n## Appendices\n\n';
    for (const a of appendices) {
      const letter = path.basename(a).match(/^([A-Z])/)[1];
      output += `### Appendix ${letter}\n\n`;
      output += fs.readFileSync(a, 'utf8');
      if (!output.endsWith('\n')) output += '\n';
      output += '\n';
      sourceFiles.push(a);
    }
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outPath = path.join(OUTPUT_DIR, 'thesis.md');
  fs.writeFileSync(outPath, output);

  writeManifest({
    repoRoot: REPO_ROOT,
    outputPath: outPath,
    thesisMode: mode,
    renderTarget: 'markdown',
    sourceFiles,
  });

  console.log(`render-markdown: wrote ${path.relative(REPO_ROOT, outPath).replace(/\\/g, '/')}`);
  console.log(`  mode: ${mode}, body files: ${bodyFiles.length}, appendices: ${appendices.length}`);
}

main();
