"use client";

import { useEffect, useState } from "react";
import type { TOCItemType } from "fumadocs-core/toc";
import { cn } from "@/lib/utils";
import { ListIcon, XIcon } from "lucide-react";
import { useAtom } from "jotai";
import { isGalleryExpandedAtom } from "@/store/ui-store";
import { useSound } from "@/hooks/use-sound";
import {
    getTocItemDepth,
    TOC_GUIDE_INSET,
    TOC_GUIDE_STEP,
    TocTreeGuides,
} from "@/components/toc-tree-guides";

export function FloatingTOC({ items }: { items: TOCItemType[] }) {
    const [activeId, setActiveId] = useState<string>("");
    const [isVisible, setIsVisible] = useState(false);
    const [isOpenMobile, setIsOpenMobile] = useState(false);
    const [isGalleryExpanded] = useAtom(isGalleryExpandedAtom);
    const playHover = useSound("/sounds/hover.wav");
    const playTap = useSound("/sounds/tap.wav");

    useEffect(() => {
        const handleScroll = () => {
            // Show when scrolled down past a threshold (e.g., past the main title block)
            setIsVisible(window.scrollY > 300);

            // Find the active heading
            const headingElements = items
                .map((item) => {
                    // url format is usually "#hash"
                    const id = item.url.startsWith("#") ? item.url.slice(1) : item.url;
                    return document.getElementById(id);
                })
                .filter(Boolean) as HTMLElement[];

            let currentActiveId = "";
            for (const el of headingElements) {
                const rect = el.getBoundingClientRect();
                // If the heading is above the middle of viewport, or relatively high up
                if (rect.top <= window.innerHeight * 0.4) {
                    currentActiveId = el.id;
                } else {
                    break; // Assumes headings are ordered sequentially
                }
            }

            // If nothing is explicitly active but we have scrolled, we might still be at the top or bottom
            // default to the first if we are just scrolling above the threshold
            if (!currentActiveId && headingElements.length > 0) {
                const firstRect = headingElements[0].getBoundingClientRect();
                if (firstRect.top > window.innerHeight * 0.4) {
                    currentActiveId = headingElements[0].id; // We're above the first heading
                }
            }

            setActiveId(currentActiveId || (headingElements[0]?.id ?? ""));
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [items]);

    if (!items.length) return null;

    const TocContent = ({ isMobile = false }) => (
        <div className="flex flex-col relative w-full">
            <div className="font-semibold text-sm text-foreground mb-3 xl:hidden px-2">Table of Contents</div>
            <ul className="flex flex-col text-sm text-muted-foreground relative">
                {items.map((item, index) => {
                    const depth = getTocItemDepth(item);
                    const id = item.url.startsWith("#") ? item.url.slice(1) : item.url;
                    const isActive = activeId === id;

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
                                    isActive
                                        ? "text-blue-500 dark:text-blue-400 font-medium"
                                        : depth === 0 ? "font-medium text-foreground/90" : "text-muted-foreground"
                                )}
                                href={item.url}
                                onMouseEnter={playHover}
                                onClick={() => {
                                    playTap();
                                    if (isMobile) setIsOpenMobile(false);
                                }}
                            >
                                {item.title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    return (
        <>
            {/* Desktop View (xl and up) */}
            <div
                className={cn(
                    "fixed right-4 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-out flex items-center group/toc hidden xl:flex",
                    isVisible && !isGalleryExpanded
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-8 pointer-events-none"
                )}
            >
                {/* We use 'pr-4' to bridge the hover gap between the lines and the dialog card securely */}
                <div className="absolute right-full opacity-0 pointer-events-none group-hover/toc:opacity-100 group-hover/toc:pointer-events-auto transition-all duration-300 translate-x-2 group-hover/toc:translate-x-0 pr-4">
                    <div className="bg-background border border-border p-5 shadow-xl shadow-black/5 dark:shadow-black/40 min-w-[260px] max-w-[320px] max-h-[70vh] overflow-y-auto w-max scrollbar-thin scrollbar-thumb-muted">
                        <TocContent />
                    </div>
                </div>

                {/* The visible small lines indicators aligned to the right */}
                <div className="flex flex-col items-end gap-2.5 p-2 py-4 relative cursor-crosshair">
                    {items.map((item) => {
                        const id = item.url.startsWith("#") ? item.url.slice(1) : item.url;
                        const isActive = activeId === id;
                        return (
                            <a
                                key={item.url}
                                href={item.url}
                                className="py-1 flex items-center justify-end w-8 group/line"
                                aria-label={typeof item.title === "string" ? item.title : "Table of contents item"}
                                onMouseEnter={playHover}
                                onClick={playTap}
                            >
                                <div
                                    className={cn(
                                        "h-[1.5px] rounded-full transition-all duration-300 ease-out",
                                        isActive
                                            ? "w-6 bg-foreground"
                                            : "w-3 bg-muted-foreground/40 group-hover/line:bg-muted-foreground group-hover/line:w-4 group-hover/toc:bg-muted-foreground/60"
                                    )}
                                />
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Mobile / Tablet View (below xl) */}
            <div
                className={cn(
                    "fixed top-1/2 -translate-y-1/2 right-0 z-50 transition-all duration-500 ease-out xl:hidden flex flex-row items-center",
                    (isVisible || isOpenMobile) && !isGalleryExpanded
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 translate-x-8 pointer-events-none"
                )}
            >
                {/* Popover Card */}
                <div
                    className={cn(
                        "mr-4 bg-background border border-border p-5  shadow-xl shadow-black/5 dark:shadow-black/40 w-[280px] max-w-[calc(100vw-4rem)] max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted origin-right transition-all duration-300",
                        isOpenMobile
                            ? "scale-100 opacity-100 pointer-events-auto"
                            : "scale-95 opacity-0 pointer-events-none"
                    )}
                >
                    <TocContent isMobile={true} />
                </div>

                {/* Floating Action Button attached to edge */}
                <button
                    onClick={() => {
                        playTap();
                        setIsOpenMobile(!isOpenMobile);
                    }}
                    onMouseEnter={playHover}
                    aria-label="Table of Contents"
                    className={cn(
                        "w-10 h-10 flex items-center justify-center shadow-md transition-colors border border-r-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        isOpenMobile
                            ? "bg-foreground text-background border-transparent"
                            : "bg-background text-foreground border-border hover:bg-accent"
                    )}
                >
                    {isOpenMobile ? <XIcon className="size-4" /> : <ListIcon className="size-4" />}
                </button>
            </div>
        </>
    );
}
