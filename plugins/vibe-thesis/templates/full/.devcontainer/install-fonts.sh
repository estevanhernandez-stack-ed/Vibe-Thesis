#!/usr/bin/env bash
#
# Install the design-system fonts that 00_DESIGN_SYSTEM/tokens.yaml references
# but that are not in apt's package catalogue:
#
#   - JetBrains Mono (code_font in the typography section)
#   - Source Serif 4  (serif_body in the editorial brand layer)
#   - Space Grotesk   (sans heading in the editorial brand layer)
#
# Source Serif Pro and Source Sans Pro are already provided by texlive-fonts-extra.
#
# This script is invoked from the devcontainer Dockerfile so the fonts are
# baked into the image. Forks customizing the design system to use different
# fonts can either edit this script or add their fonts to /usr/share/fonts/
# via their own Dockerfile layer.
#
# Idempotent: safe to re-run.

set -euo pipefail

FONTS_DIR="/usr/share/fonts/truetype/thesisstudio"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

mkdir -p "$FONTS_DIR"

echo "install-fonts: JetBrains Mono..."
JBM_VERSION="2.304"
curl -fsSL "https://github.com/JetBrains/JetBrainsMono/releases/download/v${JBM_VERSION}/JetBrainsMono-${JBM_VERSION}.zip" -o "$TMPDIR/jbm.zip"
unzip -q -o "$TMPDIR/jbm.zip" -d "$TMPDIR/jbm/"
cp "$TMPDIR/jbm/fonts/ttf/"*.ttf "$FONTS_DIR/"

echo "install-fonts: Source Serif 4..."
SS4_VERSION="4.005"
SS4_RELEASE="${SS4_VERSION}R"
curl -fsSL "https://github.com/adobe-fonts/source-serif/releases/download/${SS4_RELEASE}/source-serif-${SS4_VERSION}_Desktop.zip" -o "$TMPDIR/ss4.zip"
unzip -q -o "$TMPDIR/ss4.zip" -d "$TMPDIR/ss4/"
find "$TMPDIR/ss4/" -name "*.otf" -exec cp {} "$FONTS_DIR/" \;

echo "install-fonts: Space Grotesk..."
curl -fsSL "https://github.com/floriankarsten/space-grotesk/archive/refs/heads/master.tar.gz" -o "$TMPDIR/sg.tar.gz"
tar -xzf "$TMPDIR/sg.tar.gz" -C "$TMPDIR/"
find "$TMPDIR/space-grotesk-master/fonts/otf/" -name "*.otf" -exec cp {} "$FONTS_DIR/" \;

echo "install-fonts: refreshing font cache..."
fc-cache -f "$FONTS_DIR" >/dev/null 2>&1 || true

# Refresh luaotfload's database so LuaLaTeX picks up the new fonts on first
# render rather than on second-render after a one-time miss.
luaotfload-tool --update --force >/dev/null 2>&1 || true

echo "install-fonts: done. Installed to $FONTS_DIR:"
ls -1 "$FONTS_DIR" | wc -l | xargs -I {} echo "  {} font files."
