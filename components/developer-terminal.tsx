"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAtom } from "jotai";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Terminal, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
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
  "cat",
  "sudo hire",
  "matrix",
  "clear",
  "exit",
];

const INITIAL_OUTPUT: OutputLine[] = [
  {
    id: "banner-1",
    type: "banner",
    text: `┌───────────────────────────────────────────────────────────┐
│  M N S H  .  C L I   v1.3.0 (x86_64-apple-darwin)          │
│  Type 'help' for commands | Ctrl +/- to Zoom             │
└───────────────────────────────────────────────────────────┘`,
  },
  {
    id: "banner-2",
    type: "system",
    text: `Welcome to Manish Vishwakarma's interactive terminal.
Try typing: 'work', 'blog', 'gear', 'tools', 'whoami', 'skills', or 'sudo hire'.`,
  },
];

export interface TerminalEngineProps {
  embedded?: boolean;
  onClose?: () => void;
  className?: string;
}

export function TerminalEngine({ embedded = false, onClose, className }: TerminalEngineProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<OutputLine[]>(INITIAL_OUTPUT);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [scanlines, setScanlines] = useState(true);
  const [fontSize, setFontSize] = useState(13); // Default font size 13px

  const { setAnimatedTheme } = useAnimatedThemeToggle();
  const playTap = useSound("/sounds/tap.wav");
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const zoomIn = useCallback(() => setFontSize((prev) => Math.min(prev + 1, 22)), []);
  const zoomOut = useCallback(() => setFontSize((prev) => Math.max(prev - 1, 10)), []);
  const zoomReset = useCallback(() => setFontSize(13), []);

  // Internal viewport scroll only (0 page jump/scroll)
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [output]);

  // Matrix Rain Canvas Animation Effect
  useEffect(() => {
    if (!isMatrixActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    const characters = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZmnsh.online";
    const charFontSize = Math.max(12, fontSize);
    const columns = Math.floor(canvas.width / charFontSize);
    const drops: number[] = Array(columns).fill(1);

    let animationFrameId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#10B981";
      ctx.font = `${charFontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
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
  }, [isMatrixActive, fontSize]);

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

      playTap();
      appendOutput(`visitor@mnsh.online:~$ ${raw}`, "input");

      setHistory((prev) => [...prev, raw]);
      setHistoryIndex(-1);

      const parts = raw.split(" ");
      const cmd = parts[0].toLowerCase();
      const subCmd = parts[1]?.toLowerCase();

      switch (cmd) {
        case "help":
        case "man":
          appendOutput(
            `Available Commands:
  whoami          - Display profile details & bio
  skills          - Show tech stack & engineering skills
  work [open]     - List all featured works or view/open detail ('work justwrite-notes', 'work open leank-p2p-communication')
  blog [open]     - List all blog posts or view/open post ('blog lifelog', 'blog open lifelog')
  gear            - List hardware setup & workstation gear
  tools           - List developer tools & software applications
  contact         - Get contact email & social links
  theme <mode>    - Toggle theme ('theme dark', 'theme light', 'theme system')
  sudo hire       - Execute hiring protocol 🚀
  matrix          - Toggle Matrix rain background mode
  cat <file>      - Read text files ('cat bio.md', 'cat gear.txt')
  clear           - Clear terminal output
  exit            - Close terminal window

Hotkeys:
  Ctrl/Cmd + [+]  - Zoom In font size
  Ctrl/Cmd + [-]  - Zoom Out font size
  Ctrl/Cmd + [0]  - Reset font size`,
            "output"
          );
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
Currently Building: ${USER.currentlyBuilding.name} - ${USER.currentlyBuilding.label}
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
              appendOutput(`Project not found: '${subCmd}'. Type 'work' to view all projects.`, "error");
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
              appendOutput(`Article not found: '${subCmd}'. Type 'blog' to list all posts.`, "error");
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
Email:   manishvishwakarma9960@gmail.com
Website: https://mnsh.online
GitHub:  https://github.com/HeaLthyDrugs

Social Handles:
${SOCIAL_LINKS.map((s) => `  - ${s.title.padEnd(12)} : ${s.href}`).join("\n")}`,
            "output"
          );
          break;

        case "theme":
          if (parts[1] === "dark" || parts[1] === "light" || parts[1] === "system") {
            setAnimatedTheme(parts[1]);
            appendOutput(`Theme set to: ${parts[1]}`, "system");
          } else {
            appendOutput(`Usage: theme <light | dark | system>`, "error");
          }
          break;

        case "cat":
          if (parts[1] === "bio.md" || parts[1] === "bio") {
            appendOutput(USER.about, "output");
          } else if (parts[1] === "gear.txt" || parts[1] === "gear") {
            appendOutput(
              GEAR.map((g) => `${g.name}: ${g.description}`).join("\n"),
              "output"
            );
          } else {
            appendOutput(`Usage: cat <file> (Available: bio.md, gear.txt)`, "error");
          }
          break;

        case "sudo":
          if (parts.slice(1).join(" ") === "hire") {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
            });
            appendOutput(
              `[SUCCESS] Hiring Protocol Initialized! 🚀
Root privilege confirmed for Manish Vishwakarma.
Email:   manishvishwakarma9960@gmail.com
Status:  Open for freelance projects & engineering roles.`,
              "system"
            );
          } else {
            appendOutput(`Permission denied: '${raw}'. Try 'sudo hire'`, "error");
          }
          break;

        case "hire":
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
          });
          appendOutput(
            `Hiring protocol active! Direct Email: manishvishwakarma9960@gmail.com`,
            "system"
          );
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
          appendOutput(`Command not found: '${cmd}'. Type 'help' for available commands.`, "error");
          break;
      }
    },
    [playTap, router, setAnimatedTheme, isMatrixActive, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInput(history[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx] || "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (!input.trim()) return;
      const matches = COMMAND_LIST.filter((c) => c.startsWith(input.trim().toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        appendOutput(`Matches: ${matches.join(", ")}`, "system");
      }
    } else if (e.key === "Escape" && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col w-full font-mono bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden select-text rounded-none",
        embedded
          ? "h-[420px] max-h-[420px] rounded-none border-t border-edge"
          : "h-[85vh] max-h-[680px] rounded-none border border-emerald-500/40 max-w-4xl",
        scanlines &&
          "before:pointer-events-none before:absolute before:inset-0 before:z-20 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] before:bg-[length:100%_4px]",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Matrix Rain Canvas Background */}
      {isMatrixActive && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-0 opacity-40"
        />
      )}

      {/* Header Bar - Sharp Edges */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-emerald-500/30 select-none rounded-none">
        <div className="flex items-center gap-2">
          {!embedded && (
            <button
              onClick={onClose}
              className="size-2.5 rounded-none bg-red-500 hover:bg-red-600 transition-colors"
              title="Close Terminal"
            />
          )}
          <div className="size-2.5 rounded-none bg-amber-500/80" />
          <div className="size-2.5 rounded-none bg-emerald-500/80" />
          <span className="ml-1 text-xs font-semibold tracking-wider text-emerald-400/90 flex items-center gap-1.5">
            <Terminal className="size-3.5" /> mnsh.cli — bash {embedded ? "(Bento Terminal)" : ""}
          </span>
        </div>

        {/* Header Controls: CRT Toggle & Zoom Controls */}
        <div className="flex items-center gap-2.5 text-xs text-zinc-400">
          <div className="flex items-center gap-1 bg-zinc-800/80 px-1.5 py-0.5 rounded-none border border-zinc-700/60 text-[11px]">
            <button
              onClick={zoomOut}
              className="hover:text-emerald-400 p-0.5 transition-colors"
              title="Zoom Out (Ctrl -)"
            >
              <ZoomOut className="size-3" />
            </button>
            <span className="text-[10px] text-zinc-300 font-mono min-w-[28px] text-center">
              {fontSize}px
            </span>
            <button
              onClick={zoomIn}
              className="hover:text-emerald-400 p-0.5 transition-colors"
              title="Zoom In (Ctrl +)"
            >
              <ZoomIn className="size-3" />
            </button>
            {fontSize !== 13 && (
              <button
                onClick={zoomReset}
                className="hover:text-amber-400 p-0.5 transition-colors ml-0.5"
                title="Reset Zoom (Ctrl 0)"
              >
                <RotateCcw className="size-2.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setScanlines((prev) => !prev)}
            className={cn(
              "px-2 py-0.5 text-[11px] rounded-none border transition-colors",
              scanlines
                ? "border-emerald-500/50 text-emerald-400 bg-emerald-950/40"
                : "border-zinc-700 text-zinc-500"
            )}
            title="Toggle CRT Scanline Effect"
          >
            CRT
          </button>
          {!embedded && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:text-zinc-100 transition-colors rounded-none"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body / Output Log (Internal Container Scroll Only - 0 Window Jump) */}
      <div
        ref={logContainerRef}
        className="relative z-10 flex-1 p-3.5 overflow-y-auto space-y-2 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800"
        style={{ fontSize: `${fontSize}px` }}
      >
        {output.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            {line.type === "banner" ? (
              <pre className="text-emerald-400 font-bold overflow-x-auto text-[11px] sm:text-xs">
                {line.text}
              </pre>
            ) : line.type === "input" ? (
              <span className="text-emerald-400 font-medium">{line.text}</span>
            ) : line.type === "error" ? (
              <span className="text-rose-400">{line.text}</span>
            ) : line.type === "system" ? (
              <span className="text-amber-300">{line.text}</span>
            ) : (
              <span className="text-zinc-300">{line.text}</span>
            )}
          </div>
        ))}

        {/* Active Command Input Prompt */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold shrink-0">
            visitor@mnsh.online:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-zinc-100 outline-none border-none p-0 focus:ring-0 font-mono rounded-none"
            style={{ fontSize: `${fontSize}px` }}
            autoFocus={!embedded}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Quick Action Touch Toolbar - Sharp Edges */}
      <div className="relative z-10 flex items-center gap-1.5 p-2 bg-zinc-900/90 border-t border-emerald-500/20 overflow-x-auto select-none rounded-none">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest pl-1 mr-1 shrink-0">
          Quick:
        </span>
        {["help", "whoami", "skills", "work", "blog", "gear", "tools", "sudo hire", "matrix", "clear"].map((action) => (
          <button
            key={action}
            onClick={() => handleCommand(action)}
            className="px-2 py-0.5 text-[11px] rounded-none bg-zinc-800 hover:bg-emerald-950 hover:text-emerald-300 border border-zinc-700 text-zinc-300 shrink-0 transition-colors"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Footer Shortcuts - Sharp Edges */}
      {!embedded && (
        <div className="relative z-10 hidden sm:flex items-center justify-between px-4 py-1.5 bg-zinc-900/60 border-t border-zinc-800 text-[11px] text-zinc-500 select-none rounded-none">
          <span>Press <kbd className="px-1 py-0.5 rounded-none bg-zinc-800 text-zinc-300">Tab</kbd> for completion</span>
          <span>Press <kbd className="px-1 py-0.5 rounded-none bg-zinc-800 text-zinc-300">Ctrl +/-</kbd> to zoom font</span>
          <span>Press <kbd className="px-1 py-0.5 rounded-none bg-zinc-800 text-zinc-300">ESC</kbd> to exit</span>
        </div>
      )}
    </div>
  );
}

// Modal CLI Export
export function DeveloperTerminal() {
  const [isOpen, setIsOpen] = useAtom(isTerminalOpenAtom);
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/75 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <motion.div
            className="w-full max-w-4xl"
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
          >
            <TerminalEngine embedded={false} onClose={() => setIsOpen(false)} />
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
