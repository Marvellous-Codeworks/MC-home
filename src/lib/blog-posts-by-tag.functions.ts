import { createServerFn } from "@tanstack/react-start";

const BLOG_RSS_URL = "https://kb.marvellouscode.works/blog/rss.xml";
const MAX_POSTS = 3;

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
}

function extractTag(xml: string, tag: string): string {
  const escapedTag = tag.replace(":", "\\:");
  const cdataMatch = new RegExp(
    `<${escapedTag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${escapedTag}>`,
  ).exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();
  const plainMatch = new RegExp(`<${escapedTag}[^>]*>([^<]*)<\\/${escapedTag}>`).exec(xml);
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
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s{2,}/g, " ")
    .trim();
}

const MIN_P_LEN = 80;

function removeTagBlock(html: string, tagName: string): string {
  let result = "";
  let pos = 0;
  const openPattern = "<" + tagName;
  const closePattern = "</" + tagName;
  const lower = html.toLowerCase();
  while (pos < html.length) {
    const openIdx = lower.indexOf(openPattern, pos);
    if (openIdx === -1) { result += html.slice(pos); break; }
    result += html.slice(pos, openIdx);
    const tagClose = html.indexOf(">", openIdx);
    if (tagClose === -1) break;
    const closeIdx = lower.indexOf(closePattern, tagClose);
    if (closeIdx === -1) break;
    const afterClose = html.indexOf(">", closeIdx);
    pos = afterClose === -1 ? html.length : afterClose + 1;
  }
  return result;
}

function extractExcerpt(html: string, maxLen = 200): string {
  const cleaned = removeTagBlock(removeTagBlock(html, "script"), "style");
  const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let firstFallback: string | null = null;
  let m: RegExpExecArray | null;
  while ((m = pRe.exec(cleaned)) !== null) {
    const text = stripHtml(m[1]).replace(/\s{2,}/g, " ").trim();
    if (!text) continue;
    if (firstFallback === null) firstFallback = text;
    if (text.length >= MIN_P_LEN) {
      return text.length <= maxLen ? text : text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
    }
  }
  const raw = firstFallback ?? stripHtml(cleaned).replace(/\s{2,}/g, " ").trim();
  return raw.length <= maxLen ? raw : raw.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

export const getBlogPostsByTag = createServerFn({ method: "GET" })
  .inputValidator((data: { tag: string }) => data)
  .handler(async ({ data }): Promise<BlogPost[]> => {
    try {
      const res = await fetch(BLOG_RSS_URL, {
        headers: { "User-Agent": "marvellous-codeworks-site" },
      });
      if (!res.ok) return [];
      const xml = await res.text();

      const itemBlocks = xml.split(/<item[^>]*>/).slice(1);
      const posts: BlogPost[] = [];
      const filterTag = data.tag.toLowerCase();

      for (const block of itemBlocks) {
        const closing = block.indexOf("</item>");
        const item = closing >= 0 ? block.slice(0, closing) : block;

        const categories = extractAllTags(item, "category").map((c) => c.toLowerCase());
        if (!categories.includes(filterTag)) continue;

        const title = extractTag(item, "title");
        const link = extractTag(item, "link") || extractTag(item, "guid");
        const pubDate = extractTag(item, "pubDate");
        const rawDescription = extractTag(item, "description");
        const descriptionText = stripHtml(rawDescription).replace(/\s{2,}/g, " ").trim();
        const fullContent = extractTag(item, "content:encoded");
        const excerpt =
          descriptionText.length >= MIN_P_LEN
            ? descriptionText.length <= 200
              ? descriptionText
              : descriptionText.slice(0, 200).replace(/\s+\S*$/, "") + "…"
            : extractExcerpt(fullContent || rawDescription);
        const id = extractTag(item, "guid") || link;

        if (!title || !link) continue;
        posts.push({ id, title, excerpt, url: link, date: pubDate });
        if (posts.length >= MAX_POSTS) break;
      }

      return posts;
    } catch (err) {
      console.error("Blog posts by tag fetch failed:", err);
      return [];
    }
  });
