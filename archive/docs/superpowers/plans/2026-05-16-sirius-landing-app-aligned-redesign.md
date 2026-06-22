# Sirius Landing — App-Aligned Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-align the marketing landing page's visual system and component vocabulary to the Sirius desktop app, preserving all content and section order, and add app-styled screenshot placeholder slots.

**Architecture:** Replace the landing's `:root` color layer with the app's semantic `@theme` token names, keeping a *temporary legacy-alias block* so the site keeps building while sections are retuned one at a time; port the app's Button / eyebrow / status-pill / surface / screenshot-frame primitives; retune each section to the new tokens and flip the accent hierarchy (gold = brand/primary action, cyan = live/active state only); delete the alias block last.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (`@theme`), Motion, `clsx` + `tailwind-merge` (`cn()`). No test runner exists; verification is `npm run build` (webpack) + `npm run lint` + structured manual visual QA against the running dev server and the app.

**Spec:** `docs/superpowers/specs/2026-05-16-sirius-landing-app-aligned-redesign-design.md`

**Branch:** `redesign/app-aligned` (already created off `Landing-Page-Assessment`; verified merge-base = its tip). All commits land here. Do not push or open a PR — that decision is the user's.

---

## Verification model (read once)

There is no unit-test framework and this is a visual re-skin. Each task's gates are:

1. **Build gate:** `cd /Users/parhamsepasgozar/Documents/GitHub/sirius-landing && npm run build` → exits 0, no type errors.
2. **Lint gate:** `npm run lint` → no new errors.
3. **Visual gate:** with `npm run dev` running, open the affected section at `http://localhost:3000` and confirm the specific checks listed in the task. The Sirius app for side-by-side comparison: `cd /Users/parhamsepasgozar/Documents/GitHub/sirius && <its dev command>` (run only if a live comparison is needed; otherwise compare against the app token values quoted in this plan).

Do not fabricate a test runner. If a task says "verify," it means run the build + lint + the listed visual checks and confirm before committing.

---

## Token substitution map (the DRY core — every section task references this)

Legacy landing CSS var → app semantic var. Applied by the alias block (Task 1) automatically; section tasks only handle the **judgment cases** (accent split) and primitive swaps.

| Legacy var (landing) | App var (target) | Notes |
|---|---|---|
| `--color-bg-primary`, `--color-bg`, `--color-bg-secondary` | `--color-bg` `#1B1712` | flat lifted warm dark |
| `--color-bg-muted`, `--color-bg-deep`, `--color-surface-panel`, `--color-surface-elevated` | `--color-surface-deep` `#14110D` | inset/deep band |
| `--color-surface`, `--color-panel` | `--color-surface-1` `#2C261D` | solid, not a wash |
| `--color-surface-raised`, `--color-panel-strong` | `--color-surface-2` `#342D23` | raised |
| `--color-text-primary`, `--color-text`, `--ink-2` | `--color-ink-1` `#F6EFDF` | |
| `--color-text-secondary`, `--ink` | `--color-ink-2` `rgba(238,232,218,0.84)` | |
| `--color-text-muted`, `--dim`, `--color-text-faint` | `--color-ink-3` `rgba(206,208,197,0.62)` | |
| `--color-text-disabled` | `--color-ink-4` `rgba(196,199,189,0.40)` | |
| `--color-border` | `--color-border` `rgba(232,224,200,0.14)` | |
| `--color-border-strong` | `--color-border-strong` `rgba(232,224,200,0.24)` | |
| `--color-warm`, `--color-warm-rgb` | `--color-accent` `#d9b978` / `217,185,120` | **landing's "warm" was the app's brand color** |
| `--color-accent` / `--color-accent-strong` / `--color-link` (cyan) | **JUDGMENT — see accent rule** | default → gold; state → cyan |
| `--color-focus` (cyan) | gold ring `rgba(217,185,120,0.55)` | |
| `--color-success` | `--color-success` `#a7dbb2` | unchanged |
| `--color-warning` | `--color-warning` `#f0c879` | unchanged |
| `--color-error` | `--color-danger` `#f0a3a3` | renamed |
| `--radius-card` `18px`, `--radius-panel` `22px` | `--radius-md` `12px`, `--radius-lg` `16px` | tighten |
| `--shadow-panel` `0 24px 90px` | `0 24px 64px rgba(0,0,0,0.45)` | app modal depth, used sparingly |
| `--font-mono: var(--font-body)` | keep as-is | app also has no UI mono |

