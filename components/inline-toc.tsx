import type { TOCItemType } from "fumadocs-core/toc";
import { TextT } from "@phosphor-icons/react/dist/ssr";

import type { Collapsible } from "@/components/ui/collapsible";
import {
  CollapsibleChevronsIcon,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  getTocItemDepth,
  TOC_GUIDE_INSET,
  TOC_GUIDE_STEP,
  TocTreeGuides,
} from "@/components/toc-tree-guides";

export function InlineTOC({
  items,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible> & {
  items: TOCItemType[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <CollapsibleWithContext
      className={cn("not-prose rounded-none bg-code font-sans", className)}
      {...props}
    >
      <CollapsibleTrigger className="group/toc ring ring-inset ring-black/10 dark:ring-white/10 inline-flex w-full items-center gap-2 p-3 pl-4 text-sm font-medium [&_svg]:size-4">
        <TextT />
        {children ?? "On this page"}
        <div className="ml-auto shrink-0 text-muted-foreground" aria-hidden>
          <CollapsibleChevronsIcon />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden duration-300 data-[state=closed]:animate-collapsible-fade-up data-[state=open]:animate-collapsible-fade-down">
        <ul className="flex flex-col px-4 pb-3 pt-2 text-sm text-muted-foreground relative">
          {items.map((item, index) => {
            const depth = getTocItemDepth(item);

            return (
              <li
                key={item.url}
                className="relative flex items-center py-1.5"
                style={{
                  paddingLeft: depth ? depth * TOC_GUIDE_STEP + TOC_GUIDE_INSET : 4,
                }}
              >
                <TocTreeGuides items={items} index={index} depth={depth} />

                <a
                  className={cn(
                    "underline-offset-4 transition-colors hover:text-accent-foreground hover:underline line-clamp-2",
                    depth === 0 ? "font-medium text-foreground/90" : "text-muted-foreground"
                  )}
                  href={item.url}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </CollapsibleContent>
    </CollapsibleWithContext>
  );
}
