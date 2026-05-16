// Landing copy — see sirius-landing-page-spec-v1.md
export const landingContent = {
  meta: {
    wordmark: "Sirius",
    availability: "Private beta",
    tagline: "Your personal assistant that doesn't forget.",
  },
  hero: {
    eyebrow: "Sirius",
    title: "Your personal assistant",
    description:
      "Sirius remembers the context behind your work, acts across your apps, and turns repeated tasks into workflows you can reuse.",
    primaryCta: "Request early access",
    headlineAlternates: [
      "The assistant the others were pretending to be.",
      "Quietly competent.",
    ],
  },
  workflows: {
    sectionLabel: "Workflows",
    title: "The work you already do, saved for next time.",
    intro:
      "You already have workflows: the emails you rewrite, the checks you run before meetings, the updates you pull together every week.",
    coda:
      "Sirius notices the patterns, helps package the useful ones, and lets you run them again by voice or chat. Feeds and schedules are next.",
    notes: [
      "You've written this kind of client update three times this month. Want me to save it as a workflow?",
      "Your 2:00 meeting is coming up. I pulled the latest thread, open tasks, and last notes.",
    ],
  },
  fourWays: {
    sectionLabel: "One assistant. Four ways to command it.",
    leadIn:
      "Use voice when you are in flow and chat when you need detail. Feeds and schedules are coming soon for work that should be watched or run later.",
    items: [
      { id: "voice",     title: "Voice",     body: "Ask naturally without leaving your work." },
      { id: "chat",      title: "Chat",      body: "Work through details with the same assistant that remembers your context." },
      { id: "feeds",     title: "Feeds",     body: "Coming soon: track updates from the sources that matter and surface what needs attention." },
      { id: "schedules", title: "Schedules", body: "Coming soon: run tasks at a time or set events as triggers." },
    ],
  },
  threeIdeas: {
    sectionLabel: "One system",
    title: "One assistant that remembers, acts, and automates.",
    items: [
      { index: "01", role: "Memory that keeps the context." },
      { index: "02", role: "Actions that do the work." },
      { index: "03", role: "Workflows that run again." },
    ],
    body:
      "Sirius keeps conversation, actions, and workflows connected through the same memory. Chat knows what your workflows did earlier. Your workflows know what you asked yesterday. Your briefs include the context you would otherwise have to repeat.",
  },
  whatsNext: {
    sectionLabel: "What's next",
    headlineLead: "The desktop is where Sirius starts.",
    headlineTail: "Not where it stops.",
    fragments: ["MOBILE", "TEAM MEMORY", "BROWSER CONTEXT"],
  },
  localData: {
    sectionLabel: "Local-first",
    title: "Your data, your machine.",
  },
  inPractice: {
    sectionLabel: "In practice",
    title: "Stop doing the same work from scratch.",
    intro:
      "Sirius remembers the context, finds the repeated steps, and helps turn them into workflows you can reuse.",
    weekly: [
      { id: "design",      label: "TUE",          tail: "FEEDBACK" },
      { id: "engineering", label: "MON 09:00",    tail: "STANDUP" },
      { id: "meeting",     label: "PER MEETING",  tail: "BRIEF" },
      { id: "research",    label: "DAILY am",     tail: "BRIEF" },
    ],
    vignettes: [
      {
        id: "design",
        seq: "01",
        kind: "DESIGN",
        frequency: "ad-hoc",
        voiceTrigger: "Sirius, what came in from the client?",
        title: "Client feedback, sorted before you read it.",
        body: "A client sends scattered comments across email and docs. Sirius groups the fixes, drafts the easy changes, and highlights the decisions that need you.",
        punchline: "You review the work, not the chaos.",
      },
      {
        id: "engineering",
        seq: "02",
        kind: "ENGINEERING",
        frequency: "mon · 09:00",
        voiceTrigger: "Sirius, what's standup looking like?",
        title: "Your standup, ready before you are.",
        body: "Every Monday, Sirius pulls the week’s commits, closed tickets, and team threads. A draft is waiting before you sit down. You skim, fix anything off, and post.",
        punchline: "Twenty seconds, not twenty minutes.",
      },
      {
        id: "meeting",
        seq: "03",
        kind: "MEETINGS",
        frequency: "15 min before",
        voiceTrigger: "Sirius, what's the 14:00?",
        title: "Your next meeting, already briefed.",
        body: "Fifteen minutes before a meeting, Sirius pulls the last thread, open tasks, previous notes, and anything you promised to follow up on. You walk in with the file.",
        punchline: "Briefed, not blindsided.",
      },
      {
        id: "research",
        seq: "04",
        kind: "RESEARCH",
        frequency: "daily · am",
        voiceTrigger: "Sirius, what's worth knowing this morning?",
        title: "A research desk, for one.",
        body: "Sirius keeps a feed on the companies you're tracking. Two paragraphs of what's changed since yesterday, before your first coffee.",
        punchline: "Never miss a signal.",
      },
    ],
  },
  faq: {
    sectionLabel: "Questions",
    title: "What people ask first.",
    items: [
      {
        q: "Where does my data live?",
        a: "Your personal memory, conversations, and connected files stay local by default. Some scheduled or background workflows may use Sirius cloud services when they need to run while your device is unavailable, but they only receive the context required for that workflow.",
      },
      {
        q: "How is Sirius different from ChatGPT or Claude?",
        a: "1. Memory that actually persists. Sirius builds a picture of your projects, preferences, and patterns over time, instead of starting fresh every conversation.\n 2. It's wired into the tools you already use: email, calendar, slack, github, and more.\n3. Workflows. You can build automations that run on their own, not just ask questions and wait for answers.",
      },
      {
        q: "What can Sirius automate?",
        a: "Sirius can help with repeatable knowledge work: drafting replies, preparing meeting briefs, summarizing updates, and triaging feedback. Feed tracking and scheduled workflows are coming soon.",
      },
      {
        q: "What models does Sirius use?",
        a: "Sirius uses a mix of leading AI models depending on the task. The goal is to choose the right model for the job while avoiding unnecessary costs.",
      },
      {
        q: "When can I get access?",
        a: "Sirius is in private beta. Access is rolling out in small waves so the product can be shaped with early users.",
      },
    ],
  },
  cta: {
    title: "Meet Sirius.",
    primaryCta: "Request access",
    note: "Early access is rolling out in small waves.",
  },
} as const;