**Accent rule (the only judgment call, applied per section in Tasks 8–18):**
- Default: anything that was cyan `--color-accent` / `--color-accent-strong` / `--color-link` and represents a **link, CTA, brand mark, hover, or decorative highlight** → maps to **gold** `--color-accent` / `--color-accent-strong`.
- Exception: keep **cyan** (`--color-state-listening` / `--color-state-listening-strong`) **only** where the element semantically means *live / listening / running / currently-active* — e.g. the orb listening glow, "running" operation chains in in-practice, any live/pulse indicator.

---

## Task 1: Token foundation — rewrite `app/globals.css`

**Files:**
- Modify: `app/globals.css` (full `:root` block + `body` background + add title tokens + add temporary alias block)

- [ ] **Step 1: Replace the `:root` token block with the app's semantic tokens**

Replace lines 3–74 (`:root { ... }`) with:

```css
@theme {
  --font-sans: var(--font-body), "Geist", "Inter", system-ui, sans-serif;
  --font-mono: var(--font-body), ui-monospace, monospace;
  --font-display: var(--font-display), "Fraunces", "Iowan Old Style", Georgia, serif;

  --spacing-0_5: 2px;  --spacing-1: 4px;   --spacing-2: 8px;
  --spacing-3: 12px;   --spacing-4: 16px;  --spacing-5: 20px;
  --spacing-6: 24px;   --spacing-8: 32px;  --spacing-10: 40px;
  --spacing-12: 48px;  --spacing-16: 64px;

  --radius-xs: 4px; --radius-sm: 8px; --radius-md: 12px;
  --radius-lg: 16px; --radius-full: 9999px;

  --color-bg: #1B1712;
  --color-surface-1: #2C261D;
  --color-surface-2: #342D23;
  --color-surface-deep: #14110D;

  --color-ink-1: #F6EFDF;
  --color-ink-2: rgba(238, 232, 218, 0.84);
  --color-ink-3: rgba(206, 208, 197, 0.62);
  --color-ink-4: rgba(196, 199, 189, 0.40);

  --color-border: rgba(232, 224, 200, 0.14);
  --color-border-strong: rgba(232, 224, 200, 0.24);

  --color-accent: #d9b978;
  --color-accent-strong: #f0c879;
  --color-accent-muted: #8c6f3c;
  --color-accent-rgb: 217, 185, 120;
  --color-accent-strong-rgb: 240, 200, 121;

  --color-state-listening: #9bd6e5;
  --color-state-listening-strong: #6cd8ff;
  --color-state-listening-rgb: 155, 214, 229;
  --color-state-listening-strong-rgb: 108, 216, 255;

  --color-success: #a7dbb2;
  --color-warning: #f0c879;
  --color-danger: #f0a3a3;
}

:root {
  --font-title: var(--font-display);
  --title-weight: 400;
  --title-style: normal;
  --title-tracking: -0.005em;

  /* ── TEMPORARY legacy-alias layer ───────────────────────────────
     Maps old landing var names onto the app's semantic tokens so the
     site keeps building while sections are retuned. DELETED in Task 19.
     Cyan accents are aliased to GOLD here by default; section tasks
     re-point the genuine live/listening cases back to cyan state. */
  --color-bg-primary: var(--color-bg);
  --color-bg-secondary: var(--color-bg);
  --color-bg-muted: var(--color-surface-deep);
  --color-bg-deep: var(--color-surface-deep);
  --color-bg-soft: rgba(27, 23, 18, 0.84);
  --color-surface: var(--color-surface-1);
  --color-surface-raised: var(--color-surface-2);
  --color-surface-panel: var(--color-surface-deep);
  --color-surface-elevated: var(--color-surface-deep);
  --color-surface-inset: rgba(0, 0, 0, 0.2);
  --color-input-bg: var(--color-surface-1);
  --color-secondary: rgba(246, 239, 223, 0.045);
  --color-secondary-hover: rgba(246, 239, 223, 0.075);
  --color-text-primary: var(--color-ink-1);
  --color-text-secondary: var(--color-ink-2);
  --color-text-muted: var(--color-ink-3);
  --color-text-disabled: var(--color-ink-4);
  --color-text-placeholder: var(--color-ink-3);
  --color-text-ornament: rgba(217, 185, 120, 0.58);
  --color-text-inverse: var(--color-bg);
  --color-link: var(--color-accent);
  --color-link-hover: var(--color-accent-strong);
  --color-primary: var(--color-accent);
  --color-primary-hover: var(--color-accent-strong);
  --color-primary-active: var(--color-accent-muted);
  --color-warm: var(--color-accent);
  --color-warm-rgb: var(--color-accent-rgb);
  --color-error: var(--color-danger);
  --color-info: var(--color-state-listening);
  --color-success-soft: rgba(167, 219, 178, 0.1);
  --color-warning-soft: rgba(240, 200, 121, 0.1);
  --color-error-soft: rgba(240, 163, 163, 0.1);
  --color-info-soft: rgba(155, 214, 229, 0.1);
  --color-disabled-bg: rgba(246, 239, 223, 0.035);
  --color-disabled-border: var(--color-border);
  --color-focus: rgba(217, 185, 120, 0.55);
  --color-orb-glow: rgba(217, 185, 120, 0.16);
  --color-orb-glow-soft: rgba(217, 185, 120, 0.10);
  --color-shadow-problem-card: rgba(0, 0, 0, 0.22);
  --color-shadow-problem-visual: rgba(0, 0, 0, 0.24);
  --color-selection: rgba(217, 185, 120, 0.22);
  --color-bg: #1B1712;
  --color-panel: var(--color-surface-1);
  --color-panel-strong: var(--color-surface-2);
  --color-panel-solid: var(--color-surface-1);
  --color-button: var(--color-accent);
  --color-text: var(--color-ink-1);
  --color-text-faint: var(--color-ink-3);
  --color-accent-soft: rgba(217, 185, 120, 0.12);
  --color-warm-soft: rgba(217, 185, 120, 0.12);
  --shadow-orb: 0 0 46px rgba(217, 185, 120, 0.11);
  --shadow-primary: 0 14px 36px rgba(0, 0, 0, 0.28);
  --shadow-panel: 0 24px 64px rgba(0, 0, 0, 0.45);
  --radius-panel: 16px;
  --radius-card: 12px;
  --max-width: 1440px;
  --ink: var(--color-ink-2);
  --ink-2: var(--color-ink-1);
  --dim: var(--color-ink-3);
  --cyan: var(--color-state-listening);
  --green: var(--color-success);
  --font-mono: var(--font-body);

  /* Legacy cyan accent aliases — DEFAULT to gold (brand). Section
     tasks override `--accent-color` locally where state cyan is correct. */
  --color-accent: #d9b978;
  --color-accent-strong: #f0c879;
  --color-accent-rgb: 217, 185, 120;
  --color-accent-strong-rgb: 240, 200, 121;
}
```

