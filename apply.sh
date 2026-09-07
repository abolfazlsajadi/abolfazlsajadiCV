#!/usr/bin/env bash
# Apply the September 2026 site update to the abolfazlsajadiCV repo and commit it.
#
# Usage:
#   1. Unzip site-update.zip somewhere (this script sits inside it).
#   2. Export "CV Improved" to PDF from the design tool and save it as
#      Abolfazl_Sajadi_CV.pdf next to this script (optional but recommended).
#   3. Run:  ./apply.sh /path/to/abolfazlsajadiCV
#      Add --push to push to origin after committing.
#
# The script copies files, shows the diff, and commits with your own git
# identity. Nothing is pushed unless you pass --push.
set -euo pipefail

REPO="${1:-}"
PUSH="${2:-}"
HERE="$(cd "$(dirname "$0")" && pwd)"

if [[ -z "$REPO" || ! -d "$REPO/.git" ]]; then
  echo "usage: $0 /path/to/abolfazlsajadiCV [--push]" >&2
  exit 1
fi
if [[ ! -f "$REPO/index.html" || ! -f "$REPO/CNAME" ]]; then
  echo "error: $REPO does not look like the site repo (index.html / CNAME missing)" >&2
  exit 1
fi

cd "$REPO"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: repo has uncommitted changes; commit or stash them first" >&2
  exit 1
fi

git checkout -b "site-update-$(date +%Y%m%d)" 2>/dev/null || true

cp "$HERE/index.html"  index.html
cp "$HERE/styles.css"  styles.css
mkdir -p assets
cp "$HERE/assets/proact-die.jpg" assets/proact-die.jpg
if [[ -f "$HERE/Abolfazl_Sajadi_CV.pdf" ]]; then
  cp "$HERE/Abolfazl_Sajadi_CV.pdf" assets/Abolfazl_Sajadi_CV.pdf
  echo "• replaced assets/Abolfazl_Sajadi_CV.pdf"
else
  echo "• Abolfazl_Sajadi_CV.pdf not found next to script; keeping the old PDF"
fi

echo
git --no-pager diff --stat
echo

git add index.html styles.css assets/proact-die.jpg assets/Abolfazl_Sajadi_CV.pdf 2>/dev/null || git add index.html styles.css assets/proact-die.jpg
git commit -m "Site update: fabricated chip, die photo, trimmed experience, publication labels

- PROACT stat tile: 'Taped out / fabrication in progress' -> 'Working silicon'
- Hero tagline: chip fabricated and working in silicon
- Add real die photo (assets/proact-die.jpg) above the stylized floorplan
- Experience trimmed to PhD + M.Sc./RA (Shahab Co. stays on its project card)
- Publications: 'AI paper memory' -> 'Summary'; intro reworded
- Refresh updated CV PDF (if provided)
- styles.css cache-buster bumped to v=silicon1"

echo
echo "Committed on branch $(git rev-parse --abbrev-ref HEAD)."
if [[ "$PUSH" == "--push" ]]; then
  git push -u origin "$(git rev-parse --abbrev-ref HEAD)"
  echo "Pushed. Open a pull request or merge into main to deploy via GitHub Pages."
else
  echo "Review with 'git show', then: git push -u origin $(git rev-parse --abbrev-ref HEAD)"
  echo "(or re-run with --push)"
fi
