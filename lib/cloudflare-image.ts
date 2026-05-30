const ASSETS_HOSTNAME = "assets.mnsh.online";

interface CloudflareTransformOptions {
  width?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpeg" | "png";
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
}

export function toCloudflareTransformedUrl(
  src: string,
  options: CloudflareTransformOptions = {}
) {
  if (!src) return src;
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

  return `https://${ASSETS_HOSTNAME}/cdn-cgi/image/${transforms.join(",")}/${src}`;
}
