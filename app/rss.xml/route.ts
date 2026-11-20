import { SITE_INFO } from "@/config/site";
import { getAllBlogPosts } from "@/features/blog/data/posts";
import { getAllPosts as getAllWorkPosts } from "@/features/work/data/posts";

export async function GET() {
    const blogPosts = getAllBlogPosts()
        .filter((post) => !post.metadata.hidden)
        .map((post) => ({
            title: post.metadata.title,
            description: post.metadata.description || "",
            link: `${SITE_INFO.url}/blog/${post.slug}`,
            pubDate: new Date(post.metadata.createdAt).toUTCString(),
        }));

    const workPosts = getAllWorkPosts().map((post) => ({
        title: post.metadata.title,
        description: post.metadata.description || "",
        link: `${SITE_INFO.url}/work/${post.slug}`,
        pubDate: new Date(post.metadata.createdAt).toUTCString(),
    }));

    const allPosts = [...blogPosts, ...workPosts]
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
        .slice(0, 20);

    const rssItemsXml = allPosts
        .map(
            (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${post.link}</link>
      <guid isPermaLink="true">${post.link}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${post.pubDate}</pubDate>
    </item>`
        )
        .join("");

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_INFO.name}</title>
    <link>${SITE_INFO.url}</link>
    <description>${SITE_INFO.description}</description>
    <atom:link href="${SITE_INFO.url}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en</language>
${rssItemsXml}
  </channel>
</rss>`;

    return new Response(rssXml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
