#!/usr/bin/env bash
# inject-marker.sh — append the VIBE_THESIS_MARKER stanza to CLAUDE.md
# in a Path B (gh-template-spawned) project, so the orchestrator can detect it.
# Idempotent — safe to re-run.
set -e
TARGET_DIR="${1:-.}"
CLAUDE_MD="${TARGET_DIR}/CLAUDE.md"
if [ ! -f "$CLAUDE_MD" ]; then
  echo "ERROR: $CLAUDE_MD not found. Was this directory scaffolded from ThesisStudio?" >&2
  exit 1
fi
if grep -q "VIBE_THESIS_MARKER" "$CLAUDE_MD"; then
  echo "VIBE_THESIS_MARKER already present in $CLAUDE_MD; nothing to do."
  exit 0
fi
echo "" >> "$CLAUDE_MD"
echo "<!-- VIBE_THESIS_MARKER: v0.1.0 -->" >> "$CLAUDE_MD"
echo "Appended VIBE_THESIS_MARKER stanza to $CLAUDE_MD"
