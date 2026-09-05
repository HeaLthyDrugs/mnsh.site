"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CaretLeft as ChevronLeft, CaretRight as ChevronRight, X } from "@phosphor-icons/react";
import Image from "next/image";

import type { Snap } from "@/features/snaps/types/snap";
import { cn } from "@/lib/utils";

const GRID_IMAGE_SIZES = "(max-width: 639px) 96vw, (max-width: 767px) 48vw, 256px";
const LIGHTBOX_IMAGE_SIZES = "(max-width: 640px) 92vw, (max-width: 1024px) 88vw, 80vw";
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiMxMTEzMTciLz48L3N2Zz4=";

function SnapImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className,
  quality,
  onLoad,
  maxOptimizedWidth,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  className?: string;
  quality: number;
  onLoad?: () => void;
  maxOptimizedWidth?: number;
}) {
  return (
    <Image
      loader={
        maxOptimizedWidth
          ? ({ src, width, quality }) => {
              const optimizedWidth = Math.min(width, maxOptimizedWidth);
              return `/_next/image?url=${encodeURIComponent(src)}&w=${optimizedWidth}&q=${quality ?? 75}`;
            }
          : undefined
      }
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      quality={quality}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onLoad={onLoad}
      className={className}
    />
  );
}

function LightboxDetailImage({
  snap,
  className,
  onLoad,
}: {
  snap: Snap;
  className?: string;
  onLoad?: () => void;
}) {
  return (
    <SnapImage
      src={snap.src}
      alt={snap.alt}
      width={snap.width}
      height={snap.height}
      sizes={LIGHTBOX_IMAGE_SIZES}
      quality={82}
      priority
      onLoad={onLoad}
      maxOptimizedWidth={1200}
      className={className}
    />
  );
}

function LightboxLayerImage({
  snap,
  quality,
  maxOptimizedWidth,
  className,
  onLoad,
}: {
  snap: Snap;
  quality: number;
  maxOptimizedWidth: number;
  className?: string;
  onLoad?: () => void;
}) {
  return (
    <Image
      loader={({ src, width, quality }) => {
        const optimizedWidth = Math.min(width, maxOptimizedWidth);
        return `/_next/image?url=${encodeURIComponent(src)}&w=${optimizedWidth}&q=${quality ?? 75}`;
      }}
      src={snap.src}
      alt={snap.alt}
      fill
      sizes={LIGHTBOX_IMAGE_SIZES}
      quality={quality}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      priority
      decoding="async"
      onLoad={onLoad}
      className={cn("object-contain", className)}
    />
  );
}

export function SnapsBentoGrid({
  snaps,
  className,
}: {
  snaps: Snap[];
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [loadedDetailIds, setLoadedDetailIds] = useState<Set<string>>(() => new Set());

  const activeSnap = useMemo(() => {
    if (activeIndex === null) return null;
    return snaps[activeIndex] ?? null;
  }, [activeIndex, snaps]);
  const activeSnapFrameStyle = activeSnap
    ? ({
        "--snap-aspect": activeSnap.width / activeSnap.height,
        "--snap-inverse-aspect": activeSnap.height / activeSnap.width,
      } as CSSProperties)
    : undefined;
  const preloadSnaps = useMemo(() => {
    if (activeIndex === null || snaps.length <= 1) return [];
    return [
      snaps[(activeIndex + 1) % snaps.length],
      snaps[(activeIndex - 1 + snaps.length) % snaps.length],
    ].filter((snap) => !loadedDetailIds.has(snap.id));
  }, [activeIndex, loadedDetailIds, snaps]);
  const isActiveDetailLoaded = activeSnap ? loadedDetailIds.has(activeSnap.id) : false;

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
              <SnapImage
                src={snap.src}
                alt={snap.alt}
                width={snap.width}
                height={snap.height}
                sizes={GRID_IMAGE_SIZES}
                quality={68}
                priority={index < 2}
                maxOptimizedWidth={640}
                className="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 border-t border-white/20 bg-black/48 opacity-0 backdrop-blur-lg transition-opacity duration-200 group-hover:opacity-100 dark:border-white/12 dark:bg-black/36">
                <div className="flex h-full items-center px-1.5">
                  <p className="truncate text-[9px] font-medium tracking-[0.02em] text-zinc-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    {snap.location}
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
            className="absolute inset-0 flex items-center justify-center px-4 py-12 sm:px-10"
            onClick={(event) => event.stopPropagation()}
          >
            <figure className="relative flex h-full w-full items-center justify-center">
              <div
                className="relative h-[min(82dvh,calc(90vw*var(--snap-inverse-aspect)))] w-[min(90vw,calc(82dvh*var(--snap-aspect)))]"
                style={activeSnapFrameStyle}
              >
                <LightboxLayerImage
                  snap={activeSnap}
                  quality={68}
                  maxOptimizedWidth={640}
                  className={cn(
                    "transition-opacity duration-200",
                    isActiveDetailLoaded ? "opacity-0" : "opacity-100"
                  )}
                />

                <LightboxLayerImage
                  snap={activeSnap}
                  quality={82}
                  maxOptimizedWidth={1200}
                  onLoad={() => {
                    setLoadedDetailIds((previous) => {
                      if (previous.has(activeSnap.id)) return previous;
                      const next = new Set(previous);
                      next.add(activeSnap.id);
                      return next;
                    });
                  }}
                  className={cn(
                    "transition-opacity duration-200",
                    isActiveDetailLoaded ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>

              <figcaption className="absolute bottom-0 left-1/2 w-full max-w-[90vw] -translate-x-1/2 text-center">
                <p className="text-[11px] font-medium text-zinc-100">{activeSnap.location}</p>
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

          <div className="pointer-events-none absolute size-px overflow-hidden opacity-0">
            {preloadSnaps.map((snap) => (
              <LightboxDetailImage
                key={snap.id}
                snap={snap}
                onLoad={() => {
                  setLoadedDetailIds((previous) => {
                    if (previous.has(snap.id)) return previous;
                    const next = new Set(previous);
                    next.add(snap.id);
                    return next;
                  });
                }}
                className="size-px object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
