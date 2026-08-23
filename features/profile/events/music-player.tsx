"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useAtom, useAtomValue } from "jotai";
import { 
    genreIdxAtom, currentTrackIdxAtom, isPlayingAtom, 
    currentTimeAtom, durationAtom, volumeAtom, isMusicMutedAtom, 
    shuffledGenresAtom, globalAudioRef 
} from "@/store/music-store";
import {
    Play,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Disc3,
    Maximize2,
    Minimize2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    AudioLinesIcon,
    type AudioLinesIconHandle,
} from "@/components/animated-icons/audio-lines";

// Glass style shared across buttons
const GLASS =
    "backdrop-blur-md bg-white/10 border border-white/15 hover:bg-white/20 active:scale-95 transition-all duration-300";

// ─── Component ───────────────────────────────────────────────────
export function MusicPlayer({ className }: { className?: string }) {
    const [genreIdx, setGenreIdx] = useAtom(genreIdxAtom);
    const [currentTrack, setCurrentTrack] = useAtom(currentTrackIdxAtom);
    const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
    const currentTime = useAtomValue(currentTimeAtom);
    const duration = useAtomValue(durationAtom);
    const [volume, setVolume] = useAtom(volumeAtom);
    const [isMuted, setIsMuted] = useAtom(isMusicMutedAtom);
    const [volumeOpen, setVolumeOpen] = useState(false);
    const [genreOpen, setGenreOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [mounted, setMounted] = useState(false);

    const audioLinesRef = useRef<AudioLinesIconHandle>(null);
    const shortcutsTimerRef = useRef<NodeJS.Timeout | null>(null);

    const [shuffledGenres] = useAtom(shuffledGenresAtom);
    const genre = shuffledGenres[genreIdx];
    const track = genre.tracks[currentTrack];

    useEffect(() => {
        setMounted(true);
    }, []);

    // Mouse movement / activity detection in fullscreen mode to smoothly show/fade shortcuts
    useEffect(() => {
        if (!isFullscreen) {
            setShowShortcuts(false);
            if (shortcutsTimerRef.current) clearTimeout(shortcutsTimerRef.current);
            return;
        }

        const handleActivity = () => {
            setShowShortcuts(true);
            if (shortcutsTimerRef.current) {
                clearTimeout(shortcutsTimerRef.current);
            }
            shortcutsTimerRef.current = setTimeout(() => {
                setShowShortcuts(false);
            }, 2500);
        };

        // Show briefly on entering fullscreen
        handleActivity();

        window.addEventListener("mousemove", handleActivity);
        return () => {
            window.removeEventListener("mousemove", handleActivity);
            if (shortcutsTimerRef.current) {
                clearTimeout(shortcutsTimerRef.current);
            }
        };
    }, [isFullscreen]);

    // Handle ESC key, keyboard controls and scroll locking in fullscreen mode
    useEffect(() => {
        if (!isFullscreen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const active = document.activeElement;
            if (
                active &&
                (active.tagName === "INPUT" ||
                    active.tagName === "TEXTAREA" ||
                    active.getAttribute("contenteditable") === "true")
            ) {
                return;
            }

            switch (e.key) {
                case "Escape":
                    setIsFullscreen(false);
                    break;
                case " ":
                    e.preventDefault();
                    setIsPlaying((p) => !p);
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    setCurrentTrack((p) => (p - 1 + genre.tracks.length) % genre.tracks.length);
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    setCurrentTrack((p) => (p + 1) % genre.tracks.length);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setVolume((v) => {
                        const nv = Math.min(1, v + 0.1);
                        if (nv > 0) setIsMuted(false);
                        return nv;
                    });
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    setVolume((v) => Math.max(0, v - 0.1));
                    break;
                case "m":
                case "M":
                    e.preventDefault();
                    setIsMuted((m) => !m);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [isFullscreen, genre.tracks.length, setIsPlaying, setCurrentTrack, setVolume, setIsMuted]);

    // Control AudioLines animation based on play state
    useEffect(() => {
        if (isPlaying) {
            audioLinesRef.current?.startAnimation();
        } else {
            audioLinesRef.current?.stopAnimation();
        }
    }, [isPlaying]);

    const handlePlayPause = useCallback(() => setIsPlaying((p) => !p), [setIsPlaying]);

    const handleNext = useCallback(() => {
        setCurrentTrack((p) => (p + 1) % genre.tracks.length);
    }, [genre.tracks.length, setCurrentTrack]);

    const handlePrev = useCallback(() => {
        setCurrentTrack((p) => (p - 1 + genre.tracks.length) % genre.tracks.length);
    }, [genre.tracks.length, setCurrentTrack]);

    const handleGenreChange = useCallback((idx: number) => {
        setGenreIdx(idx);
        setCurrentTrack(0);
        setGenreOpen(false);
    }, [setCurrentTrack, setGenreIdx]);

    const handleProgressClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!globalAudioRef.current || duration === 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            globalAudioRef.current.currentTime = pct * duration;
        },
        [duration]
    );

    const handleVolumeChange = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            // Calculate percentage from bottom to top
            const pct = 1 - (e.clientY - rect.top) / rect.height;
            const newVol = Math.max(0, Math.min(1, pct));
            setVolume(newVol);
            if (newVol > 0 && isMuted) setIsMuted(false);
        },
        [isMuted, setIsMuted, setVolume]
    );

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds) || !isFinite(timeInSeconds)) return "0:00";
        const m = Math.floor(timeInSeconds / 60);
        const s = Math.floor(timeInSeconds % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    const playerContent = (
        <div
            className={cn(
                "group/player relative select-none overflow-hidden transition-all duration-300",
                isFullscreen
                    ? "fixed inset-0 z-[100] w-screen h-screen bg-neutral-950 flex flex-col justify-between"
                    : cn("h-full w-full", className)
            )}
        >
            {/* ── Background Blurred Art ───────────── */}
            <div className="absolute inset-0 z-0 bg-neutral-900 shadow-2xl overflow-hidden">
                <AnimatePresence>
                    <motion.div
                        key={`bg-${genreIdx}-${currentTrack}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={track.cover}
                            alt={`${track.title} background`}
                            fill
                            className={cn(
                                "object-cover blur-[25px] scale-125 opacity-70",
                            )}
                        />
                    </motion.div>
                </AnimatePresence>
                {/* Dark overlay for contrast - lighter to show colors */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* ── Center Sharp Album Art (Square, Zero rounding) ───────────── */}
            <div
                className={cn(
                    "absolute inset-x-0 flex items-center justify-center z-10 pointer-events-none transition-all duration-300",
                    isFullscreen ? "top-14 bottom-[150px]" : "top-10 bottom-[120px]"
                )}
            >
                <div
                    className={cn(
                        "relative w-3/5 aspect-square shadow-2xl overflow-hidden bg-black/20 transition-all duration-300",
                        isFullscreen ? "max-w-[320px] md:max-w-[420px]" : "max-w-[200px]"
                    )}
                >
                    <AnimatePresence>
                        <motion.div
                            key={`cover-${genreIdx}-${currentTrack}`}
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={track.cover}
                                alt={track.title}
                                fill
                                className={cn(
                                    "object-cover rounded-none",
                                    "group-hover/player:scale-105 transition-transform duration-700"
                                )}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Track Info Inside Cover Art */}
                    <div className="absolute inset-x-0 bottom-0 p-2.5 pt-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <div className="space-y-0.5 overflow-hidden">
                            <h4
                                key={`title-${genreIdx}-${currentTrack}`}
                                className={cn(
                                    "text-white font-semibold truncate leading-tight drop-shadow-sm",
                                    isFullscreen ? "text-sm md:text-base" : "text-[11px]",
                                    "animate-[slideUp_0.35s_ease-out]"
                                )}
                            >
                                {track.title}
                            </h4>
                            <p
                                key={`artist-${genreIdx}-${currentTrack}`}
                                className={cn(
                                    "text-white/60 truncate drop-shadow-sm",
                                    isFullscreen ? "text-xs md:text-sm" : "text-[9px]",
                                    "animate-[slideUp_0.4s_ease-out]"
                                )}
                            >
                                {track.artist}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Top-Left Keyboard Shortcuts Column (Fullscreen only, auto-fading on cursor idle) ───── */}
            <AnimatePresence>
                {isFullscreen && showShortcuts && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="absolute top-3.5 left-4 z-30 pointer-events-none hidden md:flex flex-col gap-1.5 p-2.5 rounded-lg bg-black/25 backdrop-blur-md border border-white/10 shadow-2xl text-[10px] text-white/50 font-sans tracking-wide"
                    >
                        <div className="flex items-center gap-2.5">
                            <kbd className="inline-flex items-center justify-center min-w-[38px] px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white/75 text-[9px] font-mono shadow-sm">
                                Space
                            </kbd>
                            <span>Play / Pause</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="inline-flex items-center justify-center gap-0.5 min-w-[38px]">
                                <kbd className="inline-flex items-center justify-center w-[17px] py-0.5 rounded bg-white/10 border border-white/10 text-white/75 text-[9px] font-mono shadow-sm">
                                    ←
                                </kbd>
                                <kbd className="inline-flex items-center justify-center w-[17px] py-0.5 rounded bg-white/10 border border-white/10 text-white/75 text-[9px] font-mono shadow-sm">
                                    →
                                </kbd>
                            </div>
                            <span>Prev / Next track</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="inline-flex items-center justify-center gap-0.5 min-w-[38px]">
                                <kbd className="inline-flex items-center justify-center w-[17px] py-0.5 rounded bg-white/10 border border-white/10 text-white/75 text-[9px] font-mono shadow-sm">
                                    ↑
                                </kbd>
                                <kbd className="inline-flex items-center justify-center w-[17px] py-0.5 rounded bg-white/10 border border-white/10 text-white/75 text-[9px] font-mono shadow-sm">
                                    ↓
                                </kbd>
                            </div>
                            <span>Volume</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <kbd className="inline-flex items-center justify-center min-w-[38px] px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white/75 text-[9px] font-mono shadow-sm">
                                M
                            </kbd>
                            <span>Mute / Unmute</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <kbd className="inline-flex items-center justify-center min-w-[38px] px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white/75 text-[9px] font-mono shadow-sm">
                                Esc
                            </kbd>
                            <span>Exit fullscreen</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Track indicator dots — top */}
            <div className="absolute top-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                {genre.tracks.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentTrack(i)}
                        className={cn(
                            "h-1 bg-white transition-all duration-500 ease-out",
                            i === currentTrack
                                ? "w-5 opacity-90"
                                : "w-1.5 opacity-30 hover:opacity-60"
                        )}
                    />
                ))}
            </div>

            {/* Fullscreen toggle button — top right */}
            <button
                onClick={() => setIsFullscreen((prev) => !prev)}
                className={cn(
                    "absolute top-3 right-3 z-30 flex items-center justify-center size-8 text-white/70 hover:text-white transition-colors cursor-pointer",
                    GLASS
                )}
                aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
                title={isFullscreen ? "Exit full screen (Esc)" : "Full screen"}
            >
                {isFullscreen ? (
                    <Minimize2 className="size-3.5" />
                ) : (
                    <Maximize2 className="size-3.5" />
                )}
            </button>

            {/* ── Progressive blur overlay — bottom ───────────── */}
            <div
                className="absolute inset-x-0 bottom-0 h-[70%] z-10 pointer-events-none"
                style={{
                    backdropFilter: "blur(2px)",
                    WebkitBackdropFilter: "blur(2px)",
                    maskImage: "linear-gradient(to top, black 0%, transparent 60%)",
                    WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 60%)",
                }}
            />
            <div
                className="absolute inset-x-0 bottom-0 h-[55%] z-10 pointer-events-none"
                style={{
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    maskImage: "linear-gradient(to top, black 0%, transparent 70%)",
                    WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 70%)",
                }}
            />
            <div
                className="absolute inset-x-0 bottom-0 h-[45%] z-10 pointer-events-none"
                style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    maskImage: "linear-gradient(to top, black 0%, black 30%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to top, black 0%, black 30%, transparent 100%)",
                }}
            />
            <div
                className="absolute inset-x-0 bottom-0 h-[50%] z-10 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                }}
            />

            {/* ── Controls — overlaid at bottom ───────────────── */}
            <div
                className={cn(
                    "absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 transition-all duration-300",
                    isFullscreen ? "max-w-3xl mx-auto px-6 md:px-10 pb-8 pt-6" : "px-4 pb-3.5 pt-6"
                )}
            >
                {/* Progress / Seek Bar — glass effect */}
                <div className="space-y-1">
                    <div
                        className={cn(
                            "w-full cursor-pointer group/progress relative overflow-hidden",
                            "bg-white/10 backdrop-blur-sm border border-white/10",
                            isFullscreen ? "h-[6px]" : "h-[5px]"
                        )}
                        onClick={handleProgressClick}
                    >
                        {/* Glow behind fill */}
                        <div
                            className="absolute h-full opacity-40 blur-[4px] bg-white"
                            style={{ width: `${progressPercent}%` }}
                        />
                        {/* Fill */}
                        <div
                            className="h-full relative transition-[width] duration-100 ease-linear bg-white/80"
                            style={{ width: `${progressPercent}%` }}
                        >
                            {/* Scrubber */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white opacity-0 group-hover/progress:opacity-100 transition-all duration-200 scale-0 group-hover/progress:scale-100 shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-white/30 font-sans tabular-nums">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Transport Controls — all glass */}
                <div className="flex items-center justify-between">
                    {/* Volume — Container */}
                    <div
                        className="relative flex items-end justify-center group/volume z-50 size-8"
                        onMouseEnter={() => setVolumeOpen(true)}
                        onMouseLeave={() => setVolumeOpen(false)}
                        onClick={() => setVolumeOpen(!volumeOpen)}
                    >
                        {/* The Volume Button and Expanding Track background */}
                        <div
                            className={cn(
                                "absolute bottom-0 flex flex-col items-center justify-end w-8 rounded-none overflow-hidden transition-all duration-300 origin-bottom",
                                GLASS,
                                volumeOpen ? "h-32 bg-white/20 border-white/30 backdrop-blur-xl shadow-lg" : "h-8"
                            )}
                        >
                            {/* The Volume Slider Track (only visible when open) */}
                            <div
                                className={cn(
                                    "absolute top-3 w-1.5 bottom-11 bg-black/40 rounded-none cursor-pointer transition-opacity duration-300",
                                    volumeOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation(); // Don't close the slider when adjusting volume
                                    handleVolumeChange(e);
                                }}
                            >
                                {/* Volume Fill */}
                                <div
                                    className="absolute bottom-0 w-full bg-white rounded-none pointer-events-none transition-all duration-100"
                                    style={{ height: `${volume * 100}%` }}
                                >
                                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                </div>
                            </div>

                            {/* The actually clickable icon button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMuted(!isMuted);
                                }}
                                className={cn(
                                    "relative flex items-center justify-center min-h-8 w-8 text-white/70 hover:text-white transition-colors z-10 shrink-0",
                                    isMuted ? "opacity-80" : "opacity-100"
                                )}
                                aria-label={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted || volume === 0 ? (
                                    <VolumeX className="size-3.5" />
                                ) : (
                                    <Volume2 className="size-3.5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Center transport */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrev}
                            className="text-white/60 cursor-pointer hover:text-white transition-all duration-300 active:scale-90"
                            aria-label="Previous track"
                        >
                            <SkipBack className="size-4" fill="currentColor" />
                        </button>

                        {/* Play / Pause — glass */}
                        <button
                            onClick={handlePlayPause}
                            className={cn(
                                "relative flex items-center justify-center cursor-pointer",
                                "w-10 h-10 text-white",
                                GLASS
                            )}
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {/* AudioLines — always mounted, toggled via opacity */}
                            <span
                                className={cn(
                                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                                    isPlaying ? "opacity-100 scale-100" : "opacity-0 scale-75"
                                )}
                            >
                                <AudioLinesIcon ref={audioLinesRef} size={18} />
                            </span>
                            {/* Play icon */}
                            <span
                                className={cn(
                                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                                    isPlaying ? "opacity-0 scale-75" : "opacity-100 scale-100"
                                )}
                            >
                                <Play className="size-4 ml-0.5" fill="currentColor" />
                            </span>
                        </button>

                        <button
                            onClick={handleNext}
                            className="text-white/60 cursor-pointer hover:text-white transition-all duration-300 active:scale-90"
                            aria-label="Next track"
                        >
                            <SkipForward className="size-4" fill="currentColor" />
                        </button>
                    </div>

                    {/* Genre — Expanding Container */}
                    <div
                        className="relative flex items-end justify-end group/genre z-50 size-8"
                        onMouseEnter={() => setGenreOpen(true)}
                        onMouseLeave={() => setGenreOpen(false)}
                        onClick={() => setGenreOpen(!genreOpen)}
                    >
                        {/* The expanded track background */}
                        <div
                            className={cn(
                                "absolute bottom-0 right-0 rounded-none overflow-hidden transition-all duration-300 origin-bottom-right",
                                GLASS,
                                genreOpen ? "w-[160px] bg-white/20 border-white/30 backdrop-blur-xl shadow-lg" : "w-8 h-8"
                            )}
                            style={{ height: genreOpen ? `${shuffledGenres.length * 32}px` : '32px' }}
                        >
                            {/* Genere Selectors (only visible when open) */}
                            <div
                                className={cn(
                                    "absolute top-0 left-0 w-full flex flex-col transition-opacity duration-300",
                                    genreOpen ? "opacity-100 delay-100" : "opacity-0 pointer-events-none"
                                )}
                            >
                                {shuffledGenres.map((g, i) => {
                                    const Icon = g.icon;
                                    return (
                                        <button
                                            key={g.label}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleGenreChange(i);
                                            }}
                                            className={cn(
                                                "flex items-center gap-2.5 w-full h-8 pl-3 pr-8 text-left",
                                                "transition-colors duration-200 hover:bg-white/10",
                                                i === genreIdx
                                                    ? "text-white bg-white/10"
                                                    : "text-white/60 hover:text-white"
                                            )}
                                        >
                                            <Icon className="size-3.5 shrink-0" />
                                            <span className="text-[11px] font-medium tracking-wide truncate">{g.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* The actually clickable icon button - fixed at bottom right */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setGenreOpen(!genreOpen);
                                }}
                                className="absolute bottom-0 right-0 flex items-center justify-center min-h-8 min-w-8 text-white/70 hover:text-white transition-colors z-10 shrink-0"
                                aria-label="Change genre"
                            >
                                <Disc3
                                    className={cn(
                                        "size-3.5 transition-transform duration-700",
                                        isPlaying && !genreOpen && "animate-[spin_3s_linear_infinite]",
                                        genreOpen && "scale-110 text-white"
                                    )}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Inline keyframes ────────────────────────────── */}
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(6px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );

    if (isFullscreen && mounted) {
        return (
            <>
                <div className={cn("h-full w-full opacity-0 pointer-events-none", className)} />
                {createPortal(playerContent, document.body)}
            </>
        );
    }

    return playerContent;
}

