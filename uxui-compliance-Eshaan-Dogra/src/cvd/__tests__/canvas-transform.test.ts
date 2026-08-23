import { describe, it, expect } from 'vitest';
import { simulateImageData } from '../canvas-transform';

describe('Canvas & ImageData CVD Transformer', () => {
  it('correctly transforms pixel buffer and preserves alpha channel', () => {
    // 2x2 image (4 pixels = 16 bytes)
    const rawData = new Uint8ClampedArray([
      255, 0, 0, 255,     // Pixel 1: Red (fully opaque)
      0, 255, 0, 128,     // Pixel 2: Green (semi-transparent)
      0, 0, 255, 64,      // Pixel 3: Blue (semi-transparent)
      255, 255, 255, 255  // Pixel 4: White (fully opaque)
    ]);

    const imageData = {
      data: rawData,
      width: 2,
      height: 2,
      colorSpace: 'srgb' as PredefinedColorSpace
    } as ImageData;

    const result = simulateImageData(imageData, 'achromatopsia', 1.0, false);

    // Alpha channels must remain untouched
    expect(result.data[3]).toBe(255);
    expect(result.data[7]).toBe(128);
    expect(result.data[11]).toBe(64);
    expect(result.data[15]).toBe(255);

    // Pixel 1 (originally Red) in Achromatopsia should be grayscale
    expect(result.data[0]).toBe(result.data[1]);
    expect(result.data[1]).toBe(result.data[2]);

    // Pixel 4 (White) should remain White
    expect(result.data[12]).toBe(255);
    expect(result.data[13]).toBe(255);
    expect(result.data[14]).toBe(255);
  });
});
