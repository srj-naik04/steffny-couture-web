---
description: Kick off a build phase. Reads the phase from CLAUDE.md, sets up scratch notes, runs preflight checks, and announces the work plan.
---

# /phase-start <number>

Begin Phase $1 of the web build.

## Steps

1. **Read** `CLAUDE.md` and find the matching phase header. Copy its task list and acceptance criteria into `SCRATCH.md` under a `## Phase $1 — Starting <DATE>` heading.

2. **Read every skill** flagged as relevant for the phase. For reference:
   - Phase 0 → nextjs, tailwind-web, steffny-brand, responsive-design, framer-motion, image-pipeline, commit-discipline
   - Phase 1 → supabase-web, image-pipeline, commit-discipline
   - Phase 2 → nextjs, steffny-brand, framer-motion, responsive-design, seo-and-meta, image-pipeline
   - Phase 3 → product-catalog, framer-motion, responsive-design, react-hook-form-zod-web
   - Phase 4 → booking-fitting, react-hook-form-zod-web, supabase-web, responsive-design
   - Phase 5 → content-cms, seo-and-meta, framer-motion
   - Phase 6 → framer-motion, responsive-design, image-pipeline
   - Phase 7 → seo-and-meta, responsive-design (accessibility), performance audits
   - Phase 8 → vercel-deploy, demo-readiness

3. **Preflight checks** — run in this order, stop and report on any failure:
   ```bash
   npm run typecheck
   npm run lint
   git status
   ```
   If TypeScript or lint errors exist from the previous phase, fix them first. A clean baseline is non-negotiable.

4. **Plan** — write a numbered work plan into the chat. Each item one sentence. No essays. The plan should be 5-12 items max. If it's bigger, the phase is too big — split it.

5. **Confirm with the user** — pause and ask "Plan looks right? Anything to add or skip before I start?"

6. **Wait for explicit go-ahead.** Don't begin code edits until the user says continue / yes / go.

## After confirmation

Begin executing the plan top to bottom. Commit at the end of each meaningful sub-task using the `commit-discipline` skill's format. When the phase's acceptance criteria are all met, run `/phase-check $1` to verify.

## Hard rules

- Never start a phase without reading the relevant skills
- Never skip the preflight checks
- Never combine two phases into one session
- Never start Phase N+1 before `/phase-check N` passes
