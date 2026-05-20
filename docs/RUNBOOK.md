# Runbook — Steffny Couture Web

Common ops procedures for when things need doing.

## Daily

Nothing required. Site is static-mostly + Supabase-backed. No daily tasks.

## Weekly

- Glance at Vercel Analytics dashboard. Note any traffic spikes or drops.
- Glance at Supabase dashboard for any failed queries or row count anomalies.

## When a customer reports an issue

1. **Get specifics** — URL, device, browser, what they did, what happened, what they expected
2. **Reproduce** — open the same URL on the same device/browser type
3. **Check logs** — Vercel dashboard → Functions → Logs. Filter by the URL.
4. **Check the database** — Supabase dashboard → Table editor. Look for the relevant booking/inquiry.
5. **Fix and ship** — `/ship "<description>"`
6. **Reply to the customer** — let them know it's resolved

## When you need to add a new product

Steffi adds products through the mobile app. She doesn't touch the website code.

Mobile app flow: Inventory → Add Product → name, description, price, sizes, colours, photos.

The website reads `products` table; new entries appear on `/dresses` within 60 seconds (ISR revalidation).

If she needs help, the steps are:
1. Open Steffny Couture app on her iPad
2. Tap Inventory
3. Tap + Add Product
4. Fill in: name, description, story, category, price, sizes, colours, length
5. Take 4-6 photos, upload
6. Tap Save
7. Within 60 seconds, the product appears at https://www.steffnycouture.co.uk/dresses

## When you need to update a journal post

Journal posts are MDX files in `/content/journal/`.

```bash
# Edit the post
code content/journal/<slug>.mdx

# Verify it renders
npm run dev
# Open http://localhost:3000/journal/<slug>

# Ship it
git add content/journal/<slug>.mdx
git commit -m "docs(journal): update <post title>"
git push
```

Vercel auto-deploys; live within 2 minutes.

## When you need to add a new journal post

```bash
# Create the file
touch content/journal/<slug>.mdx
```

Frontmatter:
```mdx
---
title: How to choose a wedding dress in Hounslow
description: A practical guide to finding the right gown — when to start, what to look for, and how alterations transform a dress into yours.
date: 2026-05-18
image: /assets/journal/<slug>-hero.jpg
imageAlt: Bride at a Hounslow tailoring studio
author: Steffi Da Cruz
readingTime: 6 min
---

# Your post content here
```

Hero image: upload to `/public/assets/journal/<slug>-hero.jpg`. 16:9 aspect ratio recommended.

After saving:
```bash
git add content/journal/<slug>.mdx public/assets/journal/<slug>-hero.jpg
git commit -m "feat(journal): publish '<title>'"
git push
```

It'll appear at `/journal/<slug>` and in the journal index.

## When a review needs moderation

Customers submit reviews via the website form. They land in `reviews` table with `published = false`.

Steffi (or Rohan) reviews them in the mobile app:
1. Open the app
2. Tap Reviews tab
3. New reviews show with "Unpublished" badge
4. Tap to read
5. Approve → sets `published = true`, appears on website within 60 seconds
6. Reject → deletes the row

For high-quality reviews, mark as "Featured" — they pin to the top of the reviews page.

## When a booking comes through the website

1. Customer fills out wizard at `/book` or via product page
2. `inquiries` (for orders) or `bookings` (for fittings) row is created with `source: 'web'`
3. Customer gets confirmation email
4. **Steffi gets notification email** + push notification in the mobile app
5. Steffi opens the booking in the mobile app
6. Steffi updates status as the workflow progresses

If the email didn't arrive:
- Check Supabase Edge Function logs (`send-email` function)
- Check spam folder
- Resend manually from the mobile app's "Resend Notification" button

## When you need to deploy a hotfix

```bash
# 1. Create a branch
git checkout -b fix/<short-description>

# 2. Make the change
# ... edit code ...

# 3. Test locally
npm run typecheck && npm run lint && npm run build

# 4. Commit and push
git add .
git commit -m "fix(<scope>): <description>"
git push origin fix/<short-description>

# 5. Open PR on GitHub, get a preview URL from Vercel
# 6. Test the preview URL on phone + desktop
# 7. Merge to main → auto-deploys to production
```

Time to production: ~5 minutes total.

## When you need to rollback

In Vercel dashboard:
1. Deployments tab
2. Find the last good deployment (green checkmark, before the bad one)
3. Three-dot menu → "Promote to Production"
4. Rollback effective in ~30 seconds

Always faster than fixing the bug forward. Rollback first, debug after.

## When Supabase is slow or returning errors

1. Check Supabase status page: https://status.supabase.com
2. Check the Supabase dashboard for spiking metrics
3. If transient: wait it out
4. If persistent and we're on Pro: open a support ticket via the dashboard
5. While waiting: don't deploy any new migrations, don't seed any new data

## When you need to scale up

Current setup handles thousands of visits/day with no changes. If we ever exceed that:

| Symptom | Fix |
|---|---|
| Slow page loads | Check Lighthouse, optimise images, reduce JS bundle |
| Supabase rate-limit errors | Upgrade Supabase plan tier (currently Pro) |
| Vercel function timeouts | Check long server actions, move to background jobs |
| Slow build times | Check `next.config.ts`, ensure `experimental.optimizePackageImports` |

## When you need to back up the database

```bash
npx supabase db dump > backups/$(date +%Y%m%d).sql
```

Supabase Pro includes 7-day daily backups automatically. Manual backup is for "before a risky migration" moments.

## When you need to restore a backup

```bash
# Connect to the DB
psql "$(npx supabase status --output json | jq -r '.connection_string')"

# Drop & restore (CAREFUL — this is destructive)
\i backups/<date>.sql
```

Better: use Supabase dashboard → Backups → Restore (preserves staff/customer accounts).

## When the domain has issues

1. Check DNS: `dig steffnycouture.co.uk +short` — should return Vercel IPs
2. Check Vercel domains: dashboard → Project → Domains
3. Common fix: re-verify domain ownership via DNS TXT record
4. If SSL cert issue: Vercel re-issues automatically every 60 days; if it failed, click "Refresh Certificate"

## When you need to add a redirect

Edit `next.config.ts`:

```ts
const config: NextConfig = {
  async redirects() {
    return [
      {
        source: '/old-url',
        destination: '/new-url',
        permanent: true, // 301 — preserves SEO
      },
    ];
  },
};
```

Deploy. Redirects are server-side, instant.

## Emergency contacts

- **Vercel issues**: Twitter @vercel, status page, Vercel support (via dashboard)
- **Supabase issues**: status page, Discord, Supabase support ticket
- **Domain registrar**: depends on where steffnycouture.co.uk is registered
- **Email delivery issues**: SMTP provider (currently SendGrid or whatever is in the Edge Function)

## "It's broken and I don't know why"

1. **Check Vercel deployment status** — recent deploy might have failed
2. **Check Vercel logs** — Functions tab → Logs → filter by errors
3. **Check Supabase health** — dashboard for query errors
4. **Roll back the last deploy** — Vercel dashboard, promote previous
5. **Reproduce locally** — `npm run dev` and try the failing flow
6. **`npm run build` locally** — catches most production-only issues
7. **Last resort**: revert the last commit and force-deploy
   ```bash
   git revert HEAD
   git push
   ```
