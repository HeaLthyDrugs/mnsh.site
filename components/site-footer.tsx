"use client";

import { CheckIcon, ExternalLinkIcon, MousePointerClick, RssIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SITE_INFO } from "@/config/site";
import { USER } from "@/features/profile/data/user";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";
import { CopyIcon, type CopyIconHandle } from "./animated-icons/copy";
import { Icons } from "./icons";
import { SimpleTooltip } from "./ui/tooltip";

export function SiteFooter() {
  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  return (
    <footer className="max-w-screen overflow-x-hidden px-2">
      <div className="border-t border-edge mx-auto border-x md:max-w-3xl">
        <div className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px]">
            <div className="space-y-4 px-4 py-8">
              <h3 className="flex items-center flex-wrap gap-x-4 gap-y-4 font-heading text-3xl leading-tight text-muted-foreground md:text-3xl">
                <span>Got anything in mind ?</span>
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground/80">
                I&apos;m always open to interesting conversations - whether it&apos;s about building something together, sharing ideas, or just saying hello.
              </p>

              <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                <LiveClock />
              </div>
            </div>

            <ContactTriggerBox />
          </div>

          <div className="border-t border-edge flex flex-col">
            <ContactRow
              value="hey@mnsh.me"
              platform="mailto"
              href="mailto:hey@mnsh.me"
            />
            <div className="h-px w-full bg-edge" />
            <ContactRow
              value="@HeLLLthyDrug"
              platform="x.com"
              href="https://x.com/HeLLLthyDrug"
            />
            <div className="h-px w-full bg-edge" />
            <ContactRow
              value="HeaLthyDrugs"
              platform="Github"
              href="https://github.com/HeaLthyDrugs"
            />
          </div>
        </div>

        <div
          className={cn(
            "border-y border-edge flex w-full items-start justify-start before:z-1 after:z-1",
            "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/56"
          )}
        >
          <div className="flex h-11 items-center border-r border-edge bg-background">
            <SimpleTooltip content="LLMs Context File">
              <a
                className="flex h-full items-center border-r border-edge px-4 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                href={`${SITE_INFO.url}/llms.txt`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHover}
                onClick={playTap}
              >
                llms.txt
              </a>
            </SimpleTooltip>

            <SimpleTooltip content="RSS Feed">
              <a
                className="flex h-full items-center px-4 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                href={`${SITE_INFO.url}/rss.xml`}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHover}
                onClick={playTap}
              >
                <RssIcon className="size-4" />
                <span className="sr-only">RSS</span>
              </a>
            </SimpleTooltip>
          </div>
        </div>
      </div>
    </footer>
  );
}

function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return <span>{time} IST (GMT+5:30) - Lonavla, India</span>;
}

function ContactRow({
  value,
  platform,
  href
}: {
  value: string;
  platform: string;
  href: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyIconRef = useRef<CopyIconHandle>(null);
  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      copyIconRef.current?.startAnimation();
      setTimeout(() => {
        setCopied(false);
        copyIconRef.current?.stopAnimation();
      }, 2000);
    } catch {
      // Fallback for older browsers.
    }
  };

  return (
    <div className="group relative flex items-stretch">
      <button
        onClick={(e) => {
          playTap();
          handleCopy(e);
        }}
        onMouseEnter={playHover}
        className="flex items-center gap-2.5 pl-4 py-3 text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="relative size-3.5 shrink-0 cursor-pointer">
          <CheckIcon
            className={cn(
              "absolute inset-0 size-3.5 text-green-500 transition-all duration-200",
              copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )}
          />
          <span
            className={cn(
              "absolute inset-0 transition-all duration-200",
              copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
            )}
          >
            <CopyIcon ref={copyIconRef} size={14} />
          </span>
        </span>
        <span className="text-sm text-muted-foreground">{value}</span>
      </button>

      <div className="flex flex-1 items-center mx-4">
        <div className="w-px self-stretch border-l border-dashed border-edge" />
        <div className="flex-1 border-t border-dashed border-edge" />
        <div className="w-px self-stretch border-r border-dashed border-edge" />
      </div>

      <a
        href={href}
        target={platform === "mailto" ? undefined : "_blank"}
        rel={platform === "mailto" ? undefined : "noopener noreferrer"}
        className="flex shrink-0 items-center gap-2 pr-4 py-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
        onMouseEnter={playHover}
        onClick={playTap}
      >
        <span>{platform}</span>
        <ExternalLinkIcon className="size-3" />
      </a>
    </div>
  );
}

function ContactTriggerBox() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      onClick={() => {
        if (!isOpen) {
          playTap();
          setIsOpen(true);
        }
      }}
      onMouseEnter={!isOpen ? playHover : undefined}
      className={cn(
        "relative flex h-full min-h-[160px] w-full flex-col overflow-hidden border-t border-edge outline-none transition-all md:border-t-0 md:border-l",
        !isOpen
          ? "group cursor-pointer bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] hover:bg-muted/10 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"
          : "bg-background"
      )}
    >
      {isOpen ? (
        <div className="absolute inset-0 z-20 flex flex-col justify-center divide-y divide-edge animate-in fade-in zoom-in-95 duration-200">
          <a
            href="https://wa.me/918432563227"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center px-6 py-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            onMouseEnter={playHover}
            onClick={playTap}
          >
            <Icons.whatsapp className="mr-2 size-4 shrink-0" /> WhatsApp
          </a>
          <a
            href={`mailto:${USER.email}`}
            className="flex flex-1 items-center justify-center px-6 py-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            onMouseEnter={playHover}
            onClick={playTap}
          >
            <Icons.mail className="mr-2 size-4 shrink-0" /> Email
          </a>
          <a
            href="https://cal.com/mnsshh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center px-6 py-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            onMouseEnter={playHover}
            onClick={playTap}
          >
            <Icons.phone className="mr-2 size-4 shrink-0" /> Schedule a call
          </a>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center opacity-40 transition-all duration-300 group-hover:opacity-80">
          <MousePointerClick className="size-4 text-foreground" />
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-foreground">
            Tap to start conversation
          </span>
        </div>
      )}
    </div>
  );
}
