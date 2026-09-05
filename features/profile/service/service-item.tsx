import Image from "next/image";


import { Icons } from "@/components/icons";
import { Markdown } from "@/components/markdown";
import {
    CollapsibleChevronsIcon,
    CollapsibleContent,
    CollapsibleTrigger,
    CollapsibleWithContext,
} from "@/components/ui/collapsible";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProseMono } from "@/components/ui/typography";
import { UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";
import { Service } from "../types/services";
import { Tag } from "@/components/ui/tag";



export function ServiceItem({
    className,
    service,
}: {
    className?: string;
    service: Service;
}) {
    const { start, end } = service.period;
    const isOngoing = !end;
    const isSinglePeriod = end === start;

    return (
        <CollapsibleWithContext defaultOpen={service.isExpanded} asChild>
            <div className={className}>
                <div className="flex items-center hover:bg-accent2">
                    {service.logo ? (
                        <Image
                            src={service.logo}
                            alt={service.title}
                            width={32}
                            height={32}
                            quality={75}
                            className="mx-4 flex size-6 shrink-0 select-none"
                            aria-hidden="true"
                        />
                    ) : (
                        <div
                            className="mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-edge ring-offset-1 ring-offset-background select-none"
                            aria-hidden="true"
                        >
                            <Icons.project className="size-4" />
                        </div>
                    )}

                    <div className="flex-1 border-l border-dashed border-edge">
                        <CollapsibleTrigger className="flex w-full items-center gap-4 p-4 pr-2 text-left">
                            <div className="flex-1">
                                <h3 className="mb-1 leading-snug font-medium text-balance">
                                    {service.title}
                                </h3>
                            </div>

                            <div
                                className="shrink-0 text-muted-foreground [&_svg]:size-4"
                                aria-hidden
                            >
                                <CollapsibleChevronsIcon />
                            </div>
                        </CollapsibleTrigger>
                    </div>
                </div>

                <CollapsibleContent className="group overflow-hidden duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <div className="border-t border-edge shadow-inner">
                        <div className="space-y-4 p-4 duration-300 group-data-[state=closed]:animate-fade-out group-data-[state=open]:animate-fade-in">
                            {service.description && (
                                <ProseMono>
                                    <Markdown>{service.description}</Markdown>
                                </ProseMono>
                            )}

                            {service.skills.length > 0 && (
                                <ul className="flex flex-wrap gap-1.5">
                                    {service.skills.map((skill, index) => (
                                        <li key={index} className="flex">
                                            <Tag>{skill}</Tag>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </CollapsibleWithContext>
    );
}