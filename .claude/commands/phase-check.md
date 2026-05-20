---
description: Verify a phase's acceptance criteria are met. Runs checks and reports pass/fail with evidence.
---

# /phase-check <number>

Verify Phase $1 is genuinely complete before moving on.

## Steps

1. **Re-read the phase** in `CLAUDE.md`. Copy the acceptance criteria into the chat as a checkbox list.

2. **For each criterion**, run the appropriate check:
   - "X works" → exercise X manually, describe what you did and what happened
   - "Lighthouse ≥ N" → run Lighthouse via Vercel preview, report the actual score
   - "Migration applied" → query the table from Supabase Studio or the project's psql, show the schema
   - "Page renders at 360/768/1024/1280/1920" → open DevTools at each width, screenshot or describe layout
   - "No console errors" → open DevTools console on the affected pages, report any messages
   - "Booking appears in mobile app" → manually submit, switch to mobile app, confirm visible
   - "Email arrives" → check test inbox

3. **Run the standard build checks**:
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```
   All three must pass clean. Warnings count.

4. **Update PROGRESS.md** — tick off the phase, add the date and any caveats. Move SCRATCH.md notes into the phase log section.

5. **Report** — write a short summary:
   - Number of acceptance criteria: passed / failed
   - Build status
   - Anything noteworthy (perf wins, deferred work, known issues)
   - Recommendation: ready for Phase N+1 / fix the following first

## On failure

If any criterion fails:
- List the failures explicitly
- For each, propose either: fix-it-now (small) OR push-to-followup (larger, document in PROGRESS.md)
- Do not declare the phase done
- Do not start the next phase

## On success

Report "Phase $1 complete" with the build output, Lighthouse scores (if applicable), and the list of commits made during the phase. Then ask the user if they want to start the next phase.

## Hard rules

- Never declare a phase complete with failing tests/build/lint
- Never skip a Lighthouse check on phases that mandate one
- Never let "it works on my machine" pass without device verification on phases that mandate it