> Note: the `@theme` block also defines `--color-accent*`; the trailing `:root` redefinition is intentional and harmless (same values) and keeps the legacy alias section self-contained for clean deletion in Task 19.

- [ ] **Step 2: Calm the background** — replace the `body` `background:` (current lines ~96–100) with:

```css
  background:
    radial-gradient(circle at 50% 0%, rgba(217, 185, 120, 0.03), transparent 42%),
    var(--color-bg);
```

- [ ] **Step 3: Remove the heavy texture overlays** — delete the entire `body::before` rule (noise + grid, current lines ~108–121) and the entire `body::after` rule (accent sweep, current lines ~123–132).

- [ ] **Step 4: Retune `.band-deep`** — change `background: #0A0908;` to `background: var(--color-surface-deep);` (keep its `border-top/bottom`).

- [ ] **Step 5: Neutralize the giant section numerals** — in `.section-index`, change `font-size: clamp(5rem, 10vw, 8rem);` to `font-size: 0;` and add `display: none;` (the eyebrow primitive in Task 4 replaces it; hard-disable now so no section regresses visually before retune).

- [ ] **Step 6: Build gate** — Run: `cd /Users/parhamsepasgozar/Documents/GitHub/sirius-landing && npm run build`
Expected: exit 0, no errors.

- [ ] **Step 7: Visual gate** — `npm run dev`, open `http://localhost:3000`. Confirm: background is the lighter warm `#1B1712` (not near-black), no visible noise/grid, no giant ghost numerals, page still renders top-to-bottom without crashes. Buttons/links now read gold-ish (alias working).

