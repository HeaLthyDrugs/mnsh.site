import type { Metadata } from "next";
import { Suspense } from "react";

import { WorkList } from "@/features/work/components/work-list";
import { WorkListWithSearch } from "@/features/work/components/work-list-with-search";
import { getAllWorks } from "@/features/work/lib/works";
import { SITE_INFO } from "@/config/site";



export const metadata: Metadata = {
  title: "Works",
  description:
    "A showcase of my freelance, personal and collaboration works.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Works",
    description:
      "A showcase of my freelance, personal and collaboration works.",
    url: `${SITE_INFO.url}/work`,
  },
};

export default function Page() {
  const allWorks = getAllWorks();

  return (
    <div>
      <div className="border-b border-edge px-2 py-2">
        <h1 className="text-3xl font-semibold font-heading">Works</h1>
      </div>

      <div className="px-2 py-2">
        <p className="font-heading text-sm text-balance text-muted-foreground">
          {metadata.description as string}
        </p>
      </div>

      <div className="border-t border-edge">
      </div>

      <Suspense fallback={<WorkList works={allWorks} />}>
        <WorkListWithSearch works={allWorks} />
      </Suspense>
    </div>
  );
}

