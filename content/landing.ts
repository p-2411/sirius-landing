// Landing copy — see docs/superpowers/specs/2026-06-16-sirus-cofounder-rebrand-design.md
export const landingContent = {
  meta: {
    wordmark: "Sirus",
    tagline: "Your AI cofounder. It learns the business, then runs it with you.",
  },
  integrations: {
    label: "Works inside the tools you run the business in",
    tools: ["Gmail", "Calendar", "Google Drive", "Notion", "Slack", "Superhuman", "Granola", "HubSpot", "Stripe", "Zapier"],
    more: "+ anything with an API",
  },
  nav: [
    { id: "how-it-learns", label: "How it learns you" },
    { id: "while-you-sleep", label: "What it does" },
    { id: "pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ],
  downloadCta: { label: "Download for Mac", href: "#cta" },
  hero: {
    eyebrow: "Your AI cofounder",
    title: "Stop explaining yourself.",
    titleAccent: "Your cofounder already knows.",
    description:
      "Sirus sits in on your meetings, reads your inbox and CRM, and builds the full picture — you, your business, every client — then runs the work across the tools you already use.",
    proof: "Free to start — and it runs on your Mac.",
    micHint: "say anything — watch it go to work",
    micPrivacy: "Your voice stays in your browser. We're not listening.",
    tapFallback: "See it work",
  },
  howItLearns: {
    eyebrow: "How it learns you",
    title: "It learns the business on its own.",
    lead: "Every other assistant makes you feed it. Sirus picks it up itself — so it just knows you, your business, and everyone you work with.",
    pillars: [
      { title: "Sits in on your meetings", body: "It joins the call and walks out knowing what was decided, who owns what, and what happens next — no notes to write." },
      { title: "Keeps up with your clients", body: "It follows every deal, email, and conversation, so you're never the only one holding it all in your head." },
      { title: "It just knows", body: "Ask it about a deal, a person, or a promise you made three weeks ago — it already has the answer." },
    ],
  },
  relationships: {
    eyebrow: "Never drop a client",
    title: "It keeps every relationship warm.",
    body: "Sirus knows when you last spoke to each client, what you promised, and who's gone quiet. It drafts the follow-up, sends it at the right moment, and surfaces the prospects worth chasing — or just tells you who to call today.",
    card: {
      lane: "Needs you",
      eyebrow: "Follow-up ready",
      title: "Reply to Dana at Acme",
      why: "Acme thread · last reply 3 weeks ago · you promised the Q3 numbers",
      to: "Dana Reyes <dana@acme.co>",
      subject: "The Q3 numbers I promised",
      preview:
        "Hi Dana — circling back with the Q3 figures I promised. Quick recap below and the full sheet attached. Free Thursday to walk through it together?",
      actions: ["Send", "Edit", "Dismiss"],
    },
  },
  stack: {
    eyebrow: "One cofounder, every tool",
    title: "It works inside your whole stack.",
    body: "Gmail, Calendar, Drive, Notion, your CRM — Sirus operates inside the tools you already use, holding one shared context across all of them. Nothing falls between systems, because there's only one mind behind them.",
    replaces: ["personal CRM", "executive assistant", "research analyst", "outreach", "ops"],
    becomes: "Sirus",
  },
  whileYouSleep: {
    eyebrow: "Works while you sleep",
    title: "It's already handling these.",
    lead: "Hand it a job and it owns it — running on its own while you're asleep, commuting, or in another meeting. A few of the jobs it's keeping for founders right now:",
    jobs: [
      { group: "Needs you",   name: "Prospect outreach",     desc: "research & write to fresh prospects every night",  trigger: "🕐 nightly",   activity: "awaiting you", status: "awaiting" },
      { group: "Active now",  name: "Inbound triage",        desc: "qualify every new inbound lead and book the demo", trigger: "✉️ on email", activity: "3 running",    status: "running" },
      { group: "Active now",  name: "Deal follow-ups",       desc: "chase any open deal that's gone quiet 5+ days",     trigger: "🕐 daily",     activity: "",             status: "running" },
      { group: "Standing by", name: "Renewal guard",         desc: "flag any account approaching its renewal date",     trigger: "🕐 daily",     activity: "2h ago",       status: "done" },
      { group: "Standing by", name: "Investor update",       desc: "draft the weekly update from live metrics",         trigger: "🕐 Mon 8:00", activity: "3d ago",       status: "done" },
      { group: "Standing by", name: "Watch: lead investor",  desc: "alert & draft the moment a key contact emails",     trigger: "✉️ on email", activity: "5h ago",       status: "done" },
    ],
    cards: [
      { id: "outreach", time: "02:00", when: "while you slept",   title: "The outreach you didn't send", body: "Fifty prospects, each researched and written to by name. You wake up to messages already going out — and a short queue of the few that need you." },
      { id: "morning",  time: "08:00", when: "before you're in",   title: "Caught up before coffee",      body: "It reads last night's replies, your calendar, and what each client is waiting on, then tells you the three things that actually matter today." },
      { id: "brief",    time: "10:45", when: "before your 11:00",  title: "Briefed for the call",         body: "From the last meeting it sat in and every thread since, a one-page brief is waiting in the invite — who they are, what's open, what to push." },
      { id: "client",   time: "14:30", when: "client email lands", title: "Handled before you see it",    body: "It logs what changed, drafts the reply, sends the easy one, and flags the single decision that's actually yours." },
    ],
    close: "Set the boundaries once. After that it just happens — every day, while you're somewhere else.",
  },
  rightBrain: {
    eyebrow: "Better answers, smaller bill",
    title: "It always uses the right brain for the job.",
    body: "Sirus isn't one model. It picks whichever frontier model fits the task, and moves to a sharper one the day it ships. You're never locked in, or stuck on last year's model.",
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Start free.",
    tiers: [
      {
        name: "Free", was: "", price: "$0", priceSuffix: "",
        tagline: "Try your cofounder, free.",
        features: ["Voice, chat, and jobs", "Runs locally on your Mac", "Limited monthly usage"],
        cta: "Download for Mac", featured: false,
      },
      {
        name: "Pro", was: "$30", price: "$20", priceSuffix: "/mo",
        tagline: "The same Sirus, all day.",
        features: ["Everything in Free", "Much higher usage limits"],
        cta: "Download for Mac", featured: true,
      },
      {
        name: "Max", was: "", price: "$50", priceSuffix: "/mo",
        tagline: "For founders who run on it.",
        features: ["Everything in Pro", "Top usage limits", "Early access to new features"],
        cta: "Download for Mac", featured: false,
      },
    ],
  },
  local: {
    eyebrow: "Yours alone",
    title: "Your business stays on your Mac.",
    body: "Everything it knows about your clients, your meetings, your conversations, and your files lives on your machine, not our servers. The cloud only listens for the triggers that kick off the work.",
    items: ["Clients", "Meetings", "Conversations", "Files"],
  },
  maker: {
    quote:
      "We didn't want another tool to manage. We wanted a cofounder — someone who already knew the business, kept every client straight, and did the work without being asked twice. Nothing we tried remembered us, so we built the one that does.",
    signature: "— the people building Sirus",
  },
  cta: {
    title: "Meet your cofounder.",
    button: "Download for Mac",
    sub: "macOS · Apple silicon",
  },
  footer: {
    blurb: "Your AI cofounder. It learns the business and runs the work, across the tools you already use. On your Mac.",
  },
} as const;
