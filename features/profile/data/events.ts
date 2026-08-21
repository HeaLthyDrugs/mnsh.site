/**
 * Events Data Configuration
 * 
 * Grid System: 2 cols (mobile) / 4 cols (tablet) / 6 cols (desktop)
 * Dense packing enabled — items fill gaps automatically.
 * 
 * Available Size Options:
 * - xs: Extra small (1 col) - Perfect for small accents
 * - small: Small (1 col) - Standard small cards
 * - medium: Medium (1/2/2 cols) - Default size
 * - large: Large (2/2/3 cols) - Featured events
 * - wide: Wide (2/4/6 cols) - Full width banners
 * - tall: Tall (1/2/2 cols, 2 rows) - Detailed content
 * - xl: Extra large (2/2/3 cols, 2 rows) - Hero cards
 *
 * Desktop row math (6 cols):
 * Row 1-2: xl(3×2) + large(3) = 6 | xl bleeds into row 2
 * Row 2:   medium(2) + xs(1) = 3 (fills remaining of row 2)
 * Row 3:   tall(2×2) + medium(2) + small(1) + xs(1) = 6
 * Row 4:   (tall continues) + xs(1) + xs(1) + medium(2) = 6 (dense fills)
 * Row 5:   wide(6)
 * Row 6:   large(3) + medium(2) + xs(1) = 6
 * Row 7-8: small(1) + xl(3×2) + medium(2) = 6 | xl bleeds
 * Music player (2×2) inserted at position 5 — dense packing places it
 */

import { Event } from "../types/events";

export const EVENTS: Event[] = [
    {
        id: "blog",
        title: "Blog",
        date: "",
        category: "Content",
        // description: "Read my latest thoughts, tutorials, and deep-dives.",
        backgroundImage: "https://assets.mnsh.site/bentos/blog-headline-bento.png",
        link: "/blog",
        size: "hero",
        textColor: "text-white",
    },
    {
        id: "tools",
        title: "Tools",
        date: "",
        category: "Resources",
        backgroundImage: "https://assets.mnsh.site/bentos/tools-cover-bento.png",
        link: "/tools",
        size: "medium",
    },

    {
        id: "gear",
        title: "Gear",
        date: "",
        category: "Equipment",
        backgroundImage: "https://assets.mnsh.site/bentos/gear-cover-bento.png",
        link: "/gear",
        size: "medium",
    },
    {
        id: "twitter",
        title: "X (Twitter)",
        date: "",
        category: "Social",
        link: "https://x.com/mnshsshh",
        size: "social",
        backgroundImage: "https://assets.mnsh.site/icons/crayon/X.png",
        showActionButton: false,
        showTitle: false,
        showImageFullSize: true,
        backgroundColor: "bg-white",
        username: "@mnshsshh",
    },
    {
        id: "linkedin",
        title: "LinkedIn",
        date: "",
        category: "Social",
        link: "https://www.linkedin.com/in/manishvv/",
        size: "social",
        backgroundImage: "https://assets.mnsh.site/icons/crayon/linkedin.png",
        showActionButton: false,
        showTitle: false,
        showImageFullSize: true,
        backgroundColor: "bg-white",
        username: "manishvv",
    },
    {
        id: "github",
        title: "GitHub",
        date: "",
        category: "Social",
        link: "https://github.com/HeaLthyDrugs",
        size: "social",
        backgroundImage: "https://assets.mnsh.site/icons/crayon/github.png",
        showActionButton: false,
        showTitle: false,
        showImageFullSize: true,
        backgroundColor: "bg-white",
        username: "HeaLthyDrugs",
    },
    // {
    //     id: "video-loop",
    //     title: "Montage",
    //     date: "",
    //     category: "Video",
    //     size: "video",
    //     youtubeVideoIds: ["X6kaQpEXJMA", "KLuTLF3x9sA", "wnhvanMdx4s", "hMxlDbv-rec"],
    //     aspectRatio: "16/9",
    //     showTitle: false,
    //     showActionButton: false,
    // },
];
