import { cn } from "@/lib/utils";

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

export function FramedImage({
  className,
  src,
  alt = "",
  ...props
}: React.ComponentProps<"img">) {
  const imageSrc = typeof src === "string" ? src : "";

  return (
    <figure className="relative [&_img]:rounded-lg">
      {imageSrc && (
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
