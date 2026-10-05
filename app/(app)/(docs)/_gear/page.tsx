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
import { PageHeader } from "@/components/page-header";
import { SITE_INFO } from "@/config/site";

const TITLE = "Gear";
const DESCRIPTION = "Hardware, tools, and desk setup I use daily.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
        canonical: "/gear",
    },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: `${SITE_INFO.url}/gear`,
    },
};

export default function Page() {
    return (
        <div>
            <PageHeader title={TITLE} description={DESCRIPTION} />

            <div className="p-2">
                <GearList items={GEAR} />
            </div>
        </div>
    );
}
