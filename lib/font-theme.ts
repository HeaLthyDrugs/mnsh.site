export const FONT_THEME_STORAGE_KEY = "font-theme";

export const FONT_THEME_IDS = ["editorial", "minimal", "aesthetic"] as const;

export type FontThemeId = (typeof FONT_THEME_IDS)[number];

export const DEFAULT_FONT_THEME: FontThemeId = "editorial";

export const FONT_THEME_OPTIONS: Record<
  FontThemeId,
  {
    label: string;
    preview: string;
  }
> = {
  editorial: {
    label: "Editorial",
    preview: "Geist + Newsreader",
  },
  minimal: {
    label: "Minimal",
    preview: "Manrope",
  },
  aesthetic: {
    label: "Aesthetic",
    preview: "Plus Jakarta Sans + Fraunces",
  },
};

export function isFontThemeId(value: string | null | undefined): value is FontThemeId {
  return !!value && FONT_THEME_IDS.includes(value as FontThemeId);
}

export function getNextFontTheme(theme: FontThemeId): FontThemeId {
  const currentIndex = FONT_THEME_IDS.indexOf(theme);
  const nextIndex = (currentIndex + 1) % FONT_THEME_IDS.length;
  return FONT_THEME_IDS[nextIndex];
}
