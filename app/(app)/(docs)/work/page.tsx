import type { Metadata } from "next";
import { Suspense } from "react";

import { WorkList } from "@/features/work/components/work-list";
import { WorkListWithSearch } from "@/features/work/components/work-list-with-search";
import { getAllWorks } from "@/features/work/lib/works";
import { PageHeader } from "@/components/page-header";
import { SITE_INFO } from "@/config/site";

const TITLE = "Works";
const DESCRIPTION = "Projects, client work, and experiments I've built.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_INFO.url}/work`,
  },
};

export default function Page() {
  const allWorks = getAllWorks();

  return (
    <div>
      <PageHeader title={TITLE} description={DESCRIPTION} />

      <Suspense fallback={<WorkList works={allWorks} />}>
        <WorkListWithSearch works={allWorks} />
      </Suspense>
    </div>
  );
}

