#!/usr/bin/env node
/**
 * validate-schemas.js — discovers schema-typed files across the repo and
 * validates each against its JSON Schema. Exits 0 on clean, non-zero on any
 * failure with file + JSON Path + message reported.
 *
 * Discovers:
 *   - 00_DESIGN_SYSTEM/tokens.yaml                  → tokens.schema.json
 *   - 04_AGENT_SWARMS/swarm-plan*.md (frontmatter)  → swarm-plan.schema.json
 *   - 08_OUTPUT/ ** /*.manifest.json                → manifest.schema.json
 *   - examples/ ** /swarm-plan*.md                  → swarm-plan.schema.json
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const REPO_ROOT = path.resolve(__dirname, '..');
const SCHEMA_DIR = path.join(REPO_ROOT, '00_DESIGN_SYSTEM', 'schemas');

const ajv = new Ajv({ allErrors: true, strict: false, allowUnionTypes: true });
addFormats(ajv);

function loadSchema(name) {
  const schemaPath = path.join(SCHEMA_DIR, `${name}.schema.json`);
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema not found: ${schemaPath}`);
  }
  return JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
}

function walk(dir, predicate, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, predicate, results);
    } else if (predicate(full)) {
      results.push(full);
    }
  }
  return results;
}

function relativize(absPath) {
  return path.relative(REPO_ROOT, absPath).replace(/\\/g, '/');
}

const failures = [];

function record(file, errors) {
  for (const err of errors) {
    failures.push({
      file: relativize(file),
      jsonPath: err.instancePath || '/',
      message: err.message,
      params: err.params,
    });
  }
}

function validateOne(file, schema, data) {
  const validate = ajv.compile(schema);
  const ok = validate(data);
  if (!ok) record(file, validate.errors);
}

// 1. tokens.yaml
{
  const tokensPath = path.join(REPO_ROOT, '00_DESIGN_SYSTEM', 'tokens.yaml');
  if (fs.existsSync(tokensPath)) {
    try {
      const data = yaml.load(fs.readFileSync(tokensPath, 'utf8'));
      validateOne(tokensPath, loadSchema('tokens'), data);
    } catch (e) {
      failures.push({ file: relativize(tokensPath), jsonPath: '/', message: `YAML parse error: ${e.message}` });
    }
  }
}

// 2. swarm plans (have YAML frontmatter)
{
  const schema = loadSchema('swarm-plan');
  const candidates = [
    ...walk(path.join(REPO_ROOT, '04_AGENT_SWARMS'), (f) => /swarm-plan.*\.md$/i.test(f) && !/template/i.test(f)),
    ...walk(path.join(REPO_ROOT, 'examples'), (f) => /swarm-plan.*\.md$/i.test(f) && !/template/i.test(f)),
  ];
  for (const file of candidates) {
    try {
      const parsed = matter(fs.readFileSync(file, 'utf8'));
      if (parsed.data && Object.keys(parsed.data).length > 0) {
        validateOne(file, schema, parsed.data);
      }
    } catch (e) {
      failures.push({ file: relativize(file), jsonPath: '/', message: `Frontmatter parse error: ${e.message}` });
    }
  }
}

// 3. render manifests (PDF / LaTeX / markdown / HTML render outputs)
//    + lay-translator manifests (08_OUTPUT/layman/*.manifest.json)
//
// Render manifests use manifest.schema.json. Lay-translator manifests use
// lay-manifest.schema.json (different fields: skill_version, source_article,
// references_bib_hash, section_grouping_map, verbatim_phrases_preserved,
// translator_flags). The two schemas are validated separately in the same
// pass, dispatched on path.
{
  const renderSchema = loadSchema('manifest');
  const laySchema = loadSchema('lay-manifest');
  const isLayManifest = (f) => /[\\/]08_OUTPUT[\\/]layman[\\/]/.test(f);
  const manifests = walk(path.join(REPO_ROOT, '08_OUTPUT'), (f) => /\.manifest\.json$/.test(f))
    .concat(walk(path.join(REPO_ROOT, 'examples'), (f) => /\.manifest\.json$/.test(f)));
  for (const file of manifests) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      const targetSchema = isLayManifest(file) ? laySchema : renderSchema;
      validateOne(file, targetSchema, data);
    } catch (e) {
      failures.push({ file: relativize(file), jsonPath: '/', message: `JSON parse error: ${e.message}` });
    }
  }
}

if (failures.length === 0) {
  console.log('Schema validation: clean.');
  process.exit(0);
}

console.error(`Schema validation: ${failures.length} failure(s).\n`);
for (const f of failures) {
  console.error(`  ${f.file}${f.jsonPath !== '/' ? ` ${f.jsonPath}` : ''}`);
  console.error(`    ${f.message}`);
  if (f.params && Object.keys(f.params).length > 0) {
    console.error(`    (${JSON.stringify(f.params)})`);
  }
}
process.exit(1);
