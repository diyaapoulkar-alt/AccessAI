/**
 * AccessAI - UX/UI & Compliance Suite Module Entry Point
 * Role: UX/UI & Compliance Specialist
 *
 * Exposes:
 * 1. Color Vision Deficiency (CVD) Simulation Engine
 * 2. WCAG 2.1/2.2 AA Contrast Ratio Calculator & Palette Generator
 * 3. High-Contrast Theme System & OpenDyslexic Accessibility Preferences
 */

// 1. Color Vision Deficiency (CVD) Simulator
export * from './cvd';

// 2. WCAG 2.1/2.2 AA Contrast Ratio Calculator & Palette Generator
export {
  type WCAGLevel,
  type ContrastCriteriaResult,
  type ContrastScore,
  type PaletteSuggestion,
  type ContrastRampStep,
  WCAG_THRESHOLDS,
  calculateContrastRatio,
  formatContrastRatio,
  compositeColor,
  evaluateContrast,
  rgbToHsl,
  adjustColorForContrast,
  generateCompliantPalette,
  generateContrastRamp,
  ContrastCheckerCard,
  type ContrastCheckerCardProps,
  PaletteGeneratorCard,
  type PaletteGeneratorCardProps
} from './contrast';

// 3. High-Contrast Themes & Accessibility Preferences
export * from './accessibility-theme';
