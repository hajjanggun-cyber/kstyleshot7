import { getBlogPosts } from "@/lib/blog";
import { toAbsoluteUrl } from "@/lib/seo";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc2822Date(input: string): string {
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toUTCString();
  }

  return parsed.toUTCString();
}

export async function GET() {
  const [enPosts, koPosts] = await Promise.all([getBlogPosts("en"), getBlogPosts("ko")]);
  const posts = [...enPosts, ...koPosts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 300);

  const items = posts
    .map((post) => {
      const postUrl = toAbsoluteUrl(`/blog/${post.lang}/${post.slug}`);
      const description = escapeXml(post.description);
      const title = escapeXml(post.title);
      const category = escapeXml(post.category);
      const pubDate = toRfc2822Date(post.updated || post.date);

      return `<item>
  <title>${title}</title>
  <link>${postUrl}</link>
  <guid>${postUrl}</guid>
  <pubDate>${pubDate}</pubDate>
  <category>${category}</category>
  <description>${description}</description>
</item>`;
    })
    .join("\n");

  const now = new Date().toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>kstyleshot Blog</title>
  <link>${toAbsoluteUrl("/blog")}</link>
  <description>kstyleshot style guide posts in English and Korean.</description>
  <language>en</language>
  <lastBuildDate>${now}</lastBuildDate>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
