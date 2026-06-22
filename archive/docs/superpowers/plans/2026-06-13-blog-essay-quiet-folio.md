# Quiet Folio — Blog Essay Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `/blog/[slug]` essay pages per `docs/superpowers/specs/2026-06-13-blog-essay-quiet-folio-design.md`: pure-typography centered hero, Fraunces serif body on a 600px measure with drop cap and centered section marks, flat dark background (no starfield/veil), softened margin constellation, centered finale.

**Architecture:** All changes are presentational, confined to `app/blog/[slug]/page.tsx`, `app/blog/blog.css`, and `components/blog/charted-finale.tsx`. Data layer (`lib/blog.ts`, `lib/constellation.ts`), MDX pipeline, charted-sky observer logic, and the `/blog` index are untouched.

**Tech Stack:** Next.js App Router (static prerender), MDX via `@mdx-js/mdx` evaluate, plain CSS in `blog.css`, Tailwind utility classes. Fraunces variable font already loaded as `--font-display` (full weight axis — weights 340/370 are available).

**Verification model:** This repo has no test runner. Each task ends with: hot-reload screenshot → visually inspect against the approved mockup (`.superpowers/brainstorm/46894-1781275847/content/final-composite.html`) → commit. Final task runs `npx tsc --noEmit`, `npx eslint`, `npm run build`.

**Prerequisite:** A dev server on `http://localhost:3000` (start with `npm run dev` if not running). Screenshot command used throughout:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --window-size=1440,3600 --screenshot=/tmp/qf-<name>.png \
  "http://localhost:3000/blog/what-ai-actually-is" --virtual-time-budget=8000
```

---

### Task 1: Baseline screenshots

**Files:** none modified.

- [ ] **Step 1: Capture the current essay page (desktop and mobile) before touching anything**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --window-size=1440,3600 --screenshot=/tmp/qf-baseline-desktop.png \
  "http://localhost:3000/blog/what-ai-actually-is" --virtual-time-budget=8000
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --window-size=390,3600 --screenshot=/tmp/qf-baseline-mobile.png \
  "http://localhost:3000/blog/what-ai-actually-is" --virtual-time-budget=8000
```

- [ ] **Step 2: Read both PNGs with the Read tool to confirm they captured the page (header, hero plate, prose visible)**

Expected: current design — full-bleed hero plate banner, starfield behind text, 760px prose column.

---

### Task 2: Dark reading room (background layers)

**Files:**
- Modify: `app/blog/[slug]/page.tsx` (imports, background components, veil wrapper)
- Modify: `app/blog/blog.css` (delete `.prose-veil` block; soften `.charted-sky`)

- [ ] **Step 1: In `app/blog/[slug]/page.tsx`, remove the Starfield import**

Old:
```tsx
import { Starfield } from "@/components/sirius/starfield";
import { AmbientLayers } from "@/components/sirius/ambient";
```
New:
```tsx
import { AmbientLayers } from "@/components/sirius/ambient";
```

- [ ] **Step 2: Swap the background stack at the top of the returned JSX**

Old:
```tsx
      <Starfield />
      <AmbientLayers />
      <div className="atlas-grain" aria-hidden="true" />
      <SiteHeader />
```
New:
```tsx
      <AmbientLayers quiet />
      <SiteHeader />
```

