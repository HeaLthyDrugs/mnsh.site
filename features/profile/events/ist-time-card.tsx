"use client";

import { useEffect, useState } from "react";
import { MapPin } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface StatusConfig {
  label: string;
  dotColor: string;
  pulseColor: string;
}

function getAvailabilityStatus(hour: number): StatusConfig {
  if (hour >= 9 && hour < 19) {
    return {
      label: "Available for work",
      dotColor: "bg-emerald-500",
      pulseColor: "bg-emerald-400",
    };
  }
  if (hour >= 19 && hour < 24) {
    return {
      label: "Deep work",
      dotColor: "bg-indigo-500",
      pulseColor: "bg-indigo-400",
    };
  }
  return {
    label: "Offline",
    dotColor: "bg-zinc-400 dark:bg-zinc-500",
    pulseColor: "bg-zinc-400/40",
  };
}

export function IstTimeCard({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
    period: string;
    istHour: number;
  }>({
    hours: "--",
    minutes: "--",
    seconds: "--",
    period: "IST",
    istHour: 12,
  });

  useEffect(() => {
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const match = istString.match(/(\d+):(\d+):(\d+)\s*(AM|PM)?/i);
      const ist24HourStr = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
      });
      const currentIstHour = parseInt(ist24HourStr, 10) || 12;

      if (match) {
        setTime({
          hours: match[1],
          minutes: match[2],
          seconds: match[3],
          period: match[4] || "IST",
          istHour: currentIstHour,
        });
      }
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const status = getAvailabilityStatus(time.istHour);

  return (
    <div
      className={cn(
        "group relative flex h-full w-full flex-col justify-between overflow-hidden bg-card p-4 select-none",
        "transition-colors hover:bg-muted/15",
        className
      )}
    >
      {/* Top: Location only */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
        <MapPin className="size-3.5 text-muted-foreground/80 shrink-0" weight="bold" />
        <span className="tracking-tight">Lonavala, IN</span>
      </div>

      {/* Center: Big, Bold Live Time */}
      <div className="my-auto py-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-foreground tabular-nums leading-none">
            {time.hours}:{time.minutes}
          </span>
          <span className="font-mono text-base sm:text-lg font-semibold text-muted-foreground uppercase tracking-wider">
            {time.period}
          </span>
        </div>
      </div>

      {/* Bottom: Minimal Status with Pulsing Dot */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2 shrink-0">
          {mounted && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                status.pulseColor
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              status.dotColor
            )}
          />
        </span>
        <span className="text-xs font-medium text-foreground">
          {status.label}
        </span>
      </div>
    </div>
  );
}
