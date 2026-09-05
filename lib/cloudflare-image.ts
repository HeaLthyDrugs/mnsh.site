import { ImageLoaderProps } from "next/image";

const ASSETS_HOSTNAME = "assets.mnsh.site";
const CLOUDFLARE_IMAGE_RESIZING_ENABLED = false;

interface CloudflareTransformOptions {
  width?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpeg" | "png";
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
}

export function shouldUseCloudflareLoader(src: string): boolean {
  if (!src) return false;
  try {
    const url = new URL(src);
    return url.hostname === ASSETS_HOSTNAME;
  } catch {
    return false;
  }
}

export function cloudflareLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src) return "";
  if (!src.startsWith("https://")) return src;

  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return src;
  }

  if (parsed.hostname !== ASSETS_HOSTNAME) {
    return src;
  }

  if (!CLOUDFLARE_IMAGE_RESIZING_ENABLED) {
    return src;
  }

  const transforms = [
    `format=auto`,
    `quality=${quality ?? 75}`,
    `width=${width}`,
  ];

  return `https://${ASSETS_HOSTNAME}/cdn-cgi/image/${transforms.join(",")}${parsed.pathname}`;
}

export function toCloudflareTransformedUrl(
  src: string,
  options: CloudflareTransformOptions = {}
) {
  if (!src) return src;
  if (!CLOUDFLARE_IMAGE_RESIZING_ENABLED) return src;
  if (!src.startsWith("https://")) return src;

  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return src;
  }

  if (parsed.hostname !== ASSETS_HOSTNAME) {
    return src;
  }

  const transforms = [
    `format=${options.format ?? "auto"}`,
    `quality=${options.quality ?? 72}`,
    `width=${options.width ?? 1280}`,
  ];

  if (options.fit) {
    transforms.push(`fit=${options.fit}`);
  }

  return `https://${ASSETS_HOSTNAME}/cdn-cgi/image/${transforms.join(",")}${parsed.pathname}`;
}
