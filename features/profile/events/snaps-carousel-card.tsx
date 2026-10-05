"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, ArrowUpRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useSound } from "@/hooks/use-sound";
import { SNAPS } from "@/features/snaps/data/snaps";

// Select 5 curated, atmospheric landscape & nature snaps from Lonavala
const FEATURED_SNAPS = [
  SNAPS[0], // green mountain
  SNAPS[1], // ryewood garden
  SNAPS[5], // fog land
  SNAPS[2], // tree silhouette
  SNAPS[4], // sleeping cat
  SNAPS[7], // golden hour goat
].filter(Boolean);

export function SnapsCarouselCard({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % FEATURED_SNAPS.length);
  }, []);

  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(nextSlide, 4200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, nextSlide]);

  const activeSnap = FEATURED_SNAPS[currentIndex];

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
        "group relative flex h-full w-full flex-col justify-between overflow-hidden bg-black select-none cursor-pointer",
        className
      )}
    >
      {/* Background Images with Blur-Fade Crossfade Transition */}
      <div className="absolute inset-0 z-0">
        {FEATURED_SNAPS.map((snap, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={snap.id}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-out",
                isActive
                  ? "opacity-100 scale-100 filter-none"
                  : "opacity-0 scale-105 blur-[6px] pointer-events-none"
              )}
            >
              <Image
                src={snap.src}
                alt={snap.alt || "Lonavla Snap"}
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-cover"
                priority={idx === 0}
              />
            </div>
          );
        })}
      </div>

      {/* Subtle top & bottom shadow gradient scrims (Apple Photos Memories feel) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

      {/* Top Controls: Segmented Stories-style Progress Bars + Memories Badge */}
      <div className="relative z-20 flex flex-col gap-2 p-3">
        {/* Progress indicators */}
        <div className="flex w-full items-center gap-1">
          {FEATURED_SNAPS.map((snap, idx) => (
            <div
              key={snap.id}
              className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/25"
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

        {/* Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-medium tracking-wider text-white uppercase backdrop-blur-md">
            <Camera className="size-3 text-white/90" weight="fill" />
            Snaps
          </span>

          <span className="text-[10px] font-mono text-white/70">
            {currentIndex + 1}/{FEATURED_SNAPS.length}
          </span>
        </div>
      </div>

      {/* Bottom Content: Location, Caption, and Teaser CTA */}
      <div className="relative z-20 flex items-end justify-between gap-2 p-3.5">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-white drop-shadow-sm truncate">
            {activeSnap.location || "Lonavala"}
          </span>
          <span className="text-[10px] text-white/70 drop-shadow-sm truncate">
            {activeSnap.capturedAt || "Monsoon"} · {activeSnap.alt?.slice(0, 30)}...
          </span>
        </div>

        {/* Action arrow button */}
        <div className="flex size-7 shrink-0 items-center justify-center rounded-none border border-white/25 bg-white/10 text-white backdrop-blur-xs transition-transform duration-300 group-hover:scale-105 group-hover:bg-white/20">
          <ArrowUpRight className="size-3.5" />
        </div>
      </div>
    </Link>
  );
}
