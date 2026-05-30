import Image from "next/image";

import { cn } from "@/lib/utils";
import { toCloudflareTransformedUrl } from "@/lib/cloudflare-image";

export function YouTubeEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  return (
    <div className="relative">
      <iframe
        className="aspect-video w-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-black/10 ring-inset dark:ring-white/10" />
    </div>
  );
}

const IMAGE_HOST_WHITELIST = new Set([
  "assets.mnsh.online",
  "avatars.githubusercontent.com",
  "images.unsplash.com",
  "code.visualstudio.com",
  "static.figma.com",
  "www.notion.so",
  "assets.vercel.com",
  "static.linear.app",
  "m.media-amazon.com",
  "rukminim2.flixcart.com",
  "www.asrock.com",
]);

function canUseOptimizedImage(src: string) {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    const { hostname } = new URL(src);
    return IMAGE_HOST_WHITELIST.has(hostname);
  } catch {
    return false;
  }
}

function toNumber(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function FramedImage({
  className,
  src,
  alt = "",
  width,
  height,
  ...props
}: React.ComponentProps<"img">) {
  const imageSrc = typeof src === "string" ? src : "";
  const imageWidth = toNumber(width, 1200);
  const imageHeight = toNumber(height, 630);

  return (
    <figure className="relative [&_img]:rounded-lg">
      {imageSrc && canUseOptimizedImage(imageSrc) ? (
        <Image
          src={toCloudflareTransformedUrl(imageSrc, { width: 1200 })}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          sizes="(max-width: 768px) 100vw, 768px"
          className={cn("h-auto w-full rounded-lg", className)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          {...props}
          src={imageSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn("h-auto w-full rounded-lg", className)}
        />
      )}
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-black/10 ring-inset dark:ring-white/10" />
    </figure>
  );
}
