# Steffny Couture — Web

The website for [Steffny Couture](https://www.steffnycouture.co.uk), a couture and alterations studio in Hounslow, London.

Built with Next.js 15, Tailwind CSS v4, Supabase, and Framer Motion. Shares a backend with the [Steffny Couture mobile app](../steffny-couture/).

## Tech stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animation:** Framer Motion
- **Forms:** React Hook Form + Zod
- **State:** Zustand (client) + TanStack Query (server-derived)
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **Hosting:** Vercel
- **Email:** Nodemailer via Supabase Edge Function (shared with mobile app)

## Quick start

```bash
# Install
npm install

# Configure
cp .env.local.example .env.local
# (fill in Supabase keys)

# Generate types from Supabase
npx supabase gen types typescript --project-id <id> > types/database.ts

# Dev server
npm run dev
```

Open http://localhost:3000.

Full setup guide: `docs/SETUP-web.md`.

## Project structure

```
app/                  Next.js App Router pages (route groups: marketing, shop, booking)
components/           Reusable React components (ui, marketing, shop, booking, shared)
features/             Domain logic (products, cart, bookings, reviews)
content/              MDX content (journal posts)
lib/                  Cross-cutting helpers (supabase clients, cn, currency, date)
constants/            Brand tokens, shop info, nav structure
types/                TypeScript types (auto-generated database.ts)
public/               Static assets, scraped images
scripts/              Build-time scripts (scrape, optimise, seed)
supabase/             Database migrations
.claude/              Claude Code config (skills, commands, settings)
docs/                 Documentation (architecture, design, runbook, etc.)
```

Full details: `CLAUDE.md` section 2.

## Working with Claude Code

The repository is configured for [Claude Code](https://docs.claude.com/claude-code).

```bash
claude
```

Available slash commands:
- `/phase-start <n>` — begin a build phase
- `/phase-check <n>` — verify a phase's acceptance criteria
- `/page <name>` — scaffold a new page
- `/component <name>` — scaffold a new component
- `/migration <description>` — create a Supabase migration
- `/scrape` — run the image extraction from existing site
- `/ship <description>` — full ship cycle (typecheck, lint, build, commit, push)
- `/seo-check <page-or-all>` — run an SEO audit

## Skills

Pre-configured Claude Code skills:
- `steffny-brand` — the brand bible (palette, typography, voice)
- `nextjs` — App Router conventions
- `tailwind-web` — styling patterns + token discipline
- `framer-motion` — motion vocabulary
- `responsive-design` — mobile-first, breakpoints, touch targets
- `seo-and-meta` — metadata, schema.org, sitemap
- `supabase-web` — dual client pattern, RLS, server actions
- `ecommerce-mock` — cart, mock checkout, future Stripe path
- `booking-fitting` — 6-step wizard, shared with mobile app
- `react-hook-form-zod-web` — form patterns
- `product-catalog` — catalogue + product detail patterns
- `image-pipeline` — `next/image`, Supabase Storage, blur placeholders
- `content-cms` — MDX posts, reviews moderation
- `vercel-deploy` — deployment + domain migration
- `commit-discipline` — git hygiene
- `demo-readiness` — pre-launch checklist

Each in `.claude/skills/<name>/SKILL.md`.

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run start        # Run production build locally
npm run typecheck    # Type check
npm run lint         # Lint
npm run format       # Prettier auto-format
npm run scrape       # Scrape images from Webador
npm run optimise     # Optimise scraped images
npm run seed         # Seed Supabase with products
```

## Documentation

- `CLAUDE.md` — master build spec (read this first)
- `docs/ARCHITECTURE.md` — system architecture
- `docs/DATABASE_WEB.md` — schema (shared + web-only)
- `docs/DESIGN_SYSTEM-web.md` — visual reference
- `docs/SETUP-web.md` — full setup instructions
- `docs/RUNBOOK.md` — ops procedures
- `docs/DECISIONS.md` — decision log
- `docs/DEMO_SCRIPT-web.md` — for showing the site to Bunty + Steffi
- `docs/SUBMISSION_CHECKLIST-web.md` — pre-launch checklist
- `docs/PRIVACY_POLICY_TEMPLATE.md` — privacy policy boilerplate
- `PROGRESS.md` — live build state

## Deployment

The site deploys automatically to Vercel:
- Every push to `main` → production (eventually `steffnycouture.co.uk`)
- Every push to any branch → preview URL

Domain migration from Webador happens after Bunty approves the build. See `docs/SUBMISSION_CHECKLIST-web.md` for the cutover plan.

## License

Proprietary. © Steffny Couture Ltd.
