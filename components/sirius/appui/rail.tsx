import { Orb } from "@/components/sirius/orb";
import { AppIcon } from "./app-icon";
import type { AppIconName } from "./app-icon";

/**
 * Rail — matches app Rail.tsx exactly.
 * 72px wide, surface-deep bg, borderRight, orb logo at top,
 * nav buttons 52×52 rounded-r-[10px], active = cyan + left bar with glow.
 */

type NavItem = { id: string; icon: AppIconName; label: string };

const ITEMS: NavItem[] = [
  { id: "work",      icon: "work",     label: "Work" },
  { id: "workflows", icon: "flows",    label: "Workflows" },
  { id: "feed",      icon: "feed",     label: "Feed" },
];

const FOOTER_ITEMS: NavItem[] = [
  { id: "settings", icon: "settings", label: "Settings" },
];

export function Rail({ active = "flows" }: { active?: string }) {
  const homeActive = active === "voice";

  return (
    <nav
      aria-label="Primary"
      style={{
        width: 72,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        paddingTop: 20,
        paddingBottom: 20,
        background: "var(--color-surface-deep)",
        borderRight: "1px solid var(--color-border)",
        height: "100%",
      }}
    >
      {/* Spacer top — logo+nav group is vertically centered */}
      <div style={{ flex: 1 }} />

      {/* Logo orb (home) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "stretch" }}>
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: "0 10px 10px 0",
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 9999, overflow: "hidden", flexShrink: 0 }}>
                <Orb className="!h-full !w-full" staticRender />
              </div>
            {homeActive && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  top: 10,
                  bottom: 10,
                  width: 2,
                  borderRadius: 2,
                  background: "var(--color-state-listening-strong)",
                  boxShadow: "0 0 10px rgba(108,216,255,0.55)",
                }}
              />
            )}
          </div>
        </div>

        {/* Primary nav */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          {ITEMS.map((item) => (
            <li key={item.id}>
              <RailButton item={item} active={active === item.id} />
            </li>
          ))}
        </ul>
      </div>

      {/* Spacer bottom */}
      <div style={{ flex: 1 }} />

      {/* Footer (settings) */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {FOOTER_ITEMS.map((item) => (
          <li key={item.id}>
            <RailButton item={item} active={active === item.id} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function RailButton({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <div
      style={{
        position: "relative",
        marginLeft: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 52,
        height: 52,
        borderRadius: "0 10px 10px 0",
        color: active
          ? "var(--color-state-listening-strong)"
          : "var(--color-ink-3)",
      }}
      title={item.label}
    >
      <AppIcon name={item.icon} size={18} />
      {active && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 10,
            bottom: 10,
            width: 2,
            borderRadius: 2,
            background: "var(--color-state-listening-strong)",
            boxShadow: "0 0 10px rgba(108,216,255,0.55)",
          }}
        />
      )}
    </div>
  );
}
