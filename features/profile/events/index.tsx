"use client";

import { Panel } from "../components/panel";
import { EVENTS } from "../data/events";
import { EventItem } from "./event-item";
import { MusicPlayer } from "./music-player";
import { GitHubContributionsCard } from "./github-contributions-card";
import { IstTimeCard } from "./ist-time-card";
import { LatestBlogCard } from "./latest-blog-card";
import { SnapsCarouselCard } from "./snaps-carousel-card";
import { USER } from "../data/user";
import { cn } from "@/lib/utils";

import type { BlogItem } from "./latest-blog-card";

const MUSIC_PLAYER_CLASSES = "col-span-4 md:col-span-8 lg:col-span-12 row-span-4";

export interface EventsProps {
  blogs?: BlogItem[];
  latestBlog?: BlogItem;
}

export default function Events({ blogs, latestBlog }: EventsProps) {
  const githubProfileUrl = `https://github.com/${USER.username}`;

  return (
    <Panel id="events">
      <div className="w-full">
        <div
          className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 auto-rows-[minmax(100px,auto)] grid-flow-dense gap-0"
          style={{ gridAutoFlow: "dense" }}
        >
          {/* Bento 1 (Left): Big Blog Bento (2 bentos wide = 8 cols, 4 rows high) */}
          <div className="col-span-4 md:col-span-8 lg:col-span-8 row-span-3 md:row-span-4 lg:row-span-4 overflow-hidden border-b lg:border-r border-edge">
            <LatestBlogCard posts={blogs} post={latestBlog} />
          </div>

          {/* Bento 2 (Right Top): Snaps Carousel Bento (4 cols, 2 rows high) */}
          <div className="col-span-4 md:col-span-4 lg:col-span-4 row-span-2 overflow-hidden border-b md:border-r lg:border-r-0 border-edge">
            <SnapsCarouselCard />
          </div>

          {/* Bento 3 (Right Bottom): Time Bento (4 cols, 2 rows high, below Snaps) */}
          <div className="col-span-4 md:col-span-4 lg:col-span-4 row-span-2 overflow-hidden border-b border-edge">
            <IstTimeCard />
          </div>

          {/* Music Player Bento (Full width, row-span-4) */}
          <div
            className={cn(
              "overflow-hidden border-b border-edge",
              MUSIC_PLAYER_CLASSES
            )}
          >
            <MusicPlayer className="h-full" />
          </div>

          {/* Social Bentos (Twitter, LinkedIn, GitHub) */}
          {EVENTS.map((event) => (
            <div
              key={event.id}
              className={cn(
                "overflow-hidden",
                event.id === "github"
                  ? "col-span-4 md:col-span-8 lg:col-span-4 row-span-1"
                  : "col-span-4 md:col-span-4 lg:col-span-4 row-span-1"
              )}
            >
              <EventItem
                event={event}
                className={cn(
                  "h-full",
                  event.id === "twitter" && "border-b md:border-r border-edge",
                  event.id === "linkedin" && "border-b lg:border-r border-edge",
                  event.id === "github" && "border-b border-edge"
                )}
              />
            </div>
          ))}

          {/* GitHub Contributions Card */}
          <GitHubContributionsCard
            username={USER.username}
            githubProfileUrl={githubProfileUrl}
          />
        </div>
      </div>
    </Panel>
  );
}
