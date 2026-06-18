---
name: write-blog-post
description: >-
  Research, write, verify, and publish a new post for the Sirius blog (the "Star
  Atlas"). Use whenever the user asks to write, draft, or publish a blog post,
  Star Atlas plate, or article for this site — whether they name a topic or ask
  you to pick one. Handles house style, frontmatter, build verification, and
  publishing to main.
---

# Writing a Sirius blog post

The Sirius blog ("Star Atlas") is plain-English AI explainers for **high-agency
professionals — founders, investors, agency owners, freelancers — NOT
engineers.** Every post leads with the outcome and speaks their language (deals,
clients, hours saved), never the machinery. This skill codifies the full
research → write → verify → publish loop. Do the steps in order.

## 0. Audience & voice (hard constraint)

Read `CLAUDE.md` at the repo root first — it is the standing positioning rule.
In short:

- Lead with the payoff, not how AI works. A busy founder should feel the value
  in three seconds.
- No engineer framing, no internal jargon, no pipeline/DAG talk.
- Speak in deals, clients, hours, "before the meeting," "while you sleep."

The benchmark for voice, length, and formatting is the post
`content/posts/what-ai-actually-is.mdx`: concise, actionable, plain-English,
strong point of view, scannable sentence-case H2s, no throat-clearing.

## 1. Learn what already exists

- Read `lib/blog.ts` to reconfirm the frontmatter fields and parsing (they can
  change).
- `ls content/posts` and **read every existing `.mdx`**. Record each topic and
  its angle. The new post MUST be a clearly distinct topic — not a rehash or a
  near-duplicate angle of an existing one. Note the tags already in use.

## 2. Research (required — topic, angle, and claims come from this, not priors)

Use WebSearch/WebFetch across three axes:

- **Real pain/questions:** what this audience actually struggles with or asks
  (forums, Reddit, People-Also-Ask). Pick a topic that answers a real,
  recurring question or relieves a real pain.
- **SEO:** a question/keyword with genuine search demand and beatable
  competition. Pick ONE primary question the post answers (snippet-friendly) and
  shape the title + H2s around how people actually search.
- **Substance:** research the topic itself so the writing is accurate. Only
  state specific facts, numbers, tools, studies, or examples you actually
  verified. NEVER invent statistics, studies, citations, dates, or company
  names — a fabricated specific is worse than omitting it.

## 3. Write `content/posts/<slug>.mdx`

Frontmatter, EXACTLY this shape (extra fields like readingMinutes/plateNumber
are derived in `lib/blog.ts` — do not add them):

```
---
title: "..."            # compelling, search-aware
description: "..."       # one benefit-led sentence containing the core query
date: "<TODAY>"          # `date +%Y-%m-%d`; must be today so it sorts newest
slug: "<slug>"           # kebab-case, URL-safe, unique, matches the filename
author: "Sirius"
tags: ["<one or two lowercase tags>"]
---
```

`title` and `description` also drive the page's `<title>` and OpenGraph tags
(see `app/blog/[slug]/page.tsx` `generateMetadata`), so make them search-aware.

Body rules:

- **400–700 words.** Concise and actionable; every section earns its place.
- Open with the real pain/question — no warm-up. Deliver the payoff fast.
- Sentence-case H2 headings shaped around the searcher's question. Short bullet
  lists where they aid scanning.
- End on a concrete takeaway. Do NOT add a "next in this series" teaser, your
  own CTA, or any JSON-LD — the page template handles CTA and structured data.
- Founders/operators, not engineers. Take a position.

### Avoid AI tells

No em-dash overuse; no "it's not just X, it's Y"; no rule-of-three padding; no
inflated words (testament, pivotal, landscape, vibrant, underscore, delve,
tapestry); no parallel bolded inline-header bullets; no generic upbeat
conclusion; no "let's dive in" signposting. Vary sentence length. Sound human.

### Make each point once, then move on

The most common failure in these posts is restating one idea three ways and
stretching a single point across a whole paragraph. Don't. The post can have one
overarching argument, but each individual point should land in as few sentences
as it takes, then stop. If a sentence only rephrases the one before it, cut it.

Exception: when you're explaining a mechanism or what happens behind the scenes
(how a model actually behaves, where data really goes), the extra sentences are
earning their place — keep them. The test is whether each sentence adds new
information or just re-says the last one in different words.

Example of what NOT to do — three paragraphs to say "consumer plans train on
your data by default, business plans don't":

> Where your pasted data actually goes
> On the consumer plans most people use — ChatGPT Free, Plus, and Pro — your
> conversations are used to train OpenAI's models by default. That setting is on
> unless you turn it off. So the contract you pasted doesn't just produce a
> summary and vanish. It can be retained and fed into how the model learns.
> On business plans — ChatGPT Business, Enterprise, Edu — that's reversed. Your
> data is excluded from training by default. Same chatbot, completely different
> deal with your information, decided by which plan you happen to be on.
> Most people pasting sensitive work into ChatGPT are on the personal plan and
> don't know there's a difference.

That whole block is one point. Make it in two or three sentences.

## 4. Verify (MUST pass before committing, in order)

```
npx tsc --noEmit
npx eslint content/posts/<slug>.mdx   # plus any other files you changed
npm run build
```

The build must succeed AND `/blog/<slug>` must appear in the route list (it
should be SSG/prerendered). If anything fails, fix it and re-run. If you cannot
get a clean build, do NOT commit — stop and report exactly what failed.

> If `node_modules` is missing (fresh container), run `npm install` first.
> After building, revert build-artifact churn so it doesn't get committed:
> `git checkout -- package-lock.json tsconfig.tsbuildinfo`

## 5. Publish (only after a clean build)

```
git add content/posts/<slug>.mdx
git commit -m "feat(blog): <title>"
git push origin HEAD:main
```

Use this commit trailer on its own line when running as the autonomous routine:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

## 6. After publishing — getting it found

- The sitemap (`app/sitemap.ts`) and `robots.txt` (`app/robots.ts`) pick up new
  posts automatically from `getAllPosts()`. The canonical origin lives in
  `lib/site.ts` (`NEXT_PUBLIC_SITE_URL`, default `https://trysirius.me`).
- A `site:` search will NOT show the post for days to weeks — that's indexing
  lag, not a bug. To speed it up, the site owner submits `sitemap.xml` in Google
  Search Console and uses URL Inspection → Request Indexing on the new URL.
- Don't claim the post is "live on Google" or verify it via a `site:` query;
  confirm only that the build prerendered the route and the push landed on main.

## Report when done

Slug, title, the primary search question it targets, the pain point it
addresses, and the key sources your research drew on.
