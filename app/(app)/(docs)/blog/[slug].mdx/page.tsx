import { getBlogPostBySlug, getAllBlogPosts } from "@/features/blog/data/posts";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
    const posts = getAllBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between p-2 pl-4 border-b border-edge">
                <Button
                    className="h-7 gap-2 rounded-lg px-0 font-sans text-muted-foreground"
                    variant="link"
                    asChild
                >
                    <Link href={`/blog/${slug}`}>
                        <ArrowLeft className="w-4 h-4" />
                        Back to Rendered View
                    </Link>
                </Button>
                <div className="flex items-center gap-2 pr-4">
                    <span className="text-sm text-muted-foreground font-sans">Copy MDX</span>
                    <CopyButton value={post.content} className="size-7" />
                </div>
            </div>
            <div className="flex-1 bg-[#0d1117] p-4 sm:p-6 overflow-x-auto">
                <pre className="text-[13px] leading-6 relative">
                    <code className="language-mdx text-[#c9d1d9]" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {post.content}
                    </code>
                </pre>
            </div>
        </div>
    );
}
