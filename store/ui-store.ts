import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import {
  DEFAULT_FONT_THEME,
  FONT_THEME_STORAGE_KEY,
  type FontThemeId,
} from '@/lib/font-theme';

export const isGalleryExpandedAtom = atom(false);
export const isTerminalOpenAtom = atom(false);
export const showLabelsAtom = atomWithStorage('folio-show-labels', true);
export const fontThemeAtom = atomWithStorage<FontThemeId>(
  FONT_THEME_STORAGE_KEY,
  DEFAULT_FONT_THEME
);
