#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# WP-2026 LOCAL FILE ORGANIZATION + GITHUB PUBLICATION
# Run from: /media/veracrypt1/Laptop_Backup/PhD
# ═══════════════════════════════════════════════════════════════
# 
# BEFORE RUNNING:
#   1. Copy MDO-01-v3.docx and MDO-01-v3.html from session outputs
#      into /media/veracrypt1/Laptop_Backup/PhD/ first
#   2. Verify WP-2026-INFRA-01-v5-4-CONTROLLED.docx is NOT staged
#   3. Run: bash organize_and_publish.sh
#
# ═══════════════════════════════════════════════════════════════

set -e
REPO_DIR="/media/veracrypt1/Laptop_Backup/PhD"
cd "$REPO_DIR"

echo ""
echo "════════════════════════════════════════════════"
echo " WP-2026 — Local Organization + GitHub Publish"
echo "════════════════════════════════════════════════"
echo ""

# ── SAFETY CHECK ──────────────────────────────────────────────
echo "[0/6] Safety checks..."

if git diff --cached --name-only | grep -q "CONTROLLED"; then
  echo "  ERROR: CONTROLLED file is staged. Aborting."
  exit 1
fi
echo "  ✓ No CONTROLLED files staged"

if [ ! -f "MDO-01-console-v2.html" ]; then
  echo "  ERROR: MDO-01-console-v2.html not found in root"
  exit 1
fi

if [ ! -f "WP-2026-CI-PLATFORM-01.docx" ]; then
  echo "  ERROR: WP-2026-CI-PLATFORM-01.docx not found in root"
  exit 1
fi
echo "  ✓ Required files present"
echo ""

# ── STEP 1: CREATE 09-mdo-doctrine ────────────────────────────
echo "[1/6] Creating 09-mdo-doctrine/..."
mkdir -p 09-mdo-doctrine
echo "  ✓ 09-mdo-doctrine/ created"
echo ""

# ── STEP 2: MOVE FILES INTO SUBDIRECTORIES ────────────────────
echo "[2/6] Moving files into subdirectories..."

# 09-mdo-doctrine
mv MDO-01-console-v2.html      09-mdo-doctrine/MDO-01-console-v2.html
echo "  ✓ → 09-mdo-doctrine/MDO-01-console-v2.html"

mv README-09-mdo-doctrine.md   09-mdo-doctrine/README.md
echo "  ✓ → 09-mdo-doctrine/README.md"

# MDO-01-v3.docx and MDO-01-v3.html (from session outputs — must be in root first)
if [ -f "MDO-01-v3.docx" ]; then
  mv MDO-01-v3.docx             09-mdo-doctrine/WP-2026-MDO-01-v3.docx
  echo "  ✓ → 09-mdo-doctrine/WP-2026-MDO-01-v3.docx"
else
  echo "  ! MDO-01-v3.docx not found — add to 09-mdo-doctrine/ manually"
fi

if [ -f "MDO-01-v3.html" ]; then
  mv MDO-01-v3.html             09-mdo-doctrine/WP-2026-MDO-01-v3.html
  echo "  ✓ → 09-mdo-doctrine/WP-2026-MDO-01-v3.html"
else
  echo "  ! MDO-01-v3.html not found — add to 09-mdo-doctrine/ manually"
fi

if [ -f "MDO-01-v3.pdf" ]; then
  mv MDO-01-v3.pdf              09-mdo-doctrine/WP-2026-MDO-01-v3.pdf
  echo "  ✓ → 09-mdo-doctrine/WP-2026-MDO-01-v3.pdf"
fi

# 00-series-standards — new CI documents
mv WP-2026-CI-PLATFORM-01.docx  00-series-standards/WP-2026-CI-PLATFORM-01.docx
echo "  ✓ → 00-series-standards/WP-2026-CI-PLATFORM-01.docx"

mv WP-2026-CI-PLATFORM-01.pdf   00-series-standards/WP-2026-CI-PLATFORM-01.pdf
echo "  ✓ → 00-series-standards/WP-2026-CI-PLATFORM-01.pdf"

# CI-Assessment-02 final versions (may supersede existing .docx/.pdf)
mv WP-2026-CI-Assessment-02-final.docx  00-series-standards/WP-2026-CI-Assessment-02-final.docx
echo "  ✓ → 00-series-standards/WP-2026-CI-Assessment-02-final.docx"

mv WP-2026-CI-Assessment-02-final.pdf   00-series-standards/WP-2026-CI-Assessment-02-final.pdf
echo "  ✓ → 00-series-standards/WP-2026-CI-Assessment-02-final.pdf"

# 08-resilience-foundation — final versions
mv RESILIENCE-01-v9-final.docx  08-resilience-foundation/WP-2026-RESILIENCE-01-v9-final.docx
echo "  ✓ → 08-resilience-foundation/WP-2026-RESILIENCE-01-v9-final.docx"

mv RESILIENCE-01-v9-final.pdf   08-resilience-foundation/WP-2026-RESILIENCE-01-v9-final.pdf
echo "  ✓ → 08-resilience-foundation/WP-2026-RESILIENCE-01-v9-final.pdf"

