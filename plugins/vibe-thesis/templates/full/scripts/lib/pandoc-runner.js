/**
 * pandoc-runner.js — safe wrapper around the Pandoc CLI.
 *
 * Uses execFile/spawnSync with explicit argument arrays — never exec with
 * string concatenation. Surfaces Pandoc stderr cleanly on failure (no
 * swallowed errors). Validates Pandoc presence with a clear install hint
 * when missing.
 */

const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');

function ensurePandocInstalled() {
  try {
    execFileSync('pandoc', ['--version'], { stdio: 'pipe' });
  } catch (e) {
    console.error('pandoc-runner: Pandoc not found in PATH.');
    console.error('  Install Pandoc 3.x: https://pandoc.org/installing.html');
    console.error('  Or use the included devcontainer (see .devcontainer/README.md)');
    process.exit(127);
  }
}

function ensureLuaLatexInstalled() {
  try {
    execFileSync('lualatex', ['--version'], { stdio: 'pipe' });
  } catch (e) {
    console.error('pandoc-runner: LuaLaTeX not found in PATH.');
    console.error('  Install TeX Live with LuaLaTeX: https://www.tug.org/texlive/');
    console.error('  Or use the included devcontainer (Pandoc + LuaLaTeX bundled)');
    process.exit(127);
  }
}

/**
 * Run Pandoc with the given args. Inputs and outputs are file paths; do not
 * interpolate user content into the args array — pass it as files instead.
 *
 * @param {string[]} args - Pandoc CLI args (each element a separate token)
 * @param {object} opts
 * @param {string} opts.cwd - working directory
 * @returns {{ stdout: string, stderr: string }}
 */
function runPandoc(args, opts = {}) {
  const result = spawnSync('pandoc', args, {
    cwd: opts.cwd || process.cwd(),
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 50 * 1024 * 1024, // 50MB for large theses
  });

  if (result.error) {
    console.error(`pandoc-runner: Pandoc invocation failed: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`pandoc-runner: Pandoc exited with code ${result.status}`);
    if (result.stderr) {
      console.error('--- Pandoc stderr ---');
      console.error(result.stderr);
      console.error('---------------------');
    }
    process.exit(result.status || 1);
  }

  return { stdout: result.stdout || '', stderr: result.stderr || '' };
}

/**
 * Run LuaLaTeX on a .tex file. Runs twice for citation/cross-reference
 * resolution; some thesis classes need three passes — call repeatedly if
 * undefined-reference warnings persist.
 *
 * @param {string} texPath - absolute path to the .tex file
 * @param {string} outputDir - directory for build artifacts
 * @returns {{ logs: string }}
 */
function runLuaLatex(texPath, outputDir) {
  const args = [
    '-interaction=nonstopmode',
    '-halt-on-error',
    `-output-directory=${outputDir}`,
    texPath,
  ];

  // First pass
  const first = spawnSync('lualatex', args, {
    cwd: outputDir,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 100 * 1024 * 1024,
  });

  if (first.status !== 0) {
    console.error('pandoc-runner: LuaLaTeX first pass failed.');
    if (first.stdout) {
      // Show last 50 lines (errors are usually near the end)
      const lines = first.stdout.split('\n');
      console.error(lines.slice(-50).join('\n'));
    }
    process.exit(first.status || 1);
  }

  // Second pass for citations / cross-refs
  const second = spawnSync('lualatex', args, {
    cwd: outputDir,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 100 * 1024 * 1024,
  });

  if (second.status !== 0) {
    console.error('pandoc-runner: LuaLaTeX second pass failed.');
    if (second.stdout) {
      const lines = second.stdout.split('\n');
      console.error(lines.slice(-50).join('\n'));
    }
    process.exit(second.status || 1);
  }

  return { logs: second.stdout || '' };
}

module.exports = {
  ensurePandocInstalled,
  ensureLuaLatexInstalled,
  runPandoc,
  runLuaLatex,
};
