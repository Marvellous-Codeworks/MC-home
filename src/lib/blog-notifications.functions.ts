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

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function truncate(text: string, maxLen = 140): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
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
        const excerpt = truncate(stripHtml(rawDescription));
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
