import { useCallback, useRef } from "react";
import { useAtomValue } from "jotai";
import { isSoundEnabledAtom } from "@/store/sound-store";

// Global cache for audio buffers to avoid redundant fetches and decoding
const bufferCache = new Map<string, AudioBuffer>();
const pendingLoads = new Map<string, Promise<AudioBuffer>>();
// Global audio context shared across all hook instances to avoid hitting browser limits
let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext() {
    if (typeof window === "undefined") return null;
    if (!sharedAudioCtx) {
        const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

        if (AudioContextClass) {
            sharedAudioCtx = new AudioContextClass();
        }
    }
    return sharedAudioCtx;
}

function loadBuffer(url: string, audioCtx: AudioContext) {
    if (bufferCache.has(url)) {
        return Promise.resolve(bufferCache.get(url)!);
    }

    if (pendingLoads.has(url)) {
        return pendingLoads.get(url)!;
    }

    const loadPromise = fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => audioCtx.decodeAudioData(data))
        .then((decoded) => {
            bufferCache.set(url, decoded);
            pendingLoads.delete(url);
            return decoded;
        })
        .catch((err) => {
            pendingLoads.delete(url);
            throw err;
        });

    pendingLoads.set(url, loadPromise);
    return loadPromise;
}

const DEFAULT_VOLUMES: Record<string, number> = {
    "/sounds/hover.wav": 0.1,
    "/sounds/tap.wav": 0.18,
    "/sounds/copy.wav": 0.2,
    "/sounds/woosh.wav": 0.15,
    "/sounds/menu-open.wav": 0.18,
    "/sounds/sucess.wav": 0.2,
    "/sounds/intro.wav": 0.18,
};

export interface UseSoundOptions {
    volume?: number;
}

/**
 * Custom React hook to load and play a sound from a given URL using a shared Web Audio API context.
 */
export function useSound(url: string, options?: UseSoundOptions) {
    const isSoundEnabled = useAtomValue(isSoundEnabledAtom);
    const bufferRef = useRef<AudioBuffer | null>(bufferCache.get(url) || null);
    const customVolume = options?.volume;

    const play = useCallback(
        async (playOptions?: { volume?: number } | unknown) => {
            if (!isSoundEnabled) return;

            const audioCtx = getSharedAudioContext();
            if (!audioCtx) return;

            // Resume context if suspended (browser autoplay policy)
            if (audioCtx.state === "suspended") {
                await audioCtx.resume();
            }

            let buffer = bufferRef.current;
            if (!buffer) {
                try {
                    buffer = await loadBuffer(url, audioCtx);
                    bufferRef.current = buffer;
                } catch (err) {
                    console.warn(`Failed to load sound from ${url}:`, err);
                    return;
                }
            }

            const source = audioCtx.createBufferSource();
            source.buffer = buffer;

            const gainNode = audioCtx.createGain();
            const optionVolume =
                typeof playOptions === "object" &&
                playOptions !== null &&
                "volume" in playOptions &&
                typeof (playOptions as { volume?: number }).volume === "number"
                    ? (playOptions as { volume: number }).volume
                    : undefined;

            const targetVolume =
                optionVolume ??
                customVolume ??
                DEFAULT_VOLUMES[url] ??
                0.18;

            gainNode.gain.setValueAtTime(targetVolume, audioCtx.currentTime);

            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            source.start(0);
        },
        [isSoundEnabled, url, customVolume]
    );

    return play;
}
