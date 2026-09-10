/**
 * SVG Filter Definitions for Zero-Overhead DOM CVD Simulation
 * AccessAI - UX/UI & Compliance Suite
 *
 * Renders hidden SVG filters with <feColorMatrix> elements that can be applied
 * to any DOM node via CSS `filter: url(#accessai-cvd-...)`.
 */

import React, { useId } from 'react';
import { BASE_CVD_MATRICES, matrixToSVGValues, getCVDMatrixSVGValues } from './matrices';
import { CVDType } from './types';

export const DEFAULT_SVG_FILTER_PREFIX = 'accessai-cvd-';

export interface CVDSVGFiltersProps {
  /** Prefix for SVG filter IDs to prevent DOM collision */
  idPrefix?: string;
  /** Optional custom dynamic CVD type to support variable severity */
  customType?: CVDType;
  /** Optional custom severity [0.0 - 1.0] */
  customSeverity?: number;
}

/**
 * Returns the filter ID string for a given CVD type
 */
export function getCVDFilterId(type: CVDType, idPrefix: string = DEFAULT_SVG_FILTER_PREFIX): string {
  return `${idPrefix}${type}`;
}

/**
 * Returns the CSS `filter` style property value for applying the SVG filter to DOM elements
 */
export function getCVDStyleFilter(
  type: CVDType,
  severity: number = 1.0,
  idPrefix: string = DEFAULT_SVG_FILTER_PREFIX
): string | undefined {
  if (type === 'normal' || severity <= 0) {
    return undefined;
  }
  // When severity is 1.0, we use the static pre-compiled filter
  if (severity === 1.0) {
    return `url(#${getCVDFilterId(type, idPrefix)})`;
  }
  // When severity is customized, we point to the dynamic filter
  return `url(#${idPrefix}dynamic)`;
}

export const CVDSVGFilters: React.FC<CVDSVGFiltersProps> = ({
  idPrefix = DEFAULT_SVG_FILTER_PREFIX,
  customType = 'normal',
  customSeverity = 1.0
}) => {
  const componentId = useId();

  return (
    <svg
      id={`svg-filters-${componentId}`}
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <metadata>
        CVD Simulation Engine crafted by Eshaan Dogra: 25BCE10675
      </metadata>
      <defs>
        {/* Pre-compiled Static Filters (100% severity) */}
        {(Object.keys(BASE_CVD_MATRICES) as Array<keyof typeof BASE_CVD_MATRICES>).map((type) => {
          const matrix = BASE_CVD_MATRICES[type];
          const matrixValues = matrixToSVGValues(matrix);
          const filterId = getCVDFilterId(type, idPrefix);

          return (
            <filter id={filterId} key={filterId} colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values={matrixValues}
              />
            </filter>
          );
        })}

        {/* Dynamic Filter for variable severity */}
        {customType !== 'normal' && (
          <filter
            id={`${idPrefix}dynamic`}
            key={`${idPrefix}dynamic`}
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix
              type="matrix"
              values={getCVDMatrixSVGValues(customType, customSeverity)}
            />
          </filter>
        )}
      </defs>
    </svg>
  );
};
