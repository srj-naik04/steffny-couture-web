# Agent team playbook — Steffny Couture web build

Read this file at the start of any session that uses agent teams to drive phases 2-9 of the build. It tells the **lead** session how to orchestrate.

## How to start a team

Open a Claude Code session in `e:/steffny-couture-web/` and say:

> Read `.claude/AGENT_TEAM_PLAYBOOK.md` and execute the phase orchestration. Start at the current phase from `PROGRESS.md` and work through all remaining phases. Use agent teams; do not skip steps in the per-phase flow.

That's the only command. Everything else is defined here.

---

## The nine teammates

All defined under `.claude/agents/`:

| # | Teammate | Role | Used in |
|---|---|---|---|
| 1 | `phase-builder` | Implements the phase per CLAUDE.md spec | Every phase |
| 2 | `content-writer` | Long-form brand-voice copy (MDX, about, reviews seed) | Phases 3, 7 |
| 3 | `consistency-checker` | Verifies brand + pattern consistency | Every phase |
| 4 | `standards-auditor` | Definition-of-Done + SEO + a11y + perf audit | Every phase |
| 5 | `security-reviewer` | RLS, secrets, env handling, CSP, upload safety | Every phase (heavier on 2, 5, 6) |
| 6 | `playwright-tester` | Drives Playwright MCP to find UX bugs across viewports | Every phase with UI |
| 7 | `bug-fixer` | Fixes only the bugs reported, surgically | Every phase as needed |
| 8 | `docs-updater` | Updates PROGRESS.md + DECISIONS + phase docs | Every phase |
| 9 | `git-shipper` | Verifies .gitignore, commits, pushes to GitHub | Every phase |

**Deployment is deferred.** Vercel deploy + domain migration will be handled in a separate session later. Phase 8's deploy-related acceptance criteria are skipped for now (Lighthouse runs locally against `npm run build && npm run start`). Phase 9 is skipped entirely.

The lead is **you** — the session reading this file. You do NOT do any of the seven jobs yourself. You coordinate.

---

## Per-phase flow (strict — do not skip steps)

For each phase from `PROGRESS.md` current-phase onward through Phase 9:

### Step 1 — Plan the phase
- Read `CLAUDE.md §4` for the phase scope + acceptance criteria
- Read `PROGRESS.md` to confirm no surprises
- Create a task in the shared task list: `Phase N — build`

### Step 2 — Spawn phase-builder (+ content-writer if applicable)
- Spawn one `phase-builder` teammate with the phase number and any constraints
- For phases 3 and 7 (heavy copy work), spawn `content-writer` IN PARALLEL with phase-builder — they touch different files (content/ vs src/) so no conflict
- Wait for both to finish
- Do NOT start any other writer-teammate until both are done

### Step 3 — Spawn consistency-checker, standards-auditor, AND security-reviewer in parallel
- All three are read-only — safe to run together
- Wait for all three reports
- Aggregate findings into a single severity-ordered bug list (critical → high → med → low)
- Critical security findings ALWAYS block; everything else follows the cap logic in Step 4

### Step 4 — If findings: spawn bug-fixer
- Pass it the aggregated bug list
- Wait for fix report
- Loop back to Step 3 (re-audit) if needed
- Cap at 3 audit/fix cycles per phase — if still failing, halt and message the user

### Step 5 — Spawn playwright-tester
- Only after Step 3 is clean (audit must pass before testing)
- Wait for its Playwright report
- For any [BUG-N], spawn bug-fixer (Step 4 style); then re-spawn playwright-tester for re-verification
- Loop until tester reports zero bugs
- Cap at 5 test/fix cycles per phase — if still failing, halt and message the user

### Step 6 — Spawn docs-updater
- Only after testing is clean
- Wait for its report

### Step 7 — Spawn git-shipper
- Only after docs are updated
- It will halt if anything looks off; surface its concern to the user
- After successful push, the phase is shipped to GitHub

### Step 8 — Advance
- Re-read `PROGRESS.md` (docs-updater should have advanced "Current phase")
- If next phase exists, return to Step 1
- If no next phase, proceed to "Final testing" below

---

## Phase 8 — modified flow (no deploy)

When Phase 8 is reached:
- Run the full standard 8-step flow EXCEPT actual Vercel deploy
- Lighthouse runs locally: `npm run build && npm run start &` then `npx lighthouse http://localhost:3000/<route> --output=json --output-path=./lighthouse-<route>.json --chrome-flags="--headless"` for each public route
- Targets: Performance ≥ 90, A11y ≥ 95, Best Practices = 100, SEO = 100 — same as if it were running against a preview URL
- If any route misses, run the bug-fixer loop until it passes
- docs-updater marks Phase 8 as ✅ Done with a note: "Deploy deferred — Lighthouse passed locally"
- git-shipper commits + pushes; that's the phase ship

## Phase 9 — skipped

