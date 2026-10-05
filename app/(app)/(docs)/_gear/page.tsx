/**
 * GEAR PAGE — CURRENTLY UNROUTED.
 *
 * This folder is prefixed with an underscore (`_gear`), which makes it a Next.js
 * "private folder": it is NOT exposed as a route (/gear returns 404) and is not in the sitemap.
 *
 * To bring it back, rename this folder from `_gear` to `gear`, then re-enable the
 * "Gear" entries (all marked `// GEAR (disabled)`) in:
 *   config/site.ts, components/command-menu.tsx, components/mobile-nav.tsx,
 *   components/site-header-actions.tsx, components/developer-terminal.tsx,
 *   config/terminal-catalog.ts, app/sitemap.ts, public/llms.txt,
 *   features/profile/data/events.ts
 */
import type { Metadata } from "next";
import { GEAR } from "@/features/gear/data/gear";
import { GearList } from "@/features/gear/components/gear-list";
import { SITE_INFO } from "@/config/site";

export const metadata: Metadata = {
    title: "Gear",
    description: "The hardware, gadgets, and desk setup that keeps me productive.",
    alternates: {
        canonical: "/gear",
    },
    openGraph: {
        title: "Gear",
        description: "The hardware, gadgets, and desk setup that keeps me productive.",
        url: `${SITE_INFO.url}/gear`,
    },
};

export default function Page() {
    return (
        <div>
            <div className="border-b border-edge px-2 py-2">
                <h1 className="text-3xl font-semibold font-heading">Gear</h1>
            </div>

            <div className="px-2 py-2">
                <p className="font-heading text-sm text-balance text-muted-foreground">
                    {metadata.description as string}
                </p>
            </div>

            <div className="border-t border-edge p-2">
                <GearList items={GEAR} />
            </div>
        </div>
    );
}
