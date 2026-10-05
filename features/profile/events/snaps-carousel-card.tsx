"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/use-sound";
import { SNAPS } from "@/features/snaps/data/snaps";

// 4 atmospheric landscape snaps
const FEATURED_SNAPS = [
  SNAPS[0], // green mountain
  SNAPS[1], // ryewood garden
  SNAPS[5], // fog land
  SNAPS[2], // tree silhouette
].filter(Boolean);

export function SnapsCarouselCard({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  const nextSlide = useCallback(() => {
    setCurrentIndex((current) => {
      setPrevIndex(current);
      return (current + 1) % FEATURED_SNAPS.length;
    });
  }, []);

  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(nextSlide, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, nextSlide]);

  return (
    <Link
      href="/snaps"
      onMouseEnter={() => {
        setIsHovered(true);
        playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={playTap}
      className={cn(
        "group relative flex h-full w-full overflow-hidden bg-muted/40 select-none cursor-pointer",
        className
      )}
    >
      {/* Background Images Layer */}
      <div className="absolute inset-0 z-0">
        {FEATURED_SNAPS.map((snap, idx) => {
          const isCurrent = idx === currentIndex;
          const isPrevious = idx === prevIndex;

          return (
            <div
              key={snap.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                isCurrent
                  ? "opacity-100 z-10"
                  : isPrevious
                  ? "opacity-100 z-0"
                  : "opacity-0 z-0 pointer-events-none"
              )}
            >
              <Image
                src={snap.src}
                alt={snap.alt || "Snap"}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority={idx < 2}
                quality={80}
              />
            </div>
          );
        })}
      </div>

      {/* Top Pagination Bar: Shown ONLY on hover */}
      <div className="pointer-events-none absolute top-3 inset-x-3 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {FEATURED_SNAPS.map((snap, idx) => (
          <div
            key={snap.id}
            className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30 backdrop-blur-xs"
          >
            <div
              className={cn(
                "h-full w-full rounded-full transition-all duration-500",
                idx === currentIndex
                  ? "bg-white"
                  : idx < currentIndex
                  ? "bg-white/60"
                  : "bg-transparent"
              )}
            />
          </div>
        ))}
      </div>

      {/* Bottom Right Corner Button: Shown ONLY on hover */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex size-7 items-center justify-center border border-white/30 bg-black/40 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
          <ArrowUpRight className="size-3.5" />
        </div>
      </div>
    </Link>
  );
}
