// SirusLogo.jsx — Sirus brand lockup
// Asset: sirus-mark.png (transparent, black galloping horse). Use filter:invert(1) on dark.
// Type: Inter, weight 500, letter-spacing -0.02em (matches brand system).

export function SirusLogo({
  variant = "horizontal", // "horizontal" | "stacked" | "mark"
  theme = "light",        // "light" (black on light) | "dark" (white on dark)
  height = 32,            // mark height in px
  showWordmark = true,
}) {
  const dark = theme === "dark";
  const ink = dark ? "#ffffff" : "#000000";
  const stacked = variant === "stacked";
  const markOnly = variant === "mark" || !showWordmark;

  const mark = (
    <img
      src="/sirus-mark.png"
      alt="Sirus"
      style={{
        height,
        width: "auto",
        display: "block",
        filter: dark ? "invert(1)" : "none",
      }}
    />
  );

  if (markOnly) return mark;

  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: stacked ? "column" : "row",
        alignItems: "center",
        gap: stacked ? height * 0.22 : height * 0.36,
      }}
    >
      {mark}
      <span
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 500,
          fontFeatureSettings: "'ss01'",
          letterSpacing: "-0.02em",
          fontSize: height * 0.78,
          lineHeight: 1,
          color: ink,
        }}
      >
        Sirus
      </span>
    </span>
  );
}
