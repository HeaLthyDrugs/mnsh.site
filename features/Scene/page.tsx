"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SCENES = {
  light: {
    poster: "/scene/day-poster.jpg",
    animated: "https://assets.mnsh.online/gifs/day.gif",
  },
  dark: {
    poster: "/scene/evening-poster.jpg",
    animated: "https://assets.mnsh.online/gifs/morning-evening.gif",
  },
} as const;

function scheduleIdle(cb: () => void, timeout = 3000) {
  const win = window as Window & {
    requestIdleCallback?: (
      callback: () => void,
      options?: { timeout: number }
    ) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (typeof win.requestIdleCallback === "function") {
    const idleId = win.requestIdleCallback(cb, { timeout });
    return () => win.cancelIdleCallback?.(idleId);
  }

  const fallbackId = window.setTimeout(cb, timeout);
  return () => window.clearTimeout(fallbackId);
}

export default function AnimatedScene() {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || connection?.saveData) {
      return;
    }

    return scheduleIdle(() => setShowAnimation(true));
  }, []);

  return (
    <div
      className={cn(
        "relative h-40 w-full overflow-hidden border-x border-b border-edge bg-muted/10 select-none"
      )}
    >
      <picture>
        <source
          srcSet={SCENES.dark.poster}
          media="(prefers-color-scheme: dark)"
        />
        <img
          src={SCENES.light.poster}
          alt=""
          width={961}
          height={256}
          className="h-full w-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {showAnimation && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SCENES.light.animated}
            alt=""
            width={961}
            height={256}
            className="absolute inset-0 h-full w-full object-cover dark:hidden"
            loading="lazy"
            decoding="async"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SCENES.dark.animated}
            alt=""
            width={960}
            height={256}
            className="absolute inset-0 hidden h-full w-full object-cover dark:block"
            loading="lazy"
            decoding="async"
          />
        </>
      )}
    </div>
  );
}
