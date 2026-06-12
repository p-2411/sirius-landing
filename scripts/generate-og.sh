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
# sips --cropOffset shifts from center (not from top-left), so the offset
# needed to reach y=57 exceeds the max allowed delta on macOS 26; a minimal
# Python snippet (no third-party deps) slices rows directly instead.
python3 - "$TMP" << 'PYEOF'
import sys, zlib, struct

def png_crop_top(src, dsts, skip):
    with open(src, 'rb') as f:
        data = f.read()
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    chunks, idx = [], 8
    while idx < len(data):
        n = struct.unpack_from('>I', data, idx)[0]
        chunks.append((data[idx+4:idx+8], data[idx+8:idx+8+n]))
        idx += 12 + n
    w, h, ct = struct.unpack_from('>IIB', chunks[0][1], 0)[0], \
               struct.unpack_from('>II', chunks[0][1])[1], chunks[0][1][9]
    bpp = 4 if ct == 6 else 3
    stride = 1 + w * bpp
    raw = zlib.decompress(b''.join(c for t, c in chunks if t == b'IDAT'))
    rows = [raw[y*stride:(y+1)*stride] for y in range(skip, h)]
    ihdr = struct.pack('>IIBBBBB', w, len(rows), 8, ct, 0, 0, 0)
    def chunk(t, d):
        p = t + d
        return struct.pack('>I', len(d)) + p + struct.pack('>I', zlib.crc32(p) & 0xffffffff)
    out = (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr)
           + chunk(b'IDAT', zlib.compress(b''.join(rows), 6))
           + chunk(b'IEND', b''))
    for dst in dsts:
        with open(dst, 'wb') as f:
            f.write(out)

png_crop_top(sys.argv[1], ['app/opengraph-image.png', 'app/twitter-image.png'], 57)
PYEOF

sips -g pixelWidth -g pixelHeight app/opengraph-image.png
echo "Wrote app/opengraph-image.png and app/twitter-image.png"
