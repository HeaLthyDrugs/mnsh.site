import type { Metadata } from "next";

import { SNAPS } from "@/features/snaps/data/snaps";
import { SnapsBentoGrid } from "@/features/snaps/components/snaps-bento-grid";
import { PageHeader } from "@/components/page-header";

const TITLE = "Snaps";
const DESCRIPTION = "Photos and moments captured along the way.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

export default function Page() {
  return (
    <div>
      <PageHeader title={TITLE} description={DESCRIPTION} />

      <section className="border-b border-edge bg-background p-1 text-foreground">
        <SnapsBentoGrid snaps={SNAPS} />

        <div className="px-2 py-5">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80">
            More snaps will be added over time ...
          </p>
        </div>
      </section>
    </div>
  );
}
