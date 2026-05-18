import dayjs from "dayjs";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTableOfContents } from "fumadocs-core/content/toc";
import type { BlogPosting as PageSchema, WithContext } from "schema-dts";

import { Button } from "@/components/ui/button";
import { getAllBlogs, getBlogBySlug } from "@/features/blog/lib/blogs";
import { findBlogNeighbour, getBlogPostBySlug } from "@/features/blog/data/posts";
import { Prose } from "@/components/ui/typography";
import { InlineTOC } from "@/components/inline-toc";
import { FloatingTOC } from "@/components/floating-toc";
import { MDX } from "@/components/mdx";
import { MDXViewer } from "@/components/mdx-viewer";
import { cn } from "@/lib/utils";
import { BlogPost } from "@/features/blog/types/blog-post";
import { SITE_INFO } from "@/config/site";
import { USER } from "@/features/profile/data/user";
import { BlogCoverActions } from "@/features/blog/components/blog-cover-actions";
import { KeyboardNavigation } from "@/components/keyboard-navigation";
import { LLMCopyButtonWithViewOptions } from "@/components/post-page-actions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { PostShareMenu } from "@/features/blog/components/post-share-menu";


export async function generateStaticParams() {
    const blogs = getAllBlogs();
    return blogs.map((blog) => ({
        slug: blog.slug,
    }));
}

