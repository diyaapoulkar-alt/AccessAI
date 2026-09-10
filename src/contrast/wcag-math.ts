/**
 * WCAG 2.1 / 2.2 Contrast Ratio Math Engine
 * AccessAI - UX/UI & Compliance Suite
 *
 * Implements exact relative luminance calculations, alpha blending compositing,
 * and WCAG 2.1/2.2 Success Criteria compliance evaluation.
 */

import { parseColor, rgbToHex, srgbChannelToLinear, clamp } from '../cvd/color-math';
import { RGBColor } from '../cvd/types';
import { ContrastScore, ContrastCriteriaResult, WCAGLevel } from './types';

export const WCAG_THRESHOLDS = {
  AA_NORMAL_TEXT: 4.5,
  AA_LARGE_TEXT: 3.0,
  AA_UI_COMPONENT: 3.0,
  AAA_NORMAL_TEXT: 7.0,
  AAA_LARGE_TEXT: 4.5,
} as const;

/**
 * Calculates exact WCAG relative luminance for an 8-bit sRGB color.
 * L = 0.2126 * R_lin + 0.7152 * G_lin + 0.0722 * B_lin
 */
export function calculateRelativeLuminance(color: RGBColor): number {
  const rLin = srgbChannelToLinear(color.r);
  const gLin = srgbChannelToLinear(color.g);
  const bLin = srgbChannelToLinear(color.b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Composites a semi-transparent foreground color over an opaque background color.
 * C_out = alpha * C_fg + (1 - alpha) * C_bg
 */
export function compositeColor(foreground: RGBColor, background: RGBColor): RGBColor {
  const alpha = foreground.a !== undefined ? clamp(foreground.a, 0, 1) : 1;
  if (alpha === 1) {
    return { ...foreground, a: 1 };
  }

  return {
    r: Math.round(alpha * foreground.r + (1 - alpha) * background.r),
    g: Math.round(alpha * foreground.g + (1 - alpha) * background.g),
    b: Math.round(alpha * foreground.b + (1 - alpha) * background.b),
    a: 1
  };
}

/**
 * Calculates the exact WCAG contrast ratio between two colors (or color strings).
 * If the foreground has transparency, it is composited over the background first.
 * Returns a floating point number between 1.0 and 21.0.
 */
export function calculateContrastRatio(
  foregroundInput: string | RGBColor,
  backgroundInput: string | RGBColor,
  backdropInput?: string | RGBColor
): number {
  const rawFg = typeof foregroundInput === 'string' ? parseColor(foregroundInput) : foregroundInput;
  const rawBg = typeof backgroundInput === 'string' ? parseColor(backgroundInput) : backgroundInput;
  const backdrop = backdropInput
    ? (typeof backdropInput === 'string' ? parseColor(backdropInput) : backdropInput)
    : { r: 255, g: 255, b: 255, a: 1 }; // default white backdrop

  // Composite background over backdrop if bg has alpha
  const effectiveBg = rawBg.a !== undefined && rawBg.a < 1
    ? compositeColor(rawBg, backdrop)
    : rawBg;

  // Composite foreground over effective background if fg has alpha
  const effectiveFg = rawFg.a !== undefined && rawFg.a < 1
    ? compositeColor(rawFg, effectiveBg)
    : rawFg;

  const lumFg = calculateRelativeLuminance(effectiveFg);
  const lumBg = calculateRelativeLuminance(effectiveBg);

  const lighter = Math.max(lumFg, lumBg);
  const darker = Math.min(lumFg, lumBg);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  // Round to 2 decimal places per standard WCAG reporting
  return Number(ratio.toFixed(2));
}

/**
 * Formats a numeric contrast ratio into human-readable notation (e.g. "4.54:1")
 */
export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

/**
 * Evaluates WCAG level and criteria compliance for a specific text/UI category
 */
function evaluateCriteria(
  ratio: number,
  aaThreshold: number,
  aaaThreshold: number,
  description: string
): ContrastCriteriaResult {
  const passesAAA = ratio >= aaaThreshold;
  const passesAA = ratio >= aaThreshold;
  const level: WCAGLevel = passesAAA ? 'AAA' : passesAA ? 'AA' : 'FAIL';

  return {
    level,
    passesAA,
    passesAAA,
    requiredRatio: aaThreshold,
    description
  };
}

/**
 * Comprehensive evaluator returning full contrast scores and WCAG AA/AAA compliance report
 */
export function evaluateContrast(
  foregroundInput: string | RGBColor,
  backgroundInput: string | RGBColor,
  backdropInput?: string | RGBColor
): ContrastScore {
  const rawFg = typeof foregroundInput === 'string' ? parseColor(foregroundInput) : foregroundInput;
  const rawBg = typeof backgroundInput === 'string' ? parseColor(backgroundInput) : backgroundInput;
  const backdrop = backdropInput
    ? (typeof backdropInput === 'string' ? parseColor(backdropInput) : backdropInput)
    : { r: 255, g: 255, b: 255, a: 1 };

  const effectiveBg = rawBg.a !== undefined && rawBg.a < 1
    ? compositeColor(rawBg, backdrop)
    : rawBg;

  const effectiveFg = rawFg.a !== undefined && rawFg.a < 1
    ? compositeColor(rawFg, effectiveBg)
    : rawFg;

  const fgLuminance = calculateRelativeLuminance(effectiveFg);
  const bgLuminance = calculateRelativeLuminance(effectiveBg);
  const ratio = calculateContrastRatio(effectiveFg, effectiveBg);
  const formattedRatio = formatContrastRatio(ratio);

  return {
    ratio,
    formattedRatio,
    fgLuminance: Number(fgLuminance.toFixed(4)),
    bgLuminance: Number(bgLuminance.toFixed(4)),
    fgColor: effectiveFg,
    bgColor: effectiveBg,
    fgHex: rgbToHex(effectiveFg),
    bgHex: rgbToHex(effectiveBg),
    normalText: evaluateCriteria(
      ratio,
      WCAG_THRESHOLDS.AA_NORMAL_TEXT,
      WCAG_THRESHOLDS.AAA_NORMAL_TEXT,
      'Normal text (< 18pt / 24px, or < 14pt / 18.5px bold)'
    ),
    largeText: evaluateCriteria(
      ratio,
      WCAG_THRESHOLDS.AA_LARGE_TEXT,
      WCAG_THRESHOLDS.AAA_LARGE_TEXT,
      'Large text (≥ 18pt / 24px, or ≥ 14pt / 18.5px bold)'
    ),
    uiComponents: evaluateCriteria(
      ratio,
      WCAG_THRESHOLDS.AA_UI_COMPONENT,
      WCAG_THRESHOLDS.AA_UI_COMPONENT,
      'UI Components & Graphical Objects (WCAG 2.1 SC 1.4.11)'
    )
  };
}
