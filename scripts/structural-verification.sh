#!/usr/bin/env bash
# structural-verification.sh
#
# Runs the structural verification beat for Vibe Thesis v0.1 — the load-bearing
# acceptance test for the cycle's single non-negotiable criterion:
#
#   "Install plugin into fresh directory, say 'scaffold a vibe thesis project for me,'
#    round-trips through `npm run render:pdf` with no manual fixups."
#
# This script does the parts a shell can do — it does NOT do the parts that
# require user-runtime invocation inside Claude Code (the slash commands
# `/plugin marketplace add`, `/plugin install`, and the natural-language
# orchestrator invocation are not callable from bash). Those steps are flagged
# with `# OWED TO NEXT-BUILDER-ACTION` markers; run them in a fresh Claude Code
# session.
#
# Usage:
#   bash scripts/structural-verification.sh
#
# Prerequisites:
#   - Plugin repo cloned and installed locally (or pushed to its GitHub remote)
#   - `gh` CLI available + authenticated (for Path B test)
#   - A working dev container OR native install of pandoc + texlive + biber + node
#
# Exit codes:
#   0 — all automated checks passed; remaining checks are owed to next-builder-action
#   1 — automated check failed; cycle is not done

set -e

PLUGIN_REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP_DIR="${TMPDIR:-c:/tmp}/vibe-thesis-verify-$(date +%s)"
PATH_A_DIR="$TMP_DIR/pathA"
PATH_B_DIR="$TMP_DIR/pathB"

echo "=== Vibe Thesis structural verification beat ==="
echo "Plugin repo: $PLUGIN_REPO_ROOT"
echo "Temp test dir: $TMP_DIR"
echo ""

mkdir -p "$PATH_A_DIR" "$PATH_B_DIR"

echo "--- 1. Plugin manifest sanity check ---"
node -e "JSON.parse(require('fs').readFileSync('$PLUGIN_REPO_ROOT/.claude-plugin/marketplace.json'))" \
  && echo "  ✓ marketplace.json parses as valid JSON"
node -e "JSON.parse(require('fs').readFileSync('$PLUGIN_REPO_ROOT/plugins/vibe-thesis/.claude-plugin/plugin.json'))" \
  && echo "  ✓ plugin.json parses as valid JSON"

echo ""
echo "--- 2. Templates payload integrity ---"
FULL_COUNT=$(find "$PLUGIN_REPO_ROOT/plugins/vibe-thesis/templates/full" -type f | wc -l)
OVERLAY_COUNT=$(find "$PLUGIN_REPO_ROOT/plugins/vibe-thesis/templates/overlay" -type f | wc -l)
echo "  templates/full/ file count: $FULL_COUNT (expected ~103)"
echo "  templates/overlay/ file count: $OVERLAY_COUNT (expected 2: .gitattributes + inject-marker.sh)"
test "$FULL_COUNT" -ge 100 || { echo "  ✗ templates/full/ has too few files"; exit 1; }
test "$OVERLAY_COUNT" -eq 2 || { echo "  ✗ templates/overlay/ has wrong file count"; exit 1; }
grep -q "VIBE_THESIS_MARKER" "$PLUGIN_REPO_ROOT/plugins/vibe-thesis/templates/full/CLAUDE.md" \
  && echo "  ✓ templates/full/CLAUDE.md has VIBE_THESIS_MARKER stanza"
test -f "$PLUGIN_REPO_ROOT/plugins/vibe-thesis/templates/full/.gitattributes" \
  && echo "  ✓ templates/full/.gitattributes present"
echo ""

echo "--- 3. Overlay invariant ---"
bash "$PLUGIN_REPO_ROOT/scripts/check-overlay-invariant.sh"
echo ""

echo "--- 4. Sub-skills present (lifted from ThesisStudio into templates/full/.claude/skills/) ---"
for SKILL in bootstrap merge-authors lay-translator research-integrate; do
  test -f "$PLUGIN_REPO_ROOT/plugins/vibe-thesis/templates/full/.claude/skills/$SKILL/SKILL.md" \
    && echo "  ✓ $SKILL/SKILL.md present"
done
echo ""

echo "--- 5. Plugin-side skills present ---"
for SKILL in vibe-thesis vibe-render vibe-status voice-synthesis synthesis-guard; do
  test -f "$PLUGIN_REPO_ROOT/plugins/vibe-thesis/skills/$SKILL/SKILL.md" \
    && echo "  ✓ skills/$SKILL/SKILL.md present"
done
echo ""

