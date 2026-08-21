import type { Metadata } from "next";
import { Suspense } from "react";

import { BlogList } from "@/features/blog/components/blog-list";
import { BlogListWithSearch } from "@/features/blog/components/blog-list-with-search";
import { getAllBlogs } from "@/features/blog/lib/blogs";
import { SITE_INFO } from "@/config/site";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Thoughts, tutorials, and insights on technology, design, and development.",
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "Blog",
        description:
            "Thoughts, tutorials, and insights on technology, design, and development.",
        url: `${SITE_INFO.url}/blog`,
        images: [
            {
                url: "https://assets.mnsh.site/blog-covers/blog-headline.png",
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
        images: ["https://assets.mnsh.site/blog-covers/blog-headline.png"],
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
