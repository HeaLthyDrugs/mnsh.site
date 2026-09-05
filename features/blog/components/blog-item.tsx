import Link from "next/link";
import dayjs from "dayjs";
import type { BlogPost } from "../types/blog-post";
import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * Formats the date string for display.
 */
function formatDate(dateString: string): string {
    return dayjs(dateString).format("MMM D, YYYY");
}

export function BlogItem({
    post,
    shouldPreloadImage,
    showNewBadge = false,
}: {
    post: BlogPost;
    shouldPreloadImage?: boolean;
    showNewBadge?: boolean;
}) {
    const { metadata } = post;

    return (
        <Link
            href={`/blog/${post.slug}`}
            className={cn(
                "group/post flex flex-col gap-2 p-2",
                "max-sm:border-y max-sm:border-edge",
                "sm:nth-[2n+1]:border-y sm:nth-[2n+1]:border-edge"
            )}
        >
            {metadata.image && (
                <div className="relative select-none [&_img]:aspect-1200/630 [&_img]:rounded-none">
                    <Image
                        src={metadata.image}
                        alt={metadata.title}
                        width={1200}
                        height={630}
                        quality={75}
                        priority={shouldPreloadImage}
                    />

                    <div className="pointer-events-none absolute inset-0 rounded-none ring-1 ring-black/10 ring-inset dark:ring-white/10" />

                    {showNewBadge && (
                        <span className="absolute top-1.5 right-1.5 rounded-none bg-info px-1.5 font-sans text-sm font-medium text-white text-shadow-xs">
                            New
                        </span>
                    )}
                </div>
            )}

            <div className="flex flex-col gap-1">
                <h3 className="text-lg leading-snug font-medium text-balance underline-offset-4 group-hover/post:underline">
                    {metadata.title}
                </h3>

                {/* Read time and date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {metadata.readTime && (
                        <>
                            <span>{metadata.readTime} min read</span>
                            <span>·</span>
                        </>
                    )}
                    <time dateTime={metadata.createdAt}>
                        {formatDate(metadata.createdAt)}
                    </time>
                </div>
            </div>
        </Link>
    );
}
