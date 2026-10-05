"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

import { LazyRenderOnView } from "@/components/lazy-render-on-view";
import { cn } from "@/lib/utils";
import type { EventsProps } from "@/features/profile/events";

const loadEvents = () => import("@/features/profile/events");

const Events = dynamic(loadEvents, {
  ssr: false,
  loading: () => (
    <div className="border-x border-edge">
      <div className="h-[560px] w-full" />
    </div>
  ),
});

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-x border-edge",
        "before:absolute before:inset-0 before:-z-1 before:h-full before:w-full",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className
      )}
    />
  );
}

export function DeferredEvents({ latestBlog }: EventsProps) {
  // Warm the chunk during idle time so it is already loaded by the time the
  // section scrolls into view.
  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === "function") {
      const id = win.requestIdleCallback(() => void loadEvents(), { timeout: 4000 });
      return () => win.cancelIdleCallback?.(id);
    }

    const id = window.setTimeout(() => void loadEvents(), 2500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <LazyRenderOnView
      rootMargin="420px"
      minHeight={640}
      fallback={
        <>
          <div className="border-x border-edge">
            <div className="h-[560px] w-full" />
          </div>
          <Separator />
        </>
      }
    >
      <Events latestBlog={latestBlog} />
      <Separator />
    </LazyRenderOnView>
  );
}
