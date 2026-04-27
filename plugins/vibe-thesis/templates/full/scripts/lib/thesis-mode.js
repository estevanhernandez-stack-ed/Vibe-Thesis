/**
 * thesis-mode.js — parse CLAUDE.md to extract THESIS_MODE and expose helpers.
 *
 * The mode flag controls which 03_BODY/ directory layout the render pipeline
 * uses and which top-level directories are considered "load-bearing" for
 * the active project. All directories coexist; the mode shifts emphasis.
 */

const fs = require('fs');
const path = require('path');

const VALID_MODES = ['dissertation', 'article', 'masters'];

/**
 * Parse THESIS_MODE from CLAUDE.md. Returns the mode string.
 * Throws if CLAUDE.md is missing or no valid mode is set.
 */
function getMode(repoRoot) {
  const claudeMdPath = path.join(repoRoot, 'CLAUDE.md');
  if (!fs.existsSync(claudeMdPath)) {
    throw new Error(`CLAUDE.md not found at ${claudeMdPath}`);
  }
  const content = fs.readFileSync(claudeMdPath, 'utf8');

  // Look for a YAML block with THESIS_MODE
  // Pattern: ```yaml\nTHESIS_MODE: <value>\n``` (with optional surrounding lines)
  const blockMatch = content.match(/```ya?ml\s*\n([\s\S]*?)\n```/);
  if (blockMatch) {
    const block = blockMatch[1];
    // Capture the rest of the line so bracketed placeholders like
    // "[dissertation | article | masters]" are recognized correctly.
    const modeLine = block.match(/^\s*THESIS_MODE\s*:\s*(.+)$/m);
    if (modeLine) {
      const raw = modeLine[1].trim();
      // Any value starting with '[' is treated as an unfilled template placeholder.
      if (raw.startsWith('[')) {
        throw new Error(
          `THESIS_MODE in CLAUDE.md is still a placeholder (${raw}). ` +
            `Run /bootstrap or set it manually to one of: ${VALID_MODES.join(', ')}.`
        );
      }
      if (!VALID_MODES.includes(raw)) {
        throw new Error(
          `THESIS_MODE in CLAUDE.md is "${raw}", expected one of: ${VALID_MODES.join(', ')}.`
        );
      }
      return raw;
    }
  }

  throw new Error(
    `No THESIS_MODE found in CLAUDE.md. Expected a YAML block containing ` +
      `"THESIS_MODE: <${VALID_MODES.join(' | ')}>".`
  );
}

/**
 * Return the set of directories considered "load-bearing" for a given mode.
 * All directories exist in every fork; this just informs the lead writer
 * (and the render pipeline) which to prioritize.
 */
function getActiveDirs(mode) {
  const shared = [
    '00_DESIGN_SYSTEM',
    '01_PLANNING',
    '02_RESEARCH',
    '03_BODY',
    '04_AGENT_SWARMS',
    '05_CITATIONS',
    '08_OUTPUT',
  ];
  const dissertation = [...shared, '06_REVIEW_RESPONSES', '07_APPENDICES'];
  const article = [...shared, '06_REVIEW_RESPONSES', '07_APPENDICES'];
  const masters = [...shared, '06_REVIEW_RESPONSES', '07_APPENDICES'];

  switch (mode) {
    case 'dissertation':
      return dissertation;
    case 'article':
      return article;
    case 'masters':
      return masters;
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}

/**
 * Discover ordered body files in 03_BODY/. Numeric prefix determines order;
 * filenames not matching the NN-name.md pattern are excluded from renders
 * (treated as scratch / drafts).
 */
function getBodyFiles(repoRoot) {
  const bodyDir = path.join(repoRoot, '03_BODY');
  if (!fs.existsSync(bodyDir)) return [];

  const entries = fs
    .readdirSync(bodyDir, { withFileTypes: true })
    .filter((e) => e.isFile() && /^\d+[-_].*\.md$/.test(e.name))
    .map((e) => ({
      name: e.name,
      path: path.join(bodyDir, e.name),
      order: parseInt(e.name.match(/^(\d+)/)[1], 10),
    }))
    .sort((a, b) => a.order - b.order);

  return entries;
}

module.exports = { getMode, getActiveDirs, getBodyFiles, VALID_MODES };
