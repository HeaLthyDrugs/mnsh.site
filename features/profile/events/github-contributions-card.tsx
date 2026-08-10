"use client";

import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/contribution-graph";
import type { Activity } from "@/components/contribution-graph";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";

const GITHUB_CONTRIBUTIONS_CLASSES = "col-span-4 md:col-span-8 lg:col-span-12 row-span-2";
const CACHE_TTL_MS = 60 * 60 * 1000;

type CachedContributions = {
  data: Activity[];
  cachedAt: number;
};

interface GitHubContributionsCardProps {
  username: string;
  githubProfileUrl: string;
}

function GitHubContributionsFallback() {
  return (
    <div className="flex h-40.5 w-full items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  );
}

function GitHubContributionsContent({
  username,
  githubProfileUrl,
}: GitHubContributionsCardProps) {
  const cacheKey = `github-contributions:${username.toLowerCase()}`;
  const [data, setData] = useState<Activity[] | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(cacheKey);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as CachedContributions;
      if (
        !parsed ||
        !Array.isArray(parsed.data) ||
        typeof parsed.cachedAt !== "number"
      ) {
        return null;
      }

      if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) {
        return parsed.data;
      }

      return parsed.data;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const controller = new AbortController();
    let shouldSkipFetch = false;

    try {
      const raw = window.localStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw) as CachedContributions;
        if (
          parsed &&
          Array.isArray(parsed.data) &&
          typeof parsed.cachedAt === "number"
        ) {
          const isFresh = Date.now() - parsed.cachedAt <= CACHE_TTL_MS;
          if (isFresh) {
            setData(parsed.data);
            shouldSkipFetch = true;
          }
        }
      }
    } catch {
      // Ignore malformed local cache and fetch from network.
    }

    if (shouldSkipFetch) {
      return () => controller.abort();
    }

    const fetchContributions = async () => {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          console.error("Failed to fetch contributions:", res.status);
          setData([]);
          return;
        }

        const json = (await res.json()) as { contributions?: Activity[] };
        const contributions = Array.isArray(json.contributions)
          ? json.contributions
          : [];

        setData(contributions);

        const nextCachedAt = Date.now();

        const payload: CachedContributions = {
          data: contributions,
          cachedAt: nextCachedAt,
        };
        window.localStorage.setItem(cacheKey, JSON.stringify(payload));
      } catch (error) {
        if (
          error instanceof Error &&
          error.name !== "AbortError"
        ) {
          console.error("Error fetching GitHub contributions:", error);
        }
        setData([]);
      }
    };

    fetchContributions();

    return () => controller.abort();
  }, [cacheKey, username]);

  if (data === null) {
    return <GitHubContributionsFallback />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-40.5 w-full items-center justify-center">
        <p className="text-muted-foreground">No contribution data available</p>
      </div>
    );
  }

  return (
    <ContributionGraph
      className="mx-auto w-full px-2 pt-4"
      data={data}
      blockSize={11}
      blockMargin={3}
      blockRadius={0}
    >
      <ContributionGraphCalendar
        alignToEnd
        className="no-scrollbar px-0 pb-1"
        title="GitHub Contributions"
      >
        {({ activity, dayIndex, weekIndex }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <g>
                <ContributionGraphBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                />
              </g>
            </TooltipTrigger>
            <TooltipContent className="font-sans">
              <p>
                {activity.count} contribution{activity.count > 1 ? "s" : null}{" "}
                on {format(new Date(activity.date), "dd.MM.yyyy")}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </ContributionGraphCalendar>

      <ContributionGraphFooter className="mt-1 items-center px-1 text-sm sm:px-2">
        <ContributionGraphTotalCount>
          {({ totalCount, year }) => (
            <div className="text-muted-foreground/90">
              {totalCount.toLocaleString("en")} contributions in {year} on{" "}
              <a
                className="font-medium text-foreground link-underline"
                href={githubProfileUrl}
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
              .
            </div>
          )}
        </ContributionGraphTotalCount>

        <ContributionGraphLegend className="ml-auto" />
      </ContributionGraphFooter>

      <div className="relative mt-1 flex items-center justify-between px-3 pb-1.5 pt-2 text-[11px] text-muted-foreground/80 sm:px-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border/60" />
        <span>Rolling 52-week activity window</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-none bg-emerald-500" />
          Synced hourly
        </span>
      </div>
    </ContributionGraph>
  );
}

export function GitHubContributionsCard({
  username,
  githubProfileUrl,
}: GitHubContributionsCardProps) {
  return (
    <div
      className={cn(
        "bg-card overflow-hidden border-t border-edge",
        "animate-[fadeSlideUp_0.5s_ease-out_forwards]",
        "opacity-0",
        GITHUB_CONTRIBUTIONS_CLASSES
      )}
      style={{
        animationDelay: "200ms",
      }}
    >
      <GitHubContributionsContent
        username={username}
        githubProfileUrl={githubProfileUrl}
      />
    </div>
  );
}
