---
description: Ship the current branch. Runs preflight, deploys preview, runs Lighthouse, and (if confirmed) promotes to production.
---

# /ship [target]

Deploy the current state.

## Inputs

- `[target]` — optional. `preview` (default), `production`.

## Steps

1. **Read** `vercel-deploy` and `demo-readiness` skills.

2. **Preflight** — must all pass:
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```
   Stop on any error.

3. **Check git status**:
   - Uncommitted changes? → commit them first using `commit-discipline`
   - Untracked files? → confirm with user whether to commit or ignore

4. **Push the branch**:
   ```bash
   git push origin <current-branch>
   ```

5. **Vercel auto-builds**. Wait for the build to finish. Watch via:
   ```bash
   vercel ls --scope=<team>
   ```
   Or check the dashboard.

6. **Preview URL** — capture the URL Vercel returns. Test:
   - Home loads
   - One dress detail loads
   - Book-a-fitting form loads (don't submit unless testing the integration)
   - Demo banner visible on checkout
   - No console errors

7. **Run Lighthouse** on the preview URL for at least:
   - `/` (home)
   - `/dresses` (catalogue)
   - `/dresses/<one-slug>` (detail)
   - `/book-a-fitting`

   Targets: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.

8. **If target = preview** — stop here. Report the preview URL + Lighthouse scores. Done.

9. **If target = production**:
   - Confirm with user: "About to promote `<sha>` to production. Lighthouse scores: <list>. Confirm?"
   - On confirmation:
     ```bash
     vercel promote <deployment-url> --scope=<team>
     ```
     Or in the dashboard: Deployments → "..." → Promote to Production
   - Wait for promotion (usually < 30 seconds)
   - Verify https://www.steffnycouture.co.uk loads new build (cache-bust with `?t=<timestamp>` if needed)
   - Run a quick smoke test on production
   - Report success

10. **Post-deploy**:
    - Update PROGRESS.md with deploy timestamp + commit SHA
    - If production, post to internal log: "Shipped <feature> to prod at <time>"
    - If a problem appears, run the rollback procedure from `vercel-deploy` skill

## Hard rules

- Never skip preflight
- Never deploy with failing typecheck/lint/build
- Never promote to production without Lighthouse evidence
- Never promote to production without explicit user confirmation
- Never promote to production after 6pm UK time on a Friday
- Always have a rollback plan ready