Phase 9 (Domain Migration & Production) is **not part of this run**. After Phase 8 ships:
- docs-updater notes in PROGRESS.md: "Phase 9 deferred — user will run separately when ready"
- Proceed to Final testing below; do not attempt Phase 9

## Final testing (after Phase 8 ships)

When Phases 2-8 are all ✅ Done in PROGRESS.md:
1. Spawn `playwright-tester` with the prompt: "Full end-to-end regression. Test every page, every viewport (375/640/768/1024/1280/1920), every form, every cart flow, every booking flow. Verify the owner-spotlight rule (Steffi on home/about/contact). Capture screenshots into `final-regression/`. Confirm zero console errors and zero failed network requests sitewide."
2. If any bugs: bug-fixer loop, then re-test
3. Spawn `standards-auditor` with the prompt: "Final cross-phase audit. Re-run all 12 Definition-of-Done checks against every page. Run Lighthouse locally against every public route via `npm run build && npm run start`. Confirm performance ≥ 90, a11y ≥ 95, best-practices = 100, SEO = 100 on all pages."
4. Spawn `security-reviewer` with the prompt: "Final security sweep. Run `npm audit --omit=dev --audit-level=high`. Re-verify RLS policies cover all tables. Confirm no secrets in the committed tree. Confirm no `NEXT_PUBLIC_*` leakage of sensitive data."
5. If any of 3-4 block: bug-fixer loop
6. Spawn `docs-updater` to write a "Build complete (deploy pending)" entry in PROGRESS.md
7. Spawn `git-shipper` for the final commit + push

Then `Clean up the team` and exit the loop.

---

## Rules the lead MUST follow

- **Never skip a step.** The user explicitly said "no tasks must be missed from above flow."
- **Never let a teammate edit code while another is editing.** Phase-builder and bug-fixer write — they must never run concurrently. Auditors and testers read — they can run in parallel.
- **Never push with a broken build.** Git-shipper checks, but you should never even reach git-shipper if standards-auditor reported failures.
- **Halt to the user** if:
  - Audit/test cycles exhaust their cap
  - A teammate hits a Steffi-decision blocker (copy, image, design choice)
  - Git-shipper detects anything suspicious (secrets, large files, force-push needed, wrong branch)
  - Any tool/permission prompt repeats more than 3 times
- **Never compromise on quality.** The user said: "dont compromise on quality, standards, etc."
- **Use TodoWrite** to track which phase + which step you're on, visible to the user when they wake up.

## Token budget hygiene

Each teammate consumes its own context. To keep costs reasonable:
- Spawn one phase-builder at a time (not multiple parallel ones building different phases — phases build on each other)
- For Step 3, spawning consistency-checker + standards-auditor in parallel is fine — both are short-lived
- Shut down idle teammates between phases if conversations grow long; respawn for the next phase
- Lead picks default teammate model = Sonnet (set in each agent file's frontmatter). Lead stays on Opus for orchestration judgement.

## If you (the lead) are interrupted

- The task list (`~/.claude/tasks/...`) survives across sessions
- A new lead session can read this playbook + `PROGRESS.md` + the task list and resume
- But teammates are in-process and do not survive — respawn them for the current phase's step

---

## Loop mode (autonomous unattended runs)

If the user invokes this playbook via `/loop` (self-paced), each fire is a **fresh session with no memory**. You must bootstrap from disk every time:

### Bootstrap (every loop iteration)
1. Read this playbook
2. Read `PROGRESS.md` to find the current phase
3. If `PROGRESS.md` shows all phases (2-9) as ✅ Done:
   - Run the **Final testing** section (see above)
   - On success, do NOT schedule another wake — exit the loop
4. If a phase is in-progress (🔨), continue it from the appropriate step
5. Otherwise start the next ⏳ phase at Step 1

### Execute exactly ONE phase per loop iteration
- Don't try to chain phases in a single iteration — the loop is the chaining mechanism
- After git-shipper succeeds and PROGRESS.md is advanced, the phase is shipped
- Call `ScheduleWakeup` with `delaySeconds: 90` and `prompt` set to the original /loop invocation
- Stop work and let the session end

### Halt-and-wait conditions (do NOT schedule another wake)
- Audit/test cycles exhausted their cap
- Steffi-decision blocker (copy, image, design choice)
- Git-shipper detected secrets, large files, or remote rejection
- Three consecutive permission prompts that suggest a settings.json gap
- Phase 9 reached — explicitly out of scope, halt and leave note for user

In any halt case, leave a clear message in `PROGRESS.md` "Blockers" section AND in the session output, so the user can see it when they wake up.

### Loop hygiene
- After git-shipper succeeds, clean up the agent team (`Clean up the team`) before scheduling the next wake — teammates can't survive the session boundary anyway, and leaving them around can corrupt state on the next iteration
- Each loop iteration spawns a fresh team for the new phase — that's the design

