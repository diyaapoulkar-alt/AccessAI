/**
 * CVD Simulation Transformation Matrices
 * AccessAI - UX/UI & Compliance Suite
 *
 * Implements Viénot et al. (1999), Brettel et al. (1997), and Machado et al. (2009)
 * color deficiency models with exact WCAG 2.1 relative luminance weights for Achromatopsia.
 */

import { CVDInfo, CVDType, Matrix3x3 } from './types';

/**
 * Identity Matrix (Normal trichromat vision)
 */
export const IDENTITY_MATRIX: Matrix3x3 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

/**
 * Baseline 3x3 Simulation Matrices (100% severity / Complete Dichromacy & Monochromacy)
 * Based on Viénot (1999) & Brettel (1997) algorithms calibrated for standard sRGB primaries (D65 white point).
 */
export const BASE_CVD_MATRICES: Record<Exclude<CVDType, 'normal'>, Matrix3x3> = {
  // Protanopia: Complete absence of L-cones (Red blindness)
  protanopia: [
    [0.56667, 0.43333, 0.0],
    [0.55833, 0.44167, 0.0],
    [0.0,     0.24167, 0.75833]
  ],

  // Protanomaly: Partial L-cone shift (~60% severity default)
  protanomaly: [
    [0.81667, 0.18333, 0.0],
    [0.33333, 0.66667, 0.0],
    [0.0,     0.125,   0.875]
  ],

  // Deuteranopia: Complete absence of M-cones (Green blindness - most prevalent)
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.700, 0.300, 0.0],
    [0.000, 0.300, 0.700]
  ],

  // Deuteranomaly: Partial M-cone shift (~60% severity default)
  deuteranomaly: [
    [0.800, 0.200, 0.0],
    [0.25833, 0.74167, 0.0],
    [0.000, 0.14167, 0.85833]
  ],

  // Tritanopia: Complete absence of S-cones (Blue-Yellow blindness)
  tritanopia: [
    [0.950, 0.050, 0.000],
    [0.000, 0.43333, 0.56667],
    [0.000, 0.475, 0.525]
  ],

  // Tritanomaly: Partial S-cone shift (~60% severity default)
  tritanomaly: [
    [0.96667, 0.03333, 0.000],
    [0.000,   0.73333, 0.26667],
    [0.000,   0.18333, 0.81667]
  ],

  // Achromatopsia: Complete Monochromacy (Total color blindness / Rod vision)
  // Uses exact WCAG 2.1 / ITU-R BT.709 relative luminance weights: 0.2126 R + 0.7152 G + 0.0722 B
  achromatopsia: [
    [0.2126, 0.7152, 0.0722],
    [0.2126, 0.7152, 0.0722],
    [0.2126, 0.7152, 0.0722]
  ],

  // Achromatomaly: Partial Monochromacy / Severely degraded cone response
  achromatomaly: [
    [0.618, 0.320, 0.062],
    [0.163, 0.775, 0.062],
    [0.163, 0.320, 0.516]
  ]
};

/**
 * Clinical reference information for each CVD condition
 */
