import type { Metadata } from "next";
import { Suspense } from "react";

import { BlogList } from "@/features/blog/components/blog-list";
import { BlogListWithSearch } from "@/features/blog/components/blog-list-with-search";
import { getAllBlogs } from "@/features/blog/lib/blogs";
import { PageHeader } from "@/components/page-header";
import { SITE_INFO } from "@/config/site";

const TITLE = "Blog";
const DESCRIPTION = "Thoughts, tutorials, and notes on software and design.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: `${SITE_INFO.url}/blog`,
        images: [
            {
                url: "https://assets.mnsh.site/blog-covers/blog-headline.png",
                width: 1200,
                height: 630,
                alt: TITLE,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: ["https://assets.mnsh.site/blog-covers/blog-headline.png"],
    },
};

export default function Page() {
    const allBlogs = getAllBlogs();

    return (
        <div>
            <PageHeader title={TITLE} description={DESCRIPTION} />

            <Suspense fallback={<BlogList posts={allBlogs} />}>
                <BlogListWithSearch posts={allBlogs} />
            </Suspense>
        </div>
    );
}
