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

      {/* Progressive Blur (NO black fade) covering bottom 25% */}
      <ProgressiveBlur
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[25%] min-h-[76px] w-full"
        direction="bottom"
        blurLayers={8}
        blurIntensity={6}
      />

      {/* Bottom 25% Text Content: Title at bottom left, small & compact */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[25%] min-h-[76px] flex-col justify-end px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex flex-col gap-1 w-full">
          {/* Title at bottom left */}
          <h3 className="font-heading font-medium sm:font-semibold text-xs sm:text-sm md:text-base leading-snug text-white line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {currentPost.title}
          </h3>

          {/* Metadata bar: Read time on left, Read post on right */}
          <div className="flex items-center justify-between font-mono text-[11px] sm:text-xs text-white/90">
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {currentPost.readTime || "5 min read"}
            </span>

            <div className="flex items-center gap-1 font-medium text-white group-hover:text-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              <span>Read post</span>
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
