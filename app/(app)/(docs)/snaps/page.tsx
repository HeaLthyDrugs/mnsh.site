import type { Metadata } from "next";

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

      <section className="border-b border-edge bg-background p-1 text-foreground">
        <SnapsBentoGrid snaps={SNAPS} />

        <div className="px-2 py-5">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
            More snaps are slowly developing here, like film.
          </p>
        </div>
      </section>
    </div>
  );
}
