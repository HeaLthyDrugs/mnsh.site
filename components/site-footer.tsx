"use client";

import { Check, ArrowSquareOut, Rss } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { SITE_INFO } from "@/config/site";
import { USER } from "@/features/profile/data/user";
import { useSound } from "@/hooks/use-sound";
import { cn } from "@/lib/utils";
import { decodeEmail } from "@/utils/string";
import { copyText } from "@/utils/copy";
import { CopyIcon, type CopyIconHandle } from "./animated-icons/copy";
import { Icons } from "./icons";
import { SimpleTooltip } from "./ui/tooltip";

export function SiteFooter() {
  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");
  const email = decodeEmail(USER.email);

  return (
    <footer className="max-w-screen overflow-x-hidden px-2">
      <div className="border-t border-edge mx-auto border-x md:max-w-3xl">
        <div className="flex flex-col">
          {/* Top Connected Status & Time Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-edge border-b border-edge bg-muted/5">
            <div className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-muted/15">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-xs text-foreground/90 font-medium">
                {USER.availabilityText || "Open for freelance works"}
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted/15 sm:justify-end">
              <Icons.overviewClock className="size-3.5 text-muted-foreground/70 shrink-0" />
              <LiveClock />
            </div>
          </div>

          {/* Main Content Area with Left Connected Column and Right Smiley Icon Cell */}
          <div className="flex items-stretch divide-x divide-edge">
            <div className="hidden sm:flex w-11 shrink-0 items-center justify-center py-4 bg-muted/5 select-none">
              <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-mono uppercase tracking-[0.35em] text-muted-foreground/70">
                Contact
              </span>
            </div>

            <div className="flex-1 p-5 md:p-6 space-y-1.5">
              <h3 className="font-heading text-2xl md:text-3xl font-normal tracking-tight text-foreground/80">
                Got something in mind?
              </h3>
              <p className="max-w-lg text-sm text-muted-foreground/80 leading-relaxed">
                Open to freelance work, collaborations, or just a quick chat.
              </p>
            </div>

            {/* Right Connected Cell with Smiley Icon */}
            <div className="flex w-24 sm:w-28 md:w-32 shrink-0 items-center justify-center bg-muted/5 p-4 transition-colors hover:bg-muted/15 select-none">
              <Icons.smiley className="size-14 sm:size-16 md:size-20 text-muted-foreground/80 transition-all duration-300 hover:scale-110 hover:text-foreground hover:rotate-6" />
            </div>
          </div>

          <div className="border-t border-edge flex flex-col">
            <ContactRow
              value={email}
              platform="mailto"
              href={`mailto:${email}`}
            />
            {/* WhatsApp/Mobile hidden for now */}
            {/* <div className="h-px w-full bg-edge" />
            <ContactRow
              value="+91 84325 63227"
              platform="WhatsApp"
              href="https://wa.me/918432563227"
            /> */}
            <div className="h-px w-full bg-edge" />
            <ContactRow
              value="cal.com/mnsshh"
              platform="Schedule a call"
              href="https://cal.com/mnsshh"
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
                <Rss className="size-4" />
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
      const formatted = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
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

  return <span>{time} IST</span>;
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
  const playCopy = useSound("/sounds/copy.wav");

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playCopy();
    try {
      await copyText(value);
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
          handleCopy(e);
        }}
        onMouseEnter={playHover}
        className="flex items-center gap-2.5 pl-4 py-3 text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="relative size-3.5 shrink-0 cursor-pointer">
          <Check
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
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        className="flex shrink-0 items-center gap-2 pr-4 py-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
        onMouseEnter={playHover}
        onClick={playTap}
      >
        <span>{platform}</span>
        <ArrowSquareOut className="size-3" />
      </a>
    </div>
  );
}
