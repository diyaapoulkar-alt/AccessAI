/**
 * Color Science & Math Utilities
 * AccessAI - UX/UI & Compliance Suite
 *
 * Exact sRGB linearization, gamma companding, LMS cone excitation transforms,
 * and high-fidelity color format parsing.
 */

import { Matrix3x3, RGBColor, LinearRGB } from './types';

/**
 * Clamps a numeric value between min and max bounds
 */
export function clamp(val: number, min: number = 0, max: number = 255): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Converts 8-bit sRGB channel [0 - 255] to Linear sRGB [0.0 - 1.0] (Gamma de-companding)
 * Uses standard IEC 61966-2-1 piecewise formula.
 */
export function srgbChannelToLinear(c: number): number {
  const cNorm = clamp(c, 0, 255) / 255;
  return cNorm <= 0.04045
    ? cNorm / 12.92
    : Math.pow((cNorm + 0.055) / 1.055, 2.4);
}

/**
 * Converts Linear sRGB channel [0.0 - 1.0] back to 8-bit sRGB [0 - 255] (Gamma companding)
 */
export function linearChannelToSrgb(c: number): number {
  const cClamped = Math.max(0, Math.min(1, c));
  const srgbNorm = cClamped <= 0.0031308
    ? 12.92 * cClamped
    : 1.055 * Math.pow(cClamped, 1 / 2.4) - 0.055;
  return Math.round(clamp(srgbNorm * 255, 0, 255));
}

/**
 * Converts standard 8-bit RGB [0-255] to Linear RGB [0-1]
 */
export function rgbToLinear(rgb: RGBColor): LinearRGB {
  return {
    r: srgbChannelToLinear(rgb.r),
    g: srgbChannelToLinear(rgb.g),
    b: srgbChannelToLinear(rgb.b),
    a: rgb.a !== undefined ? rgb.a : 1
  };
}

/**
 * Converts Linear RGB [0-1] back to standard 8-bit RGB [0-255]
 */
export function linearToRgb(lin: LinearRGB): RGBColor {
  return {
    r: linearChannelToSrgb(lin.r),
    g: linearChannelToSrgb(lin.g),
    b: linearChannelToSrgb(lin.b),
    a: lin.a !== undefined ? lin.a : 1
  };
}

/**
 * Multiplies a 3x3 Matrix with a 3-element vector [r, g, b]
 */
export function applyMatrix3x3(matrix: Matrix3x3, r: number, g: number, b: number): [number, number, number] {
  const rOut = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const gOut = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const bOut = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;
  return [rOut, gOut, bOut];
}

/**
 * Calculates exact WCAG 2.1 relative luminance for an sRGB color.
 * L = 0.2126 * R_lin + 0.7152 * G_lin + 0.0722 * B_lin
 */
export function calculateRelativeLuminance(rgb: RGBColor): number {
  const rLin = srgbChannelToLinear(rgb.r);
  const gLin = srgbChannelToLinear(rgb.g);
  const bLin = srgbChannelToLinear(rgb.b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Parses Hex, RGB, RGBA, or HSL color string into RGBColor structure
 */
export function parseColor(input: string): RGBColor {
  const str = input.trim().toLowerCase();

  // 1. Hex codes (#RGB, #RGBA, #RRGGBB, #RRGGBBAA)
  if (str.startsWith('#')) {
    const hex = str.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1
      };
    }
    if (hex.length === 4) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: parseInt(hex[3] + hex[3], 16) / 255
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
        a: 1
      };
    }
    if (hex.length === 8) {
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
        a: parseInt(hex.substring(6, 8), 16) / 255
      };
    }
  }

  // 2. rgb(...) / rgba(...)
  const rgbMatch = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (rgbMatch) {
    return {
      r: clamp(parseFloat(rgbMatch[1]), 0, 255),
      g: clamp(parseFloat(rgbMatch[2]), 0, 255),
      b: clamp(parseFloat(rgbMatch[3]), 0, 255),
      a: rgbMatch[4] !== undefined ? clamp(parseFloat(rgbMatch[4]), 0, 1) : 1
    };
  }

  // 3. hsl(...) / hsla(...)
  const hslMatch = str.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)/);
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]) % 360;
    const s = clamp(parseFloat(hslMatch[2]) / 100, 0, 1);
    const l = clamp(parseFloat(hslMatch[3]) / 100, 0, 1);
    const a = hslMatch[4] !== undefined ? clamp(parseFloat(hslMatch[4]), 0, 1) : 1;
    const rgb = hslToRgb(h, s, l);
    return { ...rgb, a };
  }

  // Fallback / default black
  return { r: 0, g: 0, b: 0, a: 1 };
}

/**
 * Converts HSL values to RGB
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;

  if (hp >= 0 && hp < 1) { r1 = c; g1 = x; b1 = 0; }
  else if (hp >= 1 && hp < 2) { r1 = x; g1 = c; b1 = 0; }
  else if (hp >= 2 && hp < 3) { r1 = 0; g1 = c; b1 = x; }
  else if (hp >= 3 && hp < 4) { r1 = 0; g1 = x; b1 = c; }
  else if (hp >= 4 && hp < 5) { r1 = x; g1 = 0; b1 = c; }
  else if (hp >= 5 && hp < 6) { r1 = c; g1 = 0; b1 = x; }

  const m = l - c / 2;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255)
  };
}

/**
 * Converts RGBColor to Hex string (#RRGGBB or #RRGGBBAA)
 */
export function rgbToHex(color: RGBColor, includeAlpha: boolean = false): string {
  const rHex = Math.round(clamp(color.r)).toString(16).padStart(2, '0');
  const gHex = Math.round(clamp(color.g)).toString(16).padStart(2, '0');
  const bHex = Math.round(clamp(color.b)).toString(16).padStart(2, '0');

  if (includeAlpha && color.a !== undefined && color.a < 1) {
    const aHex = Math.round(clamp(color.a * 255)).toString(16).padStart(2, '0');
    return `#${rHex}${gHex}${bHex}${aHex}`.toUpperCase();
  }

  return `#${rHex}${gHex}${bHex}`.toUpperCase();
}

/**
 * Formats RGBColor as CSS rgba(...) string
 */
export function rgbToRgbaString(color: RGBColor): string {
  const a = color.a !== undefined ? color.a : 1;
  return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${a})`;
}
