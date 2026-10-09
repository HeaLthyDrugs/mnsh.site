"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/use-sound";
import { SNAPS } from "@/features/snaps/data/snaps";
import type { Snap } from "@/features/snaps/types/snap";

function shuffleSnaps(allSnaps: Snap[]): Snap[] {
  if (!allSnaps || allSnaps.length === 0) return [];
  const array = [...allSnaps];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function SnapsCarouselCard({ className }: { className?: string }) {
  const [snaps] = useState<Snap[]>(() => shuffleSnaps(SNAPS));
  const [currentIndex, setCurrentIndex] = useState(0);

  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  useEffect(() => {
    if (snaps.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [snaps.length]);

  if (snaps.length === 0) return null;

  const currentSnap = snaps[currentIndex % snaps.length];
  const nextSnap = snaps[(currentIndex + 1) % snaps.length];

  return (
    <Link
      href="/snaps"
      onMouseEnter={playHover}
      onClick={playTap}
      className={cn(
        "group relative flex h-full w-full overflow-hidden bg-muted/40 select-none cursor-pointer",
        className
      )}
    >
      {/* Background Images Crossfade */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 will-change-[opacity]"
        >
          <Image
            src={currentSnap.src}
            alt={currentSnap.alt || "Snap"}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            priority={currentIndex === 0}
            quality={85}
          />
        </motion.div>
      </AnimatePresence>

      {/* Offscreen Preloader for the next image in the infinite sequence */}
      {nextSnap && (
        <div
          className="pointer-events-none absolute -left-[9999px] -top-[9999px] size-1 overflow-hidden opacity-0"
          aria-hidden="true"
        >
          <Image
            src={nextSnap.src}
            alt="preload next snap"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            quality={85}
            priority
          />
        </div>
      )}

      {/* Bottom Right Corner Button: Shown ONLY on hover */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex size-7 items-center justify-center border border-white/30 bg-black/40 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
          <ArrowUpRight className="size-3.5" />
        </div>
      </div>
    </Link>
  );
}
