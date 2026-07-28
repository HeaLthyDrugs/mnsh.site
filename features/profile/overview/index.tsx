"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Panel, PanelContent } from "../components/panel";
import { USER } from "../data/user";
import {
  CopyIcon,
  CopyIconHandle,
} from "@/components/animated-icons/copy";
import {
  CheckIcon,
  CheckIconHandle,
} from "@/components/animated-icons/check";
import { UserIcon } from "@/components/animated-icons/user";
import { MapPinIcon } from "@/components/animated-icons/map-pin";
import { BriefcaseIcon } from "@/components/animated-icons/briefcase";
import { MailIcon } from "@/components/animated-icons/mail";
import { EarthIcon } from "@/components/animated-icons/earth";
import { cn } from "@/lib/utils";
import { decodeEmail } from "@/utils/string";
import { LayersIcon } from "@/components/animated-icons/layers";
import { AnimatePresence, motion } from "framer-motion";
import { useLoop } from "@/lib/animation/useLoop";
import { ClockIcon } from "@/components/animated-icons/clock";
import { Markdown } from "@/components/markdown";
import Link from "next/link";
import { BentoTerminal } from "@/components/developer-terminal";


// Local time component
function LocalTime({ timezone, label }: { timezone: string; label: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [timezone]);

  if (!time) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="text-xs">
        {time} {label}
      </span>
    </span>
  );
}

// Icon container with consistent styling
function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center",
        "bg-gradient-to-br from-muted via-muted to-muted/80",
        "relative overflow-hidden",
        "border border-dashed border-muted-foreground/20",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
        "transition-all duration-300 ease-out",
        "hover:border-muted-foreground/50 hover:border-solid",
        "[&_svg]:pointer-events-none [&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        "[&_svg]:relative [&_svg]:z-10 [&_svg]:transition-transform [&_svg]:duration-300",
        "hover:[&_svg]:scale-110",
        // Outer thin ring
        "ring-1 ring-muted-foreground/15 ring-offset-2 ring-offset-background"
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

// Copyable email component with animated icons
function CopyableEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const emailDecoded = decodeEmail(email);
  const checkIconRef = useRef<CheckIconHandle>(null);
  const copyIconRef = useRef<CopyIconHandle>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailDecoded);
      setCopied(true);
      checkIconRef.current?.startAnimation();
      setTimeout(() => {
        setCopied(false);
        checkIconRef.current?.stopAnimation();
      }, 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = emailDecoded;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      checkIconRef.current?.startAnimation();
      setTimeout(() => {
        setCopied(false);
        checkIconRef.current?.stopAnimation();
      }, 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group inline-flex cursor-pointer items-center gap-1.5 font-sans text-sm transition-colors hover:text-foreground"
      aria-label={copied ? "Email copied!" : `Copy email: ${emailDecoded}`}
    >
      <span className="underline-offset-4 group-hover:underline">
        {emailDecoded}
      </span>
      <span className="flex size-4 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              className="text-emerald-500"
            >
              <CheckIcon ref={checkIconRef} size={14} />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <CopyIcon ref={copyIconRef} size={14} />
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}

// Info row component with full-height vertical separator
function InfoRow({
  icon,
  children,
  isLast = false,
  className,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  isLast?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-stretch font-sans text-sm",
        "transition-colors hover:bg-muted/20",
        !isLast && "border-b border-edge",
        className
      )}
    >
      {/* Icon column */}
      <div className="flex items-center justify-center px-3 py-2">
        <IconBox>{icon}</IconBox>
      </div>

      {/* Vertical separator - full height */}
      <div className="w-px self-stretch bg-edge/60" />

      {/* Content column */}
      <div className="flex flex-1 items-center px-3 py-2">
        {children}
      </div>
    </div>
  );
}

