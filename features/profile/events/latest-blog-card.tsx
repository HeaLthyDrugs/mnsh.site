"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/use-sound";

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
        "group relative flex h-full w-full flex-col justify-between overflow-hidden bg-black p-5 sm:p-7 select-none cursor-pointer",
        className
      )}
    >
      {/* Background Cover Image - Strictly only the current post's image is rendered to prevent any overlapping */}
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

        {/* Faded dark gradient overlay on top of the image so direct text is crisp & readable */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/45 to-black/80 pointer-events-none" />
      </div>

      {/* Top: Title directly on card (no background / box) */}
      <div className="relative z-20">
        <h3 className="font-heading font-semibold text-xl sm:text-2xl lg:text-3xl leading-snug text-white line-clamp-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          {currentPost.title}
        </h3>
      </div>

      {/* Center spacer */}
      <div className="flex-1 min-h-6" />

      {/* Bottom: Read time on left, Read post on right directly on card (no background / box) */}
      <div className="relative z-20 flex items-center justify-between text-white/90">
        <span className="font-mono text-xs font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          {currentPost.readTime || "5 min read"}
        </span>

        <div className="flex items-center gap-1.5 font-mono text-xs font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] group-hover:text-white transition-colors">
          <span>Read post</span>
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}