- [ ] **Step 8: Commit**

```bash
cd /Users/parhamsepasgozar/Documents/GitHub/sirius-landing
git add app/globals.css
git commit -m "feat(landing): adopt app semantic tokens + legacy alias layer

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Audit legacy token + accent usage

**Files:** none (read-only audit feeding Tasks 8–18)

- [ ] **Step 1:** Run and save output:

```bash
cd /Users/parhamsepasgozar/Documents/GitHub/sirius-landing
grep -rn "color-accent\|color-link\|color-warm\|color-focus\|color-error\|radius-card\|radius-panel\|shadow-panel\|section-index\|SectionLabel\|color-primary\b" components app | sort
```

- [ ] **Step 2:** For every match of a cyan accent (`--color-accent`, `--color-accent-strong`, `--color-link`, `--cyan`), classify it **gold (default)** or **cyan-state (live/listening/running)** per the Accent rule. Record the cyan-state exceptions — expected set: orb listening glow (`components/sirius/orb.tsx`), in-practice "running" operation chains (`components/sections/in-practice.tsx` + the `*-mock.tsx` it renders), any `.wave-bar`/pulse live indicator. Everything else → gold.

- [ ] **Step 3:** No commit (audit only). Carry the classification into the section tasks.

---

## Task 3: Button primitive — port the app's Button

**Files:**
- Modify: `components/ui/button.tsx`

- [ ] **Step 1: Replace the variant classes** so `primary` is the app's gold filled button, `secondary` is the app's `border-strong` outline, `quiet` stays a text link; gold focus ring; app radii/heights. Replace lines 12–22 with:

```ts
const base =
  "group inline-flex items-center justify-center font-medium tracking-[0.01em] transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[rgba(217,185,120,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

const variantClasses = {
  primary:
    "h-12 min-w-44 px-7 rounded-[var(--radius-sm)] text-sm bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent-strong)] active:bg-[var(--color-accent-muted)]",
  secondary:
    "h-12 min-w-40 px-6 rounded-[var(--radius-sm)] text-sm border border-[var(--color-border-strong)] bg-transparent text-[var(--color-ink-1)] hover:bg-[var(--color-surface-2)] hover:border-[var(--color-accent)]",
  quiet:
    "inline-flex items-center gap-2 px-0 h-auto text-[var(--color-ink-2)] hover:text-[var(--color-ink-1)] underline-offset-4 hover:underline decoration-[var(--color-ink-3)]",
};
```

- [ ] **Step 2: Build + lint gate** — `npm run build && npm run lint`. Expected: exit 0.

- [ ] **Step 3: Visual gate** — at `http://localhost:3000`, the hero "Request early access" button is solid gold with dark text, hover brightens to `#f0c879`; secondary "how it works" is an outline that fills `--color-surface-2` on hover; Tab to a button → gold 2px focus ring with offset. No layout shift vs before (height 48px).

- [ ] **Step 4: Commit**

```bash
git add components/ui/button.tsx
git commit -m "feat(landing): port app Button primitive (gold primary, gold focus ring)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Eyebrow / SectionHeader primitive — replace giant numerals

**Files:**
- Modify: `components/ui/section-label.tsx`

- [ ] **Step 1: Replace the file** with the app's restrained eyebrow (10.5px, uppercase, tracking 0.16em, ink-3; index becomes a small gold ordinal inside the eyebrow, not a giant ghost numeral):

```ts
import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  tone?: "cyan" | "warm";
  index?: string;
};

export function SectionLabel({ children, tone = "warm", index }: SectionLabelProps) {
  const accent =
    tone === "cyan" ? "var(--color-state-listening)" : "var(--color-accent)";

  return (
    <p className="inline-flex items-center gap-2.5 text-[10.5px] font-semibold uppercase leading-none tracking-[0.16em] text-[var(--color-ink-3)]">
      {index && <span style={{ color: accent }}>{index}</span>}
      <span
        aria-hidden="true"
        className="inline-block h-px w-6"
        style={{ background: "var(--color-border-strong)" }}
      />
      <span>{children}</span>
    </p>
  );
}
```

> Default `tone` flips to `"warm"` (gold) — the brand accent. Sections that semantically mean "live" pass `tone="cyan"` explicitly (decided per section in Tasks 8–18).

- [ ] **Step 2: Build + lint gate** — `npm run build && npm run lint`. Expected: exit 0.

- [ ] **Step 3: Visual gate** — every section's label is now a small uppercase gold eyebrow with a hairline rule; no oversized italic ghost numbers anywhere; ordinals (01–05) render small and gold inline.

- [ ] **Step 4: Commit**

```bash
git add components/ui/section-label.tsx
git commit -m "feat(landing): app eyebrow primitive, retire giant section numerals

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Status pill primitive (new)

