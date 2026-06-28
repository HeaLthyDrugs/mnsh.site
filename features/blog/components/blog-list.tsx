"use client";

import { BlogItem } from "./blog-item";
import type { BlogPost } from "../types/blog-post";

interface BlogListProps {
    posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground">No blog posts found.</p>
            </div>
        );
    }

    return (
        <div className="relative py-4">
            <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
                <div className="border-r border-edge"></div>
                <div className="border-l border-edge"></div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {posts.map((post, index) => (
                    <BlogItem
                        key={post.slug}
                        post={post}
                        shouldPreloadImage={index < 4}
                        showNewBadge={post.metadata.new === true}
                    />
                ))}
            </div>
        </div>
    );
}
