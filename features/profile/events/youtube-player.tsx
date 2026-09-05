"use client";

import { useEffect, useId, useMemo, useRef, useState, type MouseEvent } from "react";
import { SpeakerHigh as Volume2, SpeakerX as VolumeX, CaretLeft as ChevronLeft, CaretRight as ChevronRight, Play, Pause } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type YouTubePlayer = {
    destroy: () => void;
    loadVideoById: (videoId: string) => void;
    mute: () => void;
    pauseVideo: () => void;
    playVideo: () => void;
    unMute: () => void;
};

type YouTubePlayerReadyEvent = {
    target: YouTubePlayer;
};

type YouTubePlayerStateChangeEvent = YouTubePlayerReadyEvent & {
    data: number;
};

type YouTubeApi = {
    Player: new (
        elementId: string,
        config: {
            videoId: string;
            playerVars: Record<string, number>;
            events?: {
                onReady?: (event: YouTubePlayerReadyEvent) => void;
                onStateChange?: (event: YouTubePlayerStateChangeEvent) => void;
            };
        }
    ) => YouTubePlayer;
    PlayerState: {
        BUFFERING: number;
        ENDED: number;
        PAUSED: number;
        PLAYING: number;
    };
};

declare global {
    interface Window {
        YT?: YouTubeApi;
        onYouTubeIframeAPIReady?: () => void;
    }
}

