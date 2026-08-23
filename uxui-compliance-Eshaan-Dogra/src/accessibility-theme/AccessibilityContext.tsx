/**
 * Accessibility Context & Preferences Provider
 * AccessAI - UX/UI & Compliance Suite
 *
 * Manages user accessibility preferences, theme application, OpenDyslexic font toggles,
 * and localStorage persistence.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AccessibilityPreferences,
  AccessibilityContextValue,
  ThemeMode,
  FontFamilyOption,
  TextScale,
  LineSpacing
} from './types';
import './fonts.css';
import './high-contrast.css';

export const STORAGE_KEY = 'accessai_a11y_prefs_v1';

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  theme: 'dark',
  fontFamily: 'default',
  textScale: '100',
  lineSpacing: 'normal',
  reduceMotion: false,
  highContrastFocusRings: false,
  underlineLinks: false,
};

export const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export interface AccessibilityProviderProps {
  children: React.ReactNode;
  initialPreferences?: Partial<AccessibilityPreferences>;
  targetElement?: HTMLElement | null; // Defaults to document.documentElement
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  initialPreferences,
  targetElement
}) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() => {
    // 1. Try loading from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved), ...initialPreferences };
        }
      } catch (err) {
        console.warn('Failed to load accessibility preferences from localStorage:', err);
      }
    }

    // 2. Check system preferences (prefers-contrast & prefers-reduced-motion)
    let systemTheme: ThemeMode = 'dark';
    let systemReduceMotion = false;

    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-contrast: more)').matches) {
        systemTheme = 'high-contrast-yellow';
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        systemReduceMotion = true;
      }
    }

    return {
      ...DEFAULT_PREFERENCES,
      theme: systemTheme,
      reduceMotion: systemReduceMotion,
      ...initialPreferences
    };
  });

  // Apply DOM classes whenever preferences change
  useEffect(() => {
    const el = targetElement || (typeof document !== 'undefined' ? document.documentElement : null);
    if (!el) return;

    // 1. Theme classes
    el.classList.remove('theme-hc-yellow', 'theme-hc-white', 'dark', 'light');
    if (preferences.theme === 'high-contrast-yellow') {
      el.classList.add('theme-hc-yellow');
    } else if (preferences.theme === 'high-contrast-white') {
      el.classList.add('theme-hc-white');
    } else if (preferences.theme === 'dark') {
      el.classList.add('dark');
    } else {
      el.classList.add('light');
    }

    // 2. Dyslexia Font class
    el.classList.toggle('font-opendyslexic', preferences.fontFamily === 'opendyslexic');

    // 3. Text scale classes
    el.classList.remove('text-scale-100', 'text-scale-115', 'text-scale-130', 'text-scale-150');
    el.classList.add(`text-scale-${preferences.textScale}`);

    // 4. Line spacing classes
    el.classList.remove('line-spacing-normal', 'line-spacing-relaxed', 'line-spacing-loose');
    el.classList.add(`line-spacing-${preferences.lineSpacing}`);

    // 5. High contrast focus rings
    el.classList.toggle('hc-focus-rings', preferences.highContrastFocusRings || preferences.theme === 'high-contrast-yellow');

    // 6. Underline links
    el.classList.toggle('underline-all-links', preferences.underlineLinks);

    // 7. Reduced motion
    el.classList.toggle('reduce-motion', preferences.reduceMotion);

    // Persist to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (err) {
        console.warn('Failed to save accessibility preferences to localStorage:', err);
      }
    }
  }, [preferences, targetElement]);

  const updatePreferences = useCallback((updates: Partial<AccessibilityPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    updatePreferences({ theme });
  }, [updatePreferences]);

  const setFontFamily = useCallback((fontFamily: FontFamilyOption) => {
    updatePreferences({ fontFamily });
  }, [updatePreferences]);

  const setTextScale = useCallback((textScale: TextScale) => {
    updatePreferences({ textScale });
  }, [updatePreferences]);

  const setLineSpacing = useCallback((lineSpacing: LineSpacing) => {
    updatePreferences({ lineSpacing });
  }, [updatePreferences]);

  const setReduceMotion = useCallback((reduceMotion: boolean) => {
    updatePreferences({ reduceMotion });
  }, [updatePreferences]);

  const setHighContrastFocusRings = useCallback((highContrastFocusRings: boolean) => {
    updatePreferences({ highContrastFocusRings });
  }, [updatePreferences]);

  const setUnderlineLinks = useCallback((underlineLinks: boolean) => {
    updatePreferences({ underlineLinks });
  }, [updatePreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  const isHighContrast = preferences.theme === 'high-contrast-yellow' || preferences.theme === 'high-contrast-white';
  const isOpenDyslexic = preferences.fontFamily === 'opendyslexic';

  const value: AccessibilityContextValue = {
    preferences,
    updatePreferences,
    setTheme,
    setFontFamily,
    setTextScale,
    setLineSpacing,
    setReduceMotion,
    setHighContrastFocusRings,
    setUnderlineLinks,
    resetPreferences,
    isHighContrast,
    isOpenDyslexic
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an <AccessibilityProvider>');
  }
  return context;
}
