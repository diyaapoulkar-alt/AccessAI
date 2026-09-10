/**
 * Accessibility Preferences & Theme Types
 * AccessAI - UX/UI & Compliance Suite
 */

export type ThemeMode = 
  | 'dark'
  | 'light'
  | 'high-contrast-yellow'
  | 'high-contrast-white';

export type FontFamilyOption = 
  | 'default'
  | 'opendyslexic'
  | 'system';

export type TextScale = 
  | '100' // Normal (100%)
  | '115' // Large (115%)
  | '130' // X-Large (130%)
  | '150'; // XX-Large (150%)

export type LineSpacing = 
  | 'normal'  // 1.5
  | 'relaxed' // 1.8
  | 'loose';  // 2.1

export interface AccessibilityPreferences {
  theme: ThemeMode;
  fontFamily: FontFamilyOption;
  textScale: TextScale;
  lineSpacing: LineSpacing;
  reduceMotion: boolean;
  highContrastFocusRings: boolean;
  underlineLinks: boolean;
}

export interface AccessibilityContextValue {
  preferences: AccessibilityPreferences;
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void;
  setTheme: (theme: ThemeMode) => void;
  setFontFamily: (font: FontFamilyOption) => void;
  setTextScale: (scale: TextScale) => void;
  setLineSpacing: (spacing: LineSpacing) => void;
  setReduceMotion: (reduce: boolean) => void;
  setHighContrastFocusRings: (enabled: boolean) => void;
  setUnderlineLinks: (enabled: boolean) => void;
  resetPreferences: () => void;
  isHighContrast: boolean;
  isOpenDyslexic: boolean;
}