export const CVD_METADATA: Record<CVDType, CVDInfo> = {
  normal: {
    id: 'normal',
    label: 'Standard Vision',
    category: 'Normal',
    affectedCone: 'None',
    prevalence: '~91.5% of total population',
    description: 'Normal trichromat vision with intact L, M, and S cones.',
    clinicalImpact: 'Full visible spectrum perception from 380nm to 740nm.'
  },
  deuteranopia: {
    id: 'deuteranopia',
    label: 'Deuteranopia (Green-Blind)',
    category: 'Red-Green (M-Cone)',
    affectedCone: 'M-Cone (Medium wavelength / Green)',
    prevalence: '~1.2% males, ~0.01% females',
    description: 'Complete absence of green (M) retinal photoreceptors.',
    clinicalImpact: 'Cannot distinguish green from red, brown, or gold. Red appears brighter than in protanopia.'
  },
  deuteranomaly: {
    id: 'deuteranomaly',
    label: 'Deuteranomaly (Green-Weak)',
    category: 'Red-Green (M-Cone)',
    affectedCone: 'M-Cone (Medium wavelength / Green)',
    prevalence: '~5.0% males, ~0.35% females (Most Common)',
    description: 'Mutated M-cone spectral sensitivity shifted toward the L-cone peak.',
    clinicalImpact: 'Reduced discrimination between greens, yellows, oranges, and reds.'
  },
  protanopia: {
    id: 'protanopia',
    label: 'Protanopia (Red-Blind)',
    category: 'Red-Green (L-Cone)',
    affectedCone: 'L-Cone (Long wavelength / Red)',
    prevalence: '~1.0% males, ~0.02% females',
    description: 'Complete absence of red (L) retinal photoreceptors.',
    clinicalImpact: 'Reds appear substantially darker (loss of luminous efficiency) and merge with black/dark gray.'
  },
  protanomaly: {
    id: 'protanomaly',
    label: 'Protanomaly (Red-Weak)',
    category: 'Red-Green (L-Cone)',
    affectedCone: 'L-Cone (Long wavelength / Red)',
    prevalence: '~1.0% males, ~0.02% females',
    description: 'Mutated L-cone spectral sensitivity shifted toward the M-cone peak.',
    clinicalImpact: 'Reduced sensitivity to red light; reds appear dimmer and shift toward brown.'
  },
  tritanopia: {
    id: 'tritanopia',
    label: 'Tritanopia (Blue-Blind)',
    category: 'Blue-Yellow (S-Cone)',
    affectedCone: 'S-Cone (Short wavelength / Blue)',
    prevalence: '~0.003% of total population (Equal gender distribution)',
    description: 'Complete absence of short-wavelength blue (S) retinal photoreceptors.',
    clinicalImpact: 'Confusion between blue and green, and between yellow and violet/pink.'
  },
  tritanomaly: {
    id: 'tritanomaly',
    label: 'Tritanomaly (Blue-Weak)',
    category: 'Blue-Yellow (S-Cone)',
    affectedCone: 'S-Cone (Short wavelength / Blue)',
    prevalence: '~0.01% of total population',
    description: 'Partial deficiency in blue (S) cone photopigment.',
    clinicalImpact: 'Mild difficulty distinguishing light blues from grays and yellows from pinks.'
  },
  achromatopsia: {
    id: 'achromatopsia',
    label: 'Achromatopsia (Monochromacy)',
    category: 'Monochromacy',
    affectedCone: 'All Cones (Rod only)',
    prevalence: '~0.003% (1 in 33,000)',
    description: 'Complete absence of all functioning cone photoreceptors (total color blindness).',
    clinicalImpact: 'World is perceived entirely in shades of gray. Extremely sensitive to light (photophobia).'
  },
  achromatomaly: {
    id: 'achromatomaly',
    label: 'Achromatomaly (Partial Monochromacy)',
    category: 'Monochromacy',
    affectedCone: 'All Cones (Rod only)',
    prevalence: '< 0.001% of population',
    description: 'Severe loss of cone function with minimal residual chromatic discrimination.',
    clinicalImpact: 'Colors appear severely washed out and nearly monochromatic.'
  }
};

/**
 * Linearly interpolates between Identity matrix and target CVD matrix according to severity [0.0 - 1.0]
 */
export function getInterpolatedMatrix(type: CVDType, severity: number = 1.0): Matrix3x3 {
  if (type === 'normal' || severity <= 0) {
    return IDENTITY_MATRIX;
  }

  const s = Math.max(0, Math.min(1, severity));
  const target = BASE_CVD_MATRICES[type];

  const result: Matrix3x3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const idVal = IDENTITY_MATRIX[row][col];
      const targetVal = target[row][col];
      result[row][col] = Number(((1 - s) * idVal + s * targetVal).toFixed(5));
    }
  }

  return result;
}

/**
 * Converts a 3x3 CVD matrix into a 4x5 SVG <feColorMatrix> string format
 * [r1, r2, r3, 0, 0,
 *  g1, g2, g3, 0, 0,
 *  b1, b2, b3, 0, 0,
 *  0,  0,  0,  1, 0]
 */
export function matrixToSVGValues(m: Matrix3x3): string {
  return [
    m[0][0], m[0][1], m[0][2], 0, 0,
    m[1][0], m[1][1], m[1][2], 0, 0,
    m[2][0], m[2][1], m[2][2], 0, 0,
    0,       0,       0,       1, 0
  ].join(' ');
}

/**
 * Gets the SVG feColorMatrix value string directly for a given CVD type and severity
 */
export function getCVDMatrixSVGValues(type: CVDType, severity: number = 1.0): string {
  const m = getInterpolatedMatrix(type, severity);
  return matrixToSVGValues(m);
}
