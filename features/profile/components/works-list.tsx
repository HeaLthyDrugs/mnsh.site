"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WorkItem } from "@/features/work/components/work-item";
import type { Post } from "@/features/work/types/work-post";

export function WorksList({ allWorks }: { allWorks: Post[] }) {
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialItems = allWorks.slice(0, 4);
  const extraItems = allWorks.slice(4);

  const toggleShowAll = () => {
    if (showAll && containerRef.current) {
        const yOffset = containerRef.current.getBoundingClientRect().top + window.scrollY;
        
        const headerOffset = 100;
        if (window.scrollY > yOffset) {
            window.scrollTo({ top: yOffset - headerOffset, behavior: 'smooth' });
        }
    }
    setShowAll(!showAll);
  }

  return (
    <div className="flex flex-col" ref={containerRef}>
      <div className="relative py-4 flex flex-col gap-4">
        {/* Background grid lines */}
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge"></div>
          <div className="border-l border-edge"></div>
        </div>

        {/* Initial works */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {initialItems.map((work) => (
            <WorkItem key={work.slug} work={work} />
          ))}
        </div>

        {/* Extra works with smooth reveal */}
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
                {extraItems.map((work) => (
                  <WorkItem key={work.slug} work={work} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {extraItems.length > 0 && (
          <div className="border-t border-edge bg-gradient-to-b from-accent2/30 to-transparent">
              <div className="flex items-stretch justify-center gap-2 px-2">
                  <div className="w-px bg-[repeating-linear-gradient(to_bottom,var(--color-muted-foreground)_0,var(--color-muted-foreground)_3px,transparent_3px,transparent_6px)] opacity-20" />
                  <div className="flex items-center gap-2 py-2">
                      <span className="text-xs font-heading text-muted-foreground/60 whitespace-nowrap">
                          {showAll ? "Seen enough ?" : "Want to see more ?"}
                      </span>
                      <button
                          onClick={toggleShowAll}
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-200 group whitespace-nowrap cursor-pointer"
                      >
                          <span className="underline underline-offset-2 decoration-muted-foreground/30 group-hover:decoration-primary">
                              {showAll ? "View less" : "View all works"}
                          </span>
                      </button>
                  </div>
                  <div className="w-px bg-[repeating-linear-gradient(to_bottom,var(--color-muted-foreground)_0,var(--color-muted-foreground)_3px,transparent_3px,transparent_6px)] opacity-20" />
              </div>
          </div>
      )}
    </div>
  );
}
