import { Orb } from "@/components/sirius/orb";
import { AppEyebrow } from "./app-eyebrow";
import { AppIcon } from "./app-icon";

export type ChatMsg = {
  role: "user" | "assistant";
  text: string;
};

/**
 * ChatPane — faithful static port of the app's workflow chat pane.
 *
 * Matches the app's [name]/page.tsx chat section and MessageBubble.tsx exactly:
 * - outer: surface-1 bg, 1px border, rounded-12, flex col
 * - header: padding 12px 18px, borderBottom, eyebrow left + dim subtitle right
 * - messages: flex-1, gap 14px, padding 8px 12px
 *   - user: row-reverse, 24px avatar "Y", bubble #4A331A rounded-14 p-[12px_16px] 14px 1.55
 *   - assistant: flex gap-3, Orb 22px, prose 65% 14.5px 1.6
 * - composer: gap 10, pt-12, borderTop; Orb 44px, faux textarea, Send button
 */
export function ChatPane({
  header = "Chat with this workflow",
  subtitle = "Sirius knows what this workflow is",
  messages,
}: {
  header?: string;
  subtitle?: string;
  messages: ChatMsg[];
}) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--color-surface-1)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Header bar — padding 12px 18px per app */}
      <div
        style={{
          padding: "12px 18px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <AppEyebrow accent="dim">{header}</AppEyebrow>
        <span
          style={{
            fontSize: 11,
            fontFamily: "var(--font-sans)",
            color: "var(--color-ink-4)",
            fontWeight: 500,
          }}
        >
          {subtitle}
        </span>
      </div>

      {/* Body wrapper — 14px horizontal + bottom padding per app */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          padding: "0 14px 14px",
        }}
      >
      {/* Message list — flex-1 overflow-hidden flex-col gap-14 padding 8px 12px */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "8px 12px",
        }}
      >
        {messages.map((msg, i) =>
          msg.role === "user" ? (
            /* User: row-reverse, 24px avatar, bubble */
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              {/* Avatar 24px circle "Y" */}
              <div
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: 9999,
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-ink-2)",
                  fontSize: 11,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                Y
              </div>
              {/* Bubble */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "78%",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 14,
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--color-ink-1)",
                    background: "var(--color-bubble-user)",
                    border: "1px solid var(--color-border)",
                    boxShadow: "0 1px 0 rgba(0,0,0,0.18)",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ) : (
            /* Assistant: flex gap-3, Orb 22, prose 65% */
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <div style={{ flexShrink: 0, paddingTop: 2 }}>
                <div style={{ width: 22, height: 22, borderRadius: 9999, overflow: "hidden", flexShrink: 0 }}>
                  <Orb className="!h-full !w-full" staticRender />
                </div>
              </div>
              <p
                style={{
                  maxWidth: "65%",
                  minWidth: 0,
                  paddingTop: 1,
                  fontFamily: "var(--font-sans)",
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: "var(--color-ink-1)",
                  margin: 0,
                }}
              >
                {msg.text}
              </p>
            </div>
          ),
        )}
      </div>

      {/* Composer — gap 10, pt-12, borderTop per app Composer.tsx */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          paddingTop: 12,
          paddingBottom: 14,
          borderTop: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        {/* Orb button 44×44 */}
        <div
          style={{
            flexShrink: 0,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 9999, overflow: "hidden", flexShrink: 0 }}>
            <Orb className="!h-full !w-full" staticRender />
          </div>
        </div>

        {/* Faux textarea — h-[44px] rounded-[10px] px-[12px] py-[11px] text-[14px] */}
        <div
          style={{
            flex: 1,
            height: 44,
            borderRadius: 10,
            padding: "11px 12px",
            fontSize: 14,
            fontFamily: "var(--font-sans)",
            color: "var(--color-ink-4)",
            background: "var(--color-surface-1)",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
          }}
        >
          Send a message…
        </div>

        {/* Send button — app primary md: h-11 px-4 rounded-[8px] text-[13px] font-medium */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            height: 44,
            paddingLeft: 16,
            paddingRight: 16,
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            background: "var(--color-accent)",
            color: "var(--color-bg)",
            flexShrink: 0,
          }}
        >
          <AppIcon name="send" size={13} stroke="currentColor" />
          Send
        </div>
      </div>
      </div>
    </div>
  );
}
