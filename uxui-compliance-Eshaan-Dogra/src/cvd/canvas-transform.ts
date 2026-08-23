/**
 * Canvas & ImageData CVD Transformer (High-Performance Screenshot Scanner)
 * AccessAI - UX/UI & Compliance Suite
 *
 * Employs precomputed Gamma Lookup Tables (LUTs) for high-throughput pixel batch processing.
 */

import { srgbChannelToLinear, linearChannelToSrgb, clamp } from './color-math';
import { getInterpolatedMatrix } from './matrices';
import { CVDType } from './types';

// Precomputed 256-element gamma lookup table for linear conversions
const SRGB_TO_LINEAR_LUT = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  SRGB_TO_LINEAR_LUT[i] = srgbChannelToLinear(i);
}

/**
 * Creates an ImageData object safely in browser or headless/test environments
 */
export function createImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number
): ImageData {
  if (typeof ImageData !== 'undefined') {
    // Cast to ImageDataArray for TypeScript DOM type compatibility
    return new (ImageData as unknown as new (d: Uint8ClampedArray, w: number, h: number) => ImageData)(data, width, height);
  }
  return {
    data,
    width,
    height,
    colorSpace: 'srgb' as PredefinedColorSpace
  } as ImageData;
}

/**
 * Transforms an ImageData pixel buffer directly in place or creates a copy.
 * Optimized with flat matrix multiplication and gamma lookup.
 */
export function simulateImageData(
  source: ImageData,
  type: CVDType,
  severity: number = 1.0,
  inPlace: boolean = false
): ImageData {
  const data = inPlace ? source.data : new Uint8ClampedArray(source.data);
  const result = inPlace ? source : createImageData(data, source.width, source.height);

  if (type === 'normal' || severity <= 0) {
    return result;
  }

  const matrix = getInterpolatedMatrix(type, severity);
  const m00 = matrix[0][0], m01 = matrix[0][1], m02 = matrix[0][2];
  const m10 = matrix[1][0], m11 = matrix[1][1], m12 = matrix[1][2];
  const m20 = matrix[2][0], m21 = matrix[2][1], m22 = matrix[2][2];

  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Alpha at data[i + 3] remains untouched

    // 1. Fast LUT gamma de-companding
    const rLin = SRGB_TO_LINEAR_LUT[r];
    const gLin = SRGB_TO_LINEAR_LUT[g];
    const bLin = SRGB_TO_LINEAR_LUT[b];

    // 2. Matrix transformation
    const rSimLin = m00 * rLin + m01 * gLin + m02 * bLin;
    const gSimLin = m10 * rLin + m11 * gLin + m12 * bLin;
    const bSimLin = m20 * rLin + m21 * gLin + m22 * bLin;

    // 3. Re-gamma companding with clamping
    data[i] = linearChannelToSrgb(clamp(rSimLin, 0, 1));
    data[i + 1] = linearChannelToSrgb(clamp(gSimLin, 0, 1));
    data[i + 2] = linearChannelToSrgb(clamp(bSimLin, 0, 1));
  }

  return result;
}

/**
 * Transforms an HTMLCanvasElement into a simulated CVD view.
 */
export function simulateCanvas(
  sourceCanvas: HTMLCanvasElement,
  type: CVDType,
  severity: number = 1.0,
  targetCanvas?: HTMLCanvasElement
): HTMLCanvasElement {
  const output = targetCanvas || document.createElement('canvas');
  output.width = sourceCanvas.width;
  output.height = sourceCanvas.height;

  const srcCtx = sourceCanvas.getContext('2d');
  const dstCtx = output.getContext('2d');

  if (!srcCtx || !dstCtx) {
    throw new Error('Failed to obtain 2D rendering context from canvas.');
  }

  const rawImageData = srcCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const simulatedImageData = simulateImageData(rawImageData, type, severity, false);
  dstCtx.putImageData(simulatedImageData, 0, 0);

  return output;
}

/**
 * Transforms an HTMLImageElement and resolves with a simulated base64 Data URL.
 */
export function simulateImageElement(
  image: HTMLImageElement,
  type: CVDType,
  severity: number = 1.0
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context unavailable.');
      }

      ctx.drawImage(image, 0, 0);
      simulateCanvas(canvas, type, severity, canvas);
      resolve(canvas.toDataURL());
    } catch (err) {
      reject(err);
    }
  });
}
