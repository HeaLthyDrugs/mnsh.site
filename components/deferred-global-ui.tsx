"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GlobalAudio = dynamic(
  () => import("@/components/global-audio").then((mod) => mod.GlobalAudio),
  { ssr: false }
);

const FloatingControls = dynamic(
  () =>
    import("@/components/floating-controls").then((mod) => mod.FloatingControls),
  { ssr: false }
);

const DeveloperTerminal = dynamic(
  () =>
    import("@/components/developer-terminal").then((mod) => mod.DeveloperTerminal),
  { ssr: false }
);

function scheduleIdle(cb: () => void, timeout = 2000) {
  if (typeof window === "undefined") return;

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

export function DeferredGlobalUi() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (shouldMount) return;

    const mount = () => setShouldMount(true);
    const cancelIdle = scheduleIdle(mount, 3500);
    let interactionTimer: number | undefined;

    const handleInteraction = () => {
      interactionTimer = window.setTimeout(mount, 800);
    };
    window.addEventListener("pointerdown", handleInteraction, { once: true });
    window.addEventListener("keydown", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      cancelIdle?.();
      if (interactionTimer) {
        window.clearTimeout(interactionTimer);
      }
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [shouldMount]);

  if (!shouldMount) return null;

  return (
    <>
      <GlobalAudio />
      <FloatingControls />
      <DeveloperTerminal />
    </>
  );
}
