import type { Metadata } from "next";
import { Suspense } from "react";

import { BlogList } from "@/features/blog/components/blog-list";
import { BlogListWithSearch } from "@/features/blog/components/blog-list-with-search";
import { BlogSearchInput } from "@/features/blog/components/blog-search-input";
import { getAllBlogs } from "@/features/blog/lib/blogs";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Thoughts, tutorials, and insights on technology, design, and development.",
    openGraph: {
        title: "Blog",
        description:
            "Thoughts, tutorials, and insights on technology, design, and development.",
        images: [
            {
                url: "https://assets.mnsh.online/blog-covers/blog-headline.png",
                width: 1200,
                height: 630,
                alt: "Blog",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog",
        description:
            "Thoughts, tutorials, and insights on technology, design, and development.",
        images: ["https://assets.mnsh.online/blog-covers/blog-headline.png"],
    },
};

export default function Page() {
    const allBlogs = getAllBlogs();

    return (
        <div>
            <div className="border-b border-edge px-2 py-2">
                <h1 className="text-3xl font-semibold font-heading">Blog</h1>
            </div>

            <div className="px-2 py-2 border-b border-edge">
                <p className="font-heading text-sm text-balance text-muted-foreground">
                    {metadata.description as string}
                </p>
            </div>

            <Suspense fallback={<BlogList posts={allBlogs} />}>
                <BlogListWithSearch posts={allBlogs} />
            </Suspense>
        </div>
    );
}
