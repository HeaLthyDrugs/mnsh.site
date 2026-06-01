/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { Snap } from "@/features/snaps/types/snap";
import { toCloudflareTransformedUrl } from "@/lib/cloudflare-image";
import { cn } from "@/lib/utils";

export function SnapsBentoGrid({
  snaps,
  className,
}: {
  snaps: Snap[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const activeSnap = useMemo(() => {
    if (activeIndex === null) return null;
    return snaps[activeIndex] ?? null;
  }, [activeIndex, snaps]);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % snaps.length;
    });
  }, [snaps.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + snaps.length) % snaps.length;
    });
  }, [snaps.length]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, closeLightbox, goNext, goPrev]);

  useEffect(() => {
    if (activeIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [activeIndex]);

  return (
    <>
      <div
        className={cn(
          "columns-1 gap-1 sm:columns-2 md:columns-3 [column-fill:balance]",
          className
        )}
      >
        {snaps.map((snap, index) => (
          <figure
            key={snap.id}
            className="group relative mb-1 break-inside-avoid overflow-hidden border border-edge bg-card"
          >
            <button
              type="button"
              className="relative block w-full cursor-zoom-in overflow-hidden text-left"
              onClick={() => setActiveIndex(index)}
              aria-label={`Open snap from ${snap.location}`}
            >
              <img
                src={toCloudflareTransformedUrl(snap.src, {
                  width: 1200,
                  quality: 84,
                  format: "auto",
                })}
                alt={snap.alt}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 border-t border-white/20 bg-black/48 opacity-0 backdrop-blur-lg transition-opacity duration-200 group-hover:opacity-100 dark:border-white/12 dark:bg-black/36">
                <div className="flex h-full items-center justify-between gap-2 px-1.5">
                  <p className="truncate text-[9px] font-medium tracking-[0.02em] text-zinc-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    {snap.location}
                  </p>
                  <p className="truncate text-[8px] uppercase tracking-[0.18em] text-zinc-200/80">
                    {snap.clickedBy}
                  </p>
                </div>
              </div>
            </button>
          </figure>
        ))}
      </div>

      {isMounted && activeSnap && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-[1.5px]"
          role="dialog"
          aria-modal="true"
          aria-label="Snap preview"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
            className="absolute right-4 top-4 z-20 inline-flex size-11 items-center justify-center rounded-none border border-white/15 bg-black/45 text-zinc-100 backdrop-blur-sm transition-colors hover:bg-black/65"
            aria-label="Close preview"
          >
            <X className="size-5" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-none border border-white/15 bg-black/45 text-zinc-100 backdrop-blur-sm transition-colors hover:bg-black/65 sm:inline-flex"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-6" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-none border border-white/15 bg-black/45 text-zinc-100 backdrop-blur-sm transition-colors hover:bg-black/65 sm:inline-flex"
            aria-label="Next image"
          >
            <ChevronRight className="size-6" />
          </button>

          <div
            className="absolute inset-0 grid place-items-center px-4 py-10 sm:px-10 sm:py-12"
            onClick={(event) => event.stopPropagation()}
          >
            <figure className="relative mx-auto w-fit max-w-[90vw]">
              <img
                src={toCloudflareTransformedUrl(activeSnap.src, {
                  width: 2200,
                  quality: 92,
                  format: "auto",
                })}
                alt={activeSnap.alt}
                className="mx-auto max-h-[82vh] w-auto max-w-[90vw] object-contain"
              />

              <figcaption className="mt-3 text-center">
                <p className="text-[11px] font-medium text-zinc-100">{activeSnap.location}</p>
                <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-400">
                  Clicked by {activeSnap.clickedBy}
                </p>
              </figcaption>
            </figure>
          </div>

          <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2 px-4 sm:hidden">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goPrev();
              }}
              className="inline-flex h-10 w-14 items-center justify-center rounded-none border border-white/15 bg-black/45 text-zinc-100 backdrop-blur-sm transition-colors hover:bg-black/65"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goNext();
              }}
              className="inline-flex h-10 w-14 items-center justify-center rounded-none border border-white/15 bg-black/45 text-zinc-100 backdrop-blur-sm transition-colors hover:bg-black/65"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
