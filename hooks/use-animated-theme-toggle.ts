"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";
import { useAtomValue } from "jotai";
import { isSoundEnabledAtom } from "@/store/sound-store";
import soundManager from "@/lib/sound-manager";
import { useMetaColor } from "@/hooks/use-meta-color";
import { META_THEME_COLORS } from "@/config/site";

type ThemeOption = "light" | "dark" | "system";

export function useAnimatedThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const { setMetaColor } = useMetaColor();
    const isSoundEnabled = useAtomValue(isSoundEnabledAtom);

    // CSS for the circle-blur animation starting from top-left
    const animationCss = `
    ::view-transition-group(root) {
      animation-duration: 1s;
      animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
    }
          
    ::view-transition-new(root) {
      animation-name: reveal-light-top-left-blur;
      filter: blur(2px);
    }

    ::view-transition-old(root),
    .dark::view-transition-old(root) {
      animation: none;
      z-index: -1;
    }
    .dark::view-transition-new(root) {
      animation-name: reveal-dark-top-left-blur;
      filter: blur(2px);
    }

    @keyframes reveal-dark-top-left-blur {
      from {
        clip-path: circle(0% at 0% 0%);
        filter: blur(8px);
      }
      50% { filter: blur(4px); }
      to {
        clip-path: circle(150.0% at 0% 0%);
        filter: blur(0px);
      }
    }

    @keyframes reveal-light-top-left-blur {
      from {
         clip-path: circle(0% at 0% 0%);
         filter: blur(8px);
      }
      50% { filter: blur(4px); }
      to {
        clip-path: circle(150.0% at 0% 0%);
        filter: blur(0px);
      }
    }
  `;

    const getResolvedTargetTheme = useCallback((theme: ThemeOption) => {
        if (theme !== "system") {
            return theme;
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }, []);

    const applyTheme = useCallback((theme: ThemeOption) => {
        const resolvedTargetTheme = getResolvedTargetTheme(theme);

        setTheme(theme);
        setMetaColor(
            resolvedTargetTheme === "dark"
                ? META_THEME_COLORS.dark
                : META_THEME_COLORS.light
        );
    }, [getResolvedTargetTheme, setMetaColor, setTheme]);

    const ensureTransitionStyles = useCallback(() => {
        if (!document.startViewTransition) {
            return false;
        }

        const styleId = "theme-transition-styles";
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;

        if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = animationCss;
        return true;
    }, [animationCss]);

    const setAnimatedTheme = useCallback((theme: ThemeOption) => {
        const nextResolvedTheme = getResolvedTargetTheme(theme);
        const shouldAnimate = nextResolvedTheme !== resolvedTheme;

        if (isSoundEnabled) {
            soundManager.playWoosh();
        }

        if (!shouldAnimate || !ensureTransitionStyles()) {
            applyTheme(theme);
            return;
        }

        document.startViewTransition(() => applyTheme(theme));
    }, [
        applyTheme,
        ensureTransitionStyles,
        getResolvedTargetTheme,
        isSoundEnabled,
        resolvedTheme,
    ]);

    const toggleTheme = useCallback(() => {
        setAnimatedTheme(resolvedTheme === "dark" ? "light" : "dark");
    }, [resolvedTheme, setAnimatedTheme]);

    return {
        toggleTheme,
        setAnimatedTheme,
        isDark: resolvedTheme === "dark",
    };
}
