// Landing copy — see docs/superpowers/specs/2026-06-20-business-os-redesign-design.md
export const landingContent = {
  meta: {
    wordmark: "Sirius",
    tagline: "The operating system for your business.",
  },
  nav: [
    { id: "knows", label: "What it knows" },
    { id: "does", label: "What it does" },
    { id: "loop", label: "The loop" },
    { id: "team", label: "For your team" },
    { href: "/blog", label: "Blog" },
  ],
  requestCta: { label: "Request access", href: "#cta" },
  integrations: {
    label: "Runs inside the tools you already run on",
    tools: ["Slack", "Gmail", "Calendar", "Google Drive", "Notion", "HubSpot", "Salesforce", "Stripe", "Zoom", "Granola"],
    more: "+ anything with an API",
  },
  hero: {
    eyebrow: "The operating system for your business",
    title: "It knows how your business runs.",
    titleAccent: "So it runs it.",
    description:
      "Sirius learns your business from the inside — every meeting, every message, every client — and holds it as one picture nobody's ever had the time to keep. It sees what's slipping, then does the work to fix it, across the tools you already use.",
    proof: "Now rolling out to teams.",
    micHint: "say anything — watch it go to work",
    micPrivacy: "Your voice stays in your browser. We're not listening.",
    tapFallback: "See it work",
  },
  informationLayer: {
    eyebrow: "the information layer",
    title: "One picture of the whole business.",
    lead: "Everything your company knows is scattered — across inboxes, calls, threads, and a CRM nobody keeps current. Sirius pulls it together on its own. Every meeting it sits in, every Slack message, every email and client interaction feeds one living picture of how the business actually works — who's involved, what was promised, where it's stuck.",
    pillars: [
      { title: "Sits in on the meetings", body: "It joins the call and walks out knowing what was decided, who owns what, and what happens next." },
      { title: "Reads every channel", body: "Inbox, Slack, the CRM — it keeps up with all of it so nobody has to be the one holding it in their head." },
      { title: "Finds what's slipping", body: "It connects the threads and surfaces the gaps: the promise nobody kept, the deal gone quiet, the work falling between systems." },
    ],
  },
  operationLayer: {
    eyebrow: "the operation layer",
    title: "It closes the gaps it finds.",
    lead: "Knowing isn't the point — doing is. From that picture, Sirius acts on what's falling through: it drafts the follow-up nobody sent, chases the deal that went quiet, builds the automation you kept meaning to set up. Real work, shipped across your apps — not another dashboard telling you what's wrong.",
    jobs: [
      { group: "Needs you",   name: "Prospect outreach",     desc: "research & write to fresh prospects every night",  trigger: "nightly",   activity: "awaiting you", status: "awaiting" },
      { group: "Active now",  name: "Inbound triage",        desc: "qualify every new inbound lead and book the demo", trigger: "on email", activity: "3 running",    status: "running" },
      { group: "Active now",  name: "Deal follow-ups",       desc: "chase any open deal that's gone quiet 5+ days",     trigger: "daily",     activity: "",             status: "running" },
      { group: "Standing by", name: "Renewal guard",         desc: "flag any account approaching its renewal date",     trigger: "daily",     activity: "2h ago",       status: "done" },
      { group: "Standing by", name: "Investor update",       desc: "draft the weekly update from live metrics",         trigger: "Mon 8:00", activity: "3d ago",       status: "done" },
      { group: "Standing by", name: "Watch: lead investor",  desc: "alert & draft the moment a key contact emails",     trigger: "on email", activity: "5h ago",       status: "done" },
    ],
  },
  relationships: {
    eyebrow: "one gap, closed",
    title: "It keeps every relationship warm.",
    body: "Sirius knows when you last spoke to each client, what you promised, and who's gone quiet. It drafts the follow-up, sends it at the right moment, and surfaces the prospects worth chasing — or just tells you who to call today.",
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
  theLoop: {
    eyebrow: "the loop",
    title: "Every action makes it smarter.",
    lead: "This is what makes it an operating system and not a tool: the two layers feed each other. Everything Sirius does — every email sent, every deal moved, every automation that runs — flows back into what it knows. The picture sharpens, the gaps get clearer, and it ships more on its own. The longer it runs, the more it runs for you.",
  },
  perEmployee: {
    eyebrow: "for every person, too",
    title: "Everyone gets their own Sirius.",
    lead: "Each person on your team gets a Sirius that knows them. It takes notes in their meetings, handles their inbox, and builds the small automations they never found time for. And every bit of that work quietly feeds the same shared picture — so the whole company gets smarter every time one person gets help.",
  },
  stack: {
    eyebrow: "one mind, every tool",
    title: "It lives where the work already happens.",
    body: "Slack, Gmail, Calendar, Drive, Notion, your CRM — Sirius operates inside the tools your company already uses, holding one shared context across all of them. Nothing falls between systems, because there's only one mind behind them.",
  },
  maker: {
    quote:
      "We were tired of tools that made us feed them. Every CRM, every tracker, every app needed us to keep it current — and none of them did anything with what they knew. We wanted the opposite: something that learns the business on its own, and then actually runs it. Nothing we tried did, so we built it.",
    signature: "— the people building Sirius",
  },
  cta: {
    title: "Put your business on Sirius.",
    button: "Request access",
    sub: "Early access · rolling out to teams now",
  },
  footer: {
    blurb: "The operating system for your business. It learns how your company runs, then runs it with you — across the tools you already use.",
  },
} as const;
