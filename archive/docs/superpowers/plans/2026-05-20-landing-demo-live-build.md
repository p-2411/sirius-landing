# Landing Demo "Live Build" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the landing demo's dead "waiting on a run" with a deliverable that visibly assembles as the pipeline runs, plus an off-screen "ready" signal and an in-context conversion CTA.

**Architecture:** All demo code already lives in one file (`components/sirius/startup-analyst-demo.tsx`) and shares non-exported helpers (`splitCsvLine`, `countCsvRows`, `MarkdownPreview`, `PHASES`, `PIPELINE_STEPS`, `GROUP_LABELS`). To reuse them without exporting internals or regressing, the new `LiveBuild` component and its styles go in that same file (established pattern). It is rendered only for `contained` mode's `view === "run"`; `/demo` (non-contained) keeps its existing DAG run page untouched. The landing frame component `StartupAnalystDemo` gains a viewport-visibility observer to drive a sticky "ready" pill.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, CSS-in-`<style>` (existing pattern). No test runner in repo — verification is `tsc --noEmit` + `eslint` + `npm run build` + manual `npm run dev`.

**Verification note:** There is no unit-test infrastructure and this is a visual/animation feature. Each task verifies with typecheck + lint; build + manual QA run at the end. This is the deliberate, codebase-appropriate substitute for TDD.

---

## File Structure

- **Modify only:** `components/sirius/startup-analyst-demo.tsx`
  - Add `buildReveal()` pure helper (near other helpers, after `currentPhase`).
  - Add `LiveBuild` function component + its `<style>` (before `StartupAnalystAppDemo`).
  - Wire `LiveBuild` into `StartupAnalystAppDemo`'s `view === "run"` branch for `contained`.
  - Change the first assistant chat line (the reframe copy).
  - Add completion-reveal class + in-context CTA to the `contained` output view.
  - In `StartupAnalystDemo` (frame): add visibility `IntersectionObserver` + sticky ready-pill + its styles.
- No new files (reuse of non-exported helpers makes in-file the correct call).
- No `content/landing.ts` change (CTA copy inlined, consistent with `LiveDemoSection`).

---

### Task 1: `buildReveal` helper

**Files:**
- Modify: `components/sirius/startup-analyst-demo.tsx` (insert after the `currentPhase` function)

- [ ] **Step 1: Add the helper**

Find the existing `currentPhase` function (it ends with a `}` before `function demoTone`). Immediately after `currentPhase`'s closing brace, insert:

```ts
type BuildReveal = {
  rows: number;
  showScore: boolean;
  scoreRows: number;
  companies: number;
  founders: number;
  reportBlocks: number;
  done: boolean;
};

// Maps the pipeline's activeIndex onto how much of each artifact is revealed.
// Phase ranges mirror PHASES: discover 0–4, score 5–8, profiles 9–11, report 12–15.
function buildReveal(
  activeIndex: number,
  completed: boolean,
  totals: { rows: number; companies: number; founders: number; reportBlocks: number },
): BuildReveal {
  if (completed) {
    return {
      rows: totals.rows,
      showScore: true,
      scoreRows: totals.rows,
      companies: totals.companies,
      founders: totals.founders,
      reportBlocks: totals.reportBlocks,
      done: true,
    };
  }
  const ramp = (lo: number, hi: number, max: number) => {
    if (activeIndex < lo) return 0;
    if (activeIndex >= hi) return max;
    return Math.max(1, Math.round(((activeIndex - lo + 1) / (hi - lo + 1)) * max));
  };
  const showScore = activeIndex >= 5;
  return {
    rows: ramp(0, 4, totals.rows),
    showScore,
    scoreRows: showScore ? ramp(5, 8, totals.rows) : 0,
    companies: ramp(9, 11, totals.companies),
    founders: ramp(9, 11, totals.founders),
    reportBlocks: ramp(12, 15, totals.reportBlocks),
    done: false,
  };
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npx eslint components/sirius/startup-analyst-demo.tsx`
Expected: no output, exit 0. (`BuildReveal`/`buildReveal` unused for now is fine — they are exported-by-use in Task 2; if eslint flags unused, proceed to Task 2 before committing.)

- [ ] **Step 3: Commit**