(No starfield, nebulae at quiet level, and only AmbientLayers' single grain layer — the page-level `atlas-grain` double-up goes. The `/blog` index keeps its own.)

- [ ] **Step 3: Remove the `prose-veil` wrapper**

Old (inside the prose `<section>` — note the wrapper opens before `.prose-custom` and closes after the next-plate block):
```tsx
        <Container className="relative">
          <div className="prose-veil">
          <div className="prose-custom max-w-[760px] mx-auto">
```
New:
```tsx
        <Container className="relative">
          <div className="prose-custom max-w-[760px] mx-auto">
```

And the matching close — old:
```tsx
            )}
          </div>
          </div>
        </Container>
```
New:
```tsx
            )}
          </div>
        </Container>
```

(The 760px width is corrected to 600px in Task 4; this task only removes the veil.)

- [ ] **Step 4: In `app/blog/blog.css`, delete the entire `.prose-veil` block**

Delete these rules and their comment (lines starting at the comment "Readability veil: …" through the `.prose-veil > *` rule):
```css
/* Readability veil: quiets the starfield behind the essay column. ... */
.prose-veil { ... }
.prose-veil::before { ... }
.prose-veil > * { ... }
```

- [ ] **Step 5: Soften the charted sky in `app/blog/blog.css`**

Old:
```css
.charted-sky-star.is-lit {
  background: #d9b978;
  box-shadow: 0 0 12px 2px rgba(217, 185, 120, 0.45);
  animation: plate-twinkle 3.4s ease-in-out infinite;
}

/* Spec §5: once every section is charted, the whole constellation warms. */
.charted-sky.is-complete .charted-sky-star.is-lit {
  box-shadow: 0 0 18px 4px rgba(217, 185, 120, 0.6);
}

.charted-sky.is-complete .charted-sky-path {
  stroke: rgba(217, 185, 120, 0.65);
}

/* On narrow screens the margins vanish — sink the sky further back. */
@media (max-width: 900px) {
  .charted-sky { opacity: 0.45; }
}
```
New:
```css
.charted-sky-star.is-lit {
  background: #d9b978;
  box-shadow: 0 0 6px 1px rgba(217, 185, 120, 0.35);
}

/* Spec §5: once every section is charted, the whole constellation warms. */
.charted-sky.is-complete .charted-sky-star.is-lit {
  box-shadow: 0 0 10px 2px rgba(217, 185, 120, 0.5);
}

.charted-sky.is-complete .charted-sky-path {
  stroke: rgba(217, 185, 120, 0.55);
}

/* No margins on narrow screens — the sky has nowhere to live. */
@media (max-width: 900px) {
  .charted-sky { display: none; }
}
```

Also reduce the base path strength — old:
```css
.charted-sky-path {
  stroke: rgba(217, 185, 120, 0.45);
```
New:
```css
.charted-sky-path {
  stroke: rgba(217, 185, 120, 0.35);
```

(Dropping the twinkle on lit stars removes the only repeating animation in the reading zone; the reduced-motion block's `.charted-sky-star.is-lit { animation: none; }` override becomes redundant but is harmless — leave it.)

- [ ] **Step 6: Screenshot and inspect**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --window-size=1440,3600 --screenshot=/tmp/qf-task2.png \
  "http://localhost:3000/blog/what-ai-actually-is" --virtual-time-budget=8000
```

Read the PNG. Expected: flat dark background behind prose (no twinkling field, no visible veil band edges); margin stars still present but dimmer. Hero plate still old-style (Tasks 3+).

- [ ] **Step 7: Commit**

```bash
git add app/blog/\[slug\]/page.tsx app/blog/blog.css
git commit -m "feat(blog): dark reading room — drop starfield/veil, quiet ambient, soften charted sky"
```

---

### Task 3: Hero — The Title Page

**Files:**
- Modify: `app/blog/[slug]/page.tsx` (replace plate-banner hero; drop Plate/PlateFrame imports)
- Modify: `app/blog/blog.css` (add `.folio-divider`)

- [ ] **Step 1: In `page.tsx`, remove now-unused imports and add `starLabel`**

Old:
```tsx
import { PlateFrame } from "@/components/blog/plate-frame";
import { Plate } from "@/components/blog/plate";
import { ChartedSky } from "@/components/blog/charted-sky";
import { ChartedFinale } from "@/components/blog/charted-finale";
import { buildPlateModel, GREEK } from "@/lib/constellation";
```
New:
```tsx
import { ChartedSky } from "@/components/blog/charted-sky";
import { ChartedFinale } from "@/components/blog/charted-finale";
import { buildPlateModel, GREEK, starLabel } from "@/lib/constellation";
```

(`buildPlateModel` is still needed — it feeds `ChartedSky`. `starLabel` is used by the section marks in Task 4.)

- [ ] **Step 2: Add a `plateNo` helper next to the existing `plateDate` helper**

```tsx
function plateNo(n: number): string {
  return `PLATE ${String(n).padStart(2, "0")}`;
}
```

- [ ] **Step 3: Replace the full-bleed plate hero with the centered title page**

Old (the entire `<article>` block):
```tsx
      {/* Full-bleed hero banner — escapes the content column on purpose. */}
      <article
        className="section px-2 md:px-4"
        style={{ paddingBlock: "clamp(10px, 1.5vh, 16px) clamp(20px, 3vh, 36px)" }}
      >
        <PlateFrame className="p-5 md:p-7">
          <p className="plate-meta mb-4">
            <Link href="/blog" className="hover:text-[var(--color-ink-1)] transition-colors">
              ← ALL PLATES
            </Link>
            {" · "}
            {plateDate(post.date)} · {post.readingMinutes} MIN
            {post.tags[0] ? ` · ${post.tags[0].toUpperCase()}` : ""}
          </p>
          <Plate model={model} variant="hero" />
          <h1 className="font-display text-[clamp(1.5rem,3.2vw,2.1rem)] leading-[1.05] text-[var(--color-ink-1)] mt-4">
            {post.title}
          </h1>
          <p className="text-[0.98rem] leading-relaxed text-[var(--color-ink-3)] mt-3 max-w-[600px]">
            {post.description}
          </p>
          <p className="plate-meta mt-4" style={{ fontSize: "0.62rem" }}>
            UNCHARTED · SCROLL TO BEGIN
          </p>
        </PlateFrame>
      </article>
```
New:
```tsx
      {/* The Title Page — pure typography, centered axis (Quiet Folio spec §1). */}
      <header
        className="section"
        style={{ paddingBlock: "clamp(36px, 7vh, 72px) 0" }}
      >
        <Container>
          <div className="mx-auto max-w-[640px] text-center">
            <p className="plate-meta">
              <Link href="/blog" className="hover:text-[var(--color-ink-1)] transition-colors">
                ← ALL PLATES
              </Link>
              {" · "}
              {plateNo(post.plateNumber)} · {plateDate(post.date)} · {post.readingMinutes} MIN
              {post.tags[0] ? ` · ${post.tags[0].toUpperCase()}` : ""}
            </p>
            <h1 className="font-display font-[340] text-[clamp(2.2rem,4.5vw,2.9rem)] leading-[1.06] tracking-[-0.015em] text-[var(--color-ink-1)] mx-auto mt-5 max-w-[560px]">
              {post.title}
            </h1>
            <p className="font-display italic font-[340] text-[1.125rem] leading-[1.55] text-[var(--color-ink-3)] mx-auto mt-4 max-w-[470px]">
              {post.description}
            </p>
            <div className="folio-divider" aria-hidden="true">
              ✦ ✦ ✦
            </div>
          </div>
        </Container>
      </header>
```

- [ ] **Step 4: Add the divider style to `app/blog/blog.css`** (in the "Essay page" section, replacing the `.plate-greek` rule which Task 4 obsoletes — delete `.plate-greek` here)

Delete:
```css
.plate-greek {
  font-family: var(--font-mono);
  font-size: 0.62em;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  margin-right: 0.7em;
  vertical-align: 0.15em;
}
```
Add:
```css
/* The gateway between title page and prose — appears nowhere else. */
.folio-divider {
  margin-top: 30px;
  color: rgba(217, 185, 120, 0.7);
  font-size: 0.78rem;
  letter-spacing: 1.2em;
  padding-left: 1.2em; /* recenters: letter-spacing trails the last glyph */
}
```

Note: deleting `.plate-greek` before Task 4 leaves the old inline Greek `<span className="plate-greek">` unstyled for one commit. Acceptable — Task 4 follows immediately and removes the span; if committing breaks bisectability matters to you, fold this deletion into Task 4 instead.

- [ ] **Step 5: Screenshot and inspect**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --window-size=1440,3600 --screenshot=/tmp/qf-task3.png \
  "http://localhost:3000/blog/what-ai-actually-is" --virtual-time-budget=8000
```

Read the PNG. Expected vs mockup: centered meta line with plate number, large light-weight Fraunces title (~44px at 1440w), italic serif lede, gold ✦ ✦ ✦ divider, no plate frame/art, no "UNCHARTED" line.

- [ ] **Step 6: Commit**

```bash
git add app/blog/\[slug\]/page.tsx app/blog/blog.css
git commit -m "feat(blog): title-page essay hero — centered typography, no plate banner"
```

---

### Task 4: Folio prose typography

**Files:**
- Modify: `app/blog/blog.css` (restyle `.prose-custom`)
- Modify: `app/blog/[slug]/page.tsx` (h2 section marks; 600px measure)

- [ ] **Step 1: In `blog.css`, restyle the prose base**

Old:
```css
/* Blog post content styling — scoped under .prose-custom */
.prose-custom {
  color: var(--color-ink-2);
  line-height: 1.72;
  font-size: 1.02rem;
  word-wrap: break-word;
}
```
New:
```css
/* Blog post content styling — scoped under .prose-custom.
   Quiet Folio: Fraunces serif body on a ~62ch measure. */
.prose-custom {
  font-family: var(--font-display);
  font-weight: 370;
  color: var(--color-ink-2);
  line-height: 1.74;
  font-size: 1.156rem;
  word-wrap: break-word;
}

/* Gold drop cap on the opening paragraph only (first-child guards against
   posts that open with a heading). */
.prose-custom > p:first-child::first-letter {
  font-weight: 300;
  font-size: 3.3em;
  line-height: 0.83;
  float: left;
  margin: 0.09em 0.13em 0 0;
  color: #d9b978;
}
```

- [ ] **Step 2: Restyle headings — centered section marks for H2, italic H3**

Old:
```css
.prose-custom h2 {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.45rem;
  line-height: 1.15;
  color: var(--color-ink-1);
  margin: 2.4em 0 0.5em;
  letter-spacing: -0.015em;
}

.prose-custom h2:first-child {
  margin-top: 0;
}

.prose-custom h3 {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.15rem;
  line-height: 1.25;
  color: var(--color-ink-1);
  margin: 2em 0 0.4em;
  letter-spacing: -0.01em;
}
```
New:
```css
.prose-custom h2 {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 1.55rem;
  line-height: 1.2;
  color: var(--color-ink-1);
  margin: 3em 0 1.2em;
  letter-spacing: -0.01em;
  text-align: center;
}

.prose-custom h2:first-child {
  margin-top: 0;
}

/* The Greek catalog mark above each H2 — `α · CORE`. */
.prose-section-mark {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.32em;
  color: #d9b978;
  margin-bottom: 12px;
}

.prose-custom h3 {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 1.2rem;
  line-height: 1.3;
  color: var(--color-ink-1);
  margin: 2.2em 0 0.5em;
  letter-spacing: -0.01em;
}
```

- [ ] **Step 3: Restyle blockquotes; keep code/tables sans-mono**

Old:
```css
.prose-custom blockquote {
  margin: 1.4em 0;
  padding: 0.6em 0 0.6em 1.2em;
  border-left: 2px solid var(--color-border-strong);
  color: var(--color-ink-3);
  font-style: italic;
}
```
New:
```css
.prose-custom blockquote {
  margin: 1.8em 0;
  padding: 0 1.4em;
  border: 0;
  text-align: center;
  font-style: italic;
  font-weight: 340;
  font-size: 1.08em;
  line-height: 1.55;
  color: var(--color-ink-3);
}
```

And pin tables back to the UI face (they'd otherwise inherit the serif) — old:
```css
.prose-custom table {
  width: 100%;
  margin: 1.4em 0;
  border-collapse: collapse;
  font-size: 0.92rem;
}
```
New:
```css
.prose-custom table {
  width: 100%;
  margin: 1.4em 0;
  border-collapse: collapse;
  font-family: var(--font-sans);
  font-size: 0.85rem;
}
```

(`pre`/`code` already declare `var(--font-mono)` — untouched. Inline `code` `font-size: 0.88em` now scales against the larger serif body, which is correct. Links, lists, `strong`, `hr` inherit fine as-is.)

- [ ] **Step 4: In `page.tsx`, change the h2 MDX renderer to emit the centered mark**

Old:
```tsx
    h2: ({ children }: { children?: ReactNode }) => {
      const text = textOf(children);
      const idx = majorHeadings.indexOf(text);
      return (
        <h2 id={text ? slugifyHeading(text) : undefined}>
          {idx >= 0 && (
            <span className="plate-greek" aria-hidden="true">
              {GREEK[Math.min(idx, GREEK.length - 1)]}
            </span>
          )}
          {children}
        </h2>
      );
    },
```
New:
```tsx
    h2: ({ children }: { children?: ReactNode }) => {
      const text = textOf(children);
      const idx = majorHeadings.indexOf(text);
      return (
        <h2 id={text ? slugifyHeading(text) : undefined}>
          {idx >= 0 && (
            <span className="prose-section-mark" aria-hidden="true">
              {GREEK[Math.min(idx, GREEK.length - 1)]} · {starLabel(text)}
            </span>
          )}
          {children}
        </h2>
      );
    },
```

- [ ] **Step 5: Narrow the prose column to the folio measure**

Old:
```tsx
          <div className="prose-custom max-w-[760px] mx-auto">
```
New:
```tsx
          <div className="prose-custom max-w-[600px] mx-auto">
```

- [ ] **Step 6: Screenshot and inspect**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --window-size=1440,4200 --screenshot=/tmp/qf-task4.png \
  "http://localhost:3000/blog/what-ai-actually-is" --virtual-time-budget=8000
```

Read the PNG. Expected vs mockup: serif body ~18.5px on a 600px column, gold drop cap on "You've used ChatGPT…", H2s centered with gold `α · CORE`-style mono marks above, centered italic blockquote treatment, code blocks still mono in their dark chips.

- [ ] **Step 7: Commit**

```bash
git add app/blog/\[slug\]/page.tsx app/blog/blog.css
git commit -m "feat(blog): folio prose — serif body, drop cap, centered section marks, 600px measure"
```

---

### Task 5: Finale on the folio axis

**Files:**
- Modify: `components/blog/charted-finale.tsx` (plate number, new copy)
- Modify: `app/blog/[slug]/page.tsx` (call site, finale column width)
- Modify: `app/blog/blog.css` (centered CTA)

- [ ] **Step 1: Update `ChartedFinale` to take the plate number**

Old:
```tsx
export function ChartedFinale({ minutes }: { minutes: number }) {
```
New:
```tsx
export function ChartedFinale({ plateNumber, minutes }: { plateNumber: number; minutes: number }) {
```

Old:
```tsx
      ★ CONSTELLATION CHARTED · {minutes} MIN WELL SPENT
```
New:
```tsx
      PLATE {String(plateNumber).padStart(2, "0")} CHARTED · {minutes} MIN
```

- [ ] **Step 2: Update the call site and finale column width in `page.tsx`**

Old:
```tsx
          <div className="max-w-[760px] mx-auto mt-16">
            <ChartedFinale minutes={post.readingMinutes} />
```
New:
```tsx
          <div className="max-w-[600px] mx-auto mt-16">
            <ChartedFinale plateNumber={post.plateNumber} minutes={post.readingMinutes} />
```

- [ ] **Step 3: Center the CTA card — markup**

Old:
```tsx
            <div className="atlas-cta">
              <div>
                <p className="font-display text-[1.3rem] leading-snug text-[var(--color-ink-1)] m-0">
                  Reading about AI is the slow way.{" "}
                  <span className="accent-italic">Having one is faster.</span>
                </p>
                <p className="text-[0.88rem] text-[var(--color-ink-3)] mt-2 mb-0">
                  Sirius does your briefings, outreach, and research — done before you&rsquo;re in.
                </p>
              </div>
              <DownloadButton className="shrink-0" />
            </div>
```
New:
```tsx
            <div className="atlas-cta">
              <p className="font-display text-[1.3rem] leading-snug text-[var(--color-ink-1)] m-0">
                Reading about AI is the slow way.{" "}
                <span className="accent-italic">Having one is faster.</span>
              </p>
              <p className="text-[0.88rem] text-[var(--color-ink-3)] m-0">
                Sirius does your briefings, outreach, and research — done before you&rsquo;re in.
              </p>
              <DownloadButton className="mt-2" />
            </div>
```

- [ ] **Step 4: Center the CTA card — CSS**

Old:
```css
.atlas-cta {
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(217, 185, 120, 0.4);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(217, 185, 120, 0.08), rgba(217, 185, 120, 0.02));
  padding: 22px 24px;
}

@media (max-width: 640px) {
  .atlas-cta { flex-direction: column; align-items: flex-start; }
}
```
New:
```css
.atlas-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  border: 1px solid rgba(217, 185, 120, 0.4);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(217, 185, 120, 0.08), rgba(217, 185, 120, 0.02));
  padding: 26px 28px;
}
```

- [ ] **Step 5: Screenshot the bottom of the page and inspect**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --window-size=1440,4800 --screenshot=/tmp/qf-task5.png \
  "http://localhost:3000/blog/what-ai-actually-is" --virtual-time-budget=8000
```

Read the PNG (the finale is at the bottom). Expected: centered `PLATE 01 CHARTED · 9 MIN` line, centered stacked CTA card, NEXT PLATE row on the 600px axis.

- [ ] **Step 6: Commit**

```bash
git add components/blog/charted-finale.tsx app/blog/\[slug\]/page.tsx app/blog/blog.css
git commit -m "feat(blog): centered finale — plate-charted line and stacked CTA on folio axis"
```

---

### Task 6: Verification pass

**Files:** none modified (unless fixes needed).

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: no output (exit 0). A failure here most likely means a leftover unused import in `page.tsx`.

- [ ] **Step 2: Lint changed files**

Run: `npx eslint app/blog/\[slug\]/page.tsx components/blog/charted-finale.tsx`
Expected: no errors.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: success; `/blog/what-ai-actually-is` listed as prerendered static content (`●` or `○`, not `ƒ`).

- [ ] **Step 4: Final screenshots — desktop and mobile**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --window-size=1440,4800 --screenshot=/tmp/qf-final-desktop.png \
  "http://localhost:3000/blog/what-ai-actually-is" --virtual-time-budget=8000
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --window-size=390,4800 --screenshot=/tmp/qf-final-mobile.png \
  "http://localhost:3000/blog/what-ai-actually-is" --virtual-time-budget=8000
```

Read both. Checklist against the approved composite mockup:
- Desktop: centered hero (meta · title · lede · ✦ ✦ ✦), serif drop-cap prose on 600px, flat dark background, dim margin stars, centered section marks, centered finale/CTA.
- Mobile (390px): no charted-sky stars at all (display: none), drop cap not overflowing, title wraps cleanly, CTA card fits.

- [ ] **Step 5: Sanity-check the blog index didn't regress**

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --window-size=1440,2400 --screenshot=/tmp/qf-final-index.png \
  "http://localhost:3000/blog" --virtual-time-budget=6000
```

Read it. Expected: index unchanged (plate cards, starfield, grain all still present — index was out of scope).

- [ ] **Step 6: Fix anything found, re-run the failed check, then final commit if fixes were made**

```bash
git add -A && git commit -m "fix(blog): quiet-folio verification fixes"
```

(Skip if no fixes were needed.)
