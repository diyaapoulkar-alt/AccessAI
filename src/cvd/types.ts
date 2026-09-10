/**
 * Color Vision Deficiency (CVD) Simulator Types
 * AccessAI - UX/UI & Compliance Suite
 */

export type DichromacyType = 'protanopia' | 'deuteranopia' | 'tritanopia';
export type AnomalousTrichromacyType = 'protanomaly' | 'deuteranomaly' | 'tritanomaly';
export type MonochromacyType = 'achromatopsia' | 'achromatomaly';

export type CVDType = 
  | 'normal'
  | DichromacyType
  | AnomalousTrichromacyType
  | MonochromacyType;

export interface CVDInfo {
  id: CVDType;
  label: string;
  category: 'Normal' | 'Red-Green (L-Cone)' | 'Red-Green (M-Cone)' | 'Blue-Yellow (S-Cone)' | 'Monochromacy';
  affectedCone: 'None' | 'L-Cone (Long wavelength / Red)' | 'M-Cone (Medium wavelength / Green)' | 'S-Cone (Short wavelength / Blue)' | 'All Cones (Rod only)';
  prevalence: string;
  description: string;
  clinicalImpact: string;
}

export type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

export interface RGBColor {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
  a?: number; // 0 - 1
}

export interface LinearRGB {
  r: number; // 0 - 1
  g: number; // 0 - 1
  b: number; // 0 - 1
  a?: number; // 0 - 1
}

export interface LMSColor {
  l: number;
  m: number;
  s: number;
}

export type ComparisonMode = 'full' | 'split-vertical' | 'split-horizontal' | 'side-by-side';

export interface CVDSimulatorState {
  type: CVDType;
  severity: number; // 0.0 to 1.0 (default 1.0)
  comparisonMode: ComparisonMode;
  splitPosition: number; // 0 to 100 percentage
}
