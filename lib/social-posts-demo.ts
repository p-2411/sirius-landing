// Data for the hero's self-playing social-posts demo film.
// Depicts: pull a Notion source → research 3 angles → 3 ready drafts
// surfaced as a home-surface notification.

export type DemoDraft = {
  id: string;
  angle: string;       // the researched angle this draft takes
  text: string;        // the post body the user would ship
};

export type DemoPhase = {
  id: "trigger" | "pull" | "research" | "draft" | "done";
  label: string;       // shown in the status line while running
  dwellMs: number;     // how long this phase holds before advancing
};

export const DEMO_PHASES: DemoPhase[] = [
  { id: "trigger",  label: "Heard you — on it.",            dwellMs: 700 },
  { id: "pull",     label: "Reading your Notion page…",     dwellMs: 1100 },
  { id: "research", label: "Researching three angles…",     dwellMs: 1500 },
  { id: "draft",    label: "Drafting three posts…",         dwellMs: 1300 },
  { id: "done",     label: "3 drafts ready",                dwellMs: 0 },
];

export const DEMO_SOURCE = `Notion · “Content ideas — Q2”`;

export const DEMO_ANGLES = [
  "Contrarian take",
  "Founder story",
  "Tactical how-to",
];

export const DEMO_DRAFTS: DemoDraft[] = [
  {
    id: "contrarian",
    angle: "Contrarian take",
    text: `Everyone’s adding AI to their product. Almost no one’s removing the steps AI makes pointless. The win isn’t a chatbot in the corner — it’s the form that no longer needs filling. Subtract before you add.`,
  },
  {
    id: "story",
    angle: "Founder story",
    text: `We almost shipped a dashboard nobody asked for. Then a customer said: “I don’t want to check it — I want it to check itself.” We deleted the dashboard and built the alert. Usage tripled.`,
  },
  {
    id: "howto",
    angle: "Tactical how-to",
    text: `How we cut our weekly reporting from 2 hours to 4 minutes: 1) one source of truth, 2) a saved workflow that pulls it, 3) a draft waiting Monday 8am. We review, we don’t rebuild. Steal it.`,
  },
];
