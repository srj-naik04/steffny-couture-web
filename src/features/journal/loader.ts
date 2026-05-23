/**
 * Journal loader — Phase 7
 *
 * Server-only. Reads MDX files from content/journal/, parses frontmatter,
 * returns typed post objects sorted by date descending.
 *
 * NOTE: View tracking (journal_views RPC) is intentionally deferred.
 * The increment_view RPC has anon EXECUTE revoked (migration 0004 update).
 * View tracking will be wired up via a cron Edge Function in a later phase.
 */

import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface JournalPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO date string, e.g. '2026-04-18'
  author: string;
  readingMinutes: number;
  heroImage: string;
  heroImageAlt: string;
  tags: string[];
  featured: boolean;
  /**
   * Set `draft: true` in MDX frontmatter to suppress a post from the sitemap,
   * post list, and slug routing. Useful for WIP committed drafts — the file can
   * be committed without auto-publishing via generateStaticParams or sitemap.xml.
   */
  draft?: boolean;
  /** Raw MDX content (body after frontmatter) */
  content: string;
  /** First ~30 words of body text, stripped of markdown */
  excerpt: string;
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const JOURNAL_DIR = path.join(process.cwd(), 'content', 'journal');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip markdown syntax for a plain-text excerpt. */
function extractExcerpt(mdx: string, wordCount = 32): string {
  return mdx
    .replace(/^---[\s\S]*?---\n?/, '') // strip frontmatter
    .replace(/!\[.*?\]\(.*?\)/g, '') // strip images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // unwrap links
    .replace(/#{1,6}\s+/g, '') // strip headings
    .replace(/[*_`>]/g, '') // strip markdown punctuation
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, wordCount)
    .join(' ')
    .concat('…');
}

/**
 * Pre-process raw MDX to quote frontmatter values that contain unescaped colons.
 * YAML spec requires bare colon-containing scalar values to be quoted, but
 * content authors may write them unquoted. This sanitises them before gray-matter
 * parses so the loader is tolerant of natural-language titles like:
 *   title: Something: a subtitle
 */
function sanitiseFrontmatter(raw: string): string {
  const FM_RE = /^---\n([\s\S]*?)\n---/;
  const match = raw.match(FM_RE);
  if (!match) return raw;

  const fm = match[1];
  const sanitised = fm
    .split('\n')
    .map((line) => {
      // Match key: value lines where value is NOT already quoted and contains a colon
      const kv = line.match(/^(\w[\w_]*):\s+(.+)$/);
      if (!kv) return line;
      const [, key, value] = kv;
      // Already quoted — leave as-is
      if (value.startsWith('"') || value.startsWith("'")) return line;
      // Array — leave as-is
      if (value.startsWith('[')) return line;
      // Boolean / number — leave as-is
      if (/^(true|false|\d[\d.]*)$/.test(value.trim())) return line;
      // Value contains a colon — wrap in double-quotes, escape any existing double-quotes
      if (value.includes(':')) {
        const escaped = value.replace(/"/g, '\\"');
        return `${key}: "${escaped}"`;
      }
      return line;
    })
    .join('\n');

  return raw.replace(FM_RE, `---\n${sanitised}\n---`);
}

function parsePost(filename: string): JournalPost {
  const filePath = path.join(JOURNAL_DIR, filename);
  const rawFile = fs.readFileSync(filePath, 'utf-8');
  const raw = sanitiseFrontmatter(rawFile);
  const { data, content } = matter(raw);

  return {
    slug: data.slug as string,
    title: data.title as string,
    description: data.description as string,
    date: String(data.date),
    author: data.author as string,
    readingMinutes: Number(data.readingMinutes ?? 5),
    heroImage: data.heroImage as string,
    heroImageAlt: data.heroImageAlt as string,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    featured: Boolean(data.featured),
    draft: data.draft === true,
    content,
    excerpt: extractExcerpt(content),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getAllPosts(): JournalPost[] {
  const files = fs
    .readdirSync(JOURNAL_DIR)
    .filter((f) => f.endsWith('.mdx'));

  return files
    .map(parsePost)
    .filter((p) => p.draft !== true) // suppress draft posts from all public surfaces
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function getPostBySlug(slug: string): JournalPost | null {
  const files = fs
    .readdirSync(JOURNAL_DIR)
    .filter((f) => f.endsWith('.mdx'));

  for (const file of files) {
    const post = parsePost(file);
    if (post.slug === slug) {
      // Treat draft posts as not found — causes notFound() on the page
      if (post.draft === true) return null;
      return post;
    }
  }
  return null;
}

export function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 2,
): JournalPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug)
    .filter((p) => p.tags.some((t) => tags.includes(t)))
    .slice(0, limit);
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