**Files:**
- Create: `components/ui/status-pill.tsx`

- [ ] **Step 1: Create the file** (mirrors the app's Pill tones; cyan is reserved for `running` = live):

```ts
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "running" | "done" | "failed" | "gated" | "idle";

const tones: Record<Tone, { text: string; border: string; dot: string; pulse: boolean }> = {
  running: { text: "var(--color-state-listening-strong)", border: "rgba(108,216,255,0.32)", dot: "var(--color-state-listening-strong)", pulse: true },
  done:    { text: "var(--color-success)", border: "rgba(167,219,178,0.32)", dot: "var(--color-success)", pulse: false },
  failed:  { text: "var(--color-danger)",  border: "rgba(240,163,163,0.32)", dot: "var(--color-danger)",  pulse: false },
  gated:   { text: "var(--color-accent)",  border: "rgba(217,185,120,0.32)", dot: "var(--color-accent)",  pulse: false },
  idle:    { text: "var(--color-ink-3)",   border: "var(--color-border-strong)", dot: "transparent",      pulse: false },
};

export function StatusPill({ tone = "idle", children }: { tone?: Tone; children: ReactNode }) {
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium tracking-[0.02em]"
      style={{ color: t.text, border: `1px solid ${t.border}` }}
    >
      {t.dot !== "transparent" && (
        <span
          aria-hidden="true"
          className={cn("inline-block h-1.5 w-1.5 rounded-full", t.pulse && "motion-safe:animate-[sirius-pulse_1.6s_ease-in-out_infinite]")}
          style={{ background: t.dot }}
        />
      )}
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Add the keyframe** — append to `app/globals.css` if not already present:

```css
@keyframes sirius-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}
```

- [ ] **Step 3: Build + lint gate** — `npm run build && npm run lint`. Expected: exit 0 (component is unused yet — that's fine; it's consumed in Task 9).

- [ ] **Step 4: Commit**

```bash
git add components/ui/status-pill.tsx app/globals.css
git commit -m "feat(landing): add app-style StatusPill primitive

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Surface card primitive (new)

**Files:**
- Create: `components/ui/surface.tsx`

- [ ] **Step 1: Create the file:**

```ts
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceProps = {
  children: ReactNode;
  level?: 1 | 2;
  interactive?: boolean;
  className?: string;
};

export function Surface({ children, level = 1, interactive = false, className }: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-[var(--color-border)] transition-colors duration-150",
        level === 1 ? "bg-[var(--color-surface-1)]" : "bg-[var(--color-surface-2)]",
        interactive && "hover:bg-[var(--color-surface-2)] cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Build + lint gate** — `npm run build && npm run lint`. Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/ui/surface.tsx
git commit -m "feat(landing): add app-style Surface card primitive

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: ScreenshotFrame primitive + asset scaffold (new)

**Files:**
- Create: `components/ui/screenshot-frame.tsx`
- Create: `public/screenshots/.gitkeep`
- Create: `public/screenshots/README.md`

- [ ] **Step 1: Create `components/ui/screenshot-frame.tsx`:**

```tsx
import Image from "next/image";
import { cn } from "@/lib/utils";

type ScreenshotFrameProps = {
  /** path under /public, e.g. "/screenshots/workflow-detail.png" — omit for placeholder */
  src?: string;
  /** accessible description of the app screen */
  alt: string;
  /** muted caption shown in the placeholder state */
  caption: string;
  /** intrinsic size of the real asset; also drives the reserved aspect ratio */
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
};

