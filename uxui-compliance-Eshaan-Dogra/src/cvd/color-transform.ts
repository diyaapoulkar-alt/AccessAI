/**
 * Single-Color & Palette CVD Simulation Transformers
 * AccessAI - UX/UI & Compliance Suite
 */

import {
  clamp,
  parseColor,
  rgbToHex,
  srgbChannelToLinear,
  linearChannelToSrgb,
  applyMatrix3x3
} from './color-math';
import { getInterpolatedMatrix } from './matrices';
import { CVDType, RGBColor } from './types';

/**
 * Simulates a single RGBColor object under a given CVD condition and severity.
 * 
 * Pipeline:
 * 1. Convert non-linear sRGB channels [0-255] to Linear sRGB [0-1]
 * 2. Multiply 3-vector by the interpolated CVD transform matrix
 * 3. Clamp simulated linear values [0-1]
 * 4. Convert linear channels back to 8-bit non-linear sRGB [0-255] (Gamma companding)
 */
export function simulateRGB(
  rgb: RGBColor,
  type: CVDType,
  severity: number = 1.0
): RGBColor {
  if (type === 'normal' || severity <= 0) {
    return { ...rgb };
  }

  // 1. De-gamma to linear sRGB
  const rLin = srgbChannelToLinear(rgb.r);
  const gLin = srgbChannelToLinear(rgb.g);
  const bLin = srgbChannelToLinear(rgb.b);

  // 2. Obtain interpolated matrix
  const matrix = getInterpolatedMatrix(type, severity);

  // 3. Apply transformation
  const [rSimLin, gSimLin, bSimLin] = applyMatrix3x3(matrix, rLin, gLin, bLin);

  // 4. Re-gamma back to sRGB with clamping
  return {
    r: linearChannelToSrgb(clamp(rSimLin, 0, 1)),
    g: linearChannelToSrgb(clamp(gSimLin, 0, 1)),
    b: linearChannelToSrgb(clamp(bSimLin, 0, 1)),
    a: rgb.a
  };
}

/**
 * Simulates a color string (Hex, RGB, RGBA, HSL) under a given CVD condition.
 * Returns standard hex code (#RRGGBB or #RRGGBBAA).
 */
export function simulateCVDColor(
  colorInput: string | RGBColor,
  type: CVDType,
  severity: number = 1.0
): string {
  const rgb = typeof colorInput === 'string' ? parseColor(colorInput) : colorInput;
  const simulated = simulateRGB(rgb, type, severity);
  return rgbToHex(simulated, rgb.a !== undefined && rgb.a < 1);
}

/**
 * Batch-transforms an array of color strings (e.g. design palette or theme tokens)
 */
export function simulatePalette(
  palette: string[],
  type: CVDType,
  severity: number = 1.0
): string[] {
  return palette.map(color => simulateCVDColor(color, type, severity));
}
