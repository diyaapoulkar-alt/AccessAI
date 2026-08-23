/**
 * Compliant Palette Generator & Color Optimizer
 * AccessAI - UX/UI & Compliance Suite
 *
 * Employs binary bisection search in HSL lightness space to produce minimum-delta,
 * aesthetically cohesive color pairings meeting exact WCAG AA/AAA thresholds.
 */

import { parseColor, rgbToHex, hslToRgb } from '../cvd/color-math';
import { RGBColor } from '../cvd/types';
import { calculateContrastRatio, formatContrastRatio, WCAG_THRESHOLDS } from './wcag-math';
import { PaletteSuggestion, ContrastRampStep } from './types';

/**
 * Converts RGBColor [0-255] to HSL { h: [0-360), s: [0-1], l: [0-1] }
 */
export function rgbToHsl(rgb: RGBColor): { h: number; s: number; l: number } {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  return { h: Math.round(h), s, l };
}

/**
 * Adjusts the lightness of a base color using binary bisection search until it meets or exceeds
 * the target contrast ratio against a given background. Preserves base hue and saturation.
 */
export function adjustColorForContrast(
  baseColorInput: string | RGBColor,
  targetBgInput: string | RGBColor,
  targetRatio: number = WCAG_THRESHOLDS.AA_NORMAL_TEXT,
  direction: 'auto' | 'darken' | 'lighten' = 'auto'
): string {
  const baseRgb = typeof baseColorInput === 'string' ? parseColor(baseColorInput) : baseColorInput;
  const targetBgRgb = typeof targetBgInput === 'string' ? parseColor(targetBgInput) : targetBgInput;

  // Check if base color already satisfies ratio
  const initialRatio = calculateContrastRatio(baseRgb, targetBgRgb);
  if (initialRatio >= targetRatio) {
    return rgbToHex(baseRgb);
  }

  const { h, s, l: initialL } = rgbToHsl(baseRgb);

  // Helper to test ratio at a specific lightness
  const testLightnessRatio = (testL: number): number => {
    const testRgb = hslToRgb(h, s, testL);
    return calculateContrastRatio(testRgb, targetBgRgb);
  };

  // Determine search direction
  let searchDarken = direction === 'darken';
  let searchLighten = direction === 'lighten';

  if (direction === 'auto') {
    // If background is bright, prefer darkening; if background is dark, prefer lightening
    const bgHsl = rgbToHsl(targetBgRgb);
    if (bgHsl.l >= 0.5) {
      searchDarken = true;
    } else {
      searchLighten = true;
    }
  }

  // 1. Try search in preferred direction
  if (searchDarken) {
    let low = 0.0;
    let high = initialL;
    let bestL = 0.0;

    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2;
      const r = testLightnessRatio(mid);
      if (r >= targetRatio) {
        bestL = mid;
        low = mid; // Try to stay as close to initialL as possible
      } else {
        high = mid;
      }
    }

    if (testLightnessRatio(bestL) >= targetRatio) {
      return rgbToHex(hslToRgb(h, s, bestL));
    }
  }

  if (searchLighten) {
    let low = initialL;
    let high = 1.0;
    let bestL = 1.0;

    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2;
      const r = testLightnessRatio(mid);
      if (r >= targetRatio) {
        bestL = mid;
        high = mid; // Try to stay as close to initialL as possible
      } else {
        low = mid;
      }
    }

    if (testLightnessRatio(bestL) >= targetRatio) {
      return rgbToHex(hslToRgb(h, s, bestL));
    }
  }

  // Fallback: If preferred direction failed, try the opposite direction
  if (searchDarken) {
    return adjustColorForContrast(baseColorInput, targetBgInput, targetRatio, 'lighten');
  }
  return adjustColorForContrast(baseColorInput, targetBgInput, targetRatio, 'darken');
}

/**
 * Generates a collection of compliant foreground/background pairings for common UI components.
 */
