import { createServerFn } from "@tanstack/react-start";

const BLOG_RSS_URL = "https://kb.marvellouscode.works/blog/rss.xml";
const NOTIFICATION_TAG = "announcement";
const MAX_POSTS = 5;

export interface BlogNotification {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
}

function extractTag(xml: string, tag: string): string {
  const cdataMatch = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`,
  ).exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();
  const plainMatch = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`).exec(xml);
  return plainMatch ? plainMatch[1].trim() : "";
}

function extractAllTags(xml: string, tag: string): string[] {
  const results: string[] = [];
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*?))<\\/${tag}>`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    results.push((m[1] ?? m[2] ?? "").trim());
  }
  return results;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Extract the first substantial <p> from HTML as the excerpt.
// Skips short paragraphs (callout boxes, update notes) by requiring
// at least MIN_P_LEN characters of visible text.
// Falls back to the first <p> found, or a plain strip if no <p> exists.
const MIN_P_LEN = 80;

function extractExcerpt(html: string, maxLen = 200): string {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");

  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let firstFallback: string | null = null;
  let m: RegExpExecArray | null;

  while ((m = pRe.exec(cleaned)) !== null) {
    const text = stripHtml(m[1]).replace(/\s{2,}/g, " ").trim();
    if (!text) continue;
    if (firstFallback === null) firstFallback = text;
    if (text.length >= MIN_P_LEN) {
      return text.length <= maxLen
        ? text
        : text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
    }
  }

  // No paragraph long enough — use first paragraph found or full strip
  const raw = firstFallback ?? stripHtml(cleaned).replace(/\s{2,}/g, " ").trim();
  return raw.length <= maxLen ? raw : raw.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

export const getBlogNotifications = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogNotification[]> => {
    try {
      const res = await fetch(BLOG_RSS_URL, {
        headers: { "User-Agent": "marvellous-codeworks-site" },
      });
      if (!res.ok) return [];
      const xml = await res.text();

      // Split into <item> blocks
      const itemBlocks = xml.split(/<item[^>]*>/).slice(1);

      const posts: BlogNotification[] = [];

      for (const block of itemBlocks) {
        const closing = block.indexOf("</item>");
        const item = closing >= 0 ? block.slice(0, closing) : block;

        const categories = extractAllTags(item, "category").map((c) =>
          c.toLowerCase(),
        );
        if (!categories.includes(NOTIFICATION_TAG)) continue;

        const title = extractTag(item, "title");
        const link = extractTag(item, "link") || extractTag(item, "guid");
        const pubDate = extractTag(item, "pubDate");
        const rawDescription = extractTag(item, "description");
        const excerpt = extractExcerpt(rawDescription);
        const id = extractTag(item, "guid") || link;

        if (!title || !link) continue;

        posts.push({ id, title, excerpt, url: link, date: pubDate });

        if (posts.length >= MAX_POSTS) break;
      }

      return posts;
    } catch (err) {
      console.error("Blog notifications fetch failed:", err);
      return [];
    }
  },
);
