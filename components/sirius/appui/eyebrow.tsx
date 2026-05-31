// Copied from the main Sirius app (components/workflow/Eyebrow.tsx) for 1-1
// fidelity in landing screen ports.
import { T, FONT_BODY } from "@/lib/app-theme";

type Props = {
  children: React.ReactNode;
  accent?: "warm" | "cyan" | "dim";
};

export function Eyebrow({ children, accent = "warm" }: Props) {
  return (
    <span
      style={{
        fontSize: 10.5,
        fontFamily: FONT_BODY,
        letterSpacing: 2,
        fontWeight: 600,
        color: accent === "warm" ? T.warm : accent === "cyan" ? T.cyan : T.ink3,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}
