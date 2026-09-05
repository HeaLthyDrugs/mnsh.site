"use client";

import { USER, FACES } from "../data/user";
import { AnimatePresence, motion } from "framer-motion";
import { useLoop } from "@/lib/animation/useLoop";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { useState, useRef, useEffect } from "react";

const ROTATING_TEXTS = USER.flipSentences;

export default function ProfileHeader() {
    const { key } = useLoop(3000);
    const currentText = ROTATING_TEXTS[key % ROTATING_TEXTS.length];

    const [faceIndex, setFaceIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Preload all face images into browser cache immediately
        FACES.forEach((src) => {
            const img = new Image();
            img.src = src;
        });
    }, []);

    const handleFaceClick = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        }
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * FACES.length);
        } while (newIndex === faceIndex);
        setFaceIndex(newIndex);
    };

    return (
        <div className="border-b border-x border-edge">
            {/* Main header - responsive layout */}
            <div className="flex flex-col sm:flex-row">
                {/* Avatar section */}
                <div className="flex justify-start border-b border-dashed border-edge p-2 sm:justify-start sm:border-b-0 sm:border-r">
                    <audio ref={audioRef} src="/sounds/tap.wav" preload="auto" />
                    <motion.div
                        className="relative size-24 cursor-pointer overflow-hidden sm:size-29"
                        whileTap={{ scale: 0.9, rotate: Math.random() > 0.5 ? 2 : -2 }}
                        onClick={handleFaceClick}
                        initial={false}
                    >
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={faceIndex}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                }}
                                className="absolute inset-0"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={FACES[faceIndex]}
                                    alt={`${USER.displayName}'s avatar`}
                                    loading="eager"
                                    decoding="async"
                                    className="size-full select-none object-contain"
                                />
                            </motion.div>
                        </AnimatePresence>
                        {/* Decorative subtle ring that reacts to tap */}
                        <motion.div
                            className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary/20"
                            initial={{ scale: 1, opacity: 0 }}
                            whileTap={{ scale: 1.5, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                </div>

                {/* Content section - stacked vertically */}
                <div className="flex flex-1 flex-col">
                    {/* Name section */}
                    <div className="border-b border-dashed border-edge px-3 py-2">
                        <h1 className="text-xl font-heading sm:text-2xl">
                            {USER.displayName}
                        </h1>
                    </div>

                    {/* Bio section with rotating text */}
                    <div className="flex flex-col items-start gap-1 border-b border-dashed border-edge px-3 py-3 text-sm sm:flex-row sm:items-center">
                        <span className="text-muted-foreground">
                            Building & shipping
                        </span>
                        <div className="relative inline-flex h-5 overflow-hidden">
                            <AnimatePresence mode="popLayout">
                                <motion.span
                                    key={key}
                                    initial={{ opacity: 0, y: "100%" }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: "-100%" }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="whitespace-nowrap font-heading text-foreground"
                                >
                                    {currentText}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Actions & Status section - Combined Row */}
                    <div className="flex flex-col sm:flex-row">
                        {USER.currentlyBuilding && (
                            <div className="flex flex-1 items-center gap-2 overflow-hidden border-b border-dashed border-edge px-3 py-2 text-xs text-muted-foreground transition-colors sm:border-b-0 sm:border-r sm:text-sm">
                                <Status className="rounded-none" status="online">
                                    <StatusIndicator />
                                    <StatusLabel className="truncate">
                                        currently working on{" "}
                                        <a
                                            href={USER.currentlyBuilding.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-foreground hover:underline"
                                        >
                                            {USER.currentlyBuilding.name}
                                        </a>{" "}
                                        {/* {USER.currentlyBuilding.label} */}
                                    </StatusLabel>
                                </Status>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
