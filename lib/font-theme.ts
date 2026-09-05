export const FONT_THEME_STORAGE_KEY = "font-theme";
export const FONT_THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const FONT_THEME_IDS = [
  "inter",
  "editorial",
  "minimal",
  "aesthetic",
] as const;

export type FontThemeId = (typeof FONT_THEME_IDS)[number];

export const DEFAULT_FONT_THEME: FontThemeId = "inter";

export const FONT_THEME_OPTIONS: Record<
  FontThemeId,
  {
    label: string;
    preview: string;
  }
> = {
  inter: {
    label: "Default",
    preview: "Inter",
  },
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

export function resolveFontTheme(value: string | null | undefined): FontThemeId {
  return isFontThemeId(value) ? value : DEFAULT_FONT_THEME;
}

export function getNextFontTheme(theme: FontThemeId): FontThemeId {
  const currentIndex = FONT_THEME_IDS.indexOf(theme);
  const nextIndex = (currentIndex + 1) % FONT_THEME_IDS.length;
  return FONT_THEME_IDS[nextIndex];
}
