"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpenText } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/use-sound";

export interface LatestBlogCardProps {
  post?: {
    slug: string;
    title: string;
    description: string;
    createdAt?: string;
    category?: string;
    readTime?: string;
  };
  className?: string;
}

export function LatestBlogCard({ post, className }: LatestBlogCardProps) {
  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  // Fallback defaults if none passed
  const title = post?.title || "Migrating Next.js Project to Astro.js";
  const description =
    post?.description ||
    "Step-by-step performance optimizations and architectural shifts when moving a content-heavy app.";
  const slug = post?.slug || "migrating-nextjs-project-to-astrojs";
  const category = post?.category || "Engineering";
  const readTime = post?.readTime || "5 min read";

  return (
    <Link
      href={`/blog/${slug}`}
      onMouseEnter={playHover}
      onClick={playTap}
      className={cn(
        "group relative flex h-full w-full flex-col justify-between overflow-hidden bg-background p-4 select-none",
        "transition-colors hover:bg-muted/15 cursor-pointer",
        className
      )}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80 border border-edge/80 bg-muted/40 px-1.5 py-0.5">
          <BookOpenText className="size-3 text-primary" weight="bold" />
          Latest Blog
        </span>

        <span className="font-mono text-[10px] text-muted-foreground">
          {readTime}
        </span>
      </div>

      {/* Main Title & Excerpt */}
      <div className="my-auto py-2">
        <h3 className="font-heading font-semibold text-base sm:text-lg leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer: Category & Arrow Action */}
      <div className="pt-2 border-t border-edge/60 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wide">
          #{category}
        </span>

        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          <span>Read</span>
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
