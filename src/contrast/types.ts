/**
 * WCAG 2.1/2.2 Contrast Ratio Calculator & Palette Generator Types
 * AccessAI - UX/UI & Compliance Suite
 */

import { RGBColor } from '../cvd/types';

export type WCAGLevel = 'AAA' | 'AA' | 'FAIL';

export interface ContrastCriteriaResult {
  level: WCAGLevel;
  passesAA: boolean;
  passesAAA: boolean;
  requiredRatio: number;
  description: string;
}

export interface ContrastScore {
  ratio: number;
  formattedRatio: string;
  fgLuminance: number;
  bgLuminance: number;
  fgColor: RGBColor;
  bgColor: RGBColor;
  fgHex: string;
  bgHex: string;
  normalText: ContrastCriteriaResult;
  largeText: ContrastCriteriaResult;
  uiComponents: ContrastCriteriaResult;
}

export interface PaletteSuggestion {
  id: string;
  category: 'text-on-light' | 'text-on-dark' | 'solid-button' | 'subtle-badge' | 'ui-border';
  title: string;
  description: string;
  foreground: string;
  background: string;
  contrastRatio: number;
  formattedRatio: string;
  passesAA: boolean;
  passesAAA: boolean;
}

export interface ContrastRampStep {
  step: number; // e.g. 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
  hex: string;
  lightness: number;
  contrastAgainstWhite: number;
  contrastAgainstBlack: number;
  passesAAOnWhite: boolean;
  passesAAOnBlack: boolean;
}
