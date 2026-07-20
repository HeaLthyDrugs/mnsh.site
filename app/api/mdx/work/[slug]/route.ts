import fs from "fs";
import path from "path";
import { getAllPosts } from "@/features/work/data/posts";
import { SITE_INFO } from "@/config/site";

const worksDirectory = path.join(process.cwd(), "features/work/content");

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;
    // Use path.basename to prevent path traversal via slug
    const safeSlug = path.basename(slug);
    const filePath = path.join(worksDirectory, `${safeSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return new Response("Not Found", { status: 404 });
    }

    // Return full raw MDX (frontmatter + body) for copy / LLM tools
    const raw = fs.readFileSync(filePath, "utf8");

    return new Response(raw, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Robots-Tag": "noindex, nofollow, noarchive",
            Link: `<${SITE_INFO.url}/work/${safeSlug}>; rel="canonical"`,
            "Cache-Control": "public, max-age=3600",
        },
    });
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}