```bash
git add components/sirius/startup-analyst-demo.tsx
git commit -m "feat(demo): add buildReveal helper for live-build reveal mapping"
```

---

### Task 2: `LiveBuild` component — shell, step ticker, streaming CSV

**Files:**
- Modify: `components/sirius/startup-analyst-demo.tsx` (insert a new component immediately before `export function StartupAnalystAppDemo({`)

- [ ] **Step 1: Confirm the CSV shape**

Read `lib/startup-analyst-demo.ts` and note the data CSV header row. The code below detects a score/conviction column by regex with a graceful fallback (no schema assumption needed) — just confirm a `kind: "csv"` file exists.

- [ ] **Step 2: Insert the component**

Immediately before the line `export function StartupAnalystAppDemo({`, insert:

```tsx
function LiveBuild({
  files,
  activeIndex,
  completed,
  phase,
  onSkip,
}: {
  files: StartupAnalystDemoFile[];
  activeIndex: number;
  completed: boolean;
  phase: string;
  onSkip: () => void;
}) {
  const csvFile = files.find((file) => file.kind === "csv");
  const reportFile = files.find((file) => file.group === "report");
  const companyFiles = files.filter((file) => file.group === "companies");
  const founderFiles = files.filter((file) => file.group === "founders");

  const csvRows = csvFile
    ? csvFile.content.trim().split(/\r?\n/).map(splitCsvLine)
    : [];
  const csvHeader = csvRows[0] ?? [];
  const csvBody = csvRows.slice(1);
  const scoreCol = csvHeader.findIndex((c) => /score|conviction|priority|rank/i.test(c));
  const reportBlocks = reportFile ? reportFile.content.split(/\n{2,}/).filter((b) => b.trim()) : [];

  const reveal = buildReveal(activeIndex, completed, {
    rows: csvBody.length,
    companies: companyFiles.length,
    founders: founderFiles.length,
    reportBlocks: reportBlocks.length,
  });

  const shownReport = reportBlocks.slice(0, reveal.reportBlocks).join("\n\n");

  return (
    <section className="sad-lb" aria-label="Sirius assembling the dealflow packet">
      <div className="sad-lb-ticker" aria-live="polite">
        <span className="sad-lb-dot" data-on={!completed} />
        <strong>{completed ? "Pipeline Done" : currentPhase(activeIndex, completed)}</strong>
        <span className="sad-lb-steps">
          {PHASES.filter((p) => p.label !== "Pipeline Done").map((p) => {
            const done = completed || activeIndex > p.range[1];
            const active = !completed && activeIndex >= p.range[0] && activeIndex <= p.range[1];
            return (
              <i key={p.label} data-state={done ? "done" : active ? "active" : "idle"} />
            );
          })}
        </span>
        <button type="button" className="sad-lb-skip" onClick={onSkip}>
          Skip to result →
        </button>
      </div>

      <div className="sad-lb-grid">
        <div className="sad-lb-panel sad-lb-data">
          <header>data/startups.csv · {reveal.rows} rows</header>
          <div className="sad-lb-tablewrap">
            <table>
              <thead>
                <tr>
                  {csvHeader.map((c) => (
                    <th key={c}>{c.replaceAll("_", " ")}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvBody.slice(0, reveal.rows).map((row, ri) => (
                  <tr key={ri} className="sad-lb-row">
                    {csvHeader.map((_, ci) => {
                      const hideScore =
                        ci === scoreCol && !(ri < reveal.scoreRows);
                      return <td key={ci}>{hideScore ? "···" : row[ci]}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="sad-lb-side">
          <div className="sad-lb-panel sad-lb-profiles">
            <header>
              Profiles · {reveal.companies + reveal.founders}/
              {companyFiles.length + founderFiles.length}
            </header>
            <div className="sad-lb-cards">
              {[...companyFiles.slice(0, reveal.companies), ...founderFiles.slice(0, reveal.founders)].map(
                (f) => (
                  <div key={f.id} className="sad-lb-card">
                    <AppIcon name="doc" size={13} />
                    <span>{f.name}</span>
                  </div>
                ),
              )}
              {reveal.companies + reveal.founders === 0 && (
                <p className="sad-lb-muted">Waiting on scored companies…</p>
              )}
            </div>
          </div>

          <div className="sad-lb-panel sad-lb-report">
            <header>{reportFile?.name ?? "report.md"}</header>
            <div className="sad-lb-reportbody">
              {reveal.reportBlocks > 0 ? (
                <MarkdownPreview content={shownReport} />
              ) : (
                <p className="sad-lb-muted">Report drafts once profiles are in…</p>
              )}
              {!completed && reveal.reportBlocks > 0 && (
                <span className="sad-lb-caret" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add the `LiveBuild` styles**

The component references classes not yet styled. They will be added in Task 3 Step 2 (kept together). For now verify it compiles.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npx eslint components/sirius/startup-analyst-demo.tsx`
Expected: exit 0. (`LiveBuild` unused until Task 4 — acceptable; commit happens after Task 3.)

