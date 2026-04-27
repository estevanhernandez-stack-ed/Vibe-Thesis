# ThesisStudio devcontainer
# Bundles: Node 20 LTS, Python 3.11, Pandoc 3.x, TeX Live (medium scheme + extras)
#
# A forking user opens the repo in VS Code with Dev Containers OR GitHub Codespaces.
# Everything needed to render PDFs/LaTeX/markdown is pre-installed.
#
# Image size note: ~3-4GB built. TeX Live is large; we use the medium scheme
# plus targeted extras rather than texlive-full (which would push past 6GB).

FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

ENV DEBIAN_FRONTEND=noninteractive

# Core system deps + Python
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    ca-certificates \
    build-essential \
    python3.11 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Node 20 LTS via NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Pandoc (latest stable from GitHub releases — Ubuntu's apt version lags)
RUN ARCH=$(dpkg --print-architecture) && \
    PANDOC_VERSION="3.1.13" && \
    curl -fsSL "https://github.com/jgm/pandoc/releases/download/${PANDOC_VERSION}/pandoc-${PANDOC_VERSION}-1-${ARCH}.deb" -o /tmp/pandoc.deb && \
    dpkg -i /tmp/pandoc.deb && \
    rm /tmp/pandoc.deb

# TeX Live: medium scheme + LuaLaTeX + extras for academic writing
# scheme-medium is ~1.5GB; adding latex-extra + luatex + xetex + bibtex-extra + fonts-extra
# pushes us to ~3GB. This covers virtually every academic paper / thesis use case.
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-luatex \
    texlive-xetex \
    texlive-bibtex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    biber \
    latexmk \
    fontconfig \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Design-system fonts not in apt's catalogue: JetBrains Mono (code), Source
# Serif 4 (editorial body), Space Grotesk (editorial sans). The script
# fetches them from upstream releases and installs to /usr/share/fonts/.
# Without this layer, npm run render:pdf fails with "Package fontspec Error:
# The font ... cannot be found" against any of the three.
COPY install-fonts.sh /usr/local/bin/install-fonts.sh
RUN chmod +x /usr/local/bin/install-fonts.sh && /usr/local/bin/install-fonts.sh

# Python deps for render-helper scripts (currently none required, but reserved)
# RUN pip3 install --no-cache-dir pyyaml

# Non-root vscode user is set up by the base image; nothing more needed here.

# Sanity check at build time (fails build early if a tool is broken)
RUN node --version && \
    python3 --version && \
    pandoc --version | head -1 && \
    lualatex --version | head -1
