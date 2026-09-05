"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, FileText, Envelope, User, X, Lightning, Wrench, DeviceMobile } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/nav";
import { useSound } from "@/hooks/use-sound";
import { MnshMark } from "@/components/mnsh-mark";

// Map titles to icons dynamically
const getIconForTitle = (title: string) => {
  const lowercaseTitle = title.toLowerCase();
  if (lowercaseTitle.includes("me") || lowercaseTitle.includes("home")) return MnshMark;
  if (lowercaseTitle.includes("work")) return Briefcase;
  if (lowercaseTitle.includes("blog") || lowercaseTitle.includes("post")) return FileText;
  if (lowercaseTitle.includes("contact")) return Envelope;
  if (lowercaseTitle.includes("about")) return User;
  if (lowercaseTitle.includes("tool")) return Wrench;
  if (lowercaseTitle.includes("gear")) return DeviceMobile;
  return Lightning;
};

export function MobileNav({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  const toggleMenu = () => {
    playTap();
    setIsOpen(!isOpen);
  };

  const [greeting, setGreeting] = useState({ text: "SYSTEM ONLINE", emoji: "🟢" });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting({ text: "GOOD MORNING", emoji: "🌅" });
    else if (hour < 18) setGreeting({ text: "GOOD AFTERNOON", emoji: "☀️" });
    else setGreeting({ text: "GOOD EVENING", emoji: "🌙" });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) setIsOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <Button
        variant="ghost"
        className={cn("group flex flex-col gap-[5px] rounded-none focus-visible:ring-0", className)}
        size="icon"
        onMouseEnter={playHover}
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <span 
          className={cn(
            "flex h-px w-5 transform rounded-none bg-foreground transition-all duration-300 ease-in-out",
            isOpen ? "translate-y-[6px] rotate-45" : ""
          )} 
        />
        <span 
          className={cn(
            "flex h-px w-5 transform rounded-none bg-foreground transition-all duration-300 ease-in-out",
            isOpen ? "opacity-0" : "opacity-100"
          )} 
        />
        <span 
          className={cn(
            "flex h-px w-5 transform rounded-none bg-foreground transition-all duration-300 ease-in-out",
            isOpen ? "-translate-y-[6px] -rotate-45" : ""
          )} 
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-zinc-950/80 dark:bg-zinc-950/90 sm:hidden"
              onClick={toggleMenu}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-[85vw] max-w-[360px] bg-background border-l border-border flex flex-col sm:hidden"
            >
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-border pl-4">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Navigation</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-none h-12 w-12 border-l border-border hover:bg-accent focus-visible:ring-0"
                  onMouseEnter={playHover}
                  onClick={toggleMenu}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col flex-1 overflow-y-auto w-full">
                {items.map((link, i) => {
                  const Icon = getIconForTitle(link.title);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.03, duration: 0.2 }}
                      key={link.href}
                    >
                      <Link
                        href={link.href}
                        className="group flex items-center border-b border-border p-4 hover:bg-accent transition-colors"
                        onClick={() => {
                          playTap();
                          setIsOpen(false);
                        }}
                        onMouseEnter={playHover}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border bg-background group-hover:border-foreground/30 transition-colors mr-4">
                          <Icon className={cn(
                            "text-muted-foreground group-hover:text-foreground transition-all",
                            Icon === MnshMark ? "h-8 w-8 scale-110" : "h-6 w-6"
                          )} />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-lg truncate">{link.title}</span>
                            {link.shortcut && (
                              <span className="font-mono text-xs text-muted-foreground border border-border px-1.5 py-0.5 bg-muted/50 rounded-none">
                                {link.shortcut}
                              </span>
                            )}
                          </div>
                          {link.description && (
                            <span className="text-sm text-muted-foreground truncate mt-0.5">{link.description}</span>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="mt-auto shrink-0 border-t border-border p-4 bg-muted/10">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono tracking-widest">
                       <span className="text-sm">{greeting.emoji}</span>
                       <span>{greeting.text}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">V 1.0.0</span>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
