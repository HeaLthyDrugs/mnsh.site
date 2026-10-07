"use client";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Resource } from "../data/resources";
import { useSound } from "@/hooks/use-sound";

interface ResourceCardProps {
    resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
    const playHover = useSound("/sounds/hover.wav");
    const playTap = useSound("/sounds/tap.wav");

    return (
        <Link
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={playHover}
            onClick={playTap}
            className={cn(
                "group relative flex items-stretch justify-start gap-0 transition-colors hover:bg-muted/30 bg-background",
                "h-16"
            )}
        >
            {/* Left Side: Icon Square Box */}
            <div className="w-16 shrink-0 aspect-square flex items-center justify-center border-r border-dashed border-edge bg-muted/5">
                {resource.image ? (
                    <div className="relative size-8">
                        <Image
                            src={resource.image}
                            alt={resource.name}
                            fill
                            sizes="32px"
                            className={cn(
                                "object-contain",
                                resource.invertInDark && "dark:invert"
                            )}
                        />
                    </div>
                ) : (
                    <div className="flex size-8 items-center justify-center bg-muted/50 text-muted-foreground">
                        <span className="text-xs font-medium">{resource.name[0]}</span>
                    </div>
                )}
            </div>

            {/* Title and Description */}
            <div className="flex flex-col justify-center gap-1 min-w-0 flex-1 px-4 py-2">
                <h3 className="text-base font-medium leading-none tracking-tight group-hover:text-foreground transition-colors truncate">
                    {resource.name}
                </h3>
                <p className="text-sm text-muted-foreground/80 line-clamp-1">
                    {resource.description}
                </p>
            </div>
        </Link>
    );
}