echo "--- 6. Slash command stubs present ---"
for CMD in vibe-render vibe-status voice guard; do
  test -f "$PLUGIN_REPO_ROOT/plugins/vibe-thesis/commands/$CMD.md" \
    && echo "  ✓ commands/$CMD.md present"
done
echo ""

echo "--- 7. Demo article complete ---"
DEMO="$PLUGIN_REPO_ROOT/plugins/vibe-thesis/examples/demo-article"
for F in 01_PLANNING/proposal.md 01_PLANNING/outline.md 01_PLANNING/claims-map.md \
         03_BODY/01-introduction.md 03_BODY/02-methods.md 03_BODY/03-conclusion.md \
         05_CITATIONS/references.bib README.md; do
  test -f "$DEMO/$F" && echo "  ✓ $F present"
done
BIB_COUNT=$(grep -c "^@" "$DEMO/05_CITATIONS/references.bib")
echo "  bibtex entry count: $BIB_COUNT (expected 5)"
test "$BIB_COUNT" -eq 5 || { echo "  ✗ wrong bibtex entry count"; exit 1; }
echo ""

echo "--- 8. Synthesis-guard self-test (positive) ---"
TEST_BODY="$TMP_DIR/guard-test"
mkdir -p "$TEST_BODY/03_BODY"
cat > "$TEST_BODY/CLAUDE.md" <<EOF
THESIS_MODE: article
<!-- VIBE_THESIS_MARKER: v0.1.0 -->
EOF
cat > "$TEST_BODY/03_BODY/test.md" <<'EOF'
# Test
We make three groundbreaking contributions. To the best of our knowledge,
no prior work has comprehensively addressed this rigorous problem. Our
approach uniquely demonstrates a novel framework.
EOF
echo "  Wrote synthetic body file with 5+ self-review patterns at $TEST_BODY/03_BODY/test.md"
echo "  (Actual synthesis-guard skill execution requires Claude Code runtime — see"
echo "   OWED-TO-NEXT-BUILDER-ACTION below.)"
echo ""

echo "=== Automated structural verification PASSED ==="
echo ""
echo "OWED TO NEXT-BUILDER-ACTION (run inside fresh Claude Code sessions):"
echo ""
echo "  A. Hello-world preflight verification:"
echo "     1. Open Claude Code in any directory"
echo "     2. /plugin marketplace add c:/tmp/vibe-thesis-helloworld"
echo "     3. /plugin install vt-helloworld@vt-helloworld"
echo "     4. /vt-helloworld:hello"
echo "     Expected: skill reports preflight green message"
echo ""
echo "  B. Path A round-trip verification:"
echo "     1. Open fresh Claude Code session in $PATH_A_DIR"
echo "     2. (Temporarily) gh logout to force Path A detection"
echo "     3. /plugin marketplace add file://$PLUGIN_REPO_ROOT (or after push: github URL)"
echo "     4. /plugin install vibe-thesis@vibe-thesis"
echo "     5. Say: \"scaffold a vibe thesis project for me on rubber duck debugging\""
echo "     6. Walk through bootstrap interview + voice synthesis interview"
echo "     7. Confirm: 08_OUTPUT/pdf/example.pdf exists and opens as a valid PDF"
echo "     8. gh login to restore"
echo ""
echo "  C. Path B round-trip verification:"
echo "     1. Open fresh Claude Code session in $PATH_B_DIR"
echo "     2. Confirm gh auth status reports authenticated"
echo "     3. /plugin install vibe-thesis@vibe-thesis (already installed if you ran B)"
echo "     4. Say: \"scaffold a vibe thesis project for me on rubber duck debugging\""
echo "     5. Walk through bootstrap + voice"
echo "     6. Confirm: 08_OUTPUT/pdf/example.pdf exists and opens as a valid PDF"
echo "     7. Confirm: gh repo view shows the spawned project repo on github.com"
echo ""
echo "  D. Tree-equivalence diff:"
echo "     diff -r --exclude='.git' --exclude='node_modules' --exclude='08_OUTPUT' \\"
echo "          $PATH_A_DIR/<project> $PATH_B_DIR/<project>"
echo "     Expected: zero diffs"
echo ""
echo "  E. Synthesis-guard end-to-end:"
echo "     1. Open Claude Code in $TEST_BODY"
echo "     2. /vibe-thesis:guard strict"
echo "     Expected: 4-6 findings on the synthetic test.md file"
echo "     3. Replace test.md with a clean version, re-run /vibe-thesis:guard"
echo "     Expected: 0 findings"
echo ""
echo "If any beat fails, do NOT mark the cycle complete. Open an /iterate beat to debug."
