"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AnimatedScene() {
  const [mounted, setMounted] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setVideoFailed(false);
  }, [resolvedTheme]);

  if (!mounted) {
    return (
      <div className="w-full h-40 border-x border-b border-edge bg-muted/10 animate-pulse select-none" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const getGifSrc = () => {
    return resolvedTheme === "dark"
      ? "https://assets.mnsh.online/gifs/morning-evening.gif"
      : "https://assets.mnsh.online/gifs/day.gif";
  };

  const getVideoSource = () => {
    return isDark
      ? {
          webm: "https://assets.mnsh.online/videos/morning-evening.webm",
          mp4: "https://assets.mnsh.online/videos/morning-evening.mp4",
        }
      : {
          webm: "https://assets.mnsh.online/videos/day.webm",
          mp4: "https://assets.mnsh.online/videos/day.mp4",
        };
  };

  const videoSource = getVideoSource();
  const fallbackGif = getGifSrc();

  return (
    <div
      className={cn(
        "w-full border-x border-b border-edge select-none overflow-hidden bg-muted/10"
      )}
    >
      {!videoFailed ? (
        <video
          key={resolvedTheme}
          className="block h-40 w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={fallbackGif}
          onError={() => setVideoFailed(true)}
        >
          <source src={videoSource.webm} type="video/webm" />
          <source src={videoSource.mp4} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={fallbackGif}
          alt={`Scene for ${resolvedTheme} theme`}
          width={1600}
          height={640}
          className="block h-40 w-full object-cover"
          priority
        />
      )}
    </div>
  );
}
