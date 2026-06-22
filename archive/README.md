# Sirius Landing Page

React-based landing page scaffold for Sirius, built on Next.js and optimized for a fast early-access launch.

## Tech Stack

- `Next.js`
- `React`
- `TypeScript`
- `Tailwind CSS`
- `Motion`
- `ESLint`

## Why This Stack

### Next.js

Next.js is the framework layer around React for this project.

Why it is being used:
- It gives the project routing, layouts, metadata, and production build tooling in one place.
- It is a better fit than plain React for a landing page because SEO, social previews, and page performance matter.
- It leaves room to add more routes later such as `/waitlist`, `/about`, `/demo`, or `/privacy` without reworking the architecture.
- It can also handle simple server-side form submission later if the early-access flow moves beyond a static page.

### React

React is being used for the UI composition model.

Why it is being used:
- The page will benefit from reusable sections like `Hero`, `Problem`, `Demo`, and `CTA`.
- It keeps the interface modular as the landing page evolves into a broader product site.
- It is the frontend model you explicitly wanted, and Next.js builds directly on top of it.

### TypeScript

TypeScript is being used to keep the scaffold predictable as the page grows.

Why it is being used:
- It reduces ambiguity when content objects and component props change quickly.
- It helps prevent avoidable errors during a fast build sprint.
- It makes future integration work cleaner if forms, API routes, or analytics helpers are added.

### Tailwind CSS

Tailwind is being used for layout speed and rapid visual iteration.

Why it is being used:
- It is fast for building custom sections without spending time on CSS naming overhead.
- It works well for responsive layout tuning during a short launch window.
- It still allows a custom visual system through CSS variables and hand-authored styling rather than forcing a generic component library look.

### Motion

Motion is being used for animation and interaction polish.

Why it is being used:
- The Sirius concept depends on atmosphere and controlled motion more than a flat marketing page would.
- It is a good fit for the orb, staged reveals, and ambient transitions without jumping straight to heavier rendering stacks.
- It keeps animation declarative and component-local.

### ESLint

ESLint is being used to keep the project from drifting during rapid iteration.

Why it is being used:
- It catches low-level issues before they become layout or runtime bugs.
- It keeps the codebase cleaner as more sections and contributors are added.

## Current Project Structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  layout/
  sections/
  sirius/
  ui/
content/
  landing.ts
lib/
  utils.ts
```

## Structure Rationale

- `app/`: Next.js app router entrypoint, layout, and global styling.
- `components/layout/`: site-wide shell elements like header and footer.
- `components/sections/`: major landing page blocks so the page can be rearranged quickly.
- `components/sirius/`: product-specific visuals like the orb and workflow preview.
- `components/ui/`: small reusable primitives.
- `content/landing.ts`: central place for copy and messaging so narrative changes do not require hunting through JSX.
- `lib/`: utilities and future shared helpers.

## Scripts

- `npm run dev`: start the local development server
- `npm run build`: create the production build
- `npm run start`: run the production server locally
- `npm run lint`: run lint checks

## Waitlist setup

The landing page's signup form posts to `/api/waitlist`, which writes to an Airtable base.

**One-time Airtable setup**

1. Create an Airtable base. Inside it, create a table named `Waitlist` with these fields:
   - `Email` — Single line text (primary field)
   - `Name` — Single line text
   - `Source` — Single line text
   - `Created At` — Created time (Airtable built-in type), UTC
2. At https://airtable.com/create/tokens create a Personal Access Token with scopes `data.records:read` and `data.records:write`, restricted to that base.
3. Copy the base ID from the base URL (`https://airtable.com/appXXXXXXXXXXXXXX/...`).

**Local env vars**

Add to `.env.local` (gitignored):

```bash
AIRTABLE_TOKEN=pat_...
AIRTABLE_BASE_ID=app_...
AIRTABLE_TABLE_NAME=Waitlist
```

**Production**

Set the same three vars in your host's environment (e.g. Vercel project settings → Environment Variables).

**Smoke test**

```bash
curl -sS -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"stage":"email","email":"smoke@example.com","elapsedMs":5000}'
# expect: {"ok":true}
```

## Recommended Next Steps

1. Install dependencies with `npm install`.
2. Run `npm run dev`.
3. Replace scaffold copy in `content/landing.ts` with the final landing page messaging.
4. Refine the hero, workflow panel, and motion system to match the prototype more closely.
5. Add a real early-access submission flow when the CTA is finalized.
