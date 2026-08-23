import { describe, it, expect } from 'vitest';
import {
  calculateContrastRatio,
  calculateRelativeLuminance,
  compositeColor,
  evaluateContrast,
  formatContrastRatio
} from '../wcag-math';

describe('WCAG Contrast Math Engine', () => {
  describe('Relative Luminance Calculation', () => {
    it('returns 1.0 for pure white (#FFFFFF)', () => {
      expect(calculateRelativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1.0, 5);
    });

    it('returns 0.0 for pure black (#000000)', () => {
      expect(calculateRelativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0.0);
    });
  });

  describe('Contrast Ratio Formula: (L1 + 0.05) / (L2 + 0.05)', () => {
    it('returns exactly 21:1 for Black (#000000) vs White (#FFFFFF)', () => {
      const ratio = calculateContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBe(21.0);
      expect(formatContrastRatio(ratio)).toBe('21.00:1');
    });

    it('returns 1:1 for identical colors', () => {
      expect(calculateContrastRatio('#3b82f6', '#3b82f6')).toBe(1.0);
    });

    it('is symmetric regardless of foreground and background order', () => {
      const r1 = calculateContrastRatio('#6366F1', '#FFFFFF');
      const r2 = calculateContrastRatio('#FFFFFF', '#6366F1');
      expect(r1).toBe(r2);
    });

    it('matches known WCAG reference threshold values', () => {
      // #767676 on #FFFFFF is the canonical minimum 4.54:1 AA boundary
      const ratio76 = calculateContrastRatio('#767676', '#FFFFFF');
      expect(ratio76).toBeGreaterThanOrEqual(4.5);
      expect(ratio76).toBeLessThan(4.6);

      // #595959 on #FFFFFF is the canonical minimum 7.0:1 AAA boundary
      const ratio59 = calculateContrastRatio('#595959', '#FFFFFF');
      expect(ratio59).toBeGreaterThanOrEqual(7.0);
    });
  });

  describe('Alpha Compositing Calculation', () => {
    it('composites semi-transparent white 50% over black to produce 50% gray', () => {
      const fg = { r: 255, g: 255, b: 255, a: 0.5 };
      const bg = { r: 0, g: 0, b: 0, a: 1 };
      const comp = compositeColor(fg, bg);

      expect(comp.r).toBe(128);
      expect(comp.g).toBe(128);
      expect(comp.b).toBe(128);
    });

    it('calculates contrast with alpha foreground against opaque background', () => {
      // 50% transparent black over white background
      const ratio = calculateContrastRatio('rgba(0, 0, 0, 0.5)', '#FFFFFF');
      expect(ratio).toBeGreaterThan(1.0);
      expect(ratio).toBeLessThan(21.0);
    });
  });

  describe('Full WCAG Criteria Evaluator', () => {
    it('reports PASS AA and PASS AAA for Black on White', () => {
      const result = evaluateContrast('#000000', '#FFFFFF');
      expect(result.ratio).toBe(21.0);
      expect(result.normalText.passesAA).toBe(true);
      expect(result.normalText.passesAAA).toBe(true);
      expect(result.normalText.level).toBe('AAA');
      expect(result.largeText.passesAA).toBe(true);
      expect(result.uiComponents.passesAA).toBe(true);
    });

    it('reports FAIL for low contrast pairing (e.g. #94A3B8 on #CBD5E1)', () => {
      const result = evaluateContrast('#94A3B8', '#CBD5E1');
      expect(result.ratio).toBeLessThan(3.0);
      expect(result.normalText.passesAA).toBe(false);
      expect(result.normalText.level).toBe('FAIL');
    });
  });
});
