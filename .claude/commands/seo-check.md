---
description: Audit a page (or all pages) for SEO compliance. Checks meta, structured data, headings, links, and Lighthouse scores.
---

# /seo-check [path]

Audit pages for SEO compliance.

## Inputs

- `[path]` — optional path to a specific page, e.g. `/dresses/pink-wedding-dress`. If omitted, audits all main pages.

## Steps

1. **Read** `seo-and-meta` skill.

2. **For each page to audit**, verify:

   ### Metadata
   - [ ] `<title>` present, 50-60 chars, unique
   - [ ] `<meta description>` present, 140-155 chars, unique
   - [ ] `<meta name="viewport">` present (set by Next.js root layout)
   - [ ] Canonical URL correct (auto-set by `metadataBase`)
   - [ ] `<meta robots>` correct (no `noindex` in production)
   - [ ] OpenGraph `og:title`, `og:description`, `og:image` set
   - [ ] Twitter Card meta tags set

   ### Structure
   - [ ] Exactly one `<h1>` per page
   - [ ] No skipped heading levels (no `<h3>` without `<h2>` before)
   - [ ] All images have `alt` text (descriptive, not `alt="image"`)
   - [ ] Internal links use `<Link>`, not `<a href>` for internal navigation
   - [ ] External links have `rel="noopener noreferrer"` and `target="_blank"` if appropriate
   - [ ] `<main>` element wraps the primary content

   ### Structured data (JSON-LD)
   - [ ] LocalBusiness on home + contact
   - [ ] Product on each dress detail page
   - [ ] BlogPosting on each journal post
   - [ ] BreadcrumbList on every page with depth ≥ 2
   - [ ] All JSON-LD validates at https://search.google.com/test/rich-results

   ### Content
   - [ ] Primary keyword appears in `<h1>` (naturally)
   - [ ] Primary keyword appears in first paragraph (naturally)
   - [ ] No keyword stuffing (no phrase repeated 3+ times unnaturally)
   - [ ] At least 300 words of meaningful content on the page (excluding nav, footer)
   - [ ] At least 2 internal outbound links

   ### Technical
   - [ ] Page is in `sitemap.xml`
   - [ ] Page loads in < 2 seconds on Slow 4G throttle
   - [ ] Lighthouse SEO score ≥ 95
   - [ ] Lighthouse Performance ≥ 90
   - [ ] No 404s in Network tab
   - [ ] Image dimensions specified (no CLS from image loads)

3. **Run Lighthouse** via Vercel preview URL:
   ```
   https://pagespeed.web.dev/analysis?url=<preview-url-here>
   ```
   Report Performance / Accessibility / Best Practices / SEO scores.

4. **Run Rich Results Test**:
   ```
   https://search.google.com/test/rich-results?url=<preview-url-here>
   ```
   Report any detected schemas + validation errors.

5. **Output a report**:
   - Page audited: `<path>`
   - Score summary: Performance / Accessibility / Best Practices / SEO
   - Failed checks (with explicit fixes)
   - Recommendation: pass / fix-these-first

## Hard rules

- Don't fudge results — report the actual scores
- Don't skip Lighthouse because "it's localhost" — use a Vercel preview URL
- Don't claim a page is SEO-ready with the noindex header still on (the Vercel preview env always sends `X-Robots-Tag: noindex`; checking on production after deploy is the only way to confirm)
- Don't pass a page with `<h1>` missing or duplicated