function getPageJsonLd(post: BlogPost): WithContext<PageSchema> {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.metadata.title,
        description: post.metadata.description,
        image:
            post.metadata.image
                ? (post.metadata.image.startsWith("http") ? post.metadata.image : `${SITE_INFO.url}${post.metadata.image}`)
                : `${SITE_INFO.url}/og/simple?title=${encodeURIComponent(post.metadata.title)}`,
        url: `${SITE_INFO.url}/blog/${post.slug}`,
        datePublished: dayjs(post.metadata.createdAt).toISOString(),
        dateModified: dayjs(post.metadata.updatedAt).toISOString(),
        author: {
            "@type": "Person",
            name: post.metadata.author || USER.displayName,
            identifier: USER.username,
            image: USER.avatar,
        },
    };
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const slug = (await params).slug;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return notFound();
    }

    const { title, description, image, createdAt, updatedAt } = post.metadata;

    const postUrl = `/blog/${post.slug}`;
    const ogImage = image
        ? (image.startsWith("http") ? image : `${SITE_INFO.url}${image}`)
        : `${SITE_INFO.url}/og/simple?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            title,
            description,
            url: `${SITE_INFO.url}${postUrl}`,
            type: "article",
            publishedTime: dayjs(createdAt).toISOString(),
            modifiedTime: dayjs(updatedAt).toISOString(),
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            siteName: SITE_INFO.name,
        },
        twitter: {
            card: "summary_large_image",
            site: "@iammnsh",
            creator: "@iammnsh",
            title,
            description,
            images: [ogImage],
        },
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{
        slug: string;
    }>;
}) {
    const slug = (await params).slug;
    const blog = getBlogBySlug(slug);

    if (!blog) {
        notFound();
    }

    const toc = getTableOfContents(blog.content);

    const allBlogs = getAllBlogs();
    const { previous, next } = findBlogNeighbour(allBlogs, slug);

    return (
        <>
            <KeyboardNavigation
                previousUrl={previous ? `/blog/${previous.slug}` : null}
                nextUrl={next ? `/blog/${next.slug}` : null}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(getPageJsonLd(blog)).replace(/</g, "\\u003c"),
                }}
            />
            <div className="flex items-center justify-between p-2 pl-4">
                <Button
                    className="h-7 gap-2 rounded-none px-0 font-sans text-muted-foreground"
                    variant="link"
                    asChild
                >
                    <Link href="/blog">
                        <ArrowLeftIcon />
                        Blog
                    </Link>
                </Button>

                <div className="flex items-center gap-2 z-10 relative">
                    <LLMCopyButtonWithViewOptions
                        markdownUrl={`/blog/${blog.slug}`}
                        isComponent={false}
                    />

                    <PostShareMenu
                        title={blog.metadata.title}
                        url={`/blog/${blog.slug}`}
                    />

                    {previous && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="size-7 border-none rounded-none"
                                    variant="secondary"
                                    size="icon:sm"
                                    asChild
                                >
                                    <Link href={`/blog/${previous.slug}`}>
                                        <ArrowLeftIcon />
                                        <span className="sr-only">Previous</span>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="pr-2 pl-3">
                                <div className="flex items-center gap-3">
                                    Previous Post
                                    <Kbd className="rounded-none">
                                        <ArrowLeftIcon />
                                    </Kbd>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    )}

                    {next && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="size-7 border-none rounded-none"
                                    variant="secondary"
                                    size="icon:sm"
                                    asChild
                                >
                                    <Link href={`/blog/${next.slug}`}>
                                        <span className="sr-only">Next</span>
                                        <ArrowRightIcon />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="pr-2 pl-3">
                                <div className="flex items-center gap-3">
                                    Next Post
                                    <Kbd className="rounded-none">
                                        <ArrowRightIcon />
                                    </Kbd>
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>

            <div className="border-y border-edge">
                <div
                    className={cn(
                        "relative flex h-8 w-full",
                        "before:absolute before:inset-0 before:-z-1 before:h-full before:w-full",
                        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56"
                    )}
                />
            </div>

            <Prose className="px-4">
                {/* Blog Cover Image with Title Overlay */}
                {blog.metadata.image && (
                    <div className="relative py-4 not-prose">
                        <div className="relative overflow-hidden rounded-none">
                            <Image
                                src={blog.metadata.image}
                                alt={blog.metadata.title}
                                width={1200}
                                height={630}
                                quality={100}
                                priority
                                className="w-full h-auto object-cover aspect-[1200/630]"
                            />

                            {/* Progressive blur gradient overlay */}
                            <div
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                                style={{
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)',
                                    backdropFilter: 'blur(3px)',
                                    WebkitBackdropFilter: 'blur(3px)',
                                    maskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)',
                                }}
                            />

                            {/* Content overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                                {/* Category badge */}
                                {/* {blog.metadata.category && (
                                    <div className="mb-3">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm border border-white/10">
                                            <span className="size-1.5 rounded-full bg-white/80 animate-pulse" />
                                            {blog.metadata.category}
                                        </span>
                                    </div>
                                )} */}

                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                                    {/* Left side: Title, Description, Meta */}
                                    <div className="flex-1 max-w-2xl">
                                        {/* Title */}
                                        <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg leading-snug mb-1 sm:mb-2">
                                            {blog.metadata.title}
                                        </h1>

                                        {/* Description */}
                                        <p className="text-xs sm:text-sm md:text-base text-white/80 line-clamp-2 mb-2 sm:mb-3 leading-relaxed">
                                            {blog.metadata.description}
                                        </p>

                                        {/* Meta info row */}
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-white/70">
                                            {blog.metadata.readTime && (
                                                <span className="flex items-center gap-1">
                                                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {blog.metadata.readTime} min read
                                                </span>
                                            )}
                                            <span className="hidden sm:inline text-white/40">•</span>
                                            <time dateTime={blog.metadata.createdAt} className="flex items-center gap-1">
                                                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {dayjs(blog.metadata.createdAt).format("MMM D, YYYY")}
                                            </time>
                                            {blog.metadata.author && (
                                                <>
                                                    <span className="hidden sm:inline text-white/40">•</span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        {blog.metadata.author}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Subtle border overlay */}
                            <div className="pointer-events-none absolute inset-0 rounded-none ring-1 ring-black/10 ring-inset dark:ring-white/10" />
                        </div>
                    </div>
                )}

                {/* Fallback title when no image */}
                {!blog.metadata.image && (
                    <>
                        <h1 className="border-b border-edge pb-4 mb-4 font-semibold">
                            {blog.metadata.title}
                        </h1>
                        <p className="lead mt-2 mb-4 text-muted-foreground">{blog.metadata.description}</p>
                        {/* Meta info for non-image posts */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6 not-prose">
                            {blog.metadata.readTime && (
                                <span>{blog.metadata.readTime} min read</span>
                            )}
                            <span>•</span>
                            <time dateTime={blog.metadata.createdAt}>
                                {dayjs(blog.metadata.createdAt).format("MMM D, YYYY")}
                            </time>
                            {blog.metadata.author && (
                                <>
                                    <span>•</span>
                                    <span>by {blog.metadata.author}</span>
                                </>
                            )}
                        </div>
                        <div className="mb-6 not-prose">
                            <BlogCoverActions
                                title={blog.metadata.title}
                                content={blog.content}
                                slug={blog.slug}
                            />
                        </div>
                    </>
                )}

                <InlineTOC items={toc} />

                <div className="mt-8">

                    <MDX code={blog.content} />
                </div>
            </Prose>

            <FloatingTOC items={toc} />

            <div className="border-t border-edge h-4 w-full" />
        </>
    );
}
