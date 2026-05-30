"use client";

import dynamic from "next/dynamic";

import { LazyRenderOnView } from "@/components/lazy-render-on-view";
import { cn } from "@/lib/utils";

const Events = dynamic(() => import("@/features/profile/events"), {
  ssr: false,
  loading: () => (
    <div className="border-x border-edge">
      <div className="h-[560px] w-full animate-pulse bg-muted/25" />
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

export function DeferredEvents() {
  return (
    <LazyRenderOnView
      rootMargin="420px"
      minHeight={640}
      fallback={
        <>
          <div className="border-x border-edge">
            <div className="h-[560px] w-full animate-pulse bg-muted/20" />
          </div>
          <Separator />
        </>
      }
    >
      <Events />
      <Separator />
    </LazyRenderOnView>
  );
}
