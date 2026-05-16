import { Orb } from "@/components/sirius/orb";
import { Rail } from "./rail";

export function VoiceHomeShot() {
  return (
    <div
      style={{
        display: "flex",
        width: 1360,
        height: 850,
        background: "var(--color-bg)",
        fontFamily: "var(--font-sans)",
        color: "var(--color-ink-1)",
        overflow: "hidden",
      }}
    >
      <Rail active="voice" />
      <main
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          padding: "48px 24px",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "42%",
            width: 760,
            height: 760,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle closest-side, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.42) 40%, rgba(0,0,0,0.14) 70%, rgba(0,0,0,0) 100%)",
            borderRadius: "50%",
          }}
        />
        <div style={{ position: "relative", width: 300, height: 300 }}>
          <Orb className="!h-full !w-full" staticRender />
        </div>
        <div
          style={{
            minHeight: 24,
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            color: "var(--color-ink-3)",
          }}
        >
          Tap the orb to talk (or press command /).
        </div>
        <div
          style={{
            width: "min(640px, 92%)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--color-ink-3)",
              textAlign: "center",
              lineHeight: 1.45,
              maxWidth: 520,
            }}
          >
            <span style={{ color: "var(--color-ink-4)" }}>You · </span>
            Pull together the client update from this week and save the steps.
          </div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 17,
              color: "var(--color-ink-1)",
              lineHeight: 1.5,
              textAlign: "center",
              maxWidth: 600,
              minHeight: "1.5em",
            }}
          >
            I pulled the latest thread, drafted the update, and paused before sending so you can approve it.
          </div>
        </div>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "var(--color-ink-4)",
            letterSpacing: 0.4,
          }}
        >
          or to type: command K
        </div>
      </main>
    </div>
  );
}
