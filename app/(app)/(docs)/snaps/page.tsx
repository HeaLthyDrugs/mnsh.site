import type { Metadata } from "next";
import { MapPin, UserRound } from "lucide-react";

import { SNAPS, SNAPS_INTRO } from "@/features/snaps/data/snaps";
import { SnapsBentoGrid } from "@/features/snaps/components/snaps-bento-grid";

export const metadata: Metadata = {
  title: "Snaps",
  description: "A bento wall of photos I have clicked or simply love.",
};

export default function Page() {
  return (
    <div>
      <div className="border-b border-edge px-2 py-2">
        <h1 className="font-heading text-3xl font-semibold">{SNAPS_INTRO.title}</h1>
      </div>

      <div className="border-b border-edge px-2 py-2">
        <p className="font-heading text-sm text-balance text-muted-foreground">
          {SNAPS_INTRO.subtitle}
        </p>
      </div>

      <section className="border-b border-edge bg-background p-2 text-foreground sm:p-3">
        <div className="mb-3 border border-edge bg-card p-3">
          <p className="mb-2 max-w-xl font-heading text-sm text-muted-foreground">
            {SNAPS_INTRO.description}
          </p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 border border-edge bg-muted/40 px-2 py-1 text-muted-foreground">
              <MapPin className="size-3.5" />
              Location tagged
            </span>
            <span className="inline-flex items-center gap-1 border border-edge bg-muted/40 px-2 py-1 text-muted-foreground">
              <UserRound className="size-3.5" />
              Clicked by tracked
            </span>
          </div>
        </div>

        <SnapsBentoGrid snaps={SNAPS} />
      </section>
    </div>
  );
}