---

### Task 3: `LiveBuild` styles (on-brand, reduced-motion safe)

**Files:**
- Modify: `components/sirius/startup-analyst-demo.tsx`

- [ ] **Step 1: Locate the insertion point**

In `StartupAnalystAppDemo`'s `<style>{`` block, find the rule `.sad-app-chat-entry {` (added previously). Insert the block below immediately **before** `.sad-app-chat-entry {` so it lives with the contained styles.

- [ ] **Step 2: Insert styles**

```css
        .sad-lb {
          flex: 1;
          min-width: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          padding: 16px 22px 20px;
          gap: 14px;
          overflow: hidden;
        }
        .sad-lb-ticker {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12.5px;
          color: var(--color-ink-2);
        }
        .sad-lb-ticker strong {
          color: var(--color-ink-1);
          font-weight: 500;
        }
        .sad-lb-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--color-success);
        }
        .sad-lb-dot[data-on="true"] {
          background: var(--color-state-listening);
          animation: sirius-pulse 1.4s ease-in-out infinite;
        }
        .sad-lb-steps {
          display: inline-flex;
          gap: 5px;
        }
        .sad-lb-steps i {
          width: 22px;
          height: 3px;
          border-radius: 999px;
          background: var(--color-border-strong);
          transition: background 240ms ease;
        }
        .sad-lb-steps i[data-state="active"] { background: var(--color-state-listening); }
        .sad-lb-steps i[data-state="done"] { background: var(--color-success); }
        .sad-lb-skip {
          margin-left: auto;
          border: 0;
          padding: 4px 6px;
          color: var(--color-ink-3);
          background: transparent;
          font: inherit;
          font-size: 12px;
          cursor: pointer;
        }
        .sad-lb-skip:hover { color: var(--color-accent); }
        .sad-lb-grid {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
          gap: 14px;
        }
        .sad-lb-side {
          min-height: 0;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
          gap: 14px;
        }
        .sad-lb-panel {
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          background: var(--color-surface-1);
        }
        .sad-lb-panel header {
          flex-shrink: 0;
          padding: 9px 14px;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-ink-3);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .sad-lb-tablewrap,
        .sad-lb-reportbody,
        .sad-lb-cards {
          flex: 1;
          min-height: 0;
          overflow: auto;
        }
        .sad-lb-data table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .sad-lb-data th,
        .sad-lb-data td {
          padding: 7px 10px;
          text-align: left;
          border-bottom: 1px solid var(--color-border);
          white-space: nowrap;
        }
        .sad-lb-data th {
          position: sticky;
          top: 0;
          background: var(--color-surface-1);
          color: var(--color-ink-2);
          text-transform: capitalize;
        }
        .sad-lb-data td { color: var(--color-ink-2); }
        .sad-lb-row { animation: sad-lb-in 260ms ease both; }
        .sad-lb-cards {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 10px;
        }
        .sad-lb-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          color: var(--color-ink-2);
          font-size: 12px;
          animation: sad-lb-in 260ms ease both;
        }
        .sad-lb-muted {
          margin: 0;
          padding: 14px;
          color: var(--color-ink-4);
          font-size: 12px;
        }
        .sad-lb-reportbody { padding: 4px 16px 16px; position: relative; }
        .sad-lb-reportbody .sad-markdown { padding: 14px 0; }
        .sad-lb-caret {
          display: inline-block;
          width: 7px;
          height: 15px;
          margin-left: 2px;
          background: var(--color-accent);
          animation: sad-lb-caret 1s steps(2) infinite;
        }
        @keyframes sad-lb-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sad-lb-caret { 50% { opacity: 0; } }
        @media (max-width: 760px) {
          .sad-lb { padding: 12px 14px 16px; }
          .sad-lb-grid { grid-template-columns: 1fr; grid-template-rows: minmax(0, 1fr) auto; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sad-lb-dot[data-on="true"],
          .sad-lb-row,
          .sad-lb-card,
          .sad-lb-caret { animation: none !important; }
        }
```

