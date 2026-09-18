"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { BlogItem } from "@/features/blog/components/blog-item";
import type { BlogPost } from "@/features/blog/types/blog-post";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";

export interface BlogsListProps {
  allBlogs: BlogPost[];
  initialLimit?: number;
  showToggle?: boolean;
  className?: string;
}

export function BlogsList({
  allBlogs,
  initialLimit = 4,
  showToggle = true,
  className,
}: BlogsListProps) {
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  const initialItems = allBlogs.slice(0, initialLimit);
  const extraItems = allBlogs.slice(initialLimit);

  const toggleShowAll = () => {
    playTap();
    if (showAll && containerRef.current) {
      const yOffset =
        containerRef.current.getBoundingClientRect().top + window.scrollY;
      const headerOffset = 100;
      if (window.scrollY > yOffset) {
        window.scrollTo({ top: yOffset - headerOffset, behavior: "smooth" });
      }
    }
    setShowAll(!showAll);
  };

  return (
    <div className={cn("flex flex-col", className)} ref={containerRef}>
      <div className="relative py-4 flex flex-col gap-4">
        {/* Background grid lines */}
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge" />
          <div className="border-l border-edge" />
        </div>

        {/* Initial blog posts */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {initialItems.map((post, index) => (
            <BlogItem
              key={post.slug}
              post={post}
              shouldPreloadImage={index < 2}
              showNewBadge={post.metadata.new === true}
            />
          ))}
        </div>

        {/* Extra blog posts with smooth reveal */}
        <AnimatePresence initial={false}>
          {showAll && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {extraItems.map((post) => (
                  <BlogItem
                    key={post.slug}
                    post={post}
                    showNewBadge={post.metadata.new === true}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showToggle && (
        <div className="border-t border-edge bg-gradient-to-b from-accent2/30 to-transparent">
          <div className="flex items-stretch justify-center gap-2 px-2">
            <div className="w-px bg-[repeating-linear-gradient(to_bottom,var(--color-muted-foreground)_0,var(--color-muted-foreground)_3px,transparent_3px,transparent_6px)] opacity-20" />
            <div className="flex items-center gap-2 py-2">
              <span className="text-xs font-heading text-muted-foreground/60 whitespace-nowrap">
                {showAll ? "Read enough ?" : "Want to read more ?"}
              </span>
              {extraItems.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={toggleShowAll}
                    onMouseEnter={playHover}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-200 group whitespace-nowrap cursor-pointer"
                  >
                    <span className="underline underline-offset-2 decoration-muted-foreground/30 group-hover:decoration-primary">
                      {showAll ? "View less" : "View all posts"}
                    </span>
                  </button>
                  <span className="text-xs text-muted-foreground/40">·</span>
                </>
              )}
              <Link
                href="/blog"
                onMouseEnter={playHover}
                onClick={playTap}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-200 group whitespace-nowrap"
              >
                <span className="underline underline-offset-2 decoration-muted-foreground/30 group-hover:decoration-primary">
                  All articles
                </span>
                <ArrowUpRight className="size-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
            <div className="w-px bg-[repeating-linear-gradient(to_bottom,var(--color-muted-foreground)_0,var(--color-muted-foreground)_3px,transparent_3px,transparent_6px)] opacity-20" />
          </div>
        </div>
      )}
    </div>
  );
}
