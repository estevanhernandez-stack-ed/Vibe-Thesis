#!/usr/bin/env bash
# check-overlay-invariant.sh
# Verifies every file in templates/overlay/ is byte-identical to its counterpart
# in templates/full/. The overlay is the local-additions diff applied on top of
# a Path B gh-template-spawned tree; for path equivalence to hold, overlay files
# must match the bundled (Path A) versions exactly.
#
# Exception: inject-marker.sh is overlay-only (it's a runtime script Path B
# invokes after spawn; Path A doesn't need it because templates/full/CLAUDE.md
# already has the marker stanza baked in).
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FULL="$ROOT/plugins/vibe-thesis/templates/full"
OVERLAY="$ROOT/plugins/vibe-thesis/templates/overlay"

EXIT=0
for OVERLAY_FILE in $(find "$OVERLAY" -type f); do
  REL="${OVERLAY_FILE#$OVERLAY/}"
  # Skip the runtime script (overlay-only by design)
  if [ "$REL" = "inject-marker.sh" ]; then
    continue
  fi
  FULL_FILE="$FULL/$REL"
  if [ ! -f "$FULL_FILE" ]; then
    echo "MISMATCH: overlay/$REL has no counterpart in templates/full/" >&2
    EXIT=1
    continue
  fi
  if ! cmp -s "$OVERLAY_FILE" "$FULL_FILE"; then
    echo "MISMATCH: overlay/$REL differs from templates/full/$REL" >&2
    EXIT=1
  fi
done
if [ "$EXIT" = "0" ]; then
  echo "OK: every templates/overlay/ file is byte-identical to its templates/full/ counterpart (modulo runtime scripts)."
fi
exit $EXIT