- [ ] **Step 3: Verify + commit**

Run: `npx tsc --noEmit && npx eslint components/sirius/startup-analyst-demo.tsx`
Expected: exit 0.

```bash
git add components/sirius/startup-analyst-demo.tsx
git commit -m "feat(demo): LiveBuild forming-deliverable view + styles"
```

---

### Task 4: Wire `LiveBuild` into the contained run view + reframe copy

**Files:**
- Modify: `components/sirius/startup-analyst-demo.tsx` (`StartupAnalystAppDemo`)

- [ ] **Step 1: Render LiveBuild for contained run**

Find the run branch. It is the JSX after `) : view === "run" ? (` and is a single `<section className="sad-run-page" ...> ... </section>`. Replace the opening `) : view === "run" ? (` and the `<section className="sad-run-page"` ... up to and including its matching `</section>` with a conditional. Concretely, change:

```tsx
        ) : view === "run" ? (
          <section className="sad-run-page" aria-label="Startup analyst run details">
```

to:

```tsx
        ) : view === "run" ? (
          contained ? (
            <LiveBuild
              files={files}
              activeIndex={activeIndex}
              completed={completed}
              phase={phase}
              onSkip={() => {
                setCompleted(true);
                setRunning(false);
                setView("output");
              }}
            />
          ) : (
          <section className="sad-run-page" aria-label="Startup analyst run details">
```

Then find that `<section className="sad-run-page">`'s closing `</section>` (the one immediately before `) : (` that begins the output branch) and change:

```tsx
          </section>
        ) : (
```

to:

```tsx
          </section>
          )
        ) : (
```

- [ ] **Step 2: Reframe the chat acknowledgment**

Find `assistantText` (a `const assistantText = completed ? ... : running ? ... : "Ready. This workflow will discover...";`). Replace its `running` branch string and the trailing ready string so the contained run reads as a reframe. Change the whole `const assistantText = ...;` expression to:

```tsx
  const assistantText = completed
    ? `Done. I generated the report, scored CSV, ${companyCount} company profiles, and ${founderCount} founder briefs.`
    : running
      ? "On it. I'll assemble the dealflow packet — watch it build, or keep scrolling and I'll ping you when it's ready."
      : "Ready. This workflow will discover, score, profile, and package this week's AI infrastructure dealflow.";
```

- [ ] **Step 3: Verify + commit**

Run: `npx tsc --noEmit && npx eslint components/sirius/startup-analyst-demo.tsx`
Expected: exit 0.

```bash
git add components/sirius/startup-analyst-demo.tsx
git commit -m "feat(demo): use LiveBuild for contained run + reframe chat line"
```

---

### Task 5: Completion reveal + in-context CTA (contained output only)

**Files:**
- Modify: `components/sirius/startup-analyst-demo.tsx` (`StartupAnalystAppDemo` output branch + styles)

- [ ] **Step 1: Tag the output section for the reveal + add CTA**

Find the output branch `<section className="sad-app-output" aria-label="Generated startup analyst output">`. Change its opening tag to add a contained-only reveal class:

```tsx
          <section
            className={cn("sad-app-output", contained && "sad-app-output--reveal")}
            aria-label="Generated startup analyst output"
          >
```

Then find the end of that section: the `</div>` that closes `<div className="sad-app-preview-pane" ...>` followed by `</section>`. Immediately before that closing `</section>`, insert the CTA (contained only):

```tsx
            {contained && (
              <div className="sad-app-cta">
                <p>
                  Sirius did this in seconds — and it runs every morning, before
                  you&rsquo;re in.
                </p>
                <a href="#waitlist" className="sad-app-cta-btn">
                  Get Sirius
                </a>
              </div>
            )}
```

- [ ] **Step 2: Confirm the CTA anchor target**

