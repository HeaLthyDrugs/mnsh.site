// ─── Genre & Track Definitions ─────────────────────────────────────

import { Flame, Globe, type LucideIcon } from "lucide-react";

export interface Track {
    title: string;
    artist: string;
    cover: string;
    // audioSrc can be an external URL (e.g., "https://...") 
    // or a local path to a file in the public folder (e.g., "/music/song.mp3")
    // Supports various formats: .mp3, .wav, .ogg, etc.
    audioSrc: string;
}

export interface Genre {
    label: string;
    icon: LucideIcon;
    tracks: Track[];
}

export const GENRES: Genre[] = [
    {
        label: "#2",
        icon: Globe,
        tracks: [
            {
                title: "AAAHH MEN!",
                artist: "Doja Cat",
                cover: "https://assets.mnsh.site/music-covers/aahh%20men%20-%20doja%20cat.jpg",
                audioSrc: "https://assets.mnsh.site/music/Doja%20Cat%20-%20AAAHH%20MEN!%20(Audio)%20(1).mp3",
            },
            {
                title: "I Took A Pill In Ibiza",
                artist: "Mike Posner",
                cover: "https://assets.mnsh.site/music-covers/i-took-a-pill-in-ibiza.jpg",
                audioSrc: "https://assets.mnsh.site/music/Mike%20Posner%20-%20I%20Took%20A%20Pill%20In%20Ibiza%20(Seeb%20Remix)%20(Explicit)%20-%20MikePosnerVEVO.mp3",
            },
            {
                title: "Plastic Love",
                artist: "Mariya Takeuchi",
                cover: "https://assets.mnsh.site/music-covers/plastic-love.jpg",
                audioSrc: "https://assets.mnsh.site/music/%E7%AB%B9%E5%86%85%E3%81%BE%E3%82%8A%E3%82%84%20-%20%20Plastic%20Love%20(Official%20Music%20Video)%20-%20%E7%AB%B9%E5%86%85%E3%81%BE%E3%82%8A%E3%82%84%20-%20Mariya%20Takeuchi%20Official%20YouTube%20Channel.mp3",
            },
            {
                title: "TV Off",
                artist: "Kendrick Lamar",
                cover: "https://assets.mnsh.site/music-covers/tv-off-kendrick.jpg",
                audioSrc: "https://assets.mnsh.site/music/Kendrick%20Lamar%20-%20tv%20off%20(Official%20Audio)%20-%20Kendrick%20Lamar.mp3",
            },
            {
                title: "Runaway",
                artist: "Kanye West",
                cover: "https://assets.mnsh.site/music-covers/runaway-kanye-west.jpg",
                audioSrc: "https://assets.mnsh.site/music/Kanye%20West%20-%20Runaway%20(Video%20Version)%20ft.%20Pusha%20T%20-%20KanyeWestVEVO.mp3",
            },
            {
                title: "Can't Tell Me Nothing",
                artist: "Kanye West",
                cover: "https://assets.mnsh.site/music-covers/can't-tell-me-nothing-kanye-west.jpg",
                audioSrc: "https://assets.mnsh.site/music/Kanye%20West%20-%20Can't%20Tell%20Me%20Nothing%20-%20KanyeWestVEVO.mp3",
            },
            {
                title: "Baby Blue",
                artist: "Badfinger",
                cover: "https://assets.mnsh.site/music-covers/baby-blue.jpg",
                audioSrc: "https://assets.mnsh.site/music/Badfinger%20-%20Baby%20Blue%20lyrics%20video%20-%20Straight%20Up%20LP%20(1971)%20-%20Pete%20Ham.mp3",
            },
            {
                title: "Just Keep Watching",
                artist: "Tate McRae",
                cover: "https://assets.mnsh.site/music-covers/f1-just-like-that.jpg",
                audioSrc: "https://assets.mnsh.site/music/Tate%20McRae%20-%20Just%20Keep%20Watching%20(From%20F1%C2%AE%20The%20Movie)%20(Official%20Video)%20-%20Tate%20McRae.mp3",
            },
        ],
    },
    {
        label: "#1",
        icon: Flame,
        tracks: [
            {
                title: "In Dino",
                artist: "Soham Chakraborty",
                cover: "https://assets.mnsh.site/music-covers/in-dino.jpg",
                audioSrc: "https://assets.mnsh.site/music/In%20Dino.mp3",
            },
            {
                title: "Ae Nazneen Suno Na",
                artist: "Abhijeet Bhattacharya",
                cover: "https://assets.mnsh.site/music-covers/Ae%20Nazneen%20Suno%20Na.jpg",
                audioSrc: "https://assets.mnsh.site/music/Ae%20Nazneen%20Suno%20Na.mp3",
            },
            {
                title: "Doorie",
                artist: "Atif Aslam",
                cover: "https://assets.mnsh.site/music-covers/doorie.jpg",
                audioSrc: "https://assets.mnsh.site/music/Doorie.mp3",
            },
            {
                title: "Tere Nainon Mein",
                artist: "The Bilz & Kashif",
                cover: "https://assets.mnsh.site/music-covers/Tere%20Nainon%20Mein.jpg",
                audioSrc: "https://assets.mnsh.site/music/The_Bilz___Kashif_-_Tere_Nainon_Mein__SPOTISAVER_.mp3",
            },
            {
                title: "Nadaan Parinde",
                artist: "Mohit Chauhan",
                cover: "https://assets.mnsh.site/music-covers/Nadaan%20Parinde.jpg",
                audioSrc: "https://assets.mnsh.site/music/Nadaan%20Parinde.mp3",
            },
            {
                title: "Koi Jaane Na",
                artist: "Raghav Kaushik",
                cover: "https://assets.mnsh.site/music-covers/Koi%20Jaane%20Na.jpg",
                audioSrc: "https://assets.mnsh.site/music/Koi%20Jaane%20Na.mp3",
            },
        ],
    },
];
