"use client";

import { MoonStars, Sun } from "@phosphor-icons/react";
import React from "react";

import { Button } from "./ui/button";
import soundManager from "@/lib/sound-manager";
import { cn } from "@/lib/utils";
import { useAnimatedThemeToggle } from "@/hooks/use-animated-theme-toggle";

export function ToggleTheme() {
  const { toggleTheme, isDark } = useAnimatedThemeToggle();

  return (
    <Button variant="outline" size="icon"
      className={cn(
        "relative h-8 cursor-pointer rounded-none bg-zinc-50 px-2.5 text-muted-foreground select-none hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-900",
        "not-dark:border dark:inset-shadow-[1px_1px_1px,0px_0px_2px] dark:inset-shadow-white/15"
      )}
      onClick={() => {
        soundManager.playTap();
        toggleTheme();
      }}>
      <Sun
        className={cn(
          "size-4 transition-all duration-500",
          isDark ? "-rotate-90 scale-0" : "rotate-0 scale-100"
        )}
      />
      <MoonStars
        className={cn(
          "absolute size-4 transition-all duration-500",
          isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"
        )}
      />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}