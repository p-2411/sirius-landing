import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { AppIcon, type AppIconName } from "@/components/sirius/appui";
import { landingContent } from "@/content/landing";

type Meta = { icon: AppIconName; tag: string; featured?: boolean };
const META: Record<string, Meta> = {
  standup: { icon: "doc", tag: "Mon 8:00 · ready", featured: true },
  meeting: { icon: "clock", tag: "15 min before" },
  client: { icon: "mail", tag: "reply drafted" },
  outreach: { icon: "send", tag: "50 drafted", featured: true },
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
            const m = META[c.id] ?? { icon: "spark", tag: "" };
            return (
              <RevealItem key={c.id} className={m.featured ? "h-full sm:col-span-2" : "h-full"}>
                <Card title={c.title} body={c.body} icon={m.icon} tag={m.tag} id={c.id} featured={m.featured} />
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Container>
    </section>
  );
}

function Card({
  title,
  body,
  icon,
  tag,
  id,
  featured,
}: {
  title: string;
  body: string;
  icon: AppIconName;
  tag: string;
  id: string;
  featured?: boolean;
}) {
  return (
    <div className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6 transition-colors duration-200 hover:border-[rgba(240,179,90,0.4)]">
      <div className={featured ? "flex items-start justify-between gap-8" : "flex h-full flex-col"}>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[rgba(240,179,90,0.22)] bg-[rgba(240,179,90,0.1)] text-[var(--color-accent)]">
            <AppIcon name={icon} size={16} />
          </span>
          <h3 className="font-display mt-4 text-[19px] font-normal leading-tight text-[var(--color-ink-1)]">
            {title}
          </h3>
          <p className="mt-2.5 max-w-[42ch] text-[14px] leading-[1.6] text-[var(--color-ink-2)]">{body}</p>
          <span className="mt-auto pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-3)]">
            <span className="text-[var(--color-state-listening-strong)]">◷</span> {tag}
          </span>
        </div>

        {featured && (
          <div className="hidden w-[200px] shrink-0 self-stretch sm:block">
            {id === "outreach" ? <OutreachArtifact /> : <DraftArtifact />}
          </div>
        )}
      </div>
    </div>
  );
}

function DraftArtifact() {
  return (
    <div className="flex h-full flex-col gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-deep)] p-3.5">
      <span className="font-mono text-[9px] text-[var(--color-ink-4)]">reports/standup.md</span>
      <div className="mt-1 flex flex-col gap-2">
        <div className="h-1.5 w-[92%] rounded-full bg-[var(--color-surface-2)]" />
        <div className="h-1.5 w-[78%] rounded-full bg-[var(--color-surface-2)]" />
        <div className="h-1.5 w-[85%] rounded-full bg-[var(--color-surface-2)]" />
        <div className="h-1.5 w-[60%] rounded-full bg-[var(--color-surface-2)]" />
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-[10px] text-[var(--color-success)]">
        <AppIcon name="check" size={11} /> draft ready
      </span>
    </div>
  );
}

function OutreachArtifact() {
  const names = ["Dana K. · founder, Relay", "Wei L. · founder, Kompose", "Priya M. · founder, Arc"];
  return (
    <div className="flex h-full flex-col gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-deep)] p-3.5">
      {names.map((n) => (
        <span
          key={n}
          className="flex items-center gap-2 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface-1)] px-2.5 py-1.5 text-[10px] text-[var(--color-ink-2)]"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-success)]" />
          <span className="truncate">{n}</span>
        </span>
      ))}
      <span className="mt-auto font-mono text-[9px] text-[var(--color-ink-4)]">+ 47 more drafted</span>
    </div>
  );
}
