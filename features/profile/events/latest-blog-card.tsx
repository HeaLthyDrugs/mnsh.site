"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/use-sound";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export interface BlogItem {
  slug: string;
  title: string;
  image?: string;
  readTime?: string;
}

export interface LatestBlogCardProps {
  posts?: BlogItem[];
  post?: BlogItem;
  className?: string;
}

const DEFAULT_POSTS: BlogItem[] = [
  {
    slug: "how-to-support-multiple-ai-providers-in-typescript",
    title: "How to Support Multiple AI Providers in TypeScript",
    readTime: "6 min read",
    image: "https://assets.mnsh.site/blog-covers/how-to-support-multiple-ai-support-in-typescript.png",
  },
  {
    slug: "migrating-nextjs-project-to-astrojs",
    title: "Migrating an Existing Next.js Project to Astro.js",
    readTime: "6 min read",
    image: "https://assets.mnsh.site/blog-covers/migrating-next-js-project-to-astrojs.png",
  },
  {
    slug: "recreate-petr-knolls-glass-button-in-nextjs-and-astro",
    title: "Recreate Petr Knoll's Glass Button in Next.js and Astro",
    readTime: "5 min read",
    image: "https://assets.mnsh.site/blog-covers/glass-button.png",
  },
  {
    slug: "how-to-dockerize-any-app",
    title: "How to Dockerize Any App",
    readTime: "8 min read",
    image: "https://assets.mnsh.site/blog-covers/how-to-dockerize-any-app.png",
  },
];

export function LatestBlogCard({ posts, post, className }: LatestBlogCardProps) {
  const allPosts = posts && posts.length > 0 ? posts : post ? [post] : DEFAULT_POSTS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  const changeRandomPost = useCallback(() => {
    if (allPosts.length <= 1) return;
    setCurrentIndex((current) => {
      let next = Math.floor(Math.random() * allPosts.length);
      while (next === current) {
        next = Math.floor(Math.random() * allPosts.length);
      }
      return next;
    });
  }, [allPosts.length]);

  useEffect(() => {
    if (isHovered || allPosts.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(changeRandomPost, 5200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, changeRandomPost, allPosts.length]);

  const currentPost = allPosts[currentIndex] || allPosts[0];
  const coverImage = currentPost.image || "https://assets.mnsh.site/blog-covers/blog-headline.png";

  return (
    <Link
      href={`/blog/${currentPost.slug}`}
      onMouseEnter={() => {
        setIsHovered(true);
        playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={playTap}
      className={cn(
        "group relative block h-full w-full overflow-hidden bg-black select-none cursor-pointer",
        className
      )}
    >
      {/* Background Cover Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div
          key={currentPost.slug}
          className="absolute inset-0 animate-in fade-in duration-500 ease-out"
        >
          <Image
            src={coverImage}
            alt={currentPost.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority
          />
        </div>
      </div>

      {/* Progressive Blur covering bottom 35% with subtle U-shape arch and blackish tone */}
      <ProgressiveBlur
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[35%] min-h-[96px] w-full"
        direction="bottom"
        shape="u-shape"
        blurLayers={8}
        blurIntensity={6}
        tint="linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.15) 30%, rgba(0, 0, 0, 0.45) 100%)"
      />

      {/* Bottom 35% Text Content: Reverted to clean original typography */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[35%] min-h-[96px] flex-col justify-end px-5 py-4 sm:px-7 sm:py-5">
        <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
          {/* Title at bottom left - clean font-heading, prominent & readable */}
          <h3 className="font-heading font-semibold text-lg sm:text-xl lg:text-2xl leading-snug text-white line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
            {currentPost.title}
          </h3>

          {/* Metadata bar: clean font-mono */}
          <div className="flex items-center justify-between font-mono text-xs sm:text-sm text-white/90">
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              {currentPost.readTime || "5 min read"}
            </span>

            <div className="flex items-center gap-1.5 font-medium text-white group-hover:text-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              <span>Read post</span>
              <ArrowUpRight className="size-3.5 sm:size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