export function YoutubePlaylistPlayer({
    videoIds,
    className
}: {
    videoIds: string[],
    className?: string
}) {
    const rawId = useId();
    const playerId = `yt-player-${rawId.replace(/:/g, "")}`;
    const playerRef = useRef<YouTubePlayer | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);

    // Shuffle video IDs once on mount
    const shuffledVideoIds = useMemo(() => {
        const shuffled = [...videoIds];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, [videoIds]);

    // Keep track of latest values for YT event callbacks
    const currentIndexRef = useRef(currentIndex);
    const videoIdsRef = useRef(shuffledVideoIds);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    useEffect(() => {
        videoIdsRef.current = shuffledVideoIds;
    }, [shuffledVideoIds]);

    useEffect(() => {
        if (!shuffledVideoIds || shuffledVideoIds.length === 0) return;

        const initPlayer = (youtube: YouTubeApi) => {
            const playerElement = document.getElementById(playerId);
            if (!playerElement) return;

            playerRef.current = new youtube.Player(playerId, {
                videoId: shuffledVideoIds[0],
                playerVars: {
                    autoplay: 0,
                    mute: 1,
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    playsinline: 1,
                    disablekb: 1,
                    iv_load_policy: 3
                },
                events: {
                    onStateChange: (event: YouTubePlayerStateChangeEvent) => {
                        if (event.data === youtube.PlayerState.ENDED) {
                            setIsPlaying(false);
                            setIsSwitching(true);
                            const next = (currentIndexRef.current + 1) % videoIdsRef.current.length;
                            setCurrentIndex(next);
                            event.target.loadVideoById(videoIdsRef.current[next]);
                        } else if (event.data === youtube.PlayerState.PLAYING) {
                            setIsPlaying(true);
                            setHasStarted(true);
                            setIsSwitching(false);
                        } else if (event.data === youtube.PlayerState.PAUSED) {
                            setIsPlaying(false);
                        }
                    }
                }
            });
        };

        const loadYT = () => {
            if (window.YT?.Player) {
                initPlayer(window.YT);
            } else {
                if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
                    const script = document.createElement('script');
                    script.src = "https://www.youtube.com/iframe_api";
                    document.body.appendChild(script);
                }

                const oldReady = window.onYouTubeIframeAPIReady;
                window.onYouTubeIframeAPIReady = () => {
                    if (oldReady) oldReady();
                    if (window.YT) {
                        initPlayer(window.YT);
                    }
                };
            }
        };

        loadYT();

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [playerId, shuffledVideoIds]);

    const handleNext = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (!playerRef.current) return;
        const next = (currentIndex + 1) % shuffledVideoIds.length;
        setCurrentIndex(next);
        setIsPlaying(false);
        setIsSwitching(true);
        playerRef.current.loadVideoById(shuffledVideoIds[next]);
    };

    const handlePrev = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (!playerRef.current) return;
        const prev = currentIndex === 0 ? shuffledVideoIds.length - 1 : currentIndex - 1;
        setCurrentIndex(prev);
        setIsPlaying(false);
        setIsSwitching(true);
        playerRef.current.loadVideoById(shuffledVideoIds[prev]);
    };

    const toggleMute = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (!playerRef.current) return;
        if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    };

    const togglePlay = (e?: MouseEvent<HTMLElement>) => {
        if (e) e.stopPropagation();
        if (!playerRef.current) return;

        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    return (
        <div className={cn("relative w-full h-full bg-black overflow-hidden", className)}>

            {/* YouTube Iframe Wrapper */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0">
                <div className="w-[105%] h-[105%] relative pointer-events-none">
                    <div id={playerId} className="absolute inset-0 w-full h-full border-0 outline-none" />
                </div>
            </div>

            {/* Invisible Click/Hover Shield */}
            <div
                className="absolute inset-0 z-10 bg-transparent pointer-events-auto cursor-pointer"
                onClick={() => hasStarted && togglePlay()}
            />

            {/* Hover UI overlay */}
            <div className="absolute inset-0 z-30 pointer-events-none p-2 flex flex-col justify-between">

                {/* Top bar logic */}
                <div className="flex justify-end opacity-0 group-hover/event:opacity-100 transition-opacity duration-300">
                    <span className="backdrop-blur-sm bg-black/40 text-white/90 text-xs font-mono px-2 py-1 rounded-none border border-white/10 uppercase tracking-widest shadow-lg">
                        {currentIndex + 1} / {shuffledVideoIds.length}
                    </span>
                </div>

                {/* Center controls (Prev/Next) */}
                <div className="flex items-center justify-between opacity-0 group-hover/event:opacity-100 transition-opacity duration-300 pointer-events-auto">
                    <button
                        onClick={handlePrev}
                        className="bg-black/40 backdrop-blur-md rounded-none p-2 border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg hidden md:block"
                    >
                        <ChevronLeft className="size-5" />
                    </button>

                    <div />

                    <button
                        onClick={handleNext}
                        className="bg-black/40 backdrop-blur-md rounded-none p-2 border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg hidden md:block"
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center opacity-0 group-hover/event:opacity-100 transition-opacity duration-300 pointer-events-auto w-full">
                    <button
                        onClick={handlePrev}
                        className="bg-black/40 backdrop-blur-md rounded-none p-2 border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg md:hidden mr-3 shrink-0"
                    >
                        <ChevronLeft className="size-4" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="bg-black/40 backdrop-blur-md rounded-none p-2 md:p-3 border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg mr-3 shrink-0"
                    >
                        {isPlaying ? <Pause className="size-4 md:size-5" /> : <Play className="size-4 md:size-5" />}
                    </button>

                    <button
                        onClick={toggleMute}
                        className="ml-auto bg-black/40 backdrop-blur-md rounded-none p-2 md:p-3 border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg shrink-0"
                    >
                        {isMuted ? (
                            <VolumeX className="size-4 md:size-5" />
                        ) : (
                            <Volume2 className="size-4 md:size-5" />
                        )}
                    </button>

                    <button
                        onClick={handleNext}
                        className="ml-2 bg-black/40 backdrop-blur-md rounded-none p-2 border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg md:hidden shrink-0"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>

            </div>

            {/* Initial & Pause Blur Overlay */}
            <div
                className={cn(
                    "absolute inset-0 z-[40] bg-black/40 backdrop-blur-md transition-all duration-700 flex items-end justify-end p-8",
                    (isPlaying || isSwitching) ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100 pointer-events-auto translate-y-0"
                )}
                onClick={togglePlay}
            >
                <div className="flex flex-col items-end gap-6 cursor-pointer group">
                    <div className="transition-all duration-500 group-hover:scale-110 group-hover:translate-x-[-4px]">
                        <Play className="size-12 md:size-16 fill-white text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" />
                    </div>
                    <div className="text-right space-y-2">
                        <p className="text-white/60 font-mono text-[9px] uppercase tracking-[.2em] leading-relaxed drop-shadow-md">
                            Youtube videos I like
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
