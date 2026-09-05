import Image from "next/image";
import { cloudflareLoader, shouldUseCloudflareLoader } from "@/lib/cloudflare-image";


import { Markdown } from "@/components/markdown";
import { useSound } from "@/hooks/use-sound";
import {
    CollapsibleContent,
    CollapsibleTrigger,
    CollapsibleWithContext,
} from "@/components/ui/collapsible";
import { ProseMono } from "@/components/ui/typography";
import { USER, FACES } from "../data/user";
import { Faq } from "../types/faq";
import { FaqAnimatedIcon } from "./faq-animated-icon";

export function FaqItem({
    className,
    faq,
}: {
    className?: string;
    faq: Faq;
}) {
    const playHover = useSound("/sounds/hover.wav");
    const playTap = useSound("/sounds/tap.wav");

    return (
        <CollapsibleWithContext defaultOpen={faq.isExpanded} asChild>
            <div className={className}>
                <CollapsibleTrigger 
                    className="group/faq flex w-full items-center gap-4 p-3 text-left hover:bg-accent2 transition-colors duration-200"
                    onMouseEnter={playHover}
                    onClick={playTap}
                >
                    {/* Question Text */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-regular leading-snug text-foreground/90">
                            {faq.question}
                        </h3>
                    </div>

                    {/* Plus/Minus Icon */}
                    <FaqAnimatedIcon />
                </CollapsibleTrigger>

                <CollapsibleContent className="group overflow-hidden duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <div className="border-t border-edge/60">
                        <div className="flex gap-3 duration-300 group-data-[state=closed]:animate-fade-out group-data-[state=open]:animate-fade-in">
                            {/* Avatar and vertical separator */}
                            <div className="flex flex-col items-center shrink-0 pl-4 pt-4">
                                <div className="relative">
                                    <Image
                                        loader={shouldUseCloudflareLoader(FACES[0]) ? cloudflareLoader : undefined}
                                        src={FACES[0]}
                                        alt={USER.displayName}
                                        width={28}
                                        height={28}
                                        className="size-7 rounded-none object-contain"
                                    />
                                    <div className="pointer-events-none absolute inset-0 rounded-none ring-1 ring-black/10 ring-inset dark:ring-white/10" />
                                </div>
                                <div className="flex-1 w-px bg-black/10 dark:bg-white/10" />
                            </div>

                            {/* Answer content */}
                            <div className="flex-1 min-w-0 pt-4 pr-4 pb-4">
                                <ProseMono className="text-muted-foreground">
                                    <Markdown>{faq.answer}</Markdown>
                                </ProseMono>
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </CollapsibleWithContext>
    );
}
