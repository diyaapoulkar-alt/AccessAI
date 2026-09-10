import { describe, it, expect } from 'vitest';
import { simulateCVDColor, simulateRGB, simulatePalette } from '../color-transform';
import { parseColor } from '../color-math';

describe('CVD Color Transformations', () => {
  it('returns identical color for normal vision and zero severity', () => {
    const red = '#FF0000';
    expect(simulateCVDColor(red, 'normal')).toBe('#FF0000');
    expect(simulateCVDColor(red, 'protanopia', 0)).toBe('#FF0000');
  });

  it('transforms pure red under Protanopia to darkened brown/yellowish tone', () => {
    const red = '#FF0000';
    const simulated = simulateCVDColor(red, 'protanopia');
    const parsed = parseColor(simulated);

    // In Protanopia, pure red loses L-cone excitation -> significantly darkened
    expect(parsed.r).toBeLessThan(255);
    expect(parsed.r).toBeGreaterThan(0);
    expect(parsed.g).toBeGreaterThan(0);
    // Blues remain virtually 0 for pure red
    expect(parsed.b).toBe(0);
  });

  it('transforms pure red under Deuteranopia with preserved brightness relative to Protanopia', () => {
    const red = '#FF0000';
    const protSim = simulateCVDColor(red, 'protanopia');
    const deutSim = simulateCVDColor(red, 'deuteranopia');

    const protRGB = parseColor(protSim);
    const deutRGB = parseColor(deutSim);

    // Deuteranopia red is perceived brighter than Protanopia red
    expect(deutRGB.r).toBeGreaterThanOrEqual(protRGB.r);
  });

  it('produces equal R, G, B channels under Achromatopsia (monochromacy)', () => {
    const red = '#FF0000';
    const green = '#00FF00';
    const blue = '#0000FF';
    const yellow = '#FFFF00';

    [red, green, blue, yellow].forEach((color) => {
      const simulated = simulateCVDColor(color, 'achromatopsia');
      const rgb = parseColor(simulated);
      expect(rgb.r).toBe(rgb.g);
      expect(rgb.g).toBe(rgb.b);
    });
  });

  it('supports severity interpolation (e.g. 50% severity)', () => {
    const red = { r: 255, g: 0, b: 0 };
    const full = simulateRGB(red, 'deuteranopia', 1.0);
    const half = simulateRGB(red, 'deuteranopia', 0.5);

    // Half severity green channel should be between normal (0) and full deuteranopia green
    expect(half.g).toBeGreaterThan(0);
    expect(half.g).toBeLessThan(full.g);
  });

  it('correctly simulates entire palette arrays', () => {
    const palette = ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#000000'];
    const transformed = simulatePalette(palette, 'deuteranopia');

    expect(transformed).toHaveLength(5);
    // White and Black remain White and Black
    expect(transformed[3]).toBe('#FFFFFF');
    expect(transformed[4]).toBe('#000000');
  });
});
