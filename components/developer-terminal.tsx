"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useAtom } from "jotai";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Terminal,
  X,
  Minus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  Sliders,
  Volume2,
  VolumeX,
  Palette,
  Type,
  Check,
  RefreshCw,
  Monitor,
  MousePointer,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { isTerminalOpenAtom } from "@/store/ui-store";
import { USER } from "@/features/profile/data/user";
import { SOCIAL_LINKS } from "@/features/profile/data/social-links";
import { useSound } from "@/hooks/use-sound";
import { useAnimatedThemeToggle } from "@/hooks/use-animated-theme-toggle";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  TERMINAL_WORKS,
  TERMINAL_BLOGS,
  GEAR,
  TOOLS,
} from "@/config/terminal-catalog";

export interface TerminalTheme {
  id: string;
  name: string;
  bgContainer: string;
  bgHeader: string;
  bgToolbar: string;
  borderColor: string;
  borderActive: string;
  promptColor: string;
  textColor: string;
  bannerColor: string;
  systemColor: string;
  errorColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  glowColor: string;
  previewGradient: string;
}

export const TERMINAL_THEMES: TerminalTheme[] = [
  {
    id: "cyber-light",
    name: "Cyber Light",
    bgContainer: "#fafafa",
    bgHeader: "#f4f4f5",
    bgToolbar: "#f4f4f5",
    borderColor: "rgba(2, 132, 199, 0.35)",
    borderActive: "#0284c7",
    promptColor: "#0284c7",
    textColor: "#0f172a",
    bannerColor: "#0369a1",
    systemColor: "#d97706",
    errorColor: "#dc2626",
    accentColor: "#0284c7",
    badgeBg: "rgba(2, 132, 199, 0.15)",
    badgeText: "#0284c7",
    glowColor: "rgba(2, 132, 199, 0.15)",
    previewGradient: "from-slate-100 via-sky-200 to-sky-600",
  },
  {
    id: "matrix",
    name: "Matrix Emerald",
    bgContainer: "#090d0a",
    bgHeader: "#0f1713",
    bgToolbar: "#0f1713",
    borderColor: "rgba(16, 185, 129, 0.35)",
    borderActive: "#10b981",
    promptColor: "#34d399",
    textColor: "#e2e8f0",
    bannerColor: "#10b981",
    systemColor: "#fbbf24",
    errorColor: "#f43f5e",
    accentColor: "#10b981",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeText: "#34d399",
    glowColor: "rgba(16, 185, 129, 0.2)",
    previewGradient: "from-emerald-950 via-zinc-900 to-emerald-500",
  },
  {
    id: "dracula",
    name: "Dracula Purple",
    bgContainer: "#282a36",
    bgHeader: "#1e1f29",
    bgToolbar: "#1e1f29",
    borderColor: "rgba(189, 147, 249, 0.35)",
    borderActive: "#bd93f9",
    promptColor: "#ff79c6",
    textColor: "#f8f8f2",
    bannerColor: "#bd93f9",
    systemColor: "#8be9fd",
    errorColor: "#ff5555",
    accentColor: "#bd93f9",
    badgeBg: "rgba(189, 147, 249, 0.15)",
    badgeText: "#ff79c6",
    glowColor: "rgba(189, 147, 249, 0.2)",
    previewGradient: "from-purple-950 via-zinc-900 to-pink-500",
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    bgContainer: "#1a1b26",
    bgHeader: "#16161e",
    bgToolbar: "#16161e",
    borderColor: "rgba(122, 162, 247, 0.35)",
    borderActive: "#7aa2f7",
    promptColor: "#bb9af7",
    textColor: "#c0caf5",
    bannerColor: "#7dcfff",
    systemColor: "#e0af68",
    errorColor: "#f7768e",
    accentColor: "#7aa2f7",
    badgeBg: "rgba(122, 162, 247, 0.15)",
    badgeText: "#bb9af7",
    glowColor: "rgba(122, 162, 247, 0.2)",
    previewGradient: "from-blue-950 via-indigo-950 to-purple-500",
  },
  {
    id: "catppuccin",
    name: "Catppuccin Mocha",
    bgContainer: "#1e1e2e",
    bgHeader: "#181825",
    bgToolbar: "#181825",
    borderColor: "rgba(203, 166, 247, 0.35)",
    borderActive: "#cba6f7",
    promptColor: "#f5e0dc",
    textColor: "#cdd6f4",
    bannerColor: "#89b4fa",
    systemColor: "#f9e2af",
    errorColor: "#f38ba8",
    accentColor: "#cba6f7",
    badgeBg: "rgba(203, 166, 247, 0.15)",
    badgeText: "#f5e0dc",
    glowColor: "rgba(203, 166, 247, 0.2)",
    previewGradient: "from-slate-900 via-purple-950 to-rose-400",
  },
  {
    id: "onedark",
    name: "One Dark Pro",
    bgContainer: "#21252b",
    bgHeader: "#181a1f",
    bgToolbar: "#181a1f",
    borderColor: "rgba(97, 175, 239, 0.35)",
    borderActive: "#61afef",
    promptColor: "#98c379",
    textColor: "#abb2bf",
    bannerColor: "#61afef",
    systemColor: "#e5c07b",
    errorColor: "#e06c75",
    accentColor: "#61afef",
    badgeBg: "rgba(97, 175, 239, 0.15)",
    badgeText: "#98c379",
    glowColor: "rgba(97, 175, 239, 0.2)",
    previewGradient: "from-zinc-900 via-slate-800 to-blue-400",
  },
  {
    id: "nord",
    name: "Nord Frost",
    bgContainer: "#2e3440",
    bgHeader: "#242933",
    bgToolbar: "#242933",
    borderColor: "rgba(136, 192, 208, 0.35)",
    borderActive: "#88c0d0",
    promptColor: "#a3be8c",
    textColor: "#d8dee9",
    bannerColor: "#81a1c1",
    systemColor: "#ebcb8b",
    errorColor: "#bf616a",
    accentColor: "#88c0d0",
    badgeBg: "rgba(136, 192, 208, 0.15)",
    badgeText: "#a3be8c",
    glowColor: "rgba(136, 192, 208, 0.2)",
    previewGradient: "from-slate-900 via-slate-800 to-cyan-400",
  },
  {
    id: "amber",
    name: "Retro Amber CRT",
    bgContainer: "#120c02",
    bgHeader: "#1c1304",
    bgToolbar: "#1c1304",
    borderColor: "rgba(255, 176, 0, 0.35)",
    borderActive: "#ffb000",
    promptColor: "#ffc107",
    textColor: "#ffda6a",
    bannerColor: "#ffb000",
    systemColor: "#ffd000",
    errorColor: "#ff5252",
    accentColor: "#ffb000",
    badgeBg: "rgba(255, 176, 0, 0.15)",
    badgeText: "#ffc107",
    glowColor: "rgba(255, 176, 0, 0.2)",
    previewGradient: "from-amber-950 via-zinc-900 to-amber-500",
  },
];

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
}

