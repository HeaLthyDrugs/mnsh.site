import type { Snap } from "@/features/snaps/types/snap";

export const SNAPS_INTRO = {
  title: "Snaps",
  subtitle: "Collection of snaps",
  description:
    "Using Unsplash images for now. Replace any `src` below with your Cloudflare URL and it will automatically settle into the bento based on natural aspect ratio.",
};

function getSnapVariantSrc(
  src: string,
  variant: "grid" | "lightbox"
) {
  const extensionIndex = src.lastIndexOf(".");

  if (extensionIndex === -1) {
    return src;
  }

  return `${src.slice(0, extensionIndex)}-${variant}.webp`;
}

function withSnapVariants(snap: Snap): Snap {
  return {
    ...snap,
    gridSrc: getSnapVariantSrc(snap.src, "grid"),
    lightboxSrc: getSnapVariantSrc(snap.src, "lightbox"),
  };
}

export const SNAPS: Snap[] = [
  withSnapVariants({
    id: "hanuman-tekdi-green-mountain",
    src: "https://assets.mnsh.online/snaps/green-mountain.jpg",
    alt: "Misty hillside with bright green monsoon grass and wet rocks.",
    location: "Hanuman Tekdi, Lonavla",
    clickedBy: "Me",
    width: 4032,
    height: 2268,
    capturedAt: "Jun 2026",
  }),
  withSnapVariants({
    id: "ryewood-garden-morning",
    src: "https://assets.mnsh.online/snaps/IMG_0205.JPG",
    alt: "Sunrays break through trees over a damp forest floor.",
    location: "Ryewood Garden, Lonavla",
    clickedBy: "Me",
    width: 4032,
    height: 3024,
    capturedAt: "Jun 2026",
  }),
  withSnapVariants({
    id: "hanuman-tekdi-tree-silhouette",
    src: "https://assets.mnsh.online/snaps/IMG_0212.JPG",
    alt: "A lone tree silhouette against bright blue sky and clouds.",
    location: "Hanuman Tekdi, Lonavla",
    clickedBy: "Me",
    width: 3456,
    height: 4608,
    capturedAt: "Jun 2026",
  }),
  withSnapVariants({
    id: "img-0214-16",
    src: "https://assets.mnsh.online/snaps/IMG_0214.JPG",
    alt: "Foggy railway yard with wet tracks fading into mist.",
    location: "Lonavla Rail Tracks",
    clickedBy: "Aditya",
    width: 2080,
    height: 4608,
    capturedAt: "Jun 2026",
  }),
  withSnapVariants({
    id: "rani-sleeping",
    src: "https://assets.mnsh.online/snaps/cat-sleep.jpg",
    alt: "Close-up of a sleeping cat with soft morning light.",
    location: "Home, Lonavla",
    clickedBy: "Me",
    width: 4032,
    height: 2268,
    capturedAt: "Jun 2026",
  }),
  withSnapVariants({
    id: "fog-land-18",
    src: "https://assets.mnsh.online/snaps/fog-land.jpg",
    alt: "Rocky grassland covered in thick monsoon fog.",
    location: "Hanuman Tekdi, Lonavla",
    clickedBy: "Me",
    width: 4032,
    height: 2268,
    capturedAt: "Jun 2026",
  }),
  withSnapVariants({
    id: "goat-snap-19",
    src: "https://assets.mnsh.online/snaps/goat-snap.jpg",
    alt: "Printed photo of grazing goats in warm field light.",
    location: "Lonavla Dam",
    clickedBy: "Abhishek",
    width: 2268,
    height: 4032,
    capturedAt: "Jun 2026",
  }),
  withSnapVariants({
    id: "goat-20",
    src: "https://assets.mnsh.online/snaps/goat.jpg",
    alt: "Goats grazing across a dry field at golden hour.",
    location: "Lonavla Dam",
    clickedBy: "Abhishek",
    width: 2268,
    height: 4032,
    capturedAt: "Jun 2026",
  }),
  withSnapVariants({
    id: "goat2-21",
    src: "https://assets.mnsh.online/snaps/goat2.jpg",
    alt: "Close view of a goat grazing with herd in the distance.",
    location: "Lonavla Dam",
    clickedBy: "Abhishek",
    width: 2268,
    height: 4032,
    capturedAt: "Jun 2026",
  }),
  withSnapVariants({
    id: "jaitpur-morning-22",
    src: "https://assets.mnsh.online/snaps/jaitpur-morning.jpg",
    alt: "Early morning haze over open fields and distant trees.",
    location: "Jaitpur, Uttar Pradesh",
    clickedBy: "Me",
    width: 3840,
    height: 2160,
    capturedAt: "Jun 2026",
  }),
  withSnapVariants({
    id: "mountain-up-23",
    src: "https://assets.mnsh.online/snaps/mountain-up.jpg",
    alt: "Misty ridge line with mixed green and brown shrubs.",
    location: "Hanuman Tekdi, Lonavla",
    clickedBy: "Me",
    width: 4032,
    height: 2268,
    capturedAt: "Jun 2026",
  }),
  withSnapVariants({
    id: "olkaiwadi-24",
    src: "https://assets.mnsh.online/snaps/olkaiwadi.jpg",
    alt: "Rain clouds hanging over a hillside town view.",
    location: "Olkaiwadi, Lonavla",
    clickedBy: "Me",
    width: 4032,
    height: 2268,
    capturedAt: "Jun 2026",
  }),
];