# 03-applied-enforcement — ESCALATE-01 final versions
mv ESCALATE-01-v7-final.docx    03-applied-enforcement/WP-2026-ESCALATE-01-v7-final.docx
echo "  ✓ → 03-applied-enforcement/WP-2026-ESCALATE-01-v7-final.docx"

mv ESCALATE-01-v7-final.pdf     03-applied-enforcement/WP-2026-ESCALATE-01-v7-final.pdf
echo "  ✓ → 03-applied-enforcement/WP-2026-ESCALATE-01-v7-final.pdf"

echo ""

# ── STEP 3: VERIFY CONTROLLED FILE NOT PRESENT ────────────────
echo "[3/6] Verifying no CONTROLLED files will be committed..."
if [ -f "WP-2026-INFRA-01-v5-4-CONTROLLED.docx" ]; then
  echo "  WARNING: CONTROLLED docx is in root — not staging it"
fi
# Ensure .gitignore covers it
if ! grep -q "CONTROLLED" .gitignore 2>/dev/null; then
  echo "*CONTROLLED*" >> .gitignore
  echo "  ✓ Added *CONTROLLED* pattern to .gitignore"
else
  echo "  ✓ .gitignore already covers CONTROLLED files"
fi
echo ""

# ── STEP 4: STAGE ─────────────────────────────────────────────
echo "[4/6] Staging for commit..."

git add index.html
git add README.md
git add .gitignore
git add 09-mdo-doctrine/
git add 00-series-standards/WP-2026-CI-PLATFORM-01.docx
git add 00-series-standards/WP-2026-CI-PLATFORM-01.pdf
git add 00-series-standards/WP-2026-CI-Assessment-02-final.docx
git add 00-series-standards/WP-2026-CI-Assessment-02-final.pdf
git add 08-resilience-foundation/WP-2026-RESILIENCE-01-v9-final.docx
git add 08-resilience-foundation/WP-2026-RESILIENCE-01-v9-final.pdf
git add 03-applied-enforcement/WP-2026-ESCALATE-01-v7-final.docx
git add 03-applied-enforcement/WP-2026-ESCALATE-01-v7-final.pdf

echo ""
echo "  Files staged:"
git diff --cached --name-only | sed 's/^/    /'
echo ""

# Confirm CONTROLLED not staged
if git diff --cached --name-only | grep -q "CONTROLLED"; then
  echo "  ERROR: CONTROLLED file staged. Aborting before commit."
  git reset HEAD
  exit 1
fi
echo "  ✓ No CONTROLLED files staged"
echo ""

# ── STEP 5: COMMIT ────────────────────────────────────────────
echo "[5/6] Committing..."

git commit -m "Add MDO-01 v3.0, CI-PLATFORM-01, and final document versions

09-mdo-doctrine/ (new):
- MDO-01-console-v2.html: MDO-01 Analytic Console v3.0
  Scenario builder, adversary stress test (PRC/Russia/DPRK),
  confidence matrix, F2T2EA, campaign workflow, export brief.
  Categorical viability system. Full governance architecture.
- WP-2026-MDO-01-v3.docx/.html: Final paper and companion reader.
  Eight parts, ODNI two-axis confidence standard throughout.
  Reads into HORMUZ-01/02, SHIELD-01, PERSIST-01, MAXPRESS-01.
- README.md: folder index and document descriptions.

00-series-standards/:
- WP-2026-CI-PLATFORM-01.docx/.pdf: Platform-level CI assessment.
  System-level emergent capability, machine-readable reasoning
  architecture, brief generation, adversary utility (PRC/Russia/DPRK),
  analytic misuse modes, legal exposure, consolidated risk matrix.
  Fourth CI assessment in series.
- WP-2026-CI-Assessment-02-final.docx/.pdf: Final version of CI-02.

03-applied-enforcement/:
- WP-2026-ESCALATE-01-v7-final.docx/.pdf: Final v7 versions.

08-resilience-foundation/:
- WP-2026-RESILIENCE-01-v9-final.docx/.pdf: Final v9 versions.

Root:
- index.html: Integrated site landing page with featured interactive
  tools (MDO console + SENI map), system architecture and module
  separation section, series paper grid, dependency table.
- README.md: Full series rewrite — updated series architecture,
  MDO-01 entry, CI-PLATFORM-01 in standards, reading order.
- .gitignore: Added *CONTROLLED* pattern.

WP-2026 Series — March 2026 — Unclassified // Open Source"

echo "  ✓ Committed"
echo ""

# ── STEP 6: PUSH ──────────────────────────────────────────────
echo "[6/6] Pushing to GitHub..."
git push origin main
echo "  ✓ Pushed"
echo ""

echo "════════════════════════════════════════════════"
echo " Publication complete"
echo "════════════════════════════════════════════════"
echo ""
echo "Live URLs (allow 1-2 min for GitHub Pages):"
echo "  Site:    https://collingeorge.github.io/WP-2026/"
echo "  Console: https://collingeorge.github.io/WP-2026/09-mdo-doctrine/MDO-01-console-v2.html"
echo "  Map:     https://collingeorge.github.io/WP-2026/07-intelligence-map/SENI_v4_Global_Map_FINAL.html"
echo "  Repo:    https://github.com/collingeorge/WP-2026"
echo ""
