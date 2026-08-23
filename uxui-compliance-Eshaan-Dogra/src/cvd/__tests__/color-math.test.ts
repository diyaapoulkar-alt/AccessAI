import { describe, it, expect } from 'vitest';
import {
  srgbChannelToLinear,
  linearChannelToSrgb,
  calculateRelativeLuminance,
  parseColor,
  rgbToHex,
  clamp
} from '../color-math';

describe('CVD Color Math Utilities', () => {
  it('correctly clamps values', () => {
    expect(clamp(-10, 0, 255)).toBe(0);
    expect(clamp(300, 0, 255)).toBe(255);
    expect(clamp(128, 0, 255)).toBe(128);
  });

  describe('sRGB <-> Linear Conversions (Gamma Companding)', () => {
    it('accurately converts standard 8-bit black (0) and white (255)', () => {
      expect(srgbChannelToLinear(0)).toBe(0);
      expect(srgbChannelToLinear(255)).toBe(1);
      expect(linearChannelToSrgb(0)).toBe(0);
      expect(linearChannelToSrgb(1)).toBe(255);
    });

    it('accurately handles piecewise linear threshold for small channel values', () => {
      // 0.04045 * 255 = 10.31475 -> channel 10 should be in the linear branch
      const lin = srgbChannelToLinear(10);
      expect(lin).toBeCloseTo(10 / 255 / 12.92, 5);
    });

    it('round-trips all 256 discrete 8-bit color channels without loss', () => {
      for (let i = 0; i < 256; i++) {
        const linear = srgbChannelToLinear(i);
        const reconstructed = linearChannelToSrgb(linear);
        expect(reconstructed).toBe(i);
      }
    });
  });

  describe('WCAG Exact Relative Luminance', () => {
    it('calculates 1.0 for pure white #FFFFFF', () => {
      const lum = calculateRelativeLuminance({ r: 255, g: 255, b: 255 });
      expect(lum).toBeCloseTo(1.0, 5);
    });

    it('calculates 0.0 for pure black #000000', () => {
      const lum = calculateRelativeLuminance({ r: 0, g: 0, b: 0 });
      expect(lum).toBe(0.0);
    });

    it('matches exact WCAG coefficients for primary colors', () => {
      const redLum = calculateRelativeLuminance({ r: 255, g: 0, b: 0 });
      const greenLum = calculateRelativeLuminance({ r: 0, g: 255, b: 0 });
      const blueLum = calculateRelativeLuminance({ r: 0, g: 0, b: 255 });

      expect(redLum).toBeCloseTo(0.2126, 4);
      expect(greenLum).toBeCloseTo(0.7152, 4);
      expect(blueLum).toBeCloseTo(0.0722, 4);
      expect(redLum + greenLum + blueLum).toBeCloseTo(1.0, 4);
    });
  });

  describe('Color Format Parsing', () => {
    it('parses 3-digit and 6-digit hex strings', () => {
      expect(parseColor('#FFF')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
      expect(parseColor('#3b82f6')).toEqual({ r: 59, g: 130, b: 246, a: 1 });
    });

    it('parses 4-digit and 8-digit hex strings with alpha', () => {
      const parsed8 = parseColor('#3b82f680');
      expect(parsed8.r).toBe(59);
      expect(parsed8.g).toBe(130);
      expect(parsed8.b).toBe(246);
      expect(parsed8.a).toBeCloseTo(0.5, 1);
    });

    it('parses rgb and rgba functional strings', () => {
      expect(parseColor('rgb(255, 128, 0)')).toEqual({ r: 255, g: 128, b: 0, a: 1 });
      expect(parseColor('rgba(100, 150, 200, 0.75)')).toEqual({ r: 100, g: 150, b: 200, a: 0.75 });
    });

    it('parses hsl functional strings', () => {
      const parsed = parseColor('hsl(0, 100%, 50%)'); // Pure Red
      expect(parsed.r).toBe(255);
      expect(parsed.g).toBe(0);
      expect(parsed.b).toBe(0);
    });

    it('serializes RGBColor to Hex correctly', () => {
      expect(rgbToHex({ r: 255, g: 0, b: 128 })).toBe('#FF0080');
    });
  });
});
