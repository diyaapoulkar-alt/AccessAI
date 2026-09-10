import { describe, it, expect } from 'vitest';
import {
  rgbToHsl,
  adjustColorForContrast,
  generateCompliantPalette,
  generateContrastRamp
} from '../palette-generator';
import { calculateContrastRatio } from '../wcag-math';

describe('Compliant Palette Generator', () => {
  describe('HSL Conversion', () => {
    it('converts pure red #FF0000 to H:0, S:1, L:0.5', () => {
      const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(1);
      expect(hsl.l).toBe(0.5);
    });

    it('converts pure white and black correctly', () => {
      expect(rgbToHsl({ r: 255, g: 255, b: 255 }).l).toBe(1);
      expect(rgbToHsl({ r: 0, g: 0, b: 0 }).l).toBe(0);
    });
  });

  describe('adjustColorForContrast Lightness Bisection Search', () => {
    it('adjusts bright brand yellow (#FFFF00) to meet 4.5:1 against white (#FFFFFF)', () => {
      const adjusted = adjustColorForContrast('#FFFF00', '#FFFFFF', 4.5, 'darken');
      const ratio = calculateContrastRatio(adjusted, '#FFFFFF');

      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('adjusts dark navy (#1E293B) to meet 4.5:1 against dark surface (#0F172A)', () => {
      const adjusted = adjustColorForContrast('#1E293B', '#0F172A', 4.5, 'lighten');
      const ratio = calculateContrastRatio(adjusted, '#0F172A');

      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('generateCompliantPalette', () => {
    it('generates 5 standard UI pairings that meet or exceed AA standards', () => {
      const suggestions = generateCompliantPalette('#6366F1'); // Indigo

      expect(suggestions).toHaveLength(5);

      suggestions.forEach((item) => {
        expect(item.passesAA).toBe(true);
        expect(item.contrastRatio).toBeGreaterThanOrEqual(3.0);
      });
    });
  });

  describe('generateContrastRamp', () => {
    it('generates 10 steps from 50 to 900 with valid hex colors', () => {
      const ramp = generateContrastRamp('#3B82F6');

      expect(ramp).toHaveLength(10);
      expect(ramp[0].step).toBe(50);
      expect(ramp[9].step).toBe(900);

      // Lightest step (50) should pass contrast on black
      expect(ramp[0].passesAAOnBlack).toBe(true);
      // Darkest step (900) should pass contrast on white
      expect(ramp[9].passesAAOnWhite).toBe(true);
    });
  });
});
