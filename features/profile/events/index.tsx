"use client";

import { Panel } from "../components/panel";
import { EVENTS } from "../data/events";
import { EventItem } from "./event-item";
import { MusicPlayer } from "./music-player";
import { GitHubContributionsCard } from "./github-contributions-card";
import { USER } from "../data/user";
import { cn } from "@/lib/utils";

// Map sizes to CSS grid classes for responsive bento layout
// Doubled resolution for finer control: 1 normal unit = 2 grid units
// Mobile: 4 cols, Tablet: 8 cols, Desktop: 12 cols
const sizeToGridClasses: Record<string, string> = {
    // xxs: 1/4 of a normal card (2x2 grid units -> perfect square)
    xxs: "col-span-2 row-span-2",
    // xs: 2x2 grid units
    xs: "col-span-2 row-span-2",
    // small: 2x2 grid units
    small: "col-span-2 row-span-2",
    // medium: 2x2 mobile, 4x2 tablet+
    medium: "col-span-2 md:col-span-4 row-span-2",
    // large: 4x2 mobile, 4x2 tablet, 6x2 desktop
    large: "col-span-4 lg:col-span-6 row-span-2",
    // wide: full width (thin strip)
    wide: "col-span-4 md:col-span-8 lg:col-span-12 row-span-2",
    // video: full width, spans 1 fluid row to automatically match its intrinsic aspect ratio!
    video: "col-span-4 md:col-span-8 lg:col-span-12",
    // tall: 2x4 (Double height)
    tall: "col-span-2 md:col-span-4 lg:col-span-6 row-span-4",
    // xl: 4x4 mobile/tablet, 6x4 desktop
    xl: "col-span-4 md:col-span-4 lg:col-span-6 row-span-4",
    // hero: 4x4 mobile, 8x4 tablet/desktop
    hero: "col-span-4 md:col-span-8 lg:col-span-8 row-span-4",
    // social: 1/3 width on desktop (4 cols), 1/2 on tablet (4 cols), full width on mobile (4 cols)
    social: "col-span-4 row-span-1 md:col-span-4 md:row-span-1 lg:col-span-4 lg:row-span-1",
};

// Music player grid placement — full width row-span-4
const MUSIC_PLAYER_CLASSES = "col-span-4 md:col-span-8 lg:col-span-12 row-span-4";

// Index in the events array where we insert the music player
const MUSIC_PLAYER_POSITION = 3;

// Index in the events array where we insert the GitHub contributions
const GITHUB_CONTRIBUTIONS_POSITION = 5;

export default function Events() {
    const githubProfileUrl = `https://github.com/${USER.username}`;

    return (
        <Panel id="events">

            <div className="w-full">
                {/* 
                    Responsive Bento Grid:
                    - Doubled resolution for more granular sizing
                    - auto-rows-[100px] instead of 200px
                */}
                <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 auto-rows-[minmax(100px,auto)] grid-flow-dense gap-0"
                    style={{ gridAutoFlow: "dense" }}
                >
                    {EVENTS.map((event, index) => {
                        const size = event.size || "medium";
                        const gridClasses = sizeToGridClasses[size] || sizeToGridClasses.medium;

                        const items = [];

                        // Insert music player at the designated position
                        if (index === MUSIC_PLAYER_POSITION) {
                            items.push(
                                <div
                                    key="music-player"
                                    className={cn(
                                        "overflow-hidden border-t border-edge",
                                        MUSIC_PLAYER_CLASSES
                                    )}
                                >
                                    <MusicPlayer className="h-full" />
                                </div>
                            );
                        }

                        items.push(
                            <div
                                key={event.id}
                                className={cn(
                                    "overflow-hidden",
                                    gridClasses
                                )}
                            >
                                <EventItem
                                    event={event}
                                    className={cn(
                                        "h-full",
                                        event.id === "blog" && "border-b lg:border-b-0 lg:border-r border-edge",
                                        event.id === "tools" && "border-r lg:border-r-0 lg:border-b border-edge",
                                        event.id === "twitter" && "border-t border-edge md:border-r",
                                        event.id === "linkedin" && "border-t border-edge lg:border-r",
                                        event.id === "github" && "border-t border-edge"
                                    )}
                                />
                            </div>
                        );

                        // Insert GitHub contributions at the designated position
                        if (index === GITHUB_CONTRIBUTIONS_POSITION) {
                            items.push(
                                <GitHubContributionsCard
                                    key="github-contributions"
                                    username={USER.username}
                                    githubProfileUrl={githubProfileUrl}
                                />
                            );
                        }

                        return items;
                    })}
                </div>
            </div>
        </Panel>
    );
}