Grep for an existing waitlist anchor: `grep -rn 'id="waitlist"\|#waitlist' components app`. If the id is different (e.g. the final CTA section's id), use that exact `#<id>` in the `href` above instead of `#waitlist`. Do not invent one.

- [ ] **Step 3: Add reveal + CTA styles**

In the same `<style>` block, immediately before `.sad-lb {` (added in Task 3), insert:

```css
        .sad-app-output--reveal { animation: sad-reveal 520ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .sad-app-output--reveal::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(105deg, transparent 40%, rgba(var(--color-accent-rgb), 0.16) 50%, transparent 60%);
          transform: translateX(-100%);
          animation: sad-sweep 900ms ease 120ms 1 forwards;
        }
        .sad-app-output--reveal { position: relative; }
        @keyframes sad-reveal {
          from { opacity: 0; transform: translateY(10px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sad-sweep { to { transform: translateX(100%); } }
        .sad-app-cta {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          padding: 16px 22px;
          border-top: 1px solid var(--color-border);
          background: var(--color-surface-deep);
        }
        .sad-app-cta p {
          margin: 0;
          max-width: 52ch;
          color: var(--color-ink-1);
          font-size: 14px;
        }
        .sad-app-cta-btn {
          display: inline-flex;
          align-items: center;
          height: 40px;
          padding: 0 18px;
          border-radius: 8px;
          color: var(--color-bg);
          background: var(--color-accent);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
        }
        .sad-app-cta-btn:hover { background: var(--color-accent-strong); }
        @media (prefers-reduced-motion: reduce) {
          .sad-app-output--reveal,
          .sad-app-output--reveal::after { animation: none !important; }
        }
```

Note: `.sad-app-output` is `display: grid` with two columns; `.sad-app-cta` uses `grid-column: 1 / -1` so it spans full width as a footer row. Confirm `.sad-app-output` has no fixed `grid-template-rows` that would clip the new row; it uses `grid-template-columns` only, so the CTA forms a new auto row — acceptable.

- [ ] **Step 4: Verify + commit**

Run: `npx tsc --noEmit && npx eslint components/sirius/startup-analyst-demo.tsx`
Expected: exit 0.

```bash
git add components/sirius/startup-analyst-demo.tsx
git commit -m "feat(demo): completion reveal + in-context CTA (contained)"
```

---

### Task 6: Off-screen "ready" pill in the landing frame

**Files:**
- Modify: `components/sirius/startup-analyst-demo.tsx` (`StartupAnalystDemo` frame component)

- [ ] **Step 1: Add visibility state + observer**

In `StartupAnalystDemo`, there is an existing reveal `useEffect` with an `IntersectionObserver` that disconnects after first intersection. Add a separate, persistent observer. Find:

```tsx
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<"chat" | "running" | "output">("chat");
```

Add below it:

```tsx
  const [inView, setInView] = useState(true);
```

Then, after the existing reveal `useEffect` (the one that calls `observer.disconnect()`), add:

```tsx
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const vis = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    vis.observe(el);
    return () => vis.disconnect();
  }, []);
```

- [ ] **Step 2: Render the pill**

In `StartupAnalystDemo`'s returned JSX, find the `<div className="sad-card" data-mode={phase}>` ... `</div>` and the sibling `<style>{`` block. Immediately after the closing `</div>` of `.sad-card` and before `<style>{``, insert:

```tsx
      {phase !== "chat" && !inView && (
        <button
          type="button"
          className="sad-pill"
          data-ready={phase === "output" ? "true" : "false"}
          onClick={() =>
            rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        >
          <span className="sad-pill-dot" />
          {phase === "output"
            ? "Dealflow packet ready — view"
            : "Sirius is finishing your dealflow packet…"}
        </button>
      )}
```

- [ ] **Step 3: Add pill styles**

In `StartupAnalystDemo`'s own `<style>{`` block (the frame's, containing `.sad-card {`), before the closing `` `}</style> ``, add:

```css
        .sad-pill {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 50;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          max-width: min(86vw, 360px);
          padding: 12px 16px;
          border: 1px solid var(--color-border-strong);
          border-radius: 999px;
          color: var(--color-ink-1);
          background: var(--color-surface-deep);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
          font: inherit;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          animation: sad-pill-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .sad-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--color-state-listening);
          animation: sirius-pulse 1.4s ease-in-out infinite;
        }
        .sad-pill[data-ready="true"] {
          border-color: rgba(var(--color-accent-rgb), 0.6);
        }
        .sad-pill[data-ready="true"] .sad-pill-dot {
          background: var(--color-accent);
        }
        @keyframes sad-pill-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sad-pill { animation: none; }
          .sad-pill-dot { animation: none; }
        }
