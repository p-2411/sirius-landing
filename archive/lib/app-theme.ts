// Copied from the main Sirius app (app/app/lib/theme.ts) so landing components
// can mirror real app screens 1-1. These resolve against the same CSS variables
// the landing already defines in app/globals.css.

export const T = {
  // Backgrounds
  bg: "var(--color-bg)",
  bg2: "var(--color-surface-1)",
  bgMuted: "var(--color-surface-1)",
  bgDeep: "var(--color-surface-deep)",
  surface: "var(--color-surface-1)",
  surfaceRaised: "var(--color-surface-2)",
  surfacePanel: "var(--color-surface-2)",
  surfaceInset: "var(--color-surface-deep)",
  surfaceElev: "var(--color-surface-1)",
  // Chat bubble fills
  bubbleAssistant: "var(--color-bubble-assistant)",
  bubbleUser: "var(--color-bubble-user)",
  // Borders
  border: "var(--color-border)",
  borderStrong: "var(--color-border-strong)",
  // Ink
  ink: "var(--color-ink-1)",
  ink2: "var(--color-ink-2)",
  ink3: "var(--color-ink-3)",
  ink4: "var(--color-ink-4)",
  ornament: "var(--color-accent-muted)",
  // Accents
  cyan: "var(--color-state-listening)",
  cyanStrong: "var(--color-state-listening-strong)",
  cyanRGB: "155, 214, 229",
  cyanStrongRGB: "108, 216, 255",
  warm: "var(--color-accent)",
  warmRGB: "217, 185, 120",
  warmMuted: "var(--color-accent-muted)",
  warmMutedRGB: "140, 111, 60",
  // Status
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  error: "var(--color-danger)",
  successRGB: "167, 219, 178",
  warningRGB: "240, 200, 121",
  errorRGB: "240, 163, 163",
} as const;

export const FONT_DISPLAY = "var(--font-display)";
export const FONT_BODY = "var(--font-sans)";
export const FONT_MONO = "var(--font-mono)";
