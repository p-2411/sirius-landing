import { landingContent } from "@/content/landing";
import { Orb } from "@/components/sirius/orb";
import { AppIcon } from "@/components/sirius/appui";
import type { AppIconName } from "@/components/sirius/appui";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Surface } from "@/components/ui/surface";

const CARD_META: Record<
  string,
  {
    icon: AppIconName;
    accent: string;
    rail: string;
    comingSoon?: boolean;
  }
> = {
  voice: {
    icon: "voice",
    accent: "var(--color-state-listening-strong)",
    rail: "Home",
  },
  chat: {
    icon: "work",
    accent: "var(--color-success)",
    rail: "Work",
  },
  feeds: {
    icon: "feed",
    accent: "var(--color-warning)",
    rail: "Feed preview",
    comingSoon: true,
  },
  schedules: {
    icon: "clock",
    accent: "var(--color-accent)",
    rail: "Schedule preview",
    comingSoon: true,
  },
};

function VoiceSurface() {
  return (
    <div className="flex min-h-[156px] flex-col items-center justify-center gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-deep)] px-5 py-6">
      <div className="h-20 w-20 overflow-hidden rounded-full">
        <Orb className="!h-full !w-full" staticRender listening />
      </div>
      <p className="text-center text-[12.5px] leading-[1.45] text-[var(--color-ink-2)]">
        &ldquo;Sirius, what changed since yesterday?&rdquo;
      </p>
      <div className="flex items-end gap-[3px]" aria-hidden="true">
        {[8, 14, 10, 18, 12, 7].map((h, i) => (
          <span
            key={i}
            className="w-[2px] rounded-full bg-[var(--color-state-listening-strong)]"
            style={{ height: h }}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonLine({ w }: { w: string }) {
  return (
    <span
      className="block h-2 rounded-full bg-[var(--color-border-strong)]"
      style={{ width: w }}
    />
  );
}

/* Mirrors the app chat pane (ChatPane): header, assistant orb + prose,
   right-aligned user bubble, composer with orb + input + send — message
   text replaced with skeleton rows. */
function ChatSurface() {
  return (
    <div className="flex min-h-[156px] flex-col overflow-hidden rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-1)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3.5 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-3)]">
          Chat
        </span>
        <span aria-hidden="true" className="h-1.5 w-16 rounded-full bg-[var(--color-border)]" />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3.5 px-3 py-3.5">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 h-[18px] w-[18px] shrink-0 overflow-hidden rounded-full">
            <Orb className="!h-full !w-full" staticRender />
          </div>
          <p className="w-[76%] pt-0.5 text-[12px] leading-[1.5] text-[var(--color-ink-2)]">
            Or speak and the text is transcribed for you.
          </p>
        </div>

        <div className="flex flex-row-reverse items-start gap-2">
          <div
            aria-hidden="true"
            className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border border-[var(--color-border)]"
          />
          <div className="flex w-[62%] flex-col gap-1.5 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bubble-user)] px-3 py-2.5">
            <SkeletonLine w="92%" />
            <SkeletonLine w="50%" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--color-border)] px-3 py-2.5">
        <div
          aria-hidden="true"
          title="Tap to talk"
          className="h-7 w-7 shrink-0 overflow-hidden rounded-full"
        >
          <Orb className="!h-full !w-full" staticRender listening />
        </div>
        <div className="h-7 flex-1 rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-surface-2)]" />
        <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--color-accent)] text-[var(--color-bg)]">
          <AppIcon name="send" size={11} stroke="currentColor" />
        </div>
      </div>
    </div>
  );
}

/* Coming-soon surfaces carry no fake preview — a quiet dashed placeholder
   states it plainly instead. */
function ComingSoonSurface({ icon, accent }: { icon: AppIconName; accent: string }) {
  return (
    <div className="flex min-h-[156px] flex-col items-center justify-center gap-3.5 rounded-[10px] border border-dashed border-[var(--color-border-strong)] px-5 py-6 text-center">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)]"
        style={{ color: accent, opacity: 0.55 }}
      >
        <AppIcon name={icon} size={20} />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-ink-4)]">
        Coming soon
      </span>
    </div>
  );
}

function CardSurface({ id }: { id: string }) {
  if (id === "voice") return <VoiceSurface />;
  if (id === "chat") return <ChatSurface />;
  const meta = CARD_META[id];
  return <ComingSoonSurface icon={meta.icon} accent={meta.accent} />;
}

export function FourWaysSection() {
  const { sectionLabel, leadIn, items } = landingContent.fourWays;

  return (
    <section id="four-ways" className="band-deep relative scroll-mt-24 py-24 md:py-32">
      <Container>
        <SectionLabel index="03" tone="cyan">{sectionLabel}</SectionLabel>
        <h2 className="font-display text-balance mt-7 max-w-[20ch] text-[clamp(2.4rem,5.2vw,4rem)] leading-[0.92] tracking-[-0.028em] text-[var(--color-ink-1)] font-normal">
          Command Sirius through{" "}
          <em className="font-display-italic not-italic" style={{ color: "var(--color-accent)" }}>
            the surfaces you already use.
          </em>
        </h2>
        <p className="mt-7 max-w-[52ch] text-[clamp(0.98rem,1.25vw,1.08rem)] leading-[1.68] text-[var(--color-ink-2)]">
          {leadIn}
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-6">
          {items.map((item, idx) => {
            const meta = CARD_META[item.id];
            const order = String(idx + 1).padStart(2, "0");
            return (
              <Surface key={item.id} level={1} className="relative flex flex-col p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface-deep)]"
                      style={{ color: meta.accent }}
                    >
                      <AppIcon name={meta.icon} size={17} />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-3)]">
                      {meta.rail}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-ink-4)]">
                    {order}
                  </span>
                </div>

                <CardSurface id={item.id} />

                <h3 className="mt-6 font-display text-[1.35rem] leading-tight font-normal text-[var(--color-ink-1)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-[var(--color-ink-2)]">
                  {item.body}
                </p>
              </Surface>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
