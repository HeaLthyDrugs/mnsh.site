import {
  Fraunces,
  Geist,
  Manrope,
  Newsreader,
  Plus_Jakarta_Sans,
} from "next/font/google";

export const fontGeist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const fontNewsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export const fontManrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  preload: false,
});

export const fontPlusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  preload: false,
});

export const fontFraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});