export function ScreenshotFrame({
  src,
  alt,
  caption,
  width = 1600,
  height = 1000,
  priority = false,
  className,
}: ScreenshotFrameProps) {
  return (
    <figure
      role="img"
      aria-label={alt}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface-1)] shadow-[0_24px_64px_rgba(0,0,0,0.45)]",
        className,
      )}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--color-surface-2)]"
        >
          <span
            className="h-10 w-10 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, rgba(240,200,121,0.55), rgba(217,185,120,0.18) 60%, transparent 75%)",
            }}
          />
          <span className="px-6 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-ink-3)]">
            {caption}
          </span>
        </div>
      )}
    </figure>
  );
}
```

- [ ] **Step 2: Create `public/screenshots/.gitkeep`** (empty file).

- [ ] **Step 3: Create `public/screenshots/README.md`:**

```markdown
# App screenshots

Drop real Sirius app captures here; the landing `ScreenshotFrame` swaps the
placeholder for the image automatically once `src` points at the file.

Capture from the running Sirius app and name exactly:

- `voice-orb.png` — `/` home (orb voice screen)
- `work-chat.png` — `/work` (chat + composer)
- `workflow-detail.png` — `/workflows/[name]` (two-pane DAG + workflow chat) — flagship
- `workflows-index.png` — `/workflows` (table + status pills)

Recommended: PNG or WebP, ~1600×1000 (16:10), dark theme, no OS chrome.
After adding a file, set the matching `src` prop in the section component
(grep `ScreenshotFrame` to find the slots).
```

- [ ] **Step 4: Build + lint gate** — `npm run build && npm run lint`. Expected: exit 0 (unused yet).

- [ ] **Step 5: Commit**

```bash
git add components/ui/screenshot-frame.tsx public/screenshots/.gitkeep public/screenshots/README.md
git commit -m "feat(landing): add ScreenshotFrame primitive + screenshots asset slot

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Tasks 8–18: Retune sections (one task per file)

For **each** section task below, the loop is identical (5 steps); only the file and the per-file specifics differ. Per-file specifics list (a) explicit cyan-state exceptions to keep, (b) ScreenshotFrame slot to add (if any), (c) any primitive swaps.

**The 5-step loop (apply to each task):**

- [ ] **Step A — Read the file** in full so edits are exact.
- [ ] **Step B — Apply token correctness:** with the alias layer most things already resolve. Make these concrete edits in the file: (1) replace any literal hex/`rgba` colors with the matching app token from the substitution map; (2) replace `rounded-[18px]`/`rounded-[22px]`/`--radius-card`/`--radius-panel` with `rounded-[var(--radius-md)]` (cards) or `rounded-[var(--radius-lg)]` (large panels); (3) replace `shadow-[var(--shadow-panel)]` with border-based separation or `shadow-[0_24px_64px_rgba(0,0,0,0.45)]` only if elevation is essential; (4) apply the **Accent rule** — keep cyan only for the file's listed exceptions, everything else uses gold tokens.
- [ ] **Step C — Apply the file's specifics** (ScreenshotFrame slot / primitive swap) listed in the task.
- [ ] **Step D — Build + lint + visual gate:** `npm run build && npm run lint`; then view the section at `localhost:3000` and confirm: gold is the only "action/brand" color, cyan appears only on the listed live elements, radii look tighter, surfaces read as solid cards, no layout shift, responsive at 375/768/1440.
- [ ] **Step E — Commit:** `git add <file> && git commit -m "refactor(landing): retune <section> to app design system"` (+ Co-Authored-By trailer).

---

### Task 8: `components/layout/site-header.tsx`
- Specifics: brand wordmark + orb glyph → gold accent; "Join waitlist" link uses gold; sticky bg → `var(--color-bg)` with `--color-border` bottom hairline. No ScreenshotFrame. No cyan exceptions.

### Task 9: `components/sections/hero.tsx`
- Cyan exceptions: the orb's audio-reactive/listening glow stays cyan (handled in Task 19's orb task — here just don't force the orb element to gold). "Personal assistant in private beta" micro-label → ink-3 eyebrow.
- Primitive swap: ensure CTAs use the new `ButtonLink` (primary gold / secondary outline).
- **ScreenshotFrame slot:** add the flagship shot below the hero CTAs (full-width within the hero container, `priority`):
  ```tsx
  import { ScreenshotFrame } from "@/components/ui/screenshot-frame";
  // …after the CTA row, inside the hero container:
  <div className="mt-14">
    <ScreenshotFrame
      alt="Sirius workflow workspace — live DAG on the left, workflow chat on the right"
      caption="Workflow workspace — live DAG + chat"
      priority
    />
  </div>
  ```

