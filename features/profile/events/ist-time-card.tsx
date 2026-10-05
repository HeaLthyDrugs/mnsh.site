"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, Sparkle, Moon, SunDim, Briefcase } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface StatusConfig {
  label: string;
  sublabel: string;
  dotColor: string;
  pulseColor: string;
  icon: typeof Briefcase;
}

function getAvailabilityStatus(hour: number): StatusConfig {
  // Morning & Working hours (09:00 - 18:30 IST)
  if (hour >= 9 && hour < 19) {
    return {
      label: "Available for Work",
      sublabel: "Designing & shipping products",
      dotColor: "bg-emerald-500",
      pulseColor: "bg-emerald-400",
      icon: SunDim,
    };
  }
  // Evening Deep Work hours (19:00 - 23:59 IST)
  if (hour >= 19 && hour < 24) {
    return {
      label: "Deep Work / Hacking",
      sublabel: "Building & experimenting",
      dotColor: "bg-indigo-500",
      pulseColor: "bg-indigo-400",
      icon: Sparkle,
    };
  }
  // Night hours (00:00 - 08:59 IST)
  return {
    label: "Recharging / Offline",
    sublabel: "Back online ~09:00 AM IST",
    dotColor: "bg-zinc-400 dark:bg-zinc-500",
    pulseColor: "bg-zinc-400/40",
    icon: Moon,
  };
}

export function IstTimeCard({ className }: { className?: string }) {
  // Safe initial hydration state
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
      // Format to IST using Intl
      const istString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // Parse 12-hour format string (e.g., "08:14:22 PM")
      const match = istString.match(/(\d+):(\d+):(\d+)\s*(AM|PM)?/i);
      
      // Also get 24-hour hour for status calculation
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
  const StatusIcon = status.icon;

  return (
    <div
      className={cn(
        "group relative flex h-full w-full flex-col justify-between overflow-hidden bg-background p-4 select-none",
        "transition-colors hover:bg-muted/15",
        className
      )}
    >
      {/* Top Header: Location & Timezone badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 text-muted-foreground/80 shrink-0" weight="bold" />
          <span className="font-medium tracking-tight">Lonavala, IN</span>
        </div>

        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80 border border-edge/80 bg-muted/40 px-1.5 py-0.5">
          <Clock className="size-2.5" />
          UTC+5:30
        </span>
      </div>

      {/* Center: Monospaced Live Time */}
      <div className="my-auto py-2">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-foreground tabular-nums">
            {time.hours}:{time.minutes}
          </span>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            :{time.seconds}
          </span>
          <span className="ml-1 font-mono text-xs font-medium text-muted-foreground">
            {time.period}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] font-mono text-muted-foreground/60 tracking-wider">
          INDIA STANDARD TIME
        </p>
      </div>

      {/* Bottom: Availability Status with Pulsing Dot */}
      <div className="pt-2 border-t border-edge/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
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
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-foreground truncate">
              {status.label}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {status.sublabel}
            </span>
          </div>
        </div>

        <div className="shrink-0 size-7 flex items-center justify-center border border-edge bg-muted/20 text-muted-foreground">
          <StatusIcon className="size-3.5" />
        </div>
      </div>
    </div>
  );
}
