"use client";

import { CheckIcon, CircleXIcon, CopyIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { copyText } from "@/utils/copy";

import { Button } from "./ui/button";

export const motionIconVariants = {
  initial: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.8 },
};

export const motionIconProps = {
  variants: motionIconVariants,
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

export function CopyButton({
  value,
  className,
  ...props
}: {
  value: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (state !== "idle") return;

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    try {
      if (!value) {
        throw new Error("Nothing to copy");
      }
      await copyText(value);
      setState("copied");
    } catch {
      setState("failed");
    }

    resetTimerRef.current = setTimeout(() => {
      setState("idle");
      resetTimerRef.current = null;
    }, 1500);
  }, [state, value]);

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      {...props}
      className={cn("z-10 size-6 rounded-md", className)}
      onClick={handleCopy}
      aria-label={
        state === "copied"
          ? "Copied"
          : state === "failed"
            ? "Copy failed"
            : "Copy"
      }
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {state === "idle" ? (
          <motion.span key="idle" {...motionIconProps}>
            <CopyIcon className="size-3" />
          </motion.span>
        ) : state === "copied" ? (
          <motion.span key="copied" {...motionIconProps}>
            <CheckIcon className="size-3" strokeWidth={3} />
          </motion.span>
        ) : (
          <motion.span key="failed" {...motionIconProps}>
            <CircleXIcon className="size-3" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only">
        {state === "copied"
          ? "Copied"
          : state === "failed"
            ? "Copy failed"
            : "Copy"}
      </span>
    </Button>
  );
}
