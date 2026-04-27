/**
 * manifest.js — write per-render manifest sidecars for audit / reproducibility.
 *
 * Output schema validated against 00_DESIGN_SYSTEM/schemas/manifest.schema.json.
 *
 * Captures: render timestamp, git commit (and dirty flag), thesis mode,
 * design-system version, citation style, render target, tool versions,
 * SHA-256 hash per source file consumed by the render.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

function sha256(filePath) {
  const data = fs.readFileSync(filePath);
  return 'sha256:' + crypto.createHash('sha256').update(data).digest('hex');
}

function gitInfo(repoRoot) {
  try {
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const status = execFileSync('git', ['status', '--porcelain'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return { commit, dirty: status.length > 0 };
  } catch {
    // Not a git repo, or git not available — graceful fallback
    return { commit: 'uncommitted', dirty: true };
  }
}

function toolVersions(extras = {}) {
  const versions = { node: process.version.replace(/^v/, '') };
  // Capture pandoc + lualatex versions if available
  try {
    const pandoc = execFileSync('pandoc', ['--version'], { encoding: 'utf8' }).split('\n')[0];
    const m = pandoc.match(/pandoc\s+(\S+)/);
    if (m) versions.pandoc = m[1];
  } catch {
    // pandoc not available — render scripts will fail with their own clearer error
  }
  try {
    const lualatex = execFileSync('lualatex', ['--version'], { encoding: 'utf8' }).split('\n')[0];
    const m = lualatex.match(/Version\s+(\S+)/) || lualatex.match(/(\d+\.\d+\.\d+)/);
    if (m) versions.lualatex = m[1];
  } catch {
    // lualatex not available
  }
  return { ...versions, ...extras };
}

function readDesignSystemVersion(repoRoot) {
  try {
    const tokensPath = path.join(repoRoot, '00_DESIGN_SYSTEM', 'tokens.yaml');
    const yaml = require('js-yaml');
    const tokens = yaml.load(fs.readFileSync(tokensPath, 'utf8'));
    return tokens.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function readCitationStyle(repoRoot) {
  try {
    const tokensPath = path.join(repoRoot, '00_DESIGN_SYSTEM', 'tokens.yaml');
    const yaml = require('js-yaml');
    const tokens = yaml.load(fs.readFileSync(tokensPath, 'utf8'));
    return tokens.citation && tokens.citation.style ? tokens.citation.style : 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Write a manifest sidecar.
 *
 * @param {object} opts
 * @param {string} opts.repoRoot
 * @param {string} opts.outputPath - the rendered file's path; manifest written next to it as <outputPath>.manifest.json
 * @param {string} opts.thesisMode - dissertation | article | masters
 * @param {string} opts.renderTarget - pdf | latex | markdown
 * @param {string[]} opts.sourceFiles - absolute paths of source files consumed
 */
function writeManifest({ repoRoot, outputPath, thesisMode, renderTarget, sourceFiles }) {
  const git = gitInfo(repoRoot);
  const sourceHashes = {};
  for (const f of sourceFiles) {
    if (fs.existsSync(f)) {
      const rel = path.relative(repoRoot, f).replace(/\\/g, '/');
      sourceHashes[rel] = sha256(f);
    }
  }

  const manifest = {
    rendered_at: new Date().toISOString(),
    git_commit: git.commit,
    git_dirty: git.dirty,
    thesis_mode: thesisMode,
    design_system_version: readDesignSystemVersion(repoRoot),
    citation_style: readCitationStyle(repoRoot),
    render_target: renderTarget,
    tool_versions: toolVersions(),
    source_file_hashes: sourceHashes,
  };

  const manifestPath = outputPath + '.manifest.json';
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  return manifestPath;
}

module.exports = { writeManifest };
