"use client";

import Link from "next/link";
import Image from "next/image";
import { USER } from "../data/user";
import { cn } from "@/lib/utils";
import { BriefcaseIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useLoop } from "@/lib/animation/useLoop";
import { MessageCircleMoreIcon } from "@/components/animated-icons/message-circle-more";
import { MailCheckIcon } from "@/components/ui/mail-check";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { useState, useRef } from "react";

const FACES = [
    "https://assets.mnsh.online/icons/faces/my-notion-face-transparent%20(1).png",
    "https://assets.mnsh.online/icons/faces/my-notion-face-transparent%20(2).png",
    "https://assets.mnsh.online/icons/faces/my-notion-face-transparent%20(3).png",
    "https://assets.mnsh.online/icons/faces/my-notion-face-transparent%20(4).png",
    "https://assets.mnsh.online/icons/faces/my-notion-face-transparent%20(5).png",
    "https://assets.mnsh.online/icons/faces/my-notion-face-transparent%20(6).png",
    "https://assets.mnsh.online/icons/faces/my-notion-face-transparent%20(7).png",
];

const ROTATING_TEXTS = USER.flipSentences;

export default function ProfileHeader() {
    const { key } = useLoop(3000);
    const currentText = ROTATING_TEXTS[key % ROTATING_TEXTS.length];

    const [faceIndex, setFaceIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

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
                    <audio ref={audioRef} src="/sounds/tap.wav" preload="none" />
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
                                <Image
                                    src={FACES[faceIndex]}
                                    alt={`${USER.displayName}'s avatar`}
                                    width={116}
                                    height={116}
                                    priority={faceIndex === 0}
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
                            I build softwares
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

                        {/* <div className="flex items-center px-3 py-2 sm:px-1 sm:py-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="rounded-none cursor-pointer shrink-0">
                                        <MessageCircleMoreIcon className="size-4" />
                                        Start a conversation
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-42 rounded-none">
                                    <DropdownMenuItem asChild className="rounded-none cursor-pointer">
                                        <a
                                            href="https://wa.me/918432563227"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Icons.whatsapp className="mr-2 size-4" />
                                            WhatsApp
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-none cursor-pointer">
                                        <a href={`mailto:${USER.email}`}>
                                            <Icons.mail className="mr-2 size-4" />
                                            Email
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-none cursor-pointer">
                                        <a
                                            href="https://cal.com/mnsh"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Icons.phone className="mr-2 size-4" />
                                            Schedule a call
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
