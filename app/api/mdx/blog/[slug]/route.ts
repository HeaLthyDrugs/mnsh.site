import fs from "fs";
import path from "path";
import { getAllBlogs } from "@/features/blog/lib/blogs";
import { SITE_INFO } from "@/config/site";

const blogsDirectory = path.join(process.cwd(), "features/blog/content");

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;
    // Use path.basename to prevent path traversal via slug
    const safeSlug = path.basename(slug);
    const filePath = path.join(blogsDirectory, `${safeSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
        return new Response("Not Found", { status: 404 });
    }

    // Return full raw MDX (frontmatter + body) for copy / LLM tools
    const raw = fs.readFileSync(filePath, "utf8");

    return new Response(raw, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Robots-Tag": "noindex, nofollow, noarchive",
            Link: `<${SITE_INFO.url}/blog/${safeSlug}>; rel="canonical"`,
            "Cache-Control": "public, max-age=3600",
        },
    });
}

export async function generateStaticParams() {
    const posts = getAllBlogs();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}
