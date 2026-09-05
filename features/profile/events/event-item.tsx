import { ArrowUpRight } from "@phosphor-icons/react";
import Image from "next/image";
import { Event } from "../types/events";
import { cn } from "@/lib/utils";
import { YoutubePlaylistPlayer } from "./youtube-player";

const SOCIAL_CAPTIONS: Record<string, string> = {
    twitter: "Thoughts, updates, and quick takes",
    linkedin: "Career journey and professional updates",
    github: "Open-source work and shipped code",
    youtube: "Build logs, demos, and experiments",
};

export function EventItem({
    event,
    className,
}: {
    event: Event;
    className?: string;
}) {
    const hasBackgroundImage = !!event.backgroundImage;
    const showInlineImage = event.showImage !== false && event.image;
    const isSocial = event.category === "Social";

    if (isSocial && event.showImageFullSize) {
        return (
            <div
                className={cn(
                    "group/event relative flex h-full w-full items-center gap-3.5 px-4 py-2 overflow-hidden select-none",
                    event.link && "cursor-pointer",
                    event.backgroundColor || "bg-white",
                    className
                )}
                onClick={() => {
                    if (event.link) {
                        window.open(event.link, "_blank");
                    }
                }}
            >
                {/* Left: Logo */}
                <div className="relative shrink-0 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center">
                    <img
                        src={event.backgroundImage!}
                        alt={event.title}
                        className={cn(
                            "w-full h-full object-contain p-0.5",
                            "grayscale transition-all duration-300 group-hover/event:grayscale-0"
                        )}
                    />
                </div>
                {/* Right: Username */}
                <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold leading-none mb-1">
                        {event.title}
                    </span>
                    <span className="text-xs md:text-sm font-bold truncate text-zinc-900 leading-tight">
                        {event.username || event.tagline || event.title}
                    </span>
                </div>
                {/* Subtle external arrow indicator on hover */}
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 z-20 opacity-0 transition-all duration-300 group-hover/event:opacity-100 group-hover/event:translate-x-1">
                    <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "group/event relative flex h-full w-full flex-col overflow-hidden",
                event.link && "cursor-pointer",
                !hasBackgroundImage && !event.backgroundColor && "bg-card",
                event.backgroundColor,
                className
            )}
            style={
                event.category === "Video"
                    ? { aspectRatio: event.aspectRatio || "16/9" }
                    : undefined
            }
            onClick={() => {
                if (event.link) {
                    window.open(event.link, "_blank");
                }
            }}
        >
            {/* Background Image (The Main Visual) */}
            {hasBackgroundImage && (!isSocial || event.showImageFullSize) && (
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <img
                        src={event.backgroundImage!}
                        alt=""
                        className={cn(
                            "w-full h-full grayscale transition-all duration-300 group-hover/event:grayscale-0",
                            event.showImageFullSize ? "object-contain p-2" : "object-cover"
                        )}
                    />
                </div>
            )}

            {/* Social Card Visual System: background logo + blur + centered logo */}
            {isSocial && hasBackgroundImage && !event.showImageFullSize && (
                <>
                    <div className="absolute inset-0 z-0" style={{ filter: 'blur(25px)' }}>
                        <Image
                            src={event.backgroundImage!}
                            alt=""
                            fill
                            sizes="256px"
                            className="object-cover scale-[1.1] opacity-95 transition-transform duration-500 group-hover/event:scale-[1.14]"
                        />
                    </div>
                    <div className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-3 md:p-4">
                        <div className="relative aspect-square w-full max-w-[72%] md:max-w-[68%]">
                            <Image
                                src={event.backgroundImage!}
                                alt={event.title}
                                fill
                                sizes="(max-width: 768px) 50vw, 200px"
                                className="object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover/event:scale-[1.03]"
                            />
                        </div>
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-black/65 to-transparent" />
                </>
            )}

            {/* Background YouTube Video */}
            {event.youtubeVideoIds && event.youtubeVideoIds.length > 0 && (
                <div className="absolute inset-0 z-50 overflow-hidden pointer-events-auto bg-black flex items-center justify-center">
                    <YoutubePlaylistPlayer videoIds={event.youtubeVideoIds} className="absolute inset-0" />
                </div>
            )}
            
            {/* Legacy Background YouTube Video component backward compatibility */}
            {!event.youtubeVideoIds && event.youtubeVideoId && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black flex items-center justify-center">
                    <div className="w-[105%] h-[105%] relative pointer-events-none">
                        <iframe
                            src={`https://www.youtube.com/embed/${event.youtubeVideoId}?autoplay=0&mute=1&controls=0&loop=1&playlist=${event.youtubeVideoId}&playsinline=1&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3`}
                            title={event.title}
                            className="absolute inset-0 w-full h-full border-0 outline-none opacity-95 pointer-events-none"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                </div>
            )}

            {/* Inline Image Section (optional) */}
            {showInlineImage && (
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                        src={event.image!}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
            )}

            {/* Content Section */}
            <div className={cn(
                "relative z-10 flex flex-1 flex-col gap-2 p-3 md:gap-3 md:p-4",
                event.size === 'xxs' && "p-1 md:p-1.5",
                !showInlineImage && "pt-3 md:pt-4",
                event.size === 'xxs' && !showInlineImage && "pt-1 md:pt-1.5",
                isSocial && "justify-end p-2.5 md:p-3"
            )}>

                {/* Title */}
                <h3 className={cn(
                    "absolute top-2 left-2 z-20 font-sans text-[10px] font-bold uppercase tracking-wider text-white px-1",
                    // Respect property and hide on mobile
                    (event.showTitle === false || event.size === 'xxs') ? "hidden" : "hidden md:block",
                    // Smooth transition
                    "transition-all duration-300 ease-out",
                    // Desktop: show on hover
                    "md:opacity-0 md:-translate-y-1",
                    "md:group-hover/event:opacity-100 md:group-hover/event:translate-y-0"
                )}
                >
                    {event.title}
                </h3>

                {/* Tagline Overlay (Primarily for Socials) */}
                {isSocial ? (
                    event.showTitle !== false && (
                        <div className="relative z-20 mt-auto hidden md:block">
                            <div className="text-[9px] font-medium leading-snug text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                                {SOCIAL_CAPTIONS[event.id] || event.tagline || event.title}
                            </div>
                        </div>
                    )
                ) : (
                    <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
                        <div className="mt-auto mb-2 md:mb-3">
                            {event.tagline && (
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg",
                                    "text-[10px] md:text-xs font-bold text-white tracking-tight animate-in fade-in slide-in-from-bottom-2"
                                )}>
                                    {event.tagline}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Legacy Description logic for non-socials */}
                {!isSocial && (
                    <div className="flex flex-1 flex-col justify-end">
                        {event.description && (
                            <p className={cn(
                                "text-xs md:text-sm line-clamp-2",
                                event.textColor || (hasBackgroundImage ? "text-white/80" : "text-muted-foreground")
                            )}>
                                {event.description}
                            </p>
                        )}
                    </div>
                )}

            </div>

            {isSocial && (
                <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
                    <svg
                        className="absolute right-2 top-2 h-5 w-5 text-white/55 transition-transform duration-300 group-hover/event:translate-x-0.5 group-hover/event:-translate-y-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path
                            d="M7 17L17 7M10 7h7v7"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}

            {/* Glassmorphic Action Button - Bottom Left */}
            <div
                className={cn(
                    "absolute bottom-2 left-2 z-20",
                    "flex items-center justify-center",
                    "size-6 md:size-8",
                    // Hide if flag is false or on mobile
                    event.showActionButton === false ? "hidden" : "hidden md:flex",
                    // Subtle glassmorphism effect
                    "backdrop-blur-xs",
                    hasBackgroundImage
                        ? "bg-white/10 border border-white/20"
                        : "bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10",
                    // Smooth transition
                    "transition-all duration-300 ease-out",
                    // Hover states
                    "md:opacity-0 md:translate-y-2",
                    "md:group-hover/event:opacity-100 md:group-hover/event:translate-y-0"
                )}
                aria-label="View link"
            >
                <ArrowUpRight
                    className={cn(
                        "size-3 md:size-4",
                        hasBackgroundImage ? "text-white/80" : "text-foreground/70"
                    )}
                />
            </div>
        </div>
    );
}
