# Progress

Live state of the build. Update after every phase or significant change.

## Current phase

**Phase 0 — Foundation** (in progress — scaffold complete, awaiting Lighthouse verification)

## Phase status

| Phase | Status | Notes |
|---|---|---|
| 0 — Foundation | 🔨 In progress | Scaffold + brand tokens + UI primitives + header/footer + home placeholder shipped; visual + Lighthouse pass outstanding |
| 1 — Asset Extraction | ⏳ Not started | Scrape Webador, optimise, blur placeholders |
| 2 — Database & Backend | ⏳ Not started | Web-only tables, RLS, Supabase clients |
| 3 — Marketing Pages | ⏳ Not started | Home, about, services, contact |
| 4 — Dress Catalogue | ⏳ Not started | Grid, product detail, carousel |
| 5 — Cart & Mock Checkout | ⏳ Not started | Zustand cart, fake payment, inquiry record |
| 6 — Fitting Booking | ⏳ Not started | 6-step wizard, shared bookings table |
| 7 — Reviews, Journal, Polish | ⏳ Not started | MDX posts, reviews, animations, a11y |
| 8 — Demo Prep & Deploy | ⏳ Not started | Lighthouse, cross-browser, Vercel preview |
| 9 — Domain Migration | ⏳ Not started | Cut over from Webador to Vercel |

Legend: ⏳ Not started • 🔨 In progress • ✅ Done

## Decisions made

See `docs/DECISIONS.md` for the full log.

Notable to date:
- Next.js 15 App Router locked
- Supabase project shared with mobile app
- Mock payments for v1, Stripe later
- No customer accounts in v1
- Vercel hosting

## Open questions

- [ ] Final hero image — using a placeholder; Steffi to pick the real one
- [ ] About-page copy — currently from existing site, needs Steffi's voice review
- [ ] Journal post topics — 3 to start, need ideas from Steffi (or write generic Hounslow-wedding pieces)
- [ ] Press section — does Steffi have any features? If yes, set up the section
- [ ] Instagram pull — auto-pull (requires Instagram API + Business account) or static curated grid?

## Blockers

None currently. Setup pending.

## Activity log

### 2026-05-18
- Project kit assembled
- CLAUDE.md, all 16 skills, all 8 commands, all 9 docs, 3 scripts written
- Ready for Phase 0 setup

### 2026-05-20
- Phase 0 scaffold landed: Next.js 15.5 + React 19, Tailwind v4 with `@theme` brand tokens, Fraunces + Inter via `next/font/google`
- `src/lib/` essentials (`cn`, `currency`, `date`, `env`, `motion/presets`) and `src/constants/{brand,nav}.ts`
- UI primitives (`Button`, `Container`, `Section`, `Card`, `Input`, `Label`) + shared `Header`, `MobileDrawer` (Framer Motion drawer, ESC + body-scroll lock), `Footer`, `Logo`, `MotionConfigProvider`
- `(marketing)` route group with placeholder home + global `not-found.tsx`
- `npm run typecheck`, `lint`, `build` all clean; dev smoke test returns 200 + correct `<title>`
- Lucide v1 dropped brand icons; Instagram glyph inlined as SVG in footer

---

## How to update this file

After every commit or session-end:
1. Update the "Current phase" line if it changed
2. Update the phase status table
3. Add to the activity log under today's date
4. Add to "Open questions" anything you noticed but didn't address
5. Add to "Blockers" anything stopping progress

Keep entries short. One line per achievement. Detailed notes go in commit messages and `docs/DECISIONS.md`.
