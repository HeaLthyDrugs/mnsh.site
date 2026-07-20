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
import { cn } from "@/lib/utils";
import { BlogPost } from "@/features/blog/types/blog-post";
import { SITE_INFO } from "@/config/site";
import { USER } from "@/features/profile/data/user";
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
    const canonicalUrl = `${SITE_INFO.url}/blog/${post.slug}`;
    const imageUrl =
        post.metadata.image
            ? (post.metadata.image.startsWith("http") ? post.metadata.image : `${SITE_INFO.url}${post.metadata.image}`)
            : `${SITE_INFO.url}/og/simple?title=${encodeURIComponent(post.metadata.title)}`;

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.metadata.title,
        description: post.metadata.description,
        keywords: post.metadata.keywords?.join(", ") || post.metadata.tags?.join(", "),
        image: imageUrl,
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
        datePublished: dayjs(post.metadata.createdAt).toISOString(),
        dateModified: dayjs(post.metadata.updatedAt).toISOString(),
        articleSection: post.metadata.category,
        author: {
            "@type": "Person",
            name: post.metadata.author || USER.displayName,
            identifier: USER.username,
            image: USER.avatar,
        },
        publisher: {
            "@type": "Person",
            name: USER.displayName,
            image: USER.avatar,
            url: SITE_INFO.url,
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

    const { title, description, image, createdAt, updatedAt, keywords, tags, category, author } = post.metadata;

    const postUrl = `/blog/${post.slug}`;
    const ogImage = image
        ? (image.startsWith("http") ? image : `${SITE_INFO.url}${image}`)
        : `${SITE_INFO.url}/og/simple?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        keywords: keywords?.length ? keywords : tags,
        authors: [
            {
                name: author || USER.displayName,
                url: SITE_INFO.url,
            },
        ],
        category,
        robots: {
            index: true,
            follow: true,
        },
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
        other: {
            "article:published_time": dayjs(createdAt).toISOString(),
            "article:modified_time": dayjs(updatedAt).toISOString(),
            ...(category ? { "article:section": category } : {}),
            ...(tags?.length ? { "article:tag": tags.join(", ") } : {}),
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
                                    size="icon-sm"
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
                                    size="icon-sm"
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
                {/* Blog cover — image only */}
                {blog.metadata.image && (
                    <div className="relative py-4 not-prose">
                        <div className="relative overflow-hidden rounded-none ring-1 ring-black/10 ring-inset dark:ring-white/10">
                            <Image
                                src={blog.metadata.image}
                                alt={blog.metadata.title}
                                width={1200}
                                height={630}
                                quality={100}
                                priority
                                className="w-full h-auto object-cover aspect-[1200/630]"
                            />
                        </div>
                    </div>
                )}

                {/* Visually hidden title for accessibility / document outline */}
                <h1 className="sr-only">{blog.metadata.title}</h1>

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
