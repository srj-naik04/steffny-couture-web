# Setup — Steffny Couture Web

Get the project running on a fresh machine.

## Prerequisites

- Node.js 20+ (check: `node -v`)
- npm 10+ (comes with Node)
- Git
- A Supabase project (shared with the mobile app)
- A Vercel account (for deployment)
- VS Code or Cursor or your preferred editor
- Claude Code installed: `npm install -g @anthropic/claude-code`

## 1. Clone the repo

```bash
cd E:\
git clone <your-repo-url> steffny-couture-web
cd steffny-couture-web
```

## 2. Install dependencies

```bash
npm install
```

## 3. Environment variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```bash
# Supabase (same project as mobile app)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Service role key — for server actions only, NEVER expose to client
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Demo mode (true while in demo / staging, false for production)
NEXT_PUBLIC_DEMO_MODE=true

# Vercel Analytics (auto-injected by Vercel, leave blank locally)
# VERCEL_ANALYTICS_ID=
```

Get the Supabase keys from: Supabase dashboard → Settings → API.

## 4. Generate database types

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase gen types typescript --project-id <project-ref> > types/database.ts
```

This produces `types/database.ts` which is imported by `lib/supabase/*.ts` clients.

## 5. Run migrations (first time)

If web-specific tables don't exist yet in Supabase:

```bash
npx supabase db push
```

This applies anything in `supabase/migrations/` that hasn't been applied to the linked project.

## 6. Seed initial data

After tables exist:

```bash
# Pull product photos from existing Webador site
node scripts/scrape-images.mjs

# Optimise them
node scripts/optimise-images.mjs

# Upload to Supabase Storage + insert product records
node scripts/seed-products.ts
```

## 7. Run dev server

```bash
npm run dev
```

Open http://localhost:3000.

## 8. Verify the build

```bash
npm run typecheck   # no errors
npm run lint        # no errors
npm run build       # succeeds with no warnings
```

If any of these fail, see Troubleshooting below.

## 9. Connect Claude Code

In the project root:

```bash
claude
```

Claude reads `CLAUDE.md` and `.claude/` automatically. Try `/phase-start 0` to begin Phase 0.

## 10. Vercel project setup (when ready to deploy)

```bash
npm install -g vercel
vercel login
vercel link
```

Set production env vars in Vercel dashboard:
- Project → Settings → Environment Variables
- Add all variables from `.env.local`
- Mark sensitive ones (service role key) as encrypted
- Set `NEXT_PUBLIC_DEMO_MODE=false` for production

Deploy:
```bash
vercel deploy            # preview URL
vercel deploy --prod     # production (after testing preview)
```

## Project commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run typecheck` | Run TypeScript type check |
| `npm run lint` | Run ESLint |
| `npm run lint -- --fix` | Auto-fix lint issues |
| `npm run format` | Prettier auto-format |
| `npm run scrape` | Scrape images from existing Webador site |
| `npm run optimise` | Optimise scraped images |
| `npm run seed` | Seed Supabase with products |

## Folder structure

See `CLAUDE.md` section 2.

## Troubleshooting

### "Module not found: @/..."

Check `tsconfig.json` paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### "Type 'X' is not assignable to 'Y'" with Supabase

You probably need to regenerate `types/database.ts` after a migration:
```bash
npx supabase gen types typescript --project-id <id> > types/database.ts
```

### Images don't load from Supabase Storage

Check `next.config.ts` `images.remotePatterns` includes your Supabase project hostname:
```ts
{
  protocol: 'https',
  hostname: '<project-ref>.supabase.co',
  pathname: '/storage/v1/object/public/**',
}
```

### "Hydration mismatch" error

Usually caused by:
- `Date.now()` or `new Date()` in render
- `Math.random()` in render
- `localStorage` accessed before client hydration

Fix: move client-only logic into `useEffect`, or wrap with `if (typeof window !== 'undefined')`.

### Build succeeds but page is blank

Check the browser console. Most likely:
- A server component is using a client-only API (`window`, `document`)
- An async server component is throwing (check `error.tsx`)
- Tailwind purge removed classes (constructed dynamically — fix by listing in safelist)

### Vercel build fails but local build succeeds

- Check Node version matches (Vercel uses the version in `package.json`'s `engines` field)
- Make sure all env vars are set in Vercel dashboard
- Check Vercel build logs for the exact error

## Editor setup

### VS Code recommended extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer
- Path Intellisense

### Settings (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*)[\"'`]"]
  ]
}
```

The last setting enables Tailwind autocomplete inside `cn(...)`.

## Next steps after setup

1. Read `CLAUDE.md` end to end
2. Read `docs/ARCHITECTURE.md`
3. Read `docs/DESIGN_SYSTEM-web.md`
4. Open Claude Code: `claude`
5. Run `/phase-start 0` to begin Foundation phase
