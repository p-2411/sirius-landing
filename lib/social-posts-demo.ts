// Content for the hero's self-playing "screen recording" demo.
// A directed film of the real Sirius app running a workflow:
// click the orb → Sirius starts the workflow in the background → an app
// notification → the run page (real step list) → back home → drafts-ready
// notification. All copy/data lives here; timing + rendering live in
// components/sirius/social-posts-demo.tsx.

export const WORKFLOW_NAME = "Weekly social posts";

// The Notion page the workflow reads from (shown in the transcript + run step).
export const DEMO_SOURCE = "Content ideas — Q2";

export type RunStepType =
  | "http_request"
  | "run_python"
  | "agent_task"
  | "display_to_user";

export type RunStep = {
  id: string;
  title: string;
  type: RunStepType;
};

// The run-detail step list — mirrors the real app's run page exactly.
export const RUN_STEPS: RunStep[] = [
  { id: "fetch",    title: "Fetch Notion",  type: "http_request" },
  { id: "parse",    title: "Parse Notes",   type: "run_python" },
  { id: "research", title: "Research",      type: "agent_task" },
  { id: "draft",    title: "Draft Posts",   type: "agent_task" },
  { id: "format",   title: "Format Posts",  type: "run_python" },
  { id: "display",  title: "Display Posts", type: "display_to_user" },
];

// Heading the final display_to_user step prints above the drafts.
export const DISPLAY_INTRO = "Here are your 3 LinkedIn post drafts:";

export type DemoDraft = {
  id: string;
  angle: string; // short label used on the home-notification chips
  text: string;  // the post the user would ship (\n\n = paragraph break)
};

export const DEMO_DRAFTS: DemoDraft[] = [
  {
    id: "announcement",
    angle: "Announcement",
    text: [
      "Proud to announce: Sirius has closed its pre-seed round.",
      "Lead investor: my mum. Ticket size: £200.",
      "She didn't ask for a deck. She didn't want a cap table. She just said \"don't waste it.\"",
      "So we didn't. We built Sirius — an AI that actually remembers you. Your projects, your tone, your context. Not because you re-explained it this morning, but because it learned it and kept it.",
      "It runs your workflows, reads your emails, takes action, and flags what needs you — instead of dumping everything back on your plate.",
      "Angel investors come and go. But a £200 cheque from your mum and a product that actually works? That's a round worth closing.",
    ].join("\n\n"),
  },
  {
    id: "howto",
    angle: "Tactical how-to",
    text: [
      "How I cut my weekly reporting from 2 hours to 4 minutes:",
      "1. One source of truth.\n2. A workflow that pulls it.\n3. A draft waiting at 8am Monday.",
      "I review. I don't rebuild. Steal it.",
    ].join("\n\n"),
  },
  {
    id: "contrarian",
    angle: "Contrarian take",
    text: [
      "Everyone's adding AI to their product.",
      "Almost no one's removing the steps AI makes pointless.",
      "The win isn't a chatbot in the corner. It's the work that no longer lands on your desk.",
      "Subtract before you add.",
    ].join("\n\n"),
  },
];

// What the home surface shows right after the orb is clicked.
export const HOME_PROMPT = "Draft this week's posts from my Notion page.";
export const HOME_REPLY = `On it — running ${WORKFLOW_NAME} in the background. I'll ping you when your drafts are ready.`;
