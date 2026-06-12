#!/usr/bin/env bash
# Regenerates the social banner images (app/opengraph-image.png and
# app/twitter-image.png) by snapshotting the live homepage hero:
# starry sky + dark orb + "It knows you. It does the work."
#
# Requires the dev server (npm run dev → http://localhost:3000).
# Run from the repo root: scripts/generate-og.sh
# Re-run whenever the homepage hero changes.
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
URL="${1:-http://localhost:3000/}"
TMP="$(mktemp -d)/og-full.png"

# 1200x687 = OG 1200x630 plus the 57px sticky site header (h-14 + 1px
# border), which is cropped off below so the banner is pure hero.
"$CHROME" --headless=new --disable-gpu --window-size=1200,687 \
  --screenshot="$TMP" "$URL" --virtual-time-budget=10000

# Top-anchored crop: drop the 57px header band, producing 1200x630.
# sips --cropOffset shifts from center with a max delta too small for this
# crop, so let Chrome do it: render the capture offset -57px in a 630-tall
# viewport and screenshot that.
CROP_HTML="$(mktemp -d)/crop.html"
printf '<!doctype html><style>body{margin:0;overflow:hidden}img{display:block;margin-top:-57px}</style><img src="file://%s">' "$TMP" > "$CROP_HTML"
"$CHROME" --headless=new --disable-gpu --window-size=1200,630 \
  --screenshot=app/opengraph-image.png "file://$CROP_HTML" --virtual-time-budget=3000
cp app/opengraph-image.png app/twitter-image.png

sips -g pixelWidth -g pixelHeight app/opengraph-image.png
echo "Wrote app/opengraph-image.png and app/twitter-image.png"
