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

// Doubled resolution grid system:
// Mobile: 4 cols | Tablet: 8 cols | Desktop: 12 cols
const MUSIC_PLAYER_CLASSES = "col-span-4 md:col-span-8 lg:col-span-12 row-span-4";

export interface EventsProps {
  latestBlog?: {
    slug: string;
    title: string;
    description: string;
    createdAt?: string;
    category?: string;
    readTime?: string;
  };
}

export default function Events({ latestBlog }: EventsProps) {
  const githubProfileUrl = `https://github.com/${USER.username}`;

  return (
    <Panel id="events">
      <div className="w-full">
        <div
          className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 auto-rows-[minmax(100px,auto)] grid-flow-dense gap-0"
          style={{ gridAutoFlow: "dense" }}
        >
          {/* Card 1: IST Time & Availability Bento (Compact 4 cols) */}
          <div className="col-span-4 md:col-span-4 lg:col-span-4 row-span-2 overflow-hidden border-b md:border-r border-edge">
            <IstTimeCard />
          </div>

          {/* Card 2: Latest Blog Teaser Bento (Compact 4 cols) */}
          <div className="col-span-4 md:col-span-4 lg:col-span-4 row-span-2 overflow-hidden border-b lg:border-r border-edge">
            <LatestBlogCard post={latestBlog} />
          </div>

          {/* Card 3: Snaps Carousel / Memories Bento (Compact 4 cols on desktop, 8 on tablet, 4 on mobile) */}
          <div className="col-span-4 md:col-span-8 lg:col-span-4 row-span-2 overflow-hidden border-b border-edge">
            <SnapsCarouselCard />
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
