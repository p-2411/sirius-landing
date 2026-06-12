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

# Crop rows 57-687 (remove the 57px site header from the top).
# sips --cropOffset is unreliable on macOS; Python handles it correctly.
python3 - "$TMP" << 'PYEOF'
import sys, zlib, struct

def decode_png(path):
    with open(path, 'rb') as f:
        data = f.read()
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    idat, width, height, bpp = [], 0, 0, 0
    idx = 8
    while idx < len(data):
        length = struct.unpack('>I', data[idx:idx+4])[0]
        ctype = data[idx+4:idx+8].decode('ascii')
        cdata = data[idx+8:idx+8+length]
        if ctype == 'IHDR':
            width = struct.unpack('>I', cdata[0:4])[0]
            height = struct.unpack('>I', cdata[4:8])[0]
            ct = cdata[9]
            bpp = 4 if ct == 6 else 3
        elif ctype == 'IDAT':
            idat.append(cdata)
        idx += 12 + length
    raw = zlib.decompress(b''.join(idat))
    stride = 1 + width * bpp
    prev = bytes(width * bpp)
    rows = []
    for y in range(height):
        f = raw[y * stride]
        row = bytearray(raw[y * stride + 1:(y+1) * stride])
        if f == 1:
            for x in range(bpp, len(row)): row[x] = (row[x] + row[x-bpp]) & 0xff
        elif f == 2:
            for x in range(len(row)): row[x] = (row[x] + prev[x]) & 0xff
        elif f == 3:
            for x in range(len(row)):
                a = row[x-bpp] if x >= bpp else 0
                row[x] = (row[x] + (a + prev[x]) // 2) & 0xff
        elif f == 4:
            def paeth(a, b, c):
                p = a+b-c; pa,pb,pc = abs(p-a),abs(p-b),abs(p-c)
                return a if pa<=pb and pa<=pc else (b if pb<=pc else c)
            for x in range(len(row)):
                a = row[x-bpp] if x >= bpp else 0
                b = prev[x]; c = prev[x-bpp] if x >= bpp else 0
                row[x] = (row[x] + paeth(a, b, c)) & 0xff
        rows.append(bytes(row)); prev = bytes(row)
    return width, height, bpp, rows

def encode_png(width, height, bpp, rows):
    ct = 2 if bpp == 3 else 6
    def chunk(name, data):
        if isinstance(name, str): name = name.encode()
        p = name + data
        return struct.pack('>I', len(data)) + p + struct.pack('>I', zlib.crc32(p) & 0xffffffff)
    raw = b''.join(b'\x00' + r for r in rows)
    return (b'\x89PNG\r\n\x1a\n' +
            chunk('IHDR', struct.pack('>IIBBBBB', width, height, 8, ct, 0, 0, 0)) +
            chunk('IDAT', zlib.compress(raw, 6)) +
            chunk('IEND', b''))

src = sys.argv[1]
w, h, bpp, rows = decode_png(src)
cropped = rows[57:687]
png = encode_png(w, 630, bpp, cropped)
for dst in ['app/opengraph-image.png', 'app/twitter-image.png']:
    with open(dst, 'wb') as f: f.write(png)
PYEOF

sips -g pixelWidth -g pixelHeight app/opengraph-image.png
echo "Wrote app/opengraph-image.png and app/twitter-image.png"
