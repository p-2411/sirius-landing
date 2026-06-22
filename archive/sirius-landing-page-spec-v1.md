# Sirius — Landing page spec (v1)

## Hero

**Sirius**
**An assistant. In the proper sense.**

It chats, it remembers, and it has the decency to notice when you've done the same thing three times — and offer to never do it again. Voice or keyboard. Mac.

**[ Request access ]**

A single ambient orb sits centre-stage above the headline. Default state: slow, gentle pulse, colour drifting through a narrow band of the brand palette.

When the visitor grants mic permission (soft inline prompt: *"Talk to it"* → permission sheet), the orb reacts in real time to their voice: amplitude → size, frequency centroid → hue. Louder, bigger; higher, cooler. All client-side via Web Audio API; no audio leaves the browser.

Microcopy beneath the orb: *"Your voice stays in your browser. We're not listening."*

Pre-permission state: orb still animates on a synthetic signal so the page doesn't look dead. Reduced-motion / no-mic-available: ambient pulse only, no permission prompt shown.

*PRD: hero needs to land "real assistant, does work, faintly droll" in under 40 words. The orb is the page's only interactive moment — it's the entire reason the page works as a demo, and its visual identity should match the in-product Sirius surface so they read as the same animal. Headline alternatives to A/B against the chosen one: "The assistant the others were pretending to be." / "Quietly competent."*

---

## Workflows — the work you already do, made callable

You already have workflows. Cold outreach to a particular type of person, the way you put together a weekly client update, the steps you take when a deal moves to contract, your routine for assembling the investor pipeline review. They live in your head. You re-explain them to yourself (or to ChatGPT) every time you do them, and you reload the context from scratch each round.

Sirius watches you do them, and offers to extract them.

> *"You've drafted three of these emails this week, all to fund analysts, all in roughly the same shape. Want me to make this a workflow? Next time you'll just say 'do another one for X' and I'll have the context ready."*

Once extracted, a workflow is callable. You name the target — *"do another one for X"* — and Sirius runs the pipeline you'd already built in your head, without you having to reload any of it. It pauses to ask when it needs a judgement call, runs hands-off when it doesn't.

The point isn't that Sirius lets you build automations. It's that Sirius notices you're already running the same procedure by hand, and quietly takes the typing out of it.

*PRD: this is the section that justifies the install and the trust. The framing must hold the line that workflows are user-extracted, never user-authored from scratch — Sirius does the lifting. Avoid any language ("build," "configure," "design") that puts work back on the user.*

---

## It notices

Sirius doesn't open with "good morning." It's not that kind of assistant. But if it sees you sending the same flavour of email three times in a week, it'll offer to lift it into a workflow. Mention a project you're trying to ship, and it may quietly suggest a way to take a slice off your plate.

Proactive, in a way that doesn't talk over you.

*PRD: this is the answer to "is this just another Siri?" — Sirius is proactive about your work, not chatty about the weather. Reinforces the workflow-extraction story directly above by giving it a name (Sirius "noticing") that the rest of the page can call back to.*

---

## Four ways to drive it

A four-card row. Same icon family, same sentence length.

1. **Voice** — *Talk to it like a colleague who never goes to lunch.*
2. **Chat** — *One conversation. Everything you've ever told it. No new tabs.*
3. **Feed** — *Your own briefings, generated quietly. Markets, papers, your team's PRs — whatever you've asked it to keep an eye on.*
4. **Automations** — *Recurring jobs that run themselves. Sirius watches what you keep doing, and offers to take it over.*

*PRD: lead-in copy must make clear these are the four entry points to workflows, not peers of them. Workflows are the engine; voice/chat tell Sirius what to run, automations tell it when, feeds show what came back.*

---

## Three good ideas. One app.

- The conversational depth of **Claude**.
- The autonomous execution of **OpenClaw**.
- The recurring, plumbed-together automations of **n8n**.

Arranged so a single assistant — the same one — does all three. The chat knows what your automations did this morning. The automations know what you talked about yesterday. Nothing falls between systems, because there is only one system.

*PRD: name-checking is acceptable here; the audience already lives in this stack and the comparison is the cleanest way to land what Sirius is. This is the elevator pitch for technical visitors who'll otherwise try to round Sirius down to one of the three.*

---

## Your data stays on your Mac

Memories, conversations, files — all local. The workflows that need to run while you're asleep (outreach, briefings, anything recurring) run on Sirius's cloud, with only the data they need to do their job. Prefer fully local? You can have that. The trade is that automations stop when your laptop does.

*PRD: chosen position is **local-first by default, cloud opt-in for autonomy**. Stronger differentiator vs. the comparison set than cloud-default would be, and the trade-off is honest enough to be trusted by the OpenClaw/Claude crowd. Alternative is cloud-default with a local toggle — easier engineering, weaker marketing claim.*

---

## In practice

Four vignettes — sales, design, research, engineering. Each ~3 sentences, no jargon.

**Cold outreach, at scale, without the smell of automation.**
Tell Sirius who you want to talk to — *"founders of pre-seed dev-tools companies in Melbourne."* It finds them, drafts emails in your voice, sends them, and when someone replies it pings you with a one-line summary and the suggested next move. The automation runs every Tuesday; you see the pipeline, never the spreadsheet.

**The design pipeline that runs itself.**
Drop a brief in. Sirius pulls references from your moodboard folder, drafts variants in your usual style, queues them for your morning review, and ships the approved ones into the client folder with the right naming convention. You stay on the creative work; the file admin quietly disappears.

**A research desk, for one.**
Sirius keeps a feed on the companies you're tracking — earnings, filings, analyst notes, the occasional odd signal on Twitter. Two paragraphs of *what's changed since yesterday* before your first coffee. Ask *"what's the bear case on X"* and it already knows what you've read.

**On-call, with a competent assistant.**
A pager fires at 3am. Sirius pulls the relevant logs, runs the three diagnostic checks you'd have run anyway, drafts the incident summary, and wakes you only if it actually needs a human. The channel sees a calm, well-formatted update; you see one sentence telling you whether to get out of bed.

*PRD: four distinct fields — sales, design, finance/research, engineering — to span the target archetypes. None overlap with current OpenClaw demos. All concrete enough that a visitor casts their own version onto them.*

---

## Availability

Mac, in private beta. Other platforms once we're confident the Mac one is worth keeping.

**[ Request access ]**

*PRD: honest scarcity. Email capture is the only ask. No pricing copy anywhere on the page in v1.*

---

## Voice / tone rules for the page

- Jeeves-adjacent: dry, lightly old-British. *"Rather," "a touch of," "in the proper sense," "the decency to."* Never *"tally-ho."*
- Under-promise. A landing page that doesn't shout is more believable than one that does.
- Every body paragraph should read like Sirius itself wrote it. No exclamation marks. No *"supercharge."*