export function generateCompliantPalette(baseColorInput: string | RGBColor): PaletteSuggestion[] {
  const baseRgb = typeof baseColorInput === 'string' ? parseColor(baseColorInput) : baseColorInput;
  const baseHex = rgbToHex(baseRgb);
  const { h, s } = rgbToHsl(baseRgb);

  // 1. Text on Light (#FFFFFF)
  const onWhiteFg = adjustColorForContrast(baseRgb, '#FFFFFF', WCAG_THRESHOLDS.AA_NORMAL_TEXT, 'darken');
  const onWhiteRatio = calculateContrastRatio(onWhiteFg, '#FFFFFF');

  // 2. Text on Dark (#0F172A - Slate 900)
  const darkSurface = '#0F172A';
  const onDarkFg = adjustColorForContrast(baseRgb, darkSurface, WCAG_THRESHOLDS.AA_NORMAL_TEXT, 'lighten');
  const onDarkRatio = calculateContrastRatio(onDarkFg, darkSurface);

  // 3. Solid Button Container (Base color as background + High-contrast label)
  const whiteBtnRatio = calculateContrastRatio('#FFFFFF', baseHex);
  const blackBtnRatio = calculateContrastRatio('#000000', baseHex);
  const solidBtnFg = whiteBtnRatio >= blackBtnRatio ? '#FFFFFF' : '#000000';
  const solidBtnBg = baseHex;
  const solidBtnRatio = Math.max(whiteBtnRatio, blackBtnRatio);

  // 4. Subtle Tint Badge (Light background tint + Darkened accessible text)
  const badgeBg = rgbToHex(hslToRgb(h, Math.min(s, 0.4), 0.94));
  const badgeFg = adjustColorForContrast(baseRgb, badgeBg, WCAG_THRESHOLDS.AA_NORMAL_TEXT, 'darken');
  const badgeRatio = calculateContrastRatio(badgeFg, badgeBg);

  // 5. Non-text UI Component & Border (Adjusted for ≥ 3.0:1 on Slate 900 surface)
  const uiBorder = adjustColorForContrast(baseRgb, darkSurface, WCAG_THRESHOLDS.AA_UI_COMPONENT, 'lighten');
  const uiBorderRatio = calculateContrastRatio(uiBorder, darkSurface);

  return [
    {
      id: 'text-on-light',
      category: 'text-on-light',
      title: 'Accessible Text on Light',
      description: 'Optimized foreground shade for body text and headers over white (#FFFFFF) backgrounds.',
      foreground: onWhiteFg,
      background: '#FFFFFF',
      contrastRatio: onWhiteRatio,
      formattedRatio: formatContrastRatio(onWhiteRatio),
      passesAA: onWhiteRatio >= WCAG_THRESHOLDS.AA_NORMAL_TEXT,
      passesAAA: onWhiteRatio >= WCAG_THRESHOLDS.AAA_NORMAL_TEXT,
    },
    {
      id: 'text-on-dark',
      category: 'text-on-dark',
      title: 'Accessible Text on Dark',
      description: 'Optimized foreground tint for text over dark theme cards and surface panels.',
      foreground: onDarkFg,
      background: darkSurface,
      contrastRatio: onDarkRatio,
      formattedRatio: formatContrastRatio(onDarkRatio),
      passesAA: onDarkRatio >= WCAG_THRESHOLDS.AA_NORMAL_TEXT,
      passesAAA: onDarkRatio >= WCAG_THRESHOLDS.AAA_NORMAL_TEXT,
    },
    {
      id: 'solid-button',
      category: 'solid-button',
      title: 'Solid Button Component',
      description: 'Base color applied as button container with guaranteed highest-contrast text label.',
      foreground: solidBtnFg,
      background: solidBtnBg,
      contrastRatio: solidBtnRatio,
      formattedRatio: formatContrastRatio(solidBtnRatio),
      passesAA: solidBtnRatio >= WCAG_THRESHOLDS.AA_NORMAL_TEXT,
      passesAAA: solidBtnRatio >= WCAG_THRESHOLDS.AAA_NORMAL_TEXT,
    },
    {
      id: 'subtle-badge',
      category: 'subtle-badge',
      title: 'Subtle Badge / Status Chip',
      description: 'Soft pastel background surface paired with accessible high-contrast label.',
      foreground: badgeFg,
      background: badgeBg,
      contrastRatio: badgeRatio,
      formattedRatio: formatContrastRatio(badgeRatio),
      passesAA: badgeRatio >= WCAG_THRESHOLDS.AA_NORMAL_TEXT,
      passesAAA: badgeRatio >= WCAG_THRESHOLDS.AAA_NORMAL_TEXT,
    },
    {
      id: 'ui-border',
      category: 'ui-border',
      title: 'UI Focus Ring & Borders',
      description: 'Compliant non-text contrast (≥ 3:1) for active focus rings, borders, and icons.',
      foreground: uiBorder,
      background: darkSurface,
      contrastRatio: uiBorderRatio,
      formattedRatio: formatContrastRatio(uiBorderRatio),
      passesAA: uiBorderRatio >= WCAG_THRESHOLDS.AA_UI_COMPONENT,
      passesAAA: uiBorderRatio >= WCAG_THRESHOLDS.AAA_LARGE_TEXT,
    },
  ];
}

/**
 * Generates a 9-step accessible monochromatic tonal ramp (50 to 900)
 */
export function generateContrastRamp(baseColorInput: string | RGBColor): ContrastRampStep[] {
  const baseRgb = typeof baseColorInput === 'string' ? parseColor(baseColorInput) : baseColorInput;
  const { h, s } = rgbToHsl(baseRgb);

  const rampConfig = [
    { step: 50, lightness: 0.96 },
    { step: 100, lightness: 0.90 },
    { step: 200, lightness: 0.80 },
    { step: 300, lightness: 0.70 },
    { step: 400, lightness: 0.60 },
    { step: 500, lightness: 0.50 },
    { step: 600, lightness: 0.40 },
    { step: 700, lightness: 0.30 },
    { step: 800, lightness: 0.20 },
    { step: 900, lightness: 0.10 },
  ];

  return rampConfig.map(({ step, lightness }) => {
    const rgb = hslToRgb(h, s, lightness);
    const hex = rgbToHex(rgb);
    const contrastWhite = calculateContrastRatio(hex, '#FFFFFF');
    const contrastBlack = calculateContrastRatio(hex, '#000000');

    return {
      step,
      hex,
      lightness: Math.round(lightness * 100),
      contrastAgainstWhite: contrastWhite,
      contrastAgainstBlack: contrastBlack,
      passesAAOnWhite: contrastWhite >= WCAG_THRESHOLDS.AA_NORMAL_TEXT,
      passesAAOnBlack: contrastBlack >= WCAG_THRESHOLDS.AA_NORMAL_TEXT,
    };
  });
}