export const TERMINAL_FONTS: FontOption[] = [
  {
    id: "mono",
    name: "System Mono",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  {
    id: "fira",
    name: "Fira Code",
    fontFamily: '"Fira Code", "Cascadia Code", ui-monospace, monospace',
  },
  {
    id: "geist",
    name: "Geist Mono",
    fontFamily: "var(--font-geist), ui-monospace, monospace",
  },
  {
    id: "courier",
    name: "Retro Courier",
    fontFamily: '"Courier New", Courier, monospace',
  },
  {
    id: "serif-code",
    name: "Serif Code",
    fontFamily: '"Courier Prime", Georgia, serif, monospace',
  },
];

interface TerminalConfig {
  themeId: string;
  fontId: string;
  fontSize: number;
  cursorStyle: "block" | "line" | "underline";
  cursorBlink: boolean;
  soundEnabled: boolean;
  scanlines: boolean;
}

const DEFAULT_CONFIG: TerminalConfig = {
  themeId: "cyber-light",
  fontId: "mono",
  fontSize: 13,
  cursorStyle: "block",
  cursorBlink: true,
  soundEnabled: true,
  scanlines: true,
};

const STORAGE_KEY = "mnsh_terminal_config_v1";

interface OutputLine {
  id: string;
  type: "input" | "output" | "error" | "system" | "banner";
  text: string;
}

const COMMAND_LIST = [
  "help",
  "whoami",
  "skills",
  "work",
  "work list",
  "blog",
  "blog list",
  "gear",
  "tools",
  "contact",
  "theme",
  "theme list",
  "font",
  "font list",
  "cursor",
  "sound",
  "crt",
  "scanlines",
  "settings",
  "config",
  "cat",
  "cat list",
  "ls",
  "snake",
  "game",
  "play",
  "fullscreen",
  "matrix",
  "clear",
  "exit",
];

const INITIAL_OUTPUT: OutputLine[] = [
  {
    id: "banner-1",
    type: "banner",
    text: `┌───────────────────────────────────────────────────────────┐
│  M N S H  .  C L I   v1.4.0 (x86_64-apple-darwin)          │
│  Type 'help' for commands | 'snake' to play mini-game      │
└───────────────────────────────────────────────────────────┘`,
  },
  {
    id: "banner-2",
    type: "system",
    text: `Welcome to Manish Vishwakarma's interactive terminal.
Try typing: 'work', 'blog', 'snake', 'cat list', 'theme list', 'font fira', 'crt', or 'settings'.`,
  },
];

export interface TerminalEngineProps {
  embedded?: boolean;
  standalone?: boolean;
  onClose?: () => void;
  className?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function TerminalEngine({
  embedded = false,
  standalone = false,
  onClose,
  className,
  isFullscreen: externalIsFullscreen,
  onToggleFullscreen,
}: TerminalEngineProps) {
  const [config, setConfig] = useState<TerminalConfig>(DEFAULT_CONFIG);
  const [input, setInput] = useState("");
  const [selectionPos, setSelectionPos] = useState(0);
  const [output, setOutput] = useState<OutputLine[]>(INITIAL_OUTPUT);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"themes" | "fonts" | "effects">(
    "themes"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFullscreen = externalIsFullscreen ?? internalFullscreen;

  const toggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      setInternalFullscreen((prev) => !prev);
    }
  }, [onToggleFullscreen]);

  const { setAnimatedTheme, isDark } = useAnimatedThemeToggle();
  const playTap = useSound("/sounds/tap.wav");
  const router = useRouter();

  // Cyber Snake Mini-Game State
  const GRID_WIDTH = 26;
  const GRID_HEIGHT = 12;
  const [isSnakeActive, setIsSnakeActive] = useState(false);
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 15, y: 5 });
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeHighScore, setSnakeHighScore] = useState(0);
  const [isSnakeGameOver, setIsSnakeGameOver] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mnsh_snake_highscore");
      if (saved) setSnakeHighScore(Number(saved));
    } catch {
      // Ignore
    }
  }, []);

  const spawnFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newX = Math.floor(Math.random() * GRID_WIDTH);
    let newY = Math.floor(Math.random() * GRID_HEIGHT);
    let attempts = 0;
    while (attempts < 200) {
      newX = Math.floor(Math.random() * GRID_WIDTH);
      newY = Math.floor(Math.random() * GRID_HEIGHT);
      if (!currentSnake.some((s) => s.x === newX && s.y === newY)) {
        return { x: newX, y: newY };
      }
      attempts++;
    }
    return { x: 10, y: 5 };
  }, [GRID_WIDTH, GRID_HEIGHT]);

  const startSnakeGame = useCallback(() => {
    const initSnake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    setSnake(initSnake);
    setDirection("RIGHT");
    setFood(spawnFood(initSnake));
    setSnakeScore(0);
    setIsSnakeGameOver(false);
    setIsSnakeActive(true);
  }, [spawnFood]);

  // Snake Game Loop Timer
  useEffect(() => {
    if (!isSnakeActive || isSnakeGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        if (direction === "UP") head.y -= 1;
        if (direction === "DOWN") head.y += 1;
        if (direction === "LEFT") head.x -= 1;
        if (direction === "RIGHT") head.x += 1;

        if (
          head.x < 0 ||
          head.x >= GRID_WIDTH ||
          head.y < 0 ||
          head.y >= GRID_HEIGHT
        ) {
          setIsSnakeGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some((s) => s.x === head.x && s.y === head.y)) {
          setIsSnakeGameOver(true);
          return prevSnake;
        }

        const nextSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          if (config.soundEnabled) playTap();
          setSnakeScore((prev) => {
            const newScore = prev + 10;
            setSnakeHighScore((prevHigh) => {
              const maxHigh = Math.max(prevHigh, newScore);
              try {
                localStorage.setItem("mnsh_snake_highscore", String(maxHigh));
              } catch {}
              return maxHigh;
            });
            return newScore;
          });
          setFood(spawnFood(nextSnake));
        } else {
          nextSnake.pop();
        }

        return nextSnake;
      });
    }, 130);

    return () => clearInterval(interval);
  }, [isSnakeActive, isSnakeGameOver, direction, food, spawnFood, config.soundEnabled, playTap, GRID_WIDTH, GRID_HEIGHT]);

  const inputRef = useRef<HTMLInputElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load config from localStorage on mount and sync default theme with site dark/light mode
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig((prev) => ({ ...prev, ...parsed }));
      } else {
        setConfig((prev) => ({
          ...prev,
          themeId: isDark ? "onedark" : "cyber-light",
        }));
      }
    } catch {
      setConfig((prev) => ({
        ...prev,
        themeId: isDark ? "onedark" : "cyber-light",
      }));
    }
  }, [isDark]);

  // Save config to localStorage whenever it changes
  const updateConfig = useCallback((updates: Partial<TerminalConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore localStorage error
      }
      return next;
    });
  }, []);

  const currentTheme =
    TERMINAL_THEMES.find((t) => t.id === config.themeId) || TERMINAL_THEMES[0];
  const currentFont =
    TERMINAL_FONTS.find((f) => f.id === config.fontId) || TERMINAL_FONTS[0];

  const zoomIn = useCallback(
    () =>
      updateConfig({
        fontSize: Math.min(config.fontSize + 1, 22),
      }),
    [config.fontSize, updateConfig]
  );
  const zoomOut = useCallback(
    () =>
      updateConfig({
        fontSize: Math.max(config.fontSize - 1, 10),
      }),
    [config.fontSize, updateConfig]
  );
  const zoomReset = useCallback(
    () => updateConfig({ fontSize: 13 }),
    [updateConfig]
  );

  // Internal viewport scroll only (0 page jump/scroll)
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [output]);

  // Keep selection position updated when input value changes
  useEffect(() => {
    if (inputRef.current) {
      setSelectionPos(inputRef.current.selectionStart ?? input.length);
    } else {
      setSelectionPos(input.length);
    }
  }, [input]);

  // Matrix Rain Canvas Animation Effect
  useEffect(() => {
    if (!isMatrixActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const characters = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZmnsh.online";
    const charFontSize = Math.max(12, config.fontSize);
    const columns = Math.floor(canvas.width / charFontSize);
    const drops: number[] = Array(columns).fill(1);

    let animationFrameId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = currentTheme.accentColor;
      ctx.font = `${charFontSize}px ${currentFont.fontFamily}`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
        ctx.fillText(text, i * charFontSize, drops[i] * charFontSize);

        if (drops[i] * charFontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMatrixActive, config.fontSize, currentTheme.accentColor, currentFont.fontFamily]);

  const appendOutput = (text: string, type: OutputLine["type"] = "output") => {
    setOutput((prev) => [
      ...prev,
      {
        id: `line-${Date.now()}-${Math.random()}`,
        type,
        text,
      },
    ]);
  };

  const handleCommand = useCallback(
    (cmdStr: string) => {
      const raw = cmdStr.trim();
      if (!raw) return;

      if (config.soundEnabled) {
        playTap();
      }

      appendOutput(`visitor@mnsh.online:~$ ${raw}`, "input");

      setHistory((prev) => [...prev, raw]);
      setHistoryIndex(-1);

      const parts = raw.split(" ");
      const cmd = parts[0].toLowerCase();
      const subCmd = parts[1]?.toLowerCase();
      const valArg = parts[2]?.toLowerCase();

      switch (cmd) {
        case "help":
        case "man":
          appendOutput(
            `Available Commands:
  whoami          - Display profile details & bio
  skills          - Show tech stack & engineering skills
  work [open]     - List all featured works or view detail ('work open leank-p2p')
  blog [open]     - List all blog posts or read article ('blog open lifelog')
  gear            - List hardware setup & workstation gear
  tools           - List developer tools & software applications
  contact         - Get contact email & social links
  cat [file]      - Read text file or list available files ('cat list', 'cat bio.md')
  ls              - List readable virtual text files
  snake / play    - Play interactive Cyber Snake mini-game 🐍
  fullscreen      - Toggle terminal full screen mode
  theme [name]    - Switch terminal theme or list themes ('theme list', 'theme dracula')
  font [name|size]- Customize terminal font ('font list', 'font fira', 'font size 15')
  cursor <shape>  - Change cursor shape ('cursor block', 'cursor line', 'cursor underline')
  sound <on|off>  - Toggle typing sound effects
  crt <on|off>    - Toggle CRT scanlines retro effect overlay ('crt on', 'crt off')
  settings        - Toggle visual Settings & Theme picker modal
  matrix          - Toggle Matrix rain background animation
  clear           - Clear terminal output log
  exit            - Close terminal window

Hotkeys & Controls:
  Double Click Header - Toggle Fullscreen
  F11 / Cmd+Shift+F   - Toggle Fullscreen
  ESC                 - Exit Fullscreen / Settings / Snake Game`,
            "output"
          );
          break;

        case "settings":
        case "config":
        case "customize":
          setIsSettingsOpen((prev) => !prev);
          appendOutput(
            `Settings panel ${!isSettingsOpen ? "OPENED ⚙️" : "CLOSED 🔴"}`,
            "system"
          );
          break;

        case "theme":
        case "themes":
        case "color":
        case "colors":
          if (!subCmd || subCmd === "list") {
            const listStr = TERMINAL_THEMES.map(
              (t) =>
                `  ${t.id === config.themeId ? "★ " : "  "}${t.id.padEnd(14)} - ${t.name}${t.id === config.themeId ? " [ACTIVE]" : ""}`
            ).join("\n");
            appendOutput(
              `┌──────────────────────────────────────────────────────────┐
│ TERMINAL COLOR THEMES (${TERMINAL_THEMES.length} available)                    │
└──────────────────────────────────────────────────────────┘
${listStr}

💡 Type 'theme <name>' to apply (e.g. 'theme cyber-light', 'theme dracula', 'theme tokyo-night').
💡 Type 'theme site <light|dark|system>' to toggle main website theme.`,
              "output"
            );
          } else if (subCmd === "site" && parts[2]) {
            const mode = parts[2].toLowerCase();
            if (mode === "dark" || mode === "light" || mode === "system") {
              setAnimatedTheme(mode);
              appendOutput(`Website theme set to: ${mode}`, "system");
            } else {
              appendOutput(`Usage: theme site <light | dark | system>`, "error");
            }
          } else {
            const targetTheme = TERMINAL_THEMES.find(
              (t) => t.id === subCmd || t.id.startsWith(subCmd)
            );
            if (targetTheme) {
              updateConfig({ themeId: targetTheme.id });
              appendOutput(`Terminal theme changed to: ${targetTheme.name} ✨`, "system");
            } else {
              appendOutput(
                `Theme not found: '${subCmd}'. Type 'theme list' to see all themes.`,
                "error"
              );
            }
          }
          break;

        case "font":
        case "fonts":
          if (!subCmd || subCmd === "list") {
            const listStr = TERMINAL_FONTS.map(
              (f) =>
                `  ${f.id === config.fontId ? "★ " : "  "}${f.id.padEnd(12)} - ${f.name}${f.id === config.fontId ? " [ACTIVE]" : ""}`
            ).join("\n");
            appendOutput(
              `┌──────────────────────────────────────────────────────────┐
│ TERMINAL FONTS (${TERMINAL_FONTS.length} available)                             │
└──────────────────────────────────────────────────────────┘
${listStr}
Current Font Size: ${config.fontSize}px

💡 Type 'font <id>' to change font (e.g. 'font fira', 'font geist', 'font courier').
💡 Type 'font size <px>' to set font size (e.g. 'font size 15').`,
              "output"
            );
          } else if (subCmd === "size" && valArg) {
            const num = parseInt(valArg, 10);
            if (!isNaN(num) && num >= 10 && num <= 24) {
              updateConfig({ fontSize: num });
              appendOutput(`Font size set to ${num}px`, "system");
            } else {
              appendOutput(`Font size must be a number between 10 and 24`, "error");
            }
          } else {
            const targetFont = TERMINAL_FONTS.find(
              (f) => f.id === subCmd || f.id.startsWith(subCmd)
            );
            if (targetFont) {
              updateConfig({ fontId: targetFont.id });
              appendOutput(`Font changed to: ${targetFont.name} 🔤`, "system");
            } else {
              appendOutput(
                `Font not found: '${subCmd}'. Type 'font list' to see options.`,
                "error"
              );
            }
          }
          break;

        case "cursor":
          if (subCmd === "block" || subCmd === "line" || subCmd === "underline") {
            updateConfig({ cursorStyle: subCmd });
            appendOutput(`Cursor shape set to: ${subCmd}`, "system");
          } else if (subCmd === "blink") {
            const state = valArg === "off" || valArg === "false" ? false : true;
            updateConfig({ cursorBlink: state });
            appendOutput(`Cursor blinking ${state ? "ENABLED" : "DISABLED"}`, "system");
          } else {
            appendOutput(
              `Usage: cursor <block | line | underline> or cursor blink <on | off>`,
              "error"
            );
          }
          break;

        case "sound":
        case "audio":
          if (subCmd === "off" || subCmd === "mute" || subCmd === "false") {
            updateConfig({ soundEnabled: false });
            appendOutput(`Terminal typing sound MUTED 🔇`, "system");
          } else if (subCmd === "on" || subCmd === "unmute" || subCmd === "true") {
            updateConfig({ soundEnabled: true });
            appendOutput(`Terminal typing sound ENABLED 🔊`, "system");
          } else {
            const nextState = !config.soundEnabled;
            updateConfig({ soundEnabled: nextState });
            appendOutput(
              `Terminal typing sound ${nextState ? "ENABLED 🔊" : "MUTED 🔇"}`,
              "system"
            );
          }
          break;

        case "crt":
        case "scanline":
        case "scanlines":
          if (subCmd === "off" || subCmd === "false" || subCmd === "disable") {
            updateConfig({ scanlines: false });
            appendOutput("CRT scanlines overlay DISABLED 🔴", "system");
          } else if (subCmd === "on" || subCmd === "true" || subCmd === "enable") {
            updateConfig({ scanlines: true });
            appendOutput("CRT scanlines overlay ENABLED 🟢", "system");
          } else {
            const nextState = !config.scanlines;
            updateConfig({ scanlines: nextState });
            appendOutput(
              `CRT scanlines overlay ${nextState ? "ENABLED 🟢" : "DISABLED 🔴"}`,
              "system"
            );
          }
          break;

        case "whoami":
        case "bio":
          appendOutput(
            `┌──────────────────────────────────────────────────────────┐
│ MANISH VISHWAKARMA (@HeaLthyDrugs)                        │
└──────────────────────────────────────────────────────────┘
Role:               ${USER.jobTitle}
Location:           ${USER.address}
Timezone:           ${USER.timezone} (${USER.localTimeLabel})
Status:             ${USER.availabilityText}
Currently Building: ${USER.currentlyBuilding ? `${USER.currentlyBuilding.name} - ${USER.currentlyBuilding.label}` : "mnsh.online"}
Bio:                ${USER.bio}`,
            "output"
          );
          break;

        case "skills":
        case "stack":
          appendOutput(
            `┌──────────────────────────────────────────────────────────┐
│ TECH STACK & ENGINEERING SKILLS                          │
└──────────────────────────────────────────────────────────┘
Frontend: React 19, Next.js 16, TypeScript, TailwindCSS, Framer Motion, Radix UI
Backend:  Node.js, Express, Next API Routes, REST, GraphQL, PostgreSQL, Appwrite
Mobile:   React Native, Expo, Redux Toolkit
DevOps:   Git, Docker, Cloudflare Workers, Vercel, Neovim, VS Code`,
            "output"
          );
          break;

        case "work":
        case "works":
        case "projects":
          if (!subCmd || subCmd === "list") {
            const listStr = TERMINAL_WORKS.map(
              (w, idx) =>
                `  [${idx + 1}] ${w.title.padEnd(26)} | Category: ${w.category.padEnd(20)} | Status: ${w.status}\n      Slug: ${w.slug}`
            ).join("\n\n");
            appendOutput(
              `┌──────────────────────────────────────────────────────────┐
│ FEATURED WORKS & PROJECTS (${TERMINAL_WORKS.length})                       │
└──────────────────────────────────────────────────────────┘
${listStr}

💡 Type 'work <slug>' to inspect details or 'work open <slug>' to open page.`,
              "output"
            );
          } else if (subCmd === "open" && parts[2]) {
            appendOutput(`Navigating to /work/${parts[2]}...`, "system");
            router.push(`/work/${parts[2]}`);
            if (onClose) onClose();
          } else {
            const found = TERMINAL_WORKS.find(
              (w, i) => w.slug === subCmd || String(i + 1) === subCmd
            );
            if (found) {
              appendOutput(
                `┌──────────────────────────────────────────────────────────┐
│ PROJECT: ${found.title.toUpperCase()}
└──────────────────────────────────────────────────────────┘
Description: ${found.description}
Category:    ${found.category}
Status:      ${found.status}
Tech Stack:  ${found.technologies.join(", ")}
${found.liveUrl ? `Live URL:    ${found.liveUrl}\n` : ""}${found.repoUrl ? `Repository:  ${found.repoUrl}\n` : ""}
Type 'work open ${found.slug}' to view project page.`,
                "output"
              );
            } else {
              appendOutput(
                `Project not found: '${subCmd}'. Type 'work' to view all projects.`,
                "error"
              );
            }
          }
          break;

        case "blog":
        case "blogs":
        case "posts":
          if (!subCmd || subCmd === "list") {
            const blogStr = TERMINAL_BLOGS.map(
              (b, idx) =>
                `  [${idx + 1}] ${b.title.padEnd(46)} | ${b.createdAt} (${b.readTime})\n      Slug: ${b.slug} | Tags: ${b.tags.join(", ")}`
            ).join("\n\n");
            appendOutput(
              `┌──────────────────────────────────────────────────────────┐
│ PUBLISHED ARTICLES & BLOGS (${TERMINAL_BLOGS.length})                    │
└──────────────────────────────────────────────────────────┘
${blogStr}

💡 Type 'blog <slug>' for summary or 'blog open <slug>' to read full article page.`,
              "output"
            );
          } else if (subCmd === "open" && parts[2]) {
            appendOutput(`Navigating to /blog/${parts[2]}...`, "system");
            router.push(`/blog/${parts[2]}`);
            if (onClose) onClose();
          } else {
            const foundBlog = TERMINAL_BLOGS.find(
              (b, i) => b.slug === subCmd || String(i + 1) === subCmd
            );
            if (foundBlog) {
              appendOutput(
                `┌──────────────────────────────────────────────────────────┐
│ ARTICLE: ${foundBlog.title.toUpperCase()}
└──────────────────────────────────────────────────────────┘
Published:   ${foundBlog.createdAt} (${foundBlog.readTime} read)
Category:    ${foundBlog.category}
Tags:        ${foundBlog.tags.join(", ")}
Summary:     ${foundBlog.description}

Type 'blog open ${foundBlog.slug}' to read complete post on website.`,
                "output"
              );
            } else {
              appendOutput(
                `Article not found: '${subCmd}'. Type 'blog' to list all posts.`,
                "error"
              );
            }
          }
          break;

        case "gear":
        case "setup":
          if (subCmd === "open") {
            router.push("/gear");
            if (onClose) onClose();
          } else {
            const gearStr = GEAR.map(
              (g, idx) => `  [${idx + 1}] ${g.name.padEnd(20)} — ${g.description}`
            ).join("\n");
            appendOutput(
              `┌──────────────────────────────────────────────────────────┐
│ WORKSTATION SETUP & GEAR (${GEAR.length} items)                      │
└──────────────────────────────────────────────────────────┘
${gearStr}

Type 'gear open' or click 'Gear' in navigation to view images & links.`,
              "output"
            );
          }
          break;

        case "tools":
        case "apps":
          if (subCmd === "open") {
            router.push("/tools");
            if (onClose) onClose();
          } else {
            const toolsStr = TOOLS.map(
              (t) => `  - ${t.name.padEnd(16)} [${t.category.padEnd(12)}] : ${t.description}`
            ).join("\n");
            appendOutput(
              `┌──────────────────────────────────────────────────────────┐
│ DEVELOPER TOOLS & SOFTWARE (${TOOLS.length} items)                   │
└──────────────────────────────────────────────────────────┘
${toolsStr}

Type 'tools open' to view full tools showcase page.`,
              "output"
            );
          }
          break;

        case "contact":
        case "socials":
        case "email":
          appendOutput(
            `┌──────────────────────────────────────────────────────────┐
│ CONTACT & SOCIAL MEDIA LINKS                             │
└──────────────────────────────────────────────────────────┘
Email:   hey@mnsh.site
Website: https://mnsh.site
GitHub:  https://github.com/HeaLthyDrugs

Social Handles:
${SOCIAL_LINKS.map((s) => `  - ${s.title.padEnd(12)} : ${s.href}`).join("\n")}`,
            "output"
          );
          break;

        case "cat":
          if (!subCmd || subCmd === "list" || subCmd === "ls" || subCmd === "--help") {
            appendOutput(
              `┌──────────────────────────────────────────────────────────┐
│ READABLE TERMINAL FILES (cat <filename>)                 │
└──────────────────────────────────────────────────────────┘
  📄 bio.md       - Personal background, bio & career summary
  📄 skills.txt   - Tech stack, programming languages & frameworks
  📄 gear.txt     - Workstation setup, monitor & desk hardware
  📄 tools.txt    - Developer applications, software & utilities
  📄 contact.txt  - Direct email & social media links
  📄 readme.txt   - Terminal CLI features & keyboard hotkeys guide

💡 Type 'cat <filename>' to read file contents (e.g. 'cat bio.md', 'cat skills.txt').`,
              "output"
            );
          } else if (subCmd === "bio.md" || subCmd === "bio") {
            appendOutput(USER.about, "output");
          } else if (subCmd === "skills.txt" || subCmd === "skills") {
            appendOutput(
              `┌──────────────────────────────────────────────────────────┐
│ TECH STACK & ENGINEERING SKILLS                          │
└──────────────────────────────────────────────────────────┘
Frontend: React 19, Next.js 16, TypeScript, TailwindCSS, Framer Motion, Radix UI
Backend:  Node.js, Express, Next API Routes, REST, GraphQL, PostgreSQL, Appwrite
Mobile:   React Native, Expo, Redux Toolkit
DevOps:   Git, Docker, Cloudflare Workers, Vercel, Neovim, VS Code`,
              "output"
            );
          } else if (subCmd === "gear.txt" || subCmd === "gear") {
            appendOutput(
              GEAR.map((g) => `${g.name}: ${g.description}`).join("\n"),
              "output"
            );
          } else if (subCmd === "tools.txt" || subCmd === "tools") {
            appendOutput(
              TOOLS.map((t) => `[${t.category}] ${t.name}: ${t.description}`).join("\n"),
              "output"
            );
          } else if (subCmd === "contact.txt" || subCmd === "contact") {
            appendOutput(
              `Email:   hey@mnsh.site\nWebsite: https://mnsh.site\nGitHub:  https://github.com/HeaLthyDrugs`,
              "output"
            );
          } else if (subCmd === "readme.txt" || subCmd === "readme") {
            appendOutput(
              `┌──────────────────────────────────────────────────────────┐
│ MNSH.CLI TERMINAL MANUAL & GUIDANCE                      │
└──────────────────────────────────────────────────────────┘
Commands: help, work, blog, cat list, ls, snake, settings, theme, font, clear, exit
Hotkeys:
  Double Click Header - Toggle Fullscreen
  F11 / Cmd+Shift+F   - Toggle Fullscreen
  ESC                 - Exit Fullscreen / Settings / Snake Game
  Tab                 - Auto-complete command
  Up / Down Arrow     - Command history navigation`,
              "output"
            );
          } else {
            appendOutput(
              `cat: ${subCmd}: No such file or directory. Type 'cat list' or 'ls' to see available files.`,
              "error"
            );
          }
          break;

        case "ls":
        case "dir":
          handleCommand("cat list");
          break;

        case "snake":
        case "game":
        case "play":
          startSnakeGame();
          appendOutput("Starting Cyber Snake CLI mini-game! 🐍 Use WASD or Arrow Keys to control.", "system");
          break;

        case "fullscreen":
        case "max":
        case "maximize":
          toggleFullscreen();
          break;

        case "minimize":
        case "min":
          if (isFullscreen) toggleFullscreen();
          else if (onClose) onClose();
          else zoomReset();
          break;

        case "matrix":
          setIsMatrixActive((prev) => !prev);
          appendOutput(
            `Matrix mode ${!isMatrixActive ? "ENABLED 🟢" : "DISABLED 🔴"}`,
            "system"
          );
          break;

        case "clear":
        case "cls":
          setOutput([]);
          break;

        case "exit":
        case "quit":
        case "close":
          if (onClose) onClose();
          else setOutput([]);
          break;

        default:
          appendOutput(
            `Command not found: '${cmd}'. Type 'help' for available commands or 'settings' for customization.`,
            "error"
          );
          break;
      }
    },
    [
      config.soundEnabled,
      config.themeId,
      config.fontId,
      config.fontSize,
      playTap,
      router,
      setAnimatedTheme,
      isMatrixActive,
      isSettingsOpen,
      onClose,
      updateConfig,
    ]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Update cursor selection position asynchronously after keydown
    setTimeout(() => {
      if (inputRef.current) {
        setSelectionPos(inputRef.current.selectionStart ?? inputRef.current.value.length);
      }
    }, 0);

    // Snake Game Keyboard Controls
    if (isSnakeActive) {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        if (direction !== "DOWN") setDirection("UP");
        return;
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        if (direction !== "UP") setDirection("DOWN");
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        if (direction !== "RIGHT") setDirection("LEFT");
        return;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        if (direction !== "LEFT") setDirection("RIGHT");
        return;
      }
      if (e.key === "r" || e.key === "R") {
        if (isSnakeGameOver) {
          e.preventDefault();
          startSnakeGame();
          return;
        }
      }
      if (e.key === "q" || e.key === "Q") {
        e.preventDefault();
        setIsSnakeActive(false);
        return;
      }
    }

    // Fullscreen Hotkeys (F11 or Ctrl/Cmd + Shift + F)
    if (e.key === "F11" || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "f" || e.key === "F"))) {
      e.preventDefault();
      toggleFullscreen();
      return;
    }

    // Zoom hotkeys: Ctrl/Cmd + [+] / [-] / [0]
    if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
      e.preventDefault();
      zoomIn();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === "-" || e.key === "_")) {
      e.preventDefault();
      zoomOut();
    } else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
      e.preventDefault();
      zoomReset();
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(input);
      setInput("");
      setSelectionPos(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx =
        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      const histVal = history[nextIdx] || "";
      setInput(histVal);
      setSelectionPos(histVal.length);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInput("");
        setSelectionPos(0);
      } else {
        setHistoryIndex(nextIdx);
        const histVal = history[nextIdx] || "";
        setInput(histVal);
        setSelectionPos(histVal.length);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (!input.trim()) return;
      const matches = COMMAND_LIST.filter((c) =>
        c.startsWith(input.trim().toLowerCase())
      );
      if (matches.length === 1) {
        setInput(matches[0]);
        setSelectionPos(matches[0].length);
      } else if (matches.length > 1) {
        appendOutput(`Matches: ${matches.join(", ")}`, "system");
      }
    } else if (e.key === "Escape") {
      if (isSnakeActive) {
        setIsSnakeActive(false);
      } else if (isSettingsOpen) {
        setIsSettingsOpen(false);
      } else if (isFullscreen) {
        toggleFullscreen();
      } else if (onClose) {
        onClose();
      }
    }
  };

  // Cursor position splitting for rendering exact custom cursor variant
  const safePos = Math.min(Math.max(0, selectionPos), input.length);
  const textBeforeCursor = input.slice(0, safePos);
  const charAtCursor = input.slice(safePos, safePos + 1);
  const textAfterCursor = input.slice(safePos + 1);

  const terminalContent = (
    <div
      className={cn(
        "relative flex flex-col w-full overflow-hidden select-text rounded-none transition-all duration-200",
        isFullscreen
          ? "fixed inset-0 z-[9999] h-screen max-h-none w-screen max-w-none rounded-none border-0"
          : standalone
          ? "h-[100dvh] min-h-screen max-h-none w-full rounded-none border-0"
          : embedded
          ? "h-[440px] max-h-[440px] rounded-none border-0"
          : "h-[85vh] max-h-[700px] rounded-none border max-w-4xl shadow-2xl",
        config.scanlines &&
          "before:pointer-events-none before:absolute before:inset-0 before:z-20 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] before:bg-[length:100%_4px]",
        className
      )}
      style={{
        backgroundColor: currentTheme.bgContainer,
        borderColor: embedded ? "var(--color-edge)" : currentTheme.borderColor,
        color: currentTheme.textColor,
        fontFamily: currentFont.fontFamily,
        boxShadow:
          isFullscreen || embedded || standalone
            ? "none"
            : `0 20px 40px -15px ${currentTheme.glowColor}`,
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Matrix Rain Canvas Background */}
      {isMatrixActive && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-0 opacity-40"
        />
      )}

      {/* Header Bar */}
      <div
        onDoubleClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
        className="relative z-30 flex items-center justify-between px-3.5 py-2 border-b select-none transition-colors duration-200 cursor-pointer"
        style={{
          backgroundColor: currentTheme.bgHeader,
          borderColor: embedded ? "var(--color-edge)" : currentTheme.borderColor,
        }}
      >
        {/* Top-Left macOS Window Action Control Boxes */}
        <div className="flex items-center gap-3">
          {!standalone && (
            <div className="group/mac-dots flex items-center gap-2">
              {/* Red Box: Exit / Close Terminal */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isFullscreen && onToggleFullscreen) {
                    onToggleFullscreen();
                  } else if (isFullscreen) {
                    setInternalFullscreen(false);
                  } else if (onClose) {
                    onClose();
                  }
                }}
                disabled={!onClose && !isFullscreen}
                className={cn(
                  "size-3.5 rounded-none bg-[#ff5f56] transition-all flex items-center justify-center border border-black/10 shadow-xs",
                  !onClose && !isFullscreen
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-[#ff5f56]/90 active:scale-95 cursor-pointer"
                )}
                title={
                  isFullscreen
                    ? "Exit Fullscreen (ESC)"
                    : onClose
                    ? "Close Terminal Window (ESC)"
                    : "Close (Unavailable)"
                }
                aria-label="Close Terminal"
              >
                <X
                  className={cn(
                    "size-2.5 text-red-950 font-bold transition-opacity",
                    !onClose && !isFullscreen
                      ? "opacity-30"
                      : "opacity-0 group-hover/mac-dots:opacity-100"
                  )}
                />
              </button>

              {/* Yellow Box: Minimize / Close Terminal */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isFullscreen && onToggleFullscreen) {
                    onToggleFullscreen();
                  } else if (isFullscreen) {
                    setInternalFullscreen(false);
                  } else if (onClose) {
                    onClose();
                  } else {
                    zoomReset();
                  }
                }}
                className="size-3.5 rounded-none bg-[#ffbd2e] hover:bg-[#ffbd2e]/90 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-black/10 shadow-xs"
                title={
                  isFullscreen
                    ? "Minimize / Exit Fullscreen Mode"
                    : onClose
                    ? "Minimize / Close Terminal"
                    : "Minimize / Reset Size"
                }
                aria-label="Minimize Terminal"
              >
                <Minus className="size-2.5 text-amber-950 font-bold opacity-0 group-hover/mac-dots:opacity-100 transition-opacity" />
              </button>

              {/* Green Box: Toggle Fullscreen */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="size-3.5 rounded-none bg-[#27c93f] hover:bg-[#27c93f]/90 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-black/10 shadow-xs"
                title={isFullscreen ? "Exit Fullscreen Mode" : "Toggle Fullscreen Mode"}
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="size-2.5 text-emerald-950 font-bold opacity-0 group-hover/mac-dots:opacity-100 transition-opacity" />
                ) : (
                  <Maximize2 className="size-2.5 text-emerald-950 font-bold opacity-0 group-hover/mac-dots:opacity-100 transition-opacity" />
                )}
              </button>
            </div>
          )}

          <span
            className="text-xs font-semibold tracking-wider flex items-center gap-1.5"
            style={{ color: currentTheme.promptColor }}
          >
            <Terminal className="size-3.5" /> mnsh.cli — bash
          </span>
        </div>

        {/* Header Controls: Settings button only (icon only, no text) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSettingsOpen((prev) => !prev);
            }}
            className={cn(
              "p-1.5 border transition-all rounded-none flex items-center justify-center",
              isSettingsOpen
                ? "font-semibold shadow-xs"
                : "opacity-80 hover:opacity-100"
            )}
            style={{
              backgroundColor: isSettingsOpen
                ? currentTheme.accentColor
                : currentTheme.badgeBg,
              color: isSettingsOpen ? "#ffffff" : currentTheme.promptColor,
              borderColor: currentTheme.borderColor,
            }}
            title="Terminal Settings & Customization"
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal Overlay Drawer */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-20 border-b select-none overflow-hidden"
            style={{
              backgroundColor: currentTheme.bgHeader,
              borderColor: currentTheme.borderColor,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto scrollbar-thin">
              {/* Settings Header Tabs */}
              <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: currentTheme.borderColor }}>
                <div className="flex items-center gap-2">
                  <Sliders className="size-4" style={{ color: currentTheme.promptColor }} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Terminal Preferences
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setActiveTab("themes")}
                    className={cn(
                      "px-2.5 py-1 text-xs border font-medium transition-all rounded-none flex items-center gap-1.5",
                      activeTab === "themes" ? "font-bold" : "opacity-60 hover:opacity-100"
                    )}
                    style={{
                      backgroundColor: activeTab === "themes" ? currentTheme.badgeBg : "transparent",
                      color: activeTab === "themes" ? currentTheme.promptColor : "inherit",
                      borderColor: currentTheme.borderColor,
                    }}
                  >
                    <Palette className="size-3.5" /> Color Themes
                  </button>
                  <button
                    onClick={() => setActiveTab("fonts")}
                    className={cn(
                      "px-2.5 py-1 text-xs border font-medium transition-all rounded-none flex items-center gap-1.5",
                      activeTab === "fonts" ? "font-bold" : "opacity-60 hover:opacity-100"
                    )}
                    style={{
                      backgroundColor: activeTab === "fonts" ? currentTheme.badgeBg : "transparent",
                      color: activeTab === "fonts" ? currentTheme.promptColor : "inherit",
                      borderColor: currentTheme.borderColor,
                    }}
                  >
                    <Type className="size-3.5" /> Fonts & Size
                  </button>
                  <button
                    onClick={() => setActiveTab("effects")}
                    className={cn(
                      "px-2.5 py-1 text-xs border font-medium transition-all rounded-none flex items-center gap-1.5",
                      activeTab === "effects" ? "font-bold" : "opacity-60 hover:opacity-100"
                    )}
                    style={{
                      backgroundColor: activeTab === "effects" ? currentTheme.badgeBg : "transparent",
                      color: activeTab === "effects" ? currentTheme.promptColor : "inherit",
                      borderColor: currentTheme.borderColor,
                    }}
                  >
                    <MousePointer className="size-3.5" /> Cursor & FX
                  </button>
                </div>
              </div>

              {/* TAB 1: COLOR THEMES SWATCH GRID */}
              {activeTab === "themes" && (
                <div className="space-y-2">
                  <div className="text-[11px] opacity-75">
                    Select a color scheme or type <code className="px-1 py-0.5 border" style={{ borderColor: currentTheme.borderColor }}>theme &lt;name&gt;</code> in CLI:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TERMINAL_THEMES.map((theme) => {
                      const isActive = theme.id === config.themeId;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => updateConfig({ themeId: theme.id })}
                          className={cn(
                            "relative group p-2.5 text-left border transition-all rounded-none flex flex-col justify-between h-20",
                            isActive ? "ring-1" : "hover:border-slate-400 opacity-80 hover:opacity-100"
                          )}
                          style={{
                            backgroundColor: theme.bgContainer,
                            borderColor: isActive ? theme.borderActive : currentTheme.borderColor,
                            boxShadow: isActive ? `0 0 12px ${theme.glowColor}` : "none",
                          }}
                        >
                          {/* Mini Header Strip Preview */}
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1">
                              <div className="size-1.5 bg-red-400 rounded-none" />
                              <div className="size-1.5 bg-amber-400 rounded-none" />
                              <div
                                className="size-1.5 rounded-none"
                                style={{ backgroundColor: theme.accentColor }}
                              />
                            </div>
                            {isActive && (
                              <Check
                                className="size-3.5"
                                style={{ color: theme.promptColor }}
                              />
                            )}
                          </div>

                          {/* Theme Swatch Pill */}
                          <div className="space-y-1 my-1">
                            <div
                              className="text-xs font-bold truncate"
                              style={{ color: theme.promptColor }}
                            >
                              {theme.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className="size-2 rounded-none"
                                style={{ backgroundColor: theme.promptColor }}
                              />
                              <span
                                className="size-2 rounded-none"
                                style={{ backgroundColor: theme.systemColor }}
                              />
                              <span
                                className="size-2 rounded-none"
                                style={{ backgroundColor: theme.errorColor }}
                              />
                              <span
                                className="size-2 rounded-none"
                                style={{ backgroundColor: theme.textColor }}
                              />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: FONTS & TYPOGRAPHY */}
              {activeTab === "fonts" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block">Font Family:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {TERMINAL_FONTS.map((font) => {
                        const isActive = font.id === config.fontId;
                        return (
                          <button
                            key={font.id}
                            onClick={() => updateConfig({ fontId: font.id })}
                            className={cn(
                              "p-2.5 text-left border transition-all rounded-none flex items-center justify-between",
                              isActive ? "font-bold" : "opacity-75 hover:opacity-100"
                            )}
                            style={{
                              backgroundColor: isActive ? currentTheme.badgeBg : "transparent",
                              borderColor: isActive ? currentTheme.borderActive : currentTheme.borderColor,
                              fontFamily: font.fontFamily,
                            }}
                          >
                            <div>
                              <div className="text-xs" style={{ color: currentTheme.promptColor }}>
                                {font.name}
                              </div>
                              <div className="text-[10px] opacity-60">visitor@mnsh:~$</div>
                            </div>
                            {isActive && <Check className="size-3.5" style={{ color: currentTheme.promptColor }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t" style={{ borderColor: currentTheme.borderColor }}>
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold">Font Size ({config.fontSize}px):</label>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={zoomOut}
                          className="px-2 py-0.5 border text-xs hover:opacity-100 opacity-80"
                          style={{ borderColor: currentTheme.borderColor }}
                        >
                          -
                        </button>
                        <button
                          onClick={zoomReset}
                          className="px-2 py-0.5 border text-xs text-amber-400 hover:opacity-100 opacity-80"
                          style={{ borderColor: currentTheme.borderColor }}
                        >
                          Reset
                        </button>
                        <button
                          onClick={zoomIn}
                          className="px-2 py-0.5 border text-xs hover:opacity-100 opacity-80"
                          style={{ borderColor: currentTheme.borderColor }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={22}
                      value={config.fontSize}
                      onChange={(e) => updateConfig({ fontSize: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CURSOR & AUDIO FX */}
              {activeTab === "effects" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cursor Style */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block">Cursor Shape:</label>
                    <div className="flex gap-2">
                      {(["block", "line", "underline"] as const).map((shape) => (
                        <button
                          key={shape}
                          onClick={() => updateConfig({ cursorStyle: shape })}
                          className={cn(
                            "flex-1 p-2 text-center text-xs border capitalize transition-all rounded-none",
                            config.cursorStyle === shape ? "font-bold" : "opacity-60 hover:opacity-100"
                          )}
                          style={{
                            backgroundColor: config.cursorStyle === shape ? currentTheme.badgeBg : "transparent",
                            borderColor: config.cursorStyle === shape ? currentTheme.borderActive : currentTheme.borderColor,
                            color: config.cursorStyle === shape ? currentTheme.promptColor : "inherit",
                          }}
                        >
                          {shape === "block" ? "█ Block" : shape === "line" ? "| Line" : "_ Underline"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cursor Blink */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block">Cursor Pulse:</label>
                    <button
                      onClick={() => updateConfig({ cursorBlink: !config.cursorBlink })}
                      className="w-full p-2 text-xs border text-left transition-all rounded-none flex items-center justify-between"
                      style={{
                        backgroundColor: config.cursorBlink ? currentTheme.badgeBg : "transparent",
                        borderColor: currentTheme.borderColor,
                      }}
                    >
                      <span>Blinking Cursor Animation</span>
                      <span className="font-mono text-[11px]" style={{ color: currentTheme.promptColor }}>
                        {config.cursorBlink ? "ENABLED" : "OFF"}
                      </span>
                    </button>
                  </div>

                  {/* Sound FX Toggle */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block">Terminal Audio:</label>
                    <button
                      onClick={() => updateConfig({ soundEnabled: !config.soundEnabled })}
                      className="w-full p-2 text-xs border text-left transition-all rounded-none flex items-center justify-between"
                      style={{
                        backgroundColor: config.soundEnabled ? currentTheme.badgeBg : "transparent",
                        borderColor: currentTheme.borderColor,
                      }}
                    >
                      <span className="flex items-center gap-1.5">
                        {config.soundEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5 opacity-50" />}
                        Typing Sound Feedback
                      </span>
                      <span className="font-mono text-[11px]" style={{ color: currentTheme.promptColor }}>
                        {config.soundEnabled ? "ON" : "MUTED"}
                      </span>
                    </button>
                  </div>

                  {/* Matrix Rain Toggle */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block">Background Animation:</label>
                    <button
                      onClick={() => setIsMatrixActive((prev) => !prev)}
                      className="w-full p-2 text-xs border text-left transition-all rounded-none flex items-center justify-between"
                      style={{
                        backgroundColor: isMatrixActive ? currentTheme.badgeBg : "transparent",
                        borderColor: currentTheme.borderColor,
                      }}
                    >
                      <span className="flex items-center gap-1.5">
                        <Monitor className="size-3.5" /> Matrix Rain Canvas
                      </span>
                      <span className="font-mono text-[11px]" style={{ color: currentTheme.promptColor }}>
                        {isMatrixActive ? "ACTIVE 🟢" : "OFF 🔴"}
                      </span>
                    </button>
                  </div>

                  {/* CRT Scanlines Toggle */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold block">CRT Display Effect:</label>
                    <button
                      onClick={() => updateConfig({ scanlines: !config.scanlines })}
                      className="w-full p-2 text-xs border text-left transition-all rounded-none flex items-center justify-between"
                      style={{
                        backgroundColor: config.scanlines ? currentTheme.badgeBg : "transparent",
                        borderColor: currentTheme.borderColor,
                      }}
                    >
                      <span className="flex items-center gap-1.5">
                        <Sliders className="size-3.5" /> CRT Scanlines Overlay
                      </span>
                      <span className="font-mono text-[11px]" style={{ color: currentTheme.promptColor }}>
                        {config.scanlines ? "ENABLED 🟢" : "OFF 🔴"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-3 border-t text-xs select-none" style={{ borderColor: currentTheme.borderColor }}>
                <button
                  onClick={() => updateConfig(DEFAULT_CONFIG)}
                  className="flex items-center gap-1 text-[11px] opacity-70 hover:opacity-100 hover:text-amber-400 transition-colors"
                >
                  <RefreshCw className="size-3" /> Restore Factory Defaults
                </button>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-3 py-1 text-xs border font-semibold transition-all rounded-none"
                  style={{
                    backgroundColor: currentTheme.accentColor,
                    color: "#ffffff",
                    borderColor: currentTheme.borderActive,
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Body / Output Log (Internal Container Scroll Only - 0 Window Jump) */}
      <div
        ref={logContainerRef}
        className="relative z-10 flex-1 p-3.5 overflow-y-auto space-y-2 leading-relaxed scrollbar-thin"
        style={{ fontSize: `${config.fontSize}px` }}
      >
        {output.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            {line.type === "banner" ? (
              <pre
                className="font-bold overflow-x-auto text-[11px] sm:text-xs"
                style={{ color: currentTheme.bannerColor }}
              >
                {line.text}
              </pre>
            ) : line.type === "input" ? (
              <span className="font-medium" style={{ color: currentTheme.promptColor }}>
                {line.text}
              </span>
            ) : line.type === "error" ? (
              <span style={{ color: currentTheme.errorColor }}>{line.text}</span>
            ) : line.type === "system" ? (
              <span style={{ color: currentTheme.systemColor }}>{line.text}</span>
            ) : (
              <span style={{ color: currentTheme.textColor }}>{line.text}</span>
            )}
          </div>
        ))}

        {/* Active Command Input Prompt with Custom Working Cursor Variants */}
        <div className="flex items-center gap-2 pt-1">
          <span className="font-bold shrink-0" style={{ color: currentTheme.promptColor }}>
            visitor@mnsh.online:~$
          </span>
          <div
            className="relative flex-1 flex items-center font-mono cursor-text min-h-[1.5em]"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Real hidden input element */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setSelectionPos(e.target.selectionStart ?? e.target.value.length);
              }}
              onSelect={(e) => {
                const target = e.target as HTMLInputElement;
                setSelectionPos(target.selectionStart ?? target.value.length);
              }}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-text border-none p-0 focus:ring-0 outline-none"
              autoFocus={!embedded}
              spellCheck={false}
              autoComplete="off"
            />

            {/* Custom Terminal Cursor Rendering (Block, Line, Underline) */}
            <div className="flex items-center whitespace-pre font-mono pointer-events-none select-none">
              <span>{textBeforeCursor}</span>
              <span
                className={cn(
                  "inline-flex items-center justify-center transition-opacity leading-none",
                  config.cursorBlink && "animate-pulse duration-700",
                  config.cursorStyle === "block" && "px-[1px]",
                  config.cursorStyle === "line" && "w-[2px] mx-[0.5px] h-[1.2em]",
                  config.cursorStyle === "underline" && "border-b-2 h-[1.2em] px-[0.5px]"
                )}
                style={{
                  backgroundColor:
                    config.cursorStyle === "block"
                      ? currentTheme.promptColor
                      : config.cursorStyle === "line"
                      ? currentTheme.promptColor
                      : "transparent",
                  color:
                    config.cursorStyle === "block"
                      ? currentTheme.bgContainer
                      : currentTheme.textColor,
                  borderColor: currentTheme.promptColor,
                }}
              >
                {charAtCursor === "" ? "\u00A0" : charAtCursor}
              </span>
              <span>{textAfterCursor}</span>
            </div>
          </div>
        </div>

        {/* Interactive ASCII Snake Game Panel */}
        {isSnakeActive && (
          <div
            className="my-3 p-3 border font-mono select-none rounded-none"
            style={{
              borderColor: currentTheme.borderActive,
              backgroundColor: currentTheme.bgHeader,
            }}
          >
            <div
              className="flex items-center justify-between text-xs font-bold mb-2 pb-1 border-b"
              style={{ borderColor: currentTheme.borderColor }}
            >
              <span style={{ color: currentTheme.promptColor }}>🐍 CYBER SNAKE CLI</span>
              <span className="text-[11px] font-mono">
                SCORE: {snakeScore} | HIGH SCORE: {snakeHighScore}
              </span>
            </div>

            {/* Game Grid */}
            <div className="flex flex-col items-center justify-center font-mono leading-none tracking-widest my-2 select-none">
              {Array.from({ length: GRID_HEIGHT }).map((_, rIdx) => (
                <div key={rIdx} className="flex">
                  {Array.from({ length: GRID_WIDTH }).map((_, cIdx) => {
                    const isHead = snake[0]?.x === cIdx && snake[0]?.y === rIdx;
                    const isBody = snake.slice(1).some((s) => s.x === cIdx && s.y === rIdx);
                    const isFood = food.x === cIdx && food.y === rIdx;

                    return (
                      <span
                        key={cIdx}
                        className="w-[1.15em] h-[1.15em] flex items-center justify-center text-xs"
                        style={{
                          color: isHead
                            ? currentTheme.accentColor
                            : isBody
                            ? currentTheme.promptColor
                            : isFood
                            ? currentTheme.systemColor
                            : "inherit",
                        }}
                      >
                        {isHead ? "█" : isBody ? "░" : isFood ? "★" : "·"}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer Instructions */}
            <div
              className="flex items-center justify-between text-[11px] pt-1.5 border-t opacity-90"
              style={{ borderColor: currentTheme.borderColor }}
            >
              {isSnakeGameOver ? (
                <span className="text-red-400 font-bold animate-pulse">
                  💥 GAME OVER! Final Score: {snakeScore}. Press [R] to Restart | [Q / ESC] to Quit
                </span>
              ) : (
                <span>
                  Controls: <kbd className="px-1 py-0.5 border" style={{ borderColor: currentTheme.borderColor }}>WASD</kbd> or <kbd className="px-1 py-0.5 border" style={{ borderColor: currentTheme.borderColor }}>Arrow Keys</kbd> | Press <kbd className="px-1 py-0.5 border" style={{ borderColor: currentTheme.borderColor }}>Q</kbd> to Quit
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Shortcuts */}
      {!embedded && (
        <div
          className="relative z-10 hidden sm:flex items-center justify-between px-4 py-1.5 border-t text-[11px] select-none rounded-none opacity-70"
          style={{
            backgroundColor: currentTheme.bgHeader,
            borderColor: currentTheme.borderColor,
          }}
        >
          <span>
            Press <kbd className="px-1 py-0.5 border text-xs" style={{ borderColor: currentTheme.borderColor }}>Tab</kbd> for completion
          </span>
          <span>
            Type <kbd className="px-1 py-0.5 border text-xs" style={{ borderColor: currentTheme.borderColor }}>settings</kbd> or click ⚙️ for Themes
          </span>
          <span>
            Press <kbd className="px-1 py-0.5 border text-xs" style={{ borderColor: currentTheme.borderColor }}>ESC</kbd> to exit
          </span>
        </div>
      )}
    </div>
  );

  if (isFullscreen && mounted) {
    return createPortal(terminalContent, document.body);
  }

  return terminalContent;
}

// Modal CLI Export
export function DeveloperTerminal() {
  const [isOpen, setIsOpen] = useAtom(isTerminalOpenAtom);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playOpen = useSound("/sounds/menu-open.wav");

  useEffect(() => {
    if (isOpen) {
      playOpen();
    }
  }, [isOpen, playOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md transition-all duration-200",
            isFullscreen ? "p-0" : "p-4 sm:p-6 md:p-10"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <motion.div
            className={cn("w-full transition-all duration-200", isFullscreen ? "h-full max-w-none" : "max-w-4xl")}
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
          >
            <TerminalEngine
              embedded={false}
              onClose={() => setIsOpen(false)}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Bento Embedded CLI Export
export function BentoTerminal() {
  return <TerminalEngine embedded={true} />;
}
