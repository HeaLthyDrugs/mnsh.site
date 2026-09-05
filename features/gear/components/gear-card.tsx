"use client";

import Link from "next/link";
import Image from "next/image";

import { ArrowUpRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { GearItem } from "../data/gear";
import { useSound } from "@/hooks/use-sound";

interface GearCardProps {
    item: GearItem;
}

export function GearCard({ item }: GearCardProps) {
    const playHover = useSound("/sounds/hover.wav");
    const playTap = useSound("/sounds/tap.wav");

    return (
        <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={playHover}
            onClick={playTap}
            className={cn(
                "group relative flex items-stretch h-full bg-background transition-colors hover:bg-muted/30"
            )}
        >
            <div className="w-28 shrink-0 border-r border-dashed border-edge bg-muted/10 p-3 flex flex-col justify-center">
                <div className="relative w-full aspect-square">
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 128px"
                            className="object-contain grayscale transition-all group-hover:grayscale-0"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <span className="text-xs font-medium text-muted-foreground/50">{item.name[0]}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col">
                <div className="flex items-stretch border-b border-dashed border-edge">
                    <div className="flex-1 p-3 flex flex-col justify-center">
                        <h3 className="text-sm font-medium leading-tight text-foreground/90 group-hover:text-foreground transition-colors">
                            {item.name}
                        </h3>
                    </div>
                    <div className="flex items-center justify-center border-l border-dashed border-edge px-4 shrink-0 bg-muted/5">
                        <ArrowUpRight className="size-3.5 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
                    </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-3 gap-2 bg-muted/5">
                    <p className="text-xs text-muted-foreground/80 line-clamp-3 leading-relaxed">
                        {item.description}
                    </p>
                </div>
            </div>
        </Link>
    );
}

