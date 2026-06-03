"use client";

import { useState } from "react";
import { Volume2Icon, Share2Icon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface BlogCoverActionsProps {
    title: string;
    content: string;
    slug: string;
}

export function BlogCoverActions({ title, content, slug }: BlogCoverActionsProps) {
    const [isReading, setIsReading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Text-to-speech functionality
    const handleReadAloud = () => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;

        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
            return;
        }

        // Clean content for reading (strip markdown/html)
        const cleanContent = content
            .replace(/#{1,6}\s/g, "")
            .replace(/\*\*|__/g, "")
            .replace(/\*|_/g, "")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/```[\s\S]*?```/g, "")
            .replace(/`[^`]+`/g, "")
            .replace(/\n+/g, " ")
            .trim();

        const textToRead = `${title}. ${cleanContent}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onend = () => setIsReading(false);
        utterance.onerror = () => setIsReading(false);

        window.speechSynthesis.speak(utterance);
        setIsReading(true);
    };

    // Share functionality
    const handleShare = async () => {
        const url = `${window.location.origin}/blog/${slug}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url,
                });
            } catch {
                console.log("Share cancelled");
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex items-center gap-1.5">
            {/* Read Aloud Button */}
            <SimpleTooltip content={isReading ? "Stop reading" : "Listen to article"}>
                <Button
                    variant="secondary"
                    size="icon-sm"
                    onClick={handleReadAloud}
                    className={cn(
                        "rounded-none",
                        isReading && "bg-primary text-primary-foreground"
                    )}
                >
                    <Volume2Icon className={cn("size-4", isReading && "animate-pulse")} />
                </Button>
            </SimpleTooltip>

            {/* Share Button */}
            <SimpleTooltip content={copied ? "Link copied!" : "Share article"}>
                <Button
                    variant="secondary"
                    size="icon-sm"
                    onClick={handleShare}
                    className="rounded-none"
                >
                    {copied ? (
                        <CheckIcon className="size-4 text-green-500" />
                    ) : (
                        <Share2Icon className="size-4" />
                    )}
                </Button>
            </SimpleTooltip>
        </div>
    );
}
