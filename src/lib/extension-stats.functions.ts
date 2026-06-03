import { createServerFn } from "@tanstack/react-start";

export interface ExtensionStats {
  users: number | null;
  usersLabel: string | null;
  rating: number | null;
  ratingCount: number | null;
}

function parseStats(html: string): ExtensionStats {
  // Total users, e.g. ">100,000 users<"
  const usersMatch = html.match(/>([0-9][0-9,.]*)\s*users</);
  const usersLabel = usersMatch ? usersMatch[1] : null;
  const users = usersLabel ? Number(usersLabel.replace(/[.,]/g, "")) : null;

  // First "X.Y out of 5 stars" is the extension's own rating
  const ratingMatch = html.match(/([0-9](?:\.[0-9])?)\s*out of\s*5\s*stars/i);
  const rating = ratingMatch ? Number(ratingMatch[1]) : null;

  // Ratings count, e.g. ">502 ratings<"
  const countMatch = html.match(/>([0-9][0-9,.]*)\s*ratings?</);
  const ratingCount = countMatch ? Number(countMatch[1].replace(/[.,]/g, "")) : null;

  return { users, usersLabel, rating, ratingCount };
}

export const getExtensionStats = createServerFn({ method: "GET" })
  .inputValidator((data: { url: string }) => {
    if (!/^https:\/\/chromewebstore\.google\.com\/detail\//.test(data.url)) {
      throw new Error("Invalid Chrome Web Store URL");
    }
    return data;
  })
  .handler(async ({ data }): Promise<ExtensionStats> => {
    try {
      const res = await fetch(data.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (!res.ok) {
        console.error(`CWS fetch ${res.status} for ${data.url}`);
        return { users: null, usersLabel: null, rating: null, ratingCount: null };
      }
      const html = await res.text();
      return parseStats(html);
    } catch (err) {
      console.error("CWS fetch failed:", err);
      return { users: null, usersLabel: null, rating: null, ratingCount: null };
    }
  });
