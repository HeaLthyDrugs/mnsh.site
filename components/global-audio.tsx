"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { 
    genreIdxAtom, 
    currentTrackIdxAtom, 
    isPlayingAtom, 
    currentTimeAtom, 
    durationAtom, 
    volumeAtom, 
    isMusicMutedAtom,
    shuffledGenresAtom,
    globalAudioRef 
} from "@/store/music-store";
import { isSoundEnabledAtom } from "@/store/sound-store";
import { GENRES } from "@/features/profile/data/music";

/**
 * Modern Fisher-Yates (aka Knuth) Shuffle
 */
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function GlobalAudio() {
    const [shuffledGenres, setShuffledGenres] = useAtom(shuffledGenresAtom);
    const [genreIdx, setGenreIdx] = useAtom(genreIdxAtom);
    const [currentTrack, setCurrentTrack] = useAtom(currentTrackIdxAtom);
    const isPlaying = useAtomValue(isPlayingAtom);
    
    const [, setCurrentTime] = useAtom(currentTimeAtom);
    const [, setDuration] = useAtom(durationAtom);
    
    const volume = useAtomValue(volumeAtom);
    const isMusicMuted = useAtomValue(isMusicMutedAtom);
    const isSoundEnabled = useAtomValue(isSoundEnabledAtom);

    const hasShuffled = useRef(false);

    // One-time shuffle on mount
    useEffect(() => {
        if (hasShuffled.current) return;
        
        const shuffled = shuffleArray(GENRES).map(genre => ({
            ...genre,
            tracks: shuffleArray(genre.tracks)
        }));

        setShuffledGenres(shuffled);
        
        // Randomize initial positions
        const randomGenreIdx = Math.floor(Math.random() * shuffled.length);
        const randomTrackIdx = Math.floor(Math.random() * shuffled[randomGenreIdx].tracks.length);
        
        setGenreIdx(randomGenreIdx);
        setCurrentTrack(randomTrackIdx);
        
        hasShuffled.current = true;
    }, [setShuffledGenres, setGenreIdx, setCurrentTrack]);

    const track = shuffledGenres[genreIdx]?.tracks[currentTrack];

    useEffect(() => {
        const audio = globalAudioRef.current;
        if (!audio) return;
        
        audio.muted = isMusicMuted || !isSoundEnabled;
        audio.volume = volume;
    }, [isMusicMuted, isSoundEnabled, volume]);

    useEffect(() => {
        const audio = globalAudioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(console.error);
        } else {
            audio.pause();
        }
    }, [isPlaying, track]);

    const handleTimeUpdate = useCallback(() => {
        if (globalAudioRef.current) {
            setCurrentTime(globalAudioRef.current.currentTime);
        }
    }, [setCurrentTime]);

    const handleLoadedMetadata = useCallback(() => {
        if (globalAudioRef.current) {
            setDuration(globalAudioRef.current.duration);
        }
    }, [setDuration]);

    const handleAudioEnded = useCallback(() => {
        const currentGenre = shuffledGenres[genreIdx];
        if (!currentGenre) return;
        setCurrentTrack((p) => (p + 1) % currentGenre.tracks.length);
    }, [genreIdx, setCurrentTrack, shuffledGenres]);

    if (!track) return null;

    return (
        <audio
            ref={globalAudioRef}
            src={track.audioSrc}
            preload="none"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleAudioEnded}
            style={{ display: "none" }}
        />
    );
}
