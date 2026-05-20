---
name: commit-discipline
description: Use this skill whenever making git commits, structuring PR descriptions, deciding when to push, or thinking about the project's source history. Fires before every `git commit`. Enforces the conventional-commit format, the "every commit should run" rule, and the milestone-commit-at-phase-end pattern.
---

# Commit Discipline — Web Project

A clean git history makes debugging fast, makes rollback safe, and makes the project handover sane. These rules are not optional.

## The 3 Rules

### Rule 1 — Every commit should build and run

Before `git commit`, you have already run:
- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — succeeds

If any of these fail, fix them before committing. Never push broken builds.

### Rule 2 — Conventional Commits format

Every commit message follows:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types** (use these, no others):
- `feat` — new feature visible to users
- `fix` — bug fix
- `chore` — maintenance (config, deps, tooling)
- `refactor` — code change that doesn't change behaviour
- `style` — formatting, no logic change
- `docs` — documentation only
- `test` — test additions/changes
- `perf` — performance improvement
- `build` — build system / dependencies

**Scopes** (project-specific):
- `home`, `dresses`, `about`, `contact`, `booking`, `cart`, `checkout`, `journal`, `reviews`, `services`
- `nav`, `ui`, `motion`, `seo`, `images`
- `db` (Supabase migrations), `auth`, `cms`
- `infra` (Vercel, deploy, config)

**Subject:**
- Imperative mood ("add", "fix", "remove" — not "added", "fixes")
- Lowercase first letter
- No full stop at end
- Max 60 chars

### Rule 3 — Commit at every meaningful checkpoint

Don't pile 12 unrelated changes into one mega-commit. Commit when:
- A feature is functionally complete (even if tiny)
- A bug is fixed
- A migration is added
- A skill or doc is updated
- You're about to make a risky change (commit the safe state first)

Working through a phase, expect 8-20 commits per phase. Not 1. Not 200.

## Examples

### Good
```
feat(home): add hero with parallax and CTA buttons

- Full-viewport editorial hero image
- Headline "Couture, crafted in London"
- Dual CTA: View dresses + Book a fitting
- 20% scroll parallax on the image, disabled below lg breakpoint
- Respects prefers-reduced-motion

Refs: Phase 2
```

```
fix(booking): handle HEIC photo upload from iPhone

The booking form crashed when iPhone users uploaded HEIC photos because
Supabase Storage refused the contentType "image/heic" — added explicit
heic and heif to the accept attribute and the content type detection.
```

```
chore(deps): bump next from 15.0.2 to 15.0.3

Patch release, no breaking changes. Build verified.
```

```
db: add reviews table (migration 010)

- reviews table with rating 1-5, body, customer_name, source enum, is_published
- RLS: public reads published only, anon can insert with is_published=false
- Index on (is_published, published_at) for the index page query
```

```
docs(brand): tighten CTA list to three sanctioned labels

"Book a fitting", "View the collection", "Visit the atelier" — anything
else needs explicit justification in the PR.
```

### Bad
```
WIP                                          ← what is this?
update                                       ← update what?
fix some bugs                                ← which bugs?
Fixed booking and added reviews and changed colours    ← three unrelated changes
feat: i think the form works now hopefully  ← lacks confidence, vague
FIX BOOKING URGENT                          ← shouting, no specifics
```

## When to Push

Push at logical milestones:
- End of a phase
- After major feature complete
- Before a risky change (so it's saved remotely)
- End of work day

Don't push every commit instantly — local commits are cheap, network is slow, and the GitHub UI gets noisy with single-line pushes.

## Branches

For the web project, the default is **commit straight to `main`** for the demo phase — same as the mobile app. The work is solo, the velocity matters, branching adds friction.

**Switch to branches when:**
- Multiple developers join
- After production launch, when `main` represents what's live
- When trying experimental changes that might be reverted

When using branches, names follow:
- `feat/<scope>-<short-name>` — `feat/home-hero-parallax`
- `fix/<scope>-<bug>` — `fix/booking-heic-upload`
- `chore/<thing>` — `chore/upgrade-next-15`
- `docs/<topic>` — `docs/seo-strategy`

## PR Descriptions (when used)

```markdown
## What
One-sentence summary.

## Why
The reason this exists. What problem does it solve?

## How
Brief technical approach.

## Test plan
- [ ] Steps to verify it works
- [ ] Lighthouse scores
- [ ] Cross-browser check

## Screenshots
Before / After if visual change.

## Related
Refs to issues, design docs, prior PRs.
```

## Sensitive Files — Never Commit

The `.gitignore` should already cover these, but be vigilant:

- `.env.local`, `.env.production`
- `.vercel/`
- `node_modules/`
- `.next/`, `out/`, `build/`
- `*.log`
- `*.pem`, `*.key`
- `coverage/`
- `scripts/scraped/`, `scripts/optimised/` (large binary trees from image pipeline)

If you accidentally commit a secret:
1. Rotate the secret immediately (Supabase service role, etc.)
2. Force-push to remove from history if the repo is private and recent
3. Use `git filter-repo` for older / public repos
4. Tell Rohan you rotated his Supabase service role key

## Pre-Commit Hook (recommended)

Install `husky` + `lint-staged`:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

`.husky/pre-commit`:
```bash
npx lint-staged
```

`package.json`:
```json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

This auto-formats and lints files on commit. Saves embarrassing CI failures.

## Anti-Patterns

- ❌ Committing without running `npm run build`
- ❌ Committing secrets, even by accident
- ❌ "Fix typo" commits squashed into the previous commit via `--amend --force-push` after the team has pulled — use rebase locally only on unpushed work
- ❌ Mega-commits with 50+ files touched (split it)
- ❌ Commits with no body when the change isn't obvious from the subject
- ❌ Direct commits to `main` after launch without at least a self-review pause
- ❌ "Reverting" by `git push --force` when a `git revert <sha>` would do
- ❌ Force-pushing to `main` ever, after launch
- ❌ Committing `.env.local`

## Quick Reference

```
feat(scope): add <thing>      ← new functionality
fix(scope): fix <bug>         ← bug fix
chore(scope): update <thing>  ← maintenance
db: <migration description>   ← DB migration (no scope needed)
docs(scope): <change>         ← doc-only changes
refactor(scope): <change>     ← internal restructure
```

Run before every commit:
```
npm run typecheck && npm run lint && npm run build
```

If those pass, commit. Push at milestones.