### Task 10: `components/sections/in-practice.tsx`
- **Cyan exceptions (keep cyan):** the running/active operation-chain indicators (READ→SORT→DRAFT, PULL→MERGE→…) — these mean "live". Use `--color-state-listening`. Completed steps → `--color-success`. Everything decorative/headers → gold.
- Primitive swap: render step/status chips with `StatusPill` (`running` cyan, `done` green) instead of bespoke chain pills where present.
- **ScreenshotFrame slot:** per vignette, wrap the existing mock card so the mock is the no-asset fallback — add an optional screenshot above each mock:
  ```tsx
  <ScreenshotFrame
    alt="Sirius — <vignette> in the app"
    caption="<Vignette> in Sirius"
    className="mb-6"
  />
  ```
  (Insert one per vignette block; keep the existing `*-mock.tsx` component directly beneath as the textured fallback.)

### Task 11: `components/sections/workflows.tsx`
- No cyan exceptions (the Sirius dialogue quotes are brand voice → gold accents on emphasised words). Title accent span → gold.
- ScreenshotFrame slot: none (this section is dialogue-driven; keep restrained).

### Task 12: `components/sections/four-ways.tsx`
- The four cards currently use four different accent colors (cyan/green/gold/amber). **Keep semantic differentiation but re-anchor to the app palette:** Voice = `--color-state-listening` (it *is* the live/listening mode — legitimate cyan), Chat = `--color-success`, Feeds = `--color-warning`, Schedules = `--color-accent` (gold). Card frames use `Surface`.
- Primitive swap: wrap each card in `Surface level={1}`.
- ScreenshotFrame slot: none.

### Task 13: `components/sections/three-ideas.tsx`
- Tripartite orb keeps its three-zone coloring but align zone hues to app tokens (memory=gold, action=gold-strong, workflows=cyan-state). List accent highlights → gold.
- **ScreenshotFrame slot:** one supporting shot to the side of the list:
  ```tsx
  <ScreenshotFrame
    alt="Sirius workflows index — runnable workflows with status"
    caption="Workflows, run by name"
  />
  ```
  Map to `/screenshots/workflows-index.png` when available (leave `src` unset now).

### Task 14: `components/sections/local-data.tsx`
- `.band-deep` now uses `--color-surface-deep` (Task 1). Diagram strokes → `--color-border-strong`; "local" node highlighted gold, "cloud" node ink-3. Trust-point check icons → gold. Footnote stays ink-3.
- ScreenshotFrame slot: none.

### Task 15: `components/sections/faq.tsx`
- Question ordinals Q01–Q05 → gold; expand chevron → ink-3, rotates on open (keep). `<details>` open border → `--color-border-strong`. Sticky left title → Fraunces 400.
- ScreenshotFrame slot: none.

