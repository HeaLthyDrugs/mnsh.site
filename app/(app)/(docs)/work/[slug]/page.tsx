import dayjs from "dayjs";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTableOfContents } from "fumadocs-core/content/toc";
import type { BlogPosting as PageSchema, WithContext } from "schema-dts";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getAllWorks, getWorkBySlug } from "@/features/work/lib/works";
import { findNeighbour, getPostBySlug } from "@/features/work/data/posts";
import { Prose } from "@/components/ui/typography";
import { InlineTOC } from "@/components/inline-toc";
import { FloatingTOC } from "@/components/floating-toc";
import { MDX } from "@/components/mdx";
import { cn } from "@/lib/utils";
import { Post } from "@/features/work/types/work-post";
import { SITE_INFO } from "@/config/site";
import { USER } from "@/features/profile/data/user";
import { KeyboardNavigation } from "@/components/keyboard-navigation";
import { LLMCopyButtonWithViewOptions } from "@/components/post-page-actions";
import { WorkCarousel } from "@/features/work/components/work-carousel";

export async function generateStaticParams() {
  const works = getAllWorks();
  return works.map((work) => ({
    slug: work.slug,
  }));
}

function getPageJsonLd(post: Post): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metadata.title,
    description: post.metadata.description,
    image:
      post.metadata.image ||
      `/og/simple?title=${encodeURIComponent(post.metadata.title)}`,
    url: `${SITE_INFO.url}${getPostUrl(post)}`,
    datePublished: dayjs(post.metadata.createdAt).toISOString(),
    dateModified: dayjs(post.metadata.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: USER.displayName,
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
  const post = getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const { title, description, image, createdAt, updatedAt } = post.metadata;

  const postUrl = getPostUrl(post);
  const ogImage = image || `/og/simple?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      url: postUrl,
      type: "article",
      publishedTime: dayjs(createdAt).toISOString(),
      modifiedTime: dayjs(updatedAt).toISOString(),
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: "summary_large_image",
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
  const work = getWorkBySlug(slug);

  if (!work) {
    notFound();
  }

  const toc = getTableOfContents(work.content);

  const allWorks = getAllWorks();
  const { previous, next } = findNeighbour(allWorks, slug);

  return (
    <>
      <KeyboardNavigation
        previousUrl={previous ? `/work/${previous.slug}` : null}
        nextUrl={next ? `/work/${next.slug}` : null}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd(work)).replace(/</g, "\\u003c"),
        }}
      />
      <div className="flex items-center justify-between p-2 pl-4">
        <Button
          className="h-7 gap-2 rounded-lg px-0 text-muted-foreground"
          variant="link"
          asChild
        >
          <Link href="/work">
            <ArrowLeftIcon />
            Works
          </Link>
        </Button>

        <div className="flex items-center gap-1">
          <LLMCopyButtonWithViewOptions
            markdownUrl={getPostUrl(work)}
            isComponent={work.metadata.category === "components"}
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
                  <Link href={`/work/${previous.slug}`}>
                    <ArrowLeftIcon />
                    <span className="sr-only">Previous: {previous.metadata.title}</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Previous Post
                  <Kbd>
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
                  <Link href={`/work/${next.slug}`}>
                    <span className="sr-only">Next: {next.metadata.title}</span>
                    <ArrowRightIcon />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Next Post
                  <Kbd>
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
        <div className="-mx-4 px-4 pb-4 mb-4 pt-4 not-prose">
          <h1 className="text-2xl sm:text-2xl font-bold text-foreground mb-2">
            {work.metadata.title}
          </h1>
          <p className="text-base text-muted-foreground text-balance mb-6">
            {work.metadata.description}
          </p>
        </div>

        {work.metadata.gallery && work.metadata.gallery.length > 0 && (
          <div className="mb-8 not-prose w-full">
            <WorkCarousel gallery={work.metadata.gallery} />
          </div>
        )}

        <div className="-mx-4 px-4 pb-4 mb-4 not-prose">
          <InlineTOC items={toc} />
        </div>

        <div className="mt-8">
          <MDX code={work.content} />
        </div>
      </Prose>

      <FloatingTOC items={toc} />

      <div className="border-t border-edge h-4 w-full" />
    </>
  );
}

function getPostUrl(post: Post) {
  const isComponent = post.metadata.category === "components";
  return isComponent ? `/blog/${post.slug}` : `/work/${post.slug}`;
}
