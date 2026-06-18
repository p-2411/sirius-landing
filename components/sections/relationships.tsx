import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { landingContent } from "@/content/landing";

// App theme tokens (faithful to ../sirius/app/app/globals.css) so the card
// reads as the real product component.
const T = {
  s1: "#2C261D", s2: "#342D23", deep: "#14110D",
  ink1: "#F6EFDF", ink2: "rgba(238,232,218,.84)", ink3: "rgba(206,208,197,.62)", ink4: "rgba(196,199,189,.40)",
  border: "rgba(232,224,200,.14)", borderS: "rgba(232,224,200,.24)", accent: "#d9b978",
};

export function RelationshipsSection() {
  const { eyebrow, title, body, card } = landingContent.relationships;
  return (
    <section id="relationships" className="section scroll-mt-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionLabel index="02">{eyebrow}</SectionLabel>
            <h2 className="font-display mt-7 max-w-[16ch] text-[clamp(2rem,4.4vw,3.2rem)] font-light leading-[0.98] tracking-[-0.025em] text-[var(--color-ink-1)]">
              {title}
            </h2>
            <p className="mt-6 max-w-[44ch] text-[1.05rem] leading-relaxed text-[var(--color-ink-3)]">
              {body}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div style={{ background: "#1B1712", borderRadius: 18, padding: "26px 22px", maxWidth: 480, marginInline: "auto", fontFamily: "var(--font-body), system-ui, sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 2px 12px" }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: T.accent }}>{card.lane}</span>
                <span style={{ height: 1, flex: 1, background: T.border }} />
                <span style={{ fontSize: 11, color: T.ink4 }}>1</span>
              </div>
              <div style={{ position: "relative", background: T.s1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 14, boxShadow: "0 6px 18px -16px rgba(0,0,0,.5)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                  <span aria-hidden style={{ flexShrink: 0, fontSize: 16, lineHeight: "20px", marginTop: 1 }}>✉️</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: T.accent }}>{card.eyebrow}</div>
                    <h3 style={{ margin: "4px 0 0", fontFamily: "var(--font-display), Georgia, serif", fontWeight: 400, fontSize: 15, lineHeight: 1.25, letterSpacing: "-.005em", color: T.ink1 }}>{card.title}</h3>
                    <div style={{ marginTop: 2, fontSize: 11.5, color: T.ink4 }}>{card.why}</div>
                  </div>
                </div>
                <div style={{ marginTop: 10, borderRadius: 11, border: `1px solid ${T.borderS}`, overflow: "hidden" }}>
                  <div style={{ padding: "9px 11px", background: T.s2, borderBottom: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 5 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
                      <span style={{ flexShrink: 0, width: 44, fontSize: 9.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: T.ink3 }}>To</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: T.ink1 }}>{card.to}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
                      <span style={{ flexShrink: 0, width: 44, fontSize: 9.5, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: T.ink3 }}>Subject</span>
                      <span style={{ fontSize: 12.5, color: T.ink2 }}>{card.subject}</span>
                    </div>
                  </div>
                  <div style={{ padding: "10px 11px", background: T.deep }}>
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: T.ink3 }}>{card.preview}</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 11 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 9, background: T.accent, color: "#1a1206" }}>{card.actions[0]}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 9, background: "transparent", color: T.ink2, border: `1px solid ${T.borderS}` }}>{card.actions[1]}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: 9, background: "transparent", color: T.ink3, border: `1px solid ${T.border}` }}>{card.actions[2]}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
