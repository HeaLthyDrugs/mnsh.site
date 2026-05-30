"use client";

import { useEffect, useRef, useState } from "react";

interface LazyRenderOnViewProps {
  children: React.ReactNode;
  rootMargin?: string;
  minHeight?: number;
  fallback?: React.ReactNode;
}

export function LazyRenderOnView({
  children,
  rootMargin = "350px",
  minHeight = 300,
  fallback,
}: LazyRenderOnViewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible) return;

    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
        }
      },
      { rootMargin }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={targetRef}>
      {isVisible
        ? children
        : fallback ?? <div style={{ minHeight }} aria-hidden="true" />}
    </div>
  );
}
