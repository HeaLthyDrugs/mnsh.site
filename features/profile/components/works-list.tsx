import { WorkItem } from "@/features/work/components/work-item";
import type { Post } from "@/features/work/types/work-post";

export function WorksList({ allWorks }: { allWorks: Post[] }) {
  return (
    <div className="relative py-4 flex flex-col gap-4">
      {/* Background grid lines */}
      <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
        <div className="border-r border-edge"></div>
        <div className="border-l border-edge"></div>
      </div>

      {/* Show every work by default. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {allWorks.map((work) => (
          <WorkItem key={work.slug} work={work} />
        ))}
      </div>
    </div>
  );
}
