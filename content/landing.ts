// Landing copy — see docs/superpowers/specs/2026-05-31-landing-revamp-design.md
export const landingContent = {
  meta: {
    wordmark: "Sirius",
    availability: "Free during beta",
    tagline: "One assistant. It knows you. It does the work.",
  },
  nav: [
    { id: "what-it-does", label: "What it does" },
    { id: "learns-once", label: "How it works" },
    { id: "pricing", label: "Pricing" },
  ],
  downloadCta: { label: "Download for Mac", href: "#cta" },
  hero: {
    title: "One assistant. It knows you.",
    titleAccent: "It does the work.",
    description:
      "Across your inbox, calendar, files, and any app with an API — it holds the context and does the jumping, so you don't.",
    betaPill: "Free during beta",
    micHint: "say anything — watch it go to work",
    micPrivacy: "Your voice stays in your browser. We're not listening.",
    tapFallback: "See it work",
  },
  beat: "You already knew what to do. The bottleneck was being the one holding the context and doing the jumping.",
  whatItDoes: {
    eyebrow: "What it actually does",
    title: "Your week, mostly handled.",
    cards: [
      { id: "standup",  title: "Your standup, ready before you are", body: "It pulls the week's commits, closed tickets, and threads. A draft is waiting before you sit down." },
      { id: "meeting",  title: "Your next meeting, briefed",          body: "Fifteen minutes before, it pulls the last thread, open tasks, and prior notes. You walk in with the file." },
      { id: "client",   title: "Client changes, already done",        body: "Feedback scattered across emails and a doc — it groups the changes, drafts the easy ones, flags what needs you." },
      { id: "outreach", title: "The outreach you didn't send",        body: "Fifty people, each needing a real message. It researches each one and drafts them all. You review and send." },
    ],
  },
  learnsOnce: {
    eyebrow: "Why it's reliable",
    title: "Guide it once. Then just ask.",
    body: `Every other agent re-thinks the task from scratch every run — slow, inconsistent, needs babysitting. Sirius crystallizes that first run into a workflow. After that, “do the morning briefing” runs clean in seconds. Change it by asking; you never rebuild anything.`,
    before: `“First run — you guide it.”`,
    after: `“Do another for X” — it runs itself.`,
  },
  oneApp: {
    eyebrow: "One app, not five",
    title: "Your whole stack collapses into one subscription.",
    body: "The chat knows what your automations did this morning. The automations know what you talked about yesterday. Nothing falls between systems, because there is only one system.",
    replaces: ["automation tool", "personal CRM", "email management", "personal agent", "research"],
    becomes: "Sirius",
  },
  pricing: {
    eyebrow: "Pricing",
    betaBadge: "Limited time — free during beta",
    price: "$XX",
    priceSuffix: "/mo after",
    note: "Less than the tools it replaces. Far less than the assistant it stands in for.",
    cta: "Download for Mac",
  },
  local: {
    eyebrow: "Local-first",
    title: "Plus, your data stays on your Mac.",
    body: "Memories, conversations, files are all stored on your computer. Your automation triggers are listened for on the cloud, and run on your computer.",
  },
  cta: {
    title: "Get the assistant the others were pretending to be.",
    button: "Download for Mac",
    sub: "macOS · free during beta",
  },
  footer: {
    blurb: "One assistant that knows you and acts across everything. Local-first, Mac.",
  },
} as const;
