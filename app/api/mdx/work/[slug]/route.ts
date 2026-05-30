import { getPostBySlug, getAllPosts } from "@/features/work/data/posts";
import { SITE_INFO } from "@/config/site";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const slug = (await params).slug;
    const post = getPostBySlug(slug);

    if (!post) {
        return new Response("Not Found", { status: 404 });
    }

    return new Response(post.content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Robots-Tag": "noindex, nofollow, noarchive",
            Link: `<${SITE_INFO.url}/work/${slug}>; rel="canonical"`,
        },
    });
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}