function GreetingAboutSection() {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5 || hour >= 18) {
      setGreeting("Good evening");
    } else if (hour < 12) {
      setGreeting("Good morning");
    } else {
      setGreeting("Good afternoon");
    }
  }, []);

  return (
    <div className="flex items-stretch font-sans text-sm transition-colors hover:bg-muted/10 border-b border-edge">
      {/* Left Column matching InfoRow Width */}
      <div className="flex items-center justify-center px-3 py-4 shrink-0">
        <div className="flex size-7 justify-center items-center">
          <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground/80 whitespace-nowrap">
            About Me
          </span>
        </div>
      </div>

      {/* Vertical separator - full height */}
      <div className="w-px self-stretch bg-edge/60" />

      {/* Content column */}
      <div className="flex flex-1 flex-col justify-center px-4 py-5 md:px-5 space-y-3 leading-relaxed text-muted-foreground">
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground prose-p:leading-relaxed prose-li:my-1 prose-ul:my-2 prose-a:underline prose-a:underline-offset-4 prose-a:decoration-edge/50 hover:prose-a:decoration-foreground prose-a:text-foreground/90 hover:prose-a:text-foreground prose-a:transition-colors prose-strong:text-foreground prose-strong:font-medium">
          <Markdown>
            {USER.about}
          </Markdown>
        </div>
        <p className="text-sm">
          Want to know more about me?{" "}
          <Link
            href="/blog/lifelog"
            className="underline-offset-4 hover:underline text-foreground/90"
          >
            Read my life log
          </Link>
        </p>
      </div>

    </div>
  );
}

export function Overview() {
  const { key } = useLoop(2000); // Change every 2 seconds for role animation

  const currentItem = useMemo(() => {
    return USER.flipSentences[key % USER.flipSentences.length];
  }, [key]);

  return (
    <Panel>
      <h2 className="sr-only">About Me</h2>

      <PanelContent className="p-0">
        <GreetingAboutSection />

        {/* Info list with dividers in grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-edge">
          {/* Column 1 */}
          <div className="flex flex-col">
            {/* Name */}
            <InfoRow icon={<UserIcon />}>
              <p className="text-balance" aria-label={`Name: ${USER.displayName}`}>
                {USER.fullName}
              </p>
            </InfoRow>

            {/* Location + Time */}
            <InfoRow icon={<MapPinIcon />}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    USER.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                  aria-label={`Location: ${USER.address}`}
                >
                  {USER.address}
                </a>
              </div>
            </InfoRow>

            {/* Email */}
            <InfoRow icon={<MailIcon />}>
              <CopyableEmail email={USER.email} />
            </InfoRow>

            {/* Website */}
            {USER.website && (
              <InfoRow icon={<EarthIcon />} className="border-b md:border-b-0">
                <a
                  href={USER.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                  aria-label="Portfolio website"
                >
                  mnsh.online
                </a>
              </InfoRow>
            )}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col">
            {/* Job Title */}
            <InfoRow icon={<BriefcaseIcon />}>
              <p className="text-balance text-foreground/90">
                {USER.jobTitle}
              </p>
            </InfoRow>

            {/* Experience */}
            <InfoRow icon={<ClockIcon />}>
              <LocalTime timezone={USER.timezone} label={USER.localTimeLabel} />
            </InfoRow>

            {/* Status */}
            <InfoRow
              icon={
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
                </span>
              }
            >
              <p className="text-balance text-foreground/90">
                {USER.availabilityText}
              </p>
            </InfoRow>

            {/* Currently Building */}
            {USER.currentlyBuilding && (
              <InfoRow icon={<span className="text-lg leading-none grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">🚀</span>} isLast>
                <div className="flex flex-col space-y-0.5">
                  <a
                    href={USER.currentlyBuilding.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline font-medium text-foreground/90"
                  >
                    {USER.currentlyBuilding.name}
                  </a>
                </div>
              </InfoRow>
            )}
          </div>
        </div>

        {/* Bento Direct CLI Terminal */}
        <BentoTerminal />
      </PanelContent>
    </Panel>
  );
}