### Task 16: `components/sections/final-cta.tsx`
- Orb stays (cyan listening is the orb's own concern). Headline accent "Sirius." → gold. `WaitlistForm` unchanged functionally; only ensure its inputs/buttons inherit the new tokens (Task 18 covers the form).
- ScreenshotFrame slot: none (keep the close restrained per spec).

### Task 17: `components/sections/whats-next.tsx`
- Star map: Sirius star highlighted gold, lesser stars ink-3/ink-4, connecting lines `--color-border-strong`. "SWITCHES · NOZZLES · AXES" fragments → ink-3 eyebrow styling.
- ScreenshotFrame slot: none.

### Task 18: `components/layout/site-footer.tsx` + `components/ui/waitlist-form.tsx`
- Footer: logo gold, italic tagline keeps the *one* allowed display-italic, "Request access →" → gold link, top divider `--color-border`.
- WaitlistForm: inputs use `bg-[var(--color-surface-1)] border-[var(--color-border-strong)] rounded-[var(--radius-sm)]`, focus → gold ring `ring-[rgba(217,185,120,0.32)]` + border `--color-accent`; submit button uses `ButtonLink` primary styling equivalents (or shared classes). Two-stage logic and Airtable calls untouched. Commit both files together.

---

## Task 19: Orb glow constants

**Files:**
- Modify: `components/sirius/orb.tsx`

- [ ] **Step 1: Read** `components/sirius/orb.tsx`; locate the glow color constants / gradient stops.
- [ ] **Step 2:** Set the **warm** glow stops to `rgba(217,185,120,0.18)` → `rgba(217,185,120,0.04)` → transparent, and the **cool/listening** stops to `rgba(108,216,255,0.22)` → `rgba(108,216,255,0.05)` → transparent (exact app values). Do not change the canvas/noise animation logic or audio reactivity.
- [ ] **Step 3: Build + visual gate** — `npm run build`; at `localhost:3000` the idle orb glows warm-gold; granting mic / listening state shifts to cyan. Reduced-motion still calms it.
- [ ] **Step 4: Commit** — `git add components/sirius/orb.tsx && git commit` (msg: `refactor(landing): align orb glow to app warm/cool constants` + trailer).

---

## Task 20: Remove the legacy alias layer

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1:** Re-run the audit grep from Task 2. For any remaining legacy var still referenced in `components/`, replace the reference in that component with the app semantic token (substitution map), committing per file touched.
- [ ] **Step 2:** Once the grep returns no legacy-var references in `components/app`, delete the entire "TEMPORARY legacy-alias layer" block from `:root` in `app/globals.css` (keep only `--font-title`/`--title-*` and the app `@theme`).
- [ ] **Step 3: Build + lint gate** — `npm run build && npm run lint`. Expected: exit 0. If build fails on an undefined var, that var still has a live reference — fix the component (don't restore the alias).
- [ ] **Step 4: Full visual sweep** — scroll the entire page; confirm no unstyled/black regions, gold is the sole action/brand color, cyan only on orb-listening / in-practice running chains / Voice card.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "refactor(landing): drop legacy token alias layer"` (+ trailer).

---

## Task 21: Final QA pass (spec acceptance)

**Files:** none (verification) — fix-forward with extra commits if a check fails.

- [ ] **Step 1: Contrast** — sample `--color-ink-1/2/3` on `#1B1712` and on `#2C261D` with a contrast tool; ink-1 & ink-2 ≥ 4.5:1, ink-3 used only for large/secondary. Record results.
- [ ] **Step 2: CTA singularity** — each viewport has exactly one gold primary CTA; secondary actions are subordinate; no cyan used as a call to action anywhere.
- [ ] **Step 3: Touch/focus** — every interactive element ≥ 44px target, visible gold focus-visible ring, keyboard tab order matches visual order.
- [ ] **Step 4: Reduced motion** — OS reduce-motion on: orb calms, reveals/pulses disabled, no CLS.
- [ ] **Step 5: Responsive** — 375 / 768 / 1024 / 1440: no horizontal scroll, ScreenshotFrame holds aspect ratio in placeholder state, no layout shift.
- [ ] **Step 6: Side-by-side** — open the Sirius app and the landing page together; confirm shared identity (same warm dark, gold brand, Fraunces titles, eyebrow style, pill style).
- [ ] **Step 7: Build + lint** — `npm run build && npm run lint` clean.
- [ ] **Step 8: Commit** any fixes; then stop. Report status and the open question of merging `redesign/app-aligned` (user decides; do not push/PR).

---

## Self-review (completed by plan author)

- **Spec coverage:** token re-skin (T1), accent flip (T1 alias default + per-section T8–18 + audit T2), radii/shadow/background calm (T1, per-section), eyebrow vs giant numerals (T1 step5 + T4), Button/Pill/Surface/eyebrow primitives (T3–6), ScreenshotFrame + asset slots + placement (T7, T9/10/13), orb glow (T19), preserved content/order/stack/form/a11y (sections retuned not rewritten; T18 keeps form logic), QA checklist (T21), branch off Landing-Page-Assessment (header + verified). All spec sections map to a task.
- **Placeholder scan:** no TBD/TODO; every code step has concrete code; the repetitive section loop is defined once with explicit per-file specifics (no "similar to Task N" hand-waving — each section lists its own cyan exceptions and slot).
- **Type consistency:** `ScreenshotFrame` prop names (`src/alt/caption/width/height/priority/className`) consistent across T7 and consumer tasks; `StatusPill` `tone` union consistent T5↔T10/T12; `SectionLabel` signature unchanged (drop-in). `cn` import path `@/lib/utils` matches existing usage.
- **Verification realism:** no fake test runner invented; gates are build+lint+visual, explicitly justified.
