"use client";

import { useEffect, useRef, useState } from "react";
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
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { decodeEmail } from "@/utils/string";
import { AnimatePresence, motion } from "framer-motion";
import { Markdown } from "@/components/markdown";
import Link from "next/link";


// Local time component with balanced font styling
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
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono text-sm text-foreground/90">{time}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </span>
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
      className="group inline-flex cursor-pointer items-center gap-1.5 font-sans text-sm text-foreground/90 transition-colors hover:text-foreground"
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
              <CheckIcon ref={checkIconRef} size={13} />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <CopyIcon ref={copyIconRef} size={13} />
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}

// Single info cell component with standardized icon column and full-height vertical separator
function InfoCell({
  icon,
  children,
  className,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-stretch font-sans text-sm min-h-[44px]",
        "transition-colors hover:bg-muted/15",
        className
      )}
    >
      {/* Icon column with standardized fixed width */}
      <div className="flex w-11 shrink-0 items-center justify-center text-muted-foreground">
        {icon}
      </div>

      {/* Vertical separator - full height */}
      <div className="w-px self-stretch bg-edge/60" />

      {/* Content column */}
      <div className="flex flex-1 items-center px-3.5 py-2.5">
        {children}
      </div>
    </div>
  );
}

function GreetingAboutSection() {
  return (
    <div className="flex items-stretch font-sans text-sm transition-colors hover:bg-muted/10 border-b border-edge">
      {/* Left Column matching InfoCell Icon Column Width */}
      <div className="flex w-11 shrink-0 items-center justify-center py-4">
        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground/80 whitespace-nowrap select-none">
          About Me
        </span>
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
  return (
    <Panel>
      <h2 className="sr-only">About Me</h2>

      <PanelContent className="p-0">
        <GreetingAboutSection />

        {/* 4 unified horizontal rows - guarantees identical row heights and aligned borders */}
        <div className="divide-y divide-edge">
          {/* Row 1: Name | Job Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-edge">
            <InfoCell icon={<Icons.overviewProfile className="size-5" />}>
              <p className="text-balance text-foreground/90 font-medium" aria-label={`Name: ${USER.displayName}`}>
                {USER.fullName}
              </p>
            </InfoCell>
            <InfoCell icon={<Icons.overviewWork className="size-5" />}>
              <p className="text-balance text-foreground/90 font-medium">
                {USER.jobTitle}
              </p>
            </InfoCell>
          </div>

          {/* Row 2: Location | Local Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-edge">
            <InfoCell icon={<Icons.overviewLocation className="size-5" />}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    USER.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline text-foreground/90 hover:text-foreground transition-colors"
                  aria-label={`Location: ${USER.address}`}
                >
                  {USER.address}
                </a>
              </div>
            </InfoCell>
            <InfoCell icon={<Icons.overviewClock className="size-5" />}>
              <LocalTime timezone={USER.timezone} label={USER.localTimeLabel} />
            </InfoCell>
          </div>

          {/* Row 3: Email | Availability Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-edge">
            <InfoCell icon={<Icons.overviewMail className="size-5" />}>
              <CopyableEmail email={USER.email} />
            </InfoCell>
            <InfoCell icon={<Icons.overviewStatus className="size-5" />}>
              <p className="text-balance text-foreground/90">
                {USER.availabilityText}
              </p>
            </InfoCell>
          </div>

          {/* Row 4: Website | Currently Building */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-edge">
            <InfoCell icon={<Icons.overviewWeb className="size-5" />}>
              {USER.website && (
                <a
                  href={USER.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline text-foreground/90 hover:text-foreground transition-colors"
                  aria-label="Portfolio website"
                >
                  mnsh.site
                </a>
              )}
            </InfoCell>
            <InfoCell icon={<Icons.overviewUpcoming className="size-5" />}>
              {USER.currentlyBuilding && (
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
              )}
            </InfoCell>
          </div>
        </div>
      </PanelContent>
    </Panel>
  );
}
