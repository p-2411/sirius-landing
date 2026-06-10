// Landing copy — see docs/superpowers/specs/2026-05-31-landing-revamp-design.md
export const landingContent = {
  meta: {
    wordmark: "Sirius",
    tagline: "One assistant. It knows you. It does the work — the same way, every time.",
  },
  // Tools Sirius works inside. Anything with an API connects, so the list is open-ended.
  integrations: {
    label: "Works inside the tools you already use",
    tools: ["Gmail", "Calendar", "Google Drive", "Notion", "GitHub", "Discord", "Word", "Google Docs", "Google Sheets"],
    more: "…",
  },
  nav: [
    { id: "what-it-does", label: "What it does" },
    { id: "learns-once", label: "How it works" },
    { id: "pricing", label: "Pricing" },
  ],
  downloadCta: { label: "Download for Mac", href: "#cta" },
  hero: {
    eyebrow: "The next step in agentic assistants",
    title: "It knows you.",
    titleAccent: "It does the work.",
    description:
      "An agent that knows your projects and your clients, and works inside the tools you already live in.",
    proof: "Free to start — and it runs entirely on your Mac.",
    micHint: "say anything — watch it go to work",
    micPrivacy: "Your voice stays in your browser. We're not listening.",
    tapFallback: "See it work",
  },
  beat: "You already knew what to do. The bottleneck was being the one holding the context and doing the jumping.",
  whatItDoes: {
    eyebrow: "What it actually does",
    title: "A day, mostly handled.",
    lead: "While you sleep, commute, or sit in another meeting, Sirius is already working.",
    cards: [
      { id: "standup",  time: "08:00", when: "before you're in",   title: "Standup, posted before you are", body: "It pulls the week's commits, closed tickets, and threads, writes the update, and drops it in your team channel." },
      { id: "meeting",  time: "10:45", when: "before your 11:00",  title: "Your next meeting, briefed",     body: "Fifteen minutes ahead, it gathers the last thread, open tasks, and prior notes into a one-page brief, waiting in the calendar invite." },
      { id: "client",   time: "14:30", when: "client email lands", title: "Client changes, already handled", body: "Feedback scattered across emails and a doc. It groups the changes, drafts the easy ones, and flags what actually needs you." },
      { id: "outreach", time: "02:00", when: "while you slept",    title: "The outreach you didn't send",   body: "Fifty people, each needing a real message. It researches every one and drafts them all. You wake up to a review queue, not a blank page." },
    ],
  },
  learnsOnce: {
    eyebrow: "Why it's reliable",
    title: "Guide it once. Then just ask.",
    body: `Every other agent re-thinks the task from scratch on every run: slow, inconsistent, needs babysitting. Sirius turns the first run into a workflow, so after that, "do the thing" just runs.`,
    compare: {
      before: {
        tag: "Other agents",
        label: "re-reasons every run",
        note: "Reloads the context, re-plans the steps, and hopes it lands the same way. It usually doesn't.",
      },
      after: {
        tag: "Sirius",
        label: "decided once · runs in seconds",
        note: "A fixed set of steps it worked out with you once. Same input, same path.",
      },
    },
    stats: [
      { v: "2+ ×", unit: "faster", note: "It runs the steps directly instead of working them out each time." },
      { v: "10×", unit: "more reliable", note: "The steps are fixed once, so a run can't drift from the last one." },
      { v: "¹⁄₁₀", unit: "the cost", note: "No tokens spent re-thinking the same task twice." },
    ],
  },
  oneApp: {
    eyebrow: "One app, not five",
    title: "Your whole stack collapses into one subscription.",
    body: "The chat knows what your automations did this morning. The automations know what you talked about yesterday. Nothing falls between systems, because there is only one system.",
    replaces: ["automation tool", "personal CRM", "email management", "personal agent", "research"],
    becomes: "Sirius",
  },
  rightBrain: {
    eyebrow: "Better answers, smaller bill",
    title: "It always uses the right brain for the job.",
    body: "Sirius isn't one model. It picks whichever frontier model fits the task, and moves to a sharper one the day it ships. You're never locked in, or stuck on last year's model.",
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Start free.",
    tiers: [
      {
        name: "Free",
        was: "",
        price: "$0",
        priceSuffix: "",
        tagline: "Try the whole thing, free.",
        features: [
          "Voice, chat, workflows, and schedules",
          "Runs locally on your Mac",
          "Limited monthly usage",
        ],
        cta: "Download for Mac",
        featured: false,
      },
      {
        name: "Pro",
        was: "$30",
        price: "$20",
        priceSuffix: "/mo",
        tagline: "The same Sirius, just more of it.",
        features: ["Everything in Free", "Much higher usage limits"],
        cta: "Download for Mac",
        featured: true,
      },
      {
        name: "Max",
        was: "",
        price: "$50",
        priceSuffix: "/mo",
        tagline: "For heavy, all-day use.",
        features: ["Everything in Pro", "Top usage limits", "Early access to new features"],
        cta: "Download for Mac",
        featured: false,
      },
    ],
  },
  local: {
    eyebrow: "Local-first",
    title: "Your data stays on your Mac.",
    body: "Your memories, conversations, and files never leave your Mac. The cloud only listens for the triggers that start a workflow; the work itself runs there.",
    items: ["Memories", "Conversations", "Files"],
  },
  // EDIT ME: a real first name (or two) in the signature lands far more trust
  // than a generic one. Keep the quote honest to your actual reason for building.
  maker: {
    quote:
      "Every personal AI we tried felt like a second job. It forgot what we'd told it unless we asked it to go look. Setup meant leaving a machine running in a closet, and every week we re-explained the same tasks from scratch. A real assistant doesn't work like that — it remembers you, keeps your projects straight, and just gets things done. So we built the one that does.",
    signature: "— the people building Sirius",
  },
  cta: {
    title: "Meet Sirius.",
    button: "Download for Mac",
    sub: "macOS · Apple silicon",
  },
  footer: {
    blurb: "One assistant that knows you and works across the tools you use. Local-first, on your Mac.",
  },
} as const;
