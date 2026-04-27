#!/usr/bin/env node
/**
 * check-citations.js — verify every [@key] reference in 03_BODY/*.md exists
 * in 05_CITATIONS/references.bib.
 *
 * Reports missing keys with file + line number. Exits 0 on clean, non-zero
 * on any missing key.
 *
 * Used by:
 *   - npm run check:citations (manual)
 *   - .husky/pre-push (automated before push)
 *   - .github/workflows/ci.yml (automated on PR)
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const BODY_DIR = path.join(REPO_ROOT, '03_BODY');
const BIB_PATH = path.join(REPO_ROOT, '05_CITATIONS', 'references.bib');

if (!fs.existsSync(BIB_PATH)) {
  console.warn(`check-citations: ${BIB_PATH} not found - skipping (template state is fine).`);
  process.exit(0);
}

if (!fs.existsSync(BODY_DIR)) {
  console.warn(`check-citations: ${BODY_DIR} not found - skipping.`);
  process.exit(0);
}

// Parse references.bib for citation keys.
// Lightweight regex parse rather than depending on the full bibtex parser.
// Pattern matches @TYPE{key, which is the universal entry start.
function parseBibKeys(bibPath) {
  const bibContent = fs.readFileSync(bibPath, 'utf8');
  // Strip line comments (% to end of line) before key extraction
  const stripped = bibContent.replace(/^%.*$/gm, '');
  const keys = new Set();
  const entryPattern = /@\w+\s*\{\s*([^,\s]+)/g;
  for (const match of stripped.matchAll(entryPattern)) {
    keys.add(match[1]);
  }
  return keys;
}

// Walk body markdown files
function findBodyFiles(bodyDir) {
  const files = [];
  function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if (e.name.endsWith('.md')) {
        files.push(full);
      }
    }
  }
  walk(bodyDir);
  return files;
}

// Extract [@key] and [@key1; @key2] patterns from a markdown body.
// Pandoc citation syntax: @ followed by alphanumeric / dash / underscore / colon, optionally with locator.
// Only inside [ ] brackets to avoid matching email addresses or @-handles.
//
// Skips pandoc-crossref reference prefixes (sec:, fig:, tbl:, eq:, lst:) which look
// identical to citations but reference document-internal labels, not bib keys.
const CROSSREF_PREFIXES = ['sec:', 'fig:', 'tbl:', 'eq:', 'lst:'];

function isCrossRef(key) {
  return CROSSREF_PREFIXES.some((p) => key.startsWith(p));
}

function extractCitationKeys(content) {
  const found = []; // [{ key, line }]
  const lines = content.split('\n');
  const bracketPattern = /\[([^\]]+)\]/g;
  const keyPattern = /@([A-Za-z][A-Za-z0-9_:\-./]*)/g;
  for (let i = 0; i < lines.length; i++) {
    for (const bm of lines[i].matchAll(bracketPattern)) {
      const inner = bm[1];
      if (!inner.includes('@')) continue;
      for (const km of inner.matchAll(keyPattern)) {
        if (isCrossRef(km[1])) continue;
        found.push({ key: km[1], line: i + 1 });
      }
    }
  }
  return found;
}

const bibKeys = parseBibKeys(BIB_PATH);
const bodyFiles = findBodyFiles(BODY_DIR);

let totalRefs = 0;
const missing = []; // [{ file, line, key }]

for (const file of bodyFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const refs = extractCitationKeys(content);
  totalRefs += refs.length;
  for (const r of refs) {
    if (!bibKeys.has(r.key)) {
      missing.push({
        file: path.relative(REPO_ROOT, file).replace(/\\/g, '/'),
        line: r.line,
        key: r.key,
      });
    }
  }
}

console.log(
  `check-citations: scanned ${bodyFiles.length} body file(s), ${totalRefs} citation(s), ${bibKeys.size} bib key(s) defined.`
);

if (missing.length === 0) {
  console.log('check-citations: clean.');
  process.exit(0);
}

console.error(`\ncheck-citations: ${missing.length} missing citation key(s):`);
for (const m of missing) {
  console.error(`  ${m.file}:${m.line}  [@${m.key}]`);
}
console.error(
  `\nDefine the missing keys in ${path.relative(REPO_ROOT, BIB_PATH).replace(/\\/g, '/')}, or remove the references.`
);
process.exit(1);
