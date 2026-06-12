# OG Banner Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the site real `og:image`/`twitter:image` banners — a 1200×630 snapshot of the homepage hero (starry sky, dark orb, "It knows you. It does the work.") — via Next.js metadata file conventions.

**Architecture:** A bash script snapshots the live homepage with headless Chrome at 1200×687 and crops the 57px sticky header off the top with `sips`, writing `app/opengraph-image.png` and `app/twitter-image.png`. Next.js's file convention emits the meta tags automatically (absolute URLs via the existing `metadataBase: https://sirius.so` in `app/layout.tsx`); all routes including `/blog/[slug]` inherit them. No code wiring, no new dependencies.

**Tech Stack:** Next.js App Router metadata file conventions (`opengraph-image.png`, `twitter-image.png`, `*.alt.txt`), headless Chrome (system install), `sips` (macOS built-in).

**Prerequisite:** Dev server running at `http://localhost:3000` (`npm run dev` if not).

**Spec:** `docs/superpowers/specs/2026-06-13-og-banner-image-design.md`

---

### Task 1: Generation script + assets

**Files:**
- Create: `scripts/generate-og.sh`
- Create (generated): `app/opengraph-image.png`, `app/twitter-image.png`
- Create: `app/opengraph-image.alt.txt`, `app/twitter-image.alt.txt`

- [ ] **Step 1: Create `scripts/generate-og.sh`** with exactly:

```bash
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

sips -c 630 1200 --cropOffset 57 0 "$TMP" --out app/opengraph-image.png >/dev/null
cp app/opengraph-image.png app/twitter-image.png

sips -g pixelWidth -g pixelHeight app/opengraph-image.png
echo "Wrote app/opengraph-image.png and app/twitter-image.png"
```

- [ ] **Step 2: Make it executable and run it**

```bash
chmod +x scripts/generate-og.sh
scripts/generate-og.sh
```

Expected output ends with:
```
  pixelWidth: 1200
  pixelHeight: 630
Wrote app/opengraph-image.png and app/twitter-image.png
```

If `pixelWidth`/`pixelHeight` are not 1200/630, stop and fix the sips invocation before proceeding.

- [ ] **Step 3: Visually inspect the banner**

Read `app/opengraph-image.png` with the Read tool. Expected: starry night sky, the dark orb (gold/cyan rim) upper-center, headline "It knows you. It does the work." legible below it, NO site nav/header visible, no obvious cut-off text at the bottom edge. If the framing is off (orb clipped, headline missing), adjust the window height/crop offset in the script and re-run until right.

- [ ] **Step 4: Create the alt-text files**

`app/opengraph-image.alt.txt` and `app/twitter-image.alt.txt`, both containing exactly:

```
The Sirius orb on a night sky — It knows you. It does the work.
```

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-og.sh app/opengraph-image.png app/twitter-image.png \
  app/opengraph-image.alt.txt app/twitter-image.alt.txt
git commit -m "feat(meta): OG/Twitter banner — homepage hero snapshot with orb"
```

---

### Task 2: Verification

**Files:** none modified (unless fixes needed).

- [ ] **Step 1: Verify the dev server emits the tags**

```bash
curl -s http://localhost:3000/ | grep -oE '<meta property="og:image[^>]*>|<meta name="twitter:image[^>]*>'
```

Expected: an `og:image` meta tag referencing `/opengraph-image.png` (possibly with a cache-busting query) plus `og:image:width` 1200 / `og:image:height` 630 and `og:image:alt`, and a `twitter:image` tag referencing `/twitter-image.png`.

- [ ] **Step 2: Verify a blog post inherits the banner**

```bash
curl -s http://localhost:3000/blog/what-ai-actually-is | grep -oE '<meta property="og:image[^>]*>|<meta name="twitter:image[^>]*>'
```

Expected: same `og:image`/`twitter:image` tags present (blog's `generateMetadata` sets only text fields, so the root-segment images apply).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: success; `/` and `/blog/[slug]` still prerender static/SSG. (The convention files add static routes for the images — no `ƒ` dynamic routes should appear beyond the existing two `/api/*` ones.)

- [ ] **Step 4: Commit (only if fixes were needed)**

```bash
git add -A && git commit -m "fix(meta): OG banner verification fixes"
```
