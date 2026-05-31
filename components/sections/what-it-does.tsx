import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { AppIcon, type AppIconName } from "@/components/sirius/appui";
import { landingContent } from "@/content/landing";

type Meta = { icon: AppIconName; sources: string[]; out: string; tag: string };

// The "how" lives as a sources → output flow, not a paragraph.
const META: Record<string, Meta> = {
  standup: { icon: "doc", sources: ["commits", "tickets", "team chats"], out: "draft", tag: "Mon 8:00" },
  meeting: { icon: "clock", sources: ["last thread", "open tasks", "notes"], out: "brief", tag: "15 min before" },
  client: { icon: "mail", sources: ["email", "codebase"], out: "edits + reply", tag: "drafted" },
  outreach: { icon: "send", sources: ["50 people", "researched"], out: "50 drafts", tag: "ready to send" },
};

export function WhatItDoesSection() {
  const { eyebrow, title, cards } = landingContent.whatItDoes;
  return (
    <section id="what-it-does" className="scroll-mt-24 py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionLabel tone="warm">{eyebrow}</SectionLabel>
          <h2 className="font-display mt-7 max-w-[20ch] text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.95] tracking-[-0.028em] text-[var(--color-ink-1)]">
            {title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2">
          {cards.map((c) => {
            const m = META[c.id];
            if (!m) return null;
            return (
              <RevealItem key={c.id} className="h-full">
                <Card title={c.title} meta={m} />
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}

function Card({ title, meta }: { title: string; meta: Meta }) {
  const { icon, sources, out, tag } = meta;
  return (
    <div className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 transition-colors duration-200 hover:border-[rgba(240,179,90,0.4)]">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[rgba(240,179,90,0.22)] bg-[rgba(240,179,90,0.1)] text-[var(--color-accent)]">
          <AppIcon name={icon} size={16} />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]">{tag}</span>
      </div>

      <h3 className="font-display mt-4 max-w-[22ch] text-[clamp(1.2rem,1.7vw,1.5rem)] font-normal leading-tight text-[var(--color-ink-1)]">
        {title}
      </h3>

      {/* the "how": dark pills for the steps → faint text for the output */}
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-6">
        {sources.map((s) => (
          <span
            key={s}
            className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface-deep)] px-2 py-1 text-[11px] text-[var(--color-ink-2)]"
          >
            {s}
          </span>
        ))}
        <span className="text-[13px] text-[var(--color-ink-4)]" aria-hidden>→</span>
        <span className="font-mono text-[11px] text-[var(--color-ink-3)]">{out}</span>
      </div>
    </div>
  );
}