```

- [ ] **Step 4: Verify + commit**

Run: `npx tsc --noEmit && npx eslint components/sirius/startup-analyst-demo.tsx`
Expected: exit 0.

```bash
git add components/sirius/startup-analyst-demo.tsx
git commit -m "feat(demo): off-screen ready pill driven by viewport visibility"
```

---

### Task 7: Full verification + manual QA

**Files:** none (verification only)

- [ ] **Step 1: Typecheck + lint (whole project surface)**

Run: `npx tsc --noEmit && npx eslint app/page.tsx app/demo/page.tsx components/sections/live-demo.tsx components/sirius/startup-analyst-demo.tsx components/sirius/appui/chat-pane.tsx`
Expected: exit 0, no output.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: "Compiled successfully", route table lists `○ /` and `○ /demo` (both static), no errors.

- [ ] **Step 3: Manual QA (run `npm run dev`, open `/`)**

Confirm each:
- [ ] Chat entry shows prefilled message + pulsing send; no app rail/topbar.
- [ ] Send → assistant reframe line; card grows; LiveBuild shows: CSV rows streaming during discovery, score column filling (`···` → values), profile cards appearing, report writing in. Step ticker advances; AGENT_TASK beats ~1s.
- [ ] "Skip to result →" jumps straight to output.
- [ ] Scrolling the card out of view while running shows the sticky pill ("…finishing…"); on completion it flips to "ready"; clicking it scrolls back.
- [ ] Completion: output does the one-time reveal + gold sweep; CTA row present and links to the real waitlist anchor.
- [ ] Esc returns to the chat entry; page never auto-scrolls on step completion.
- [ ] `/demo` route still shows the original DAG run page (LiveBuild NOT used there).
- [ ] OS "reduce motion" on: no pulsing/sweeping/streaming animations; content still fully readable.

- [ ] **Step 4: Commit any QA fixes, then final commit**

```bash
git add -A
git commit -m "chore(demo): live-build QA pass"
```

---

## Self-Review

**Spec coverage (§5):**
- §5.1 reframe → Task 4 Step 2 ✓
- §5.2 forming deliverable + ticker → Tasks 2,3 ✓
- §5.3 persistent Skip + Esc → Task 2 (`sad-lb-skip`) + existing Esc handler ✓
- §5.4 off-screen ready pill + IO + reduced-motion → Task 6 ✓
- §5.5 orchestrated reveal + in-context CTA → Task 5 ✓
- §5.6 pacing (1s AGENT_TASK) → already implemented (no task needed) ✓
- §5.7 progressive-loading / no-CLS (reserved skeleton panels) / continuity / reduced-motion → Tasks 2,3,5,6 ✓
- Scope "contained only; /demo untouched" → Tasks 4,5 gate on `contained`; Task 7 Step 3 verifies /demo ✓

**Placeholder scan:** No TBD/TODO; all code blocks complete; the two "confirm" steps (CSV header, waitlist anchor) are read-only confirmations of values the code already handles via regex/grep, not deferred logic.

**Type consistency:** `BuildReveal`/`buildReveal` (Task 1) consumed in Task 2; `LiveBuild` prop names (`files/activeIndex/completed/phase/onSkip`) match the call site in Task 4; `inView` state (Task 6 Step 1) used in Task 6 Step 2; class names in Task 2 JSX all defined in Task 3 CSS (`sad-lb`, `sad-lb-ticker`, `sad-lb-dot`, `sad-lb-steps`, `sad-lb-skip`, `sad-lb-grid`, `sad-lb-side`, `sad-lb-panel`, `sad-lb-data`, `sad-lb-tablewrap`, `sad-lb-row`, `sad-lb-cards`, `sad-lb-card`, `sad-lb-muted`, `sad-lb-reportbody`, `sad-lb-caret`).
