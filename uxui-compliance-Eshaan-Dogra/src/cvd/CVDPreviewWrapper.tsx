/**
 * CVD Preview Wrapper Component (Drake Theme)
 * AccessAI - UX/UI & Compliance Suite
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { CVDSVGFilters, getCVDStyleFilter } from './svg-filters';
import { CVD_METADATA } from './matrices';
import { CVDType, ComparisonMode } from './types';

export interface CVDPreviewWrapperProps {
  children: React.ReactNode;
  type: CVDType;
  severity?: number;
  comparisonMode?: ComparisonMode;
  splitPosition?: number;
  onSplitChange?: (position: number) => void;
  className?: string;
  filterIdPrefix?: string;
  showLabels?: boolean;
}

export const CVDPreviewWrapper: React.FC<CVDPreviewWrapperProps> = ({
  children,
  type,
  severity = 1.0,
  comparisonMode = 'full',
  splitPosition: controlledSplit,
  onSplitChange,
  className = '',
  filterIdPrefix = 'accessai-cvd-',
  showLabels = true
}) => {
  const [internalSplit, setInternalSplit] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const splitPos = controlledSplit !== undefined ? controlledSplit : internalSplit;
  const setSplit = useCallback(
    (pos: number) => {
      const clamped = Math.max(0, Math.min(100, pos));
      if (onSplitChange) {
        onSplitChange(clamped);
      } else {
        setInternalSplit(clamped);
      }
    },
    [onSplitChange]
  );

  const filterStyle = getCVDStyleFilter(type, severity, filterIdPrefix);
  const info = CVD_METADATA[type];
  const isSimulating = type !== 'normal' && severity > 0;

  // Handle Dragging for Split Slider
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let pos = 50;
      if (comparisonMode === 'split-horizontal') {
        pos = ((e.clientY - rect.top) / rect.height) * 100;
      } else {
        pos = ((e.clientX - rect.left) / rect.width) * 100;
      }
      setSplit(pos);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, comparisonMode, setSplit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSplit(splitPos - step);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSplit(splitPos + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSplit(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSplit(100);
    }
  };

  return (
    <div className={`relative w-full overflow-hidden select-none ${className}`}>
      {/* Hidden SVG Filter Definitions */}
      <CVDSVGFilters
        idPrefix={filterIdPrefix}
        customType={type}
        customSeverity={severity}
      />

      {/* 1. Full View Mode */}
      {comparisonMode === 'full' && (
        <div
          className="w-full h-full transition-all duration-150 rounded-3xl overflow-hidden shadow-2xl border border-[#262626]"
          style={{ filter: filterStyle }}
        >
          {children}
        </div>
      )}

      {/* 2. Side-by-Side Mode */}
      {comparisonMode === 'side-by-side' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Left: Original Normal View */}
          <div className="relative border border-[#262626] rounded-3xl overflow-hidden bg-[#0d0d0d] shadow-xl">
            {showLabels && (
              <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 text-[11px] font-black tracking-wider uppercase bg-black/85 text-slate-200 border border-[#333333] rounded-full backdrop-blur-md">
                Original (Trichromat)
              </div>
            )}
            <div className="w-full h-full">{children}</div>
          </div>

          {/* Right: Simulated CVD View */}
          <div className="relative border border-[#28e98c]/50 rounded-3xl overflow-hidden bg-[#0d0d0d] shadow-xl">
            {showLabels && (
              <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 text-[11px] font-black tracking-wider uppercase bg-[#28e98c] text-black rounded-full backdrop-blur-md shadow-md">
                Simulated: {info.label} ({Math.round(severity * 100)}%)
              </div>
            )}
            <div className="w-full h-full" style={{ filter: filterStyle }}>
              {children}
            </div>
          </div>
        </div>
      )}

      {/* 3. Interactive Split Comparison Mode */}
      {(comparisonMode === 'split-vertical' || comparisonMode === 'split-horizontal') && (
        <div
          ref={containerRef}
          className="relative w-full h-full border border-[#262626] rounded-3xl overflow-hidden select-none bg-[#0d0d0d] shadow-2xl"
        >
          {/* Base Layer: Original Trichromat */}
          <div className="w-full h-full">
            {children}
          </div>

          {/* Overlay Layer: Simulated CVD */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              filter: filterStyle,
              clipPath:
                comparisonMode === 'split-vertical'
                  ? `polygon(${splitPos}% 0%, 100% 0%, 100% 100%, ${splitPos}% 100%)`
                  : `polygon(0% ${splitPos}%, 100% ${splitPos}%, 100% 100%, 0% ${splitPos}%)`,
            }}
          >
            <div className="w-full h-full pointer-events-auto">
              {children}
            </div>
          </div>

          {/* Dynamic Labels Overlay */}
          {showLabels && isSimulating && (
            <>
              <div
                className="absolute top-4 left-4 z-20 px-3.5 py-1.5 text-[10px] font-black tracking-widest uppercase bg-black/85 text-slate-200 border border-[#333333] rounded-full backdrop-blur-md pointer-events-none"
                style={{ opacity: splitPos < 15 ? 0.3 : 1 }}
              >
                Original
              </div>
              <div
                className="absolute top-4 right-4 z-20 px-3.5 py-1.5 text-[10px] font-black tracking-widest uppercase bg-[#28e98c] text-black font-extrabold rounded-full backdrop-blur-md pointer-events-none shadow-lg shadow-[#28e98c]/30"
                style={{ opacity: splitPos > 85 ? 0.3 : 1 }}
              >
                {info.label} ({Math.round(severity * 100)}%)
              </div>
            </>
          )}

          {/* Interactive Emerald Laser Split Divider Handle */}
          {isSimulating && (
            <div
              role="slider"
              tabIndex={0}
              aria-label="Comparison split slider"
              aria-valuenow={Math.round(splitPos)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`${Math.round(splitPos)} percent original vision`}
              onKeyDown={handleKeyDown}
              onPointerDown={handlePointerDown}
              className={`absolute z-30 flex items-center justify-center cursor-ew-resize focus:outline-none ${
                comparisonMode === 'split-vertical'
                  ? 'top-0 bottom-0 w-1 -ml-0.5 bg-[#28e98c] shadow-[0_0_15px_#28e98c]'
                  : 'left-0 right-0 h-1 -mt-0.5 bg-[#28e98c] cursor-ns-resize shadow-[0_0_15px_#28e98c]'
              }`}
              style={
                comparisonMode === 'split-vertical'
                  ? { left: `${splitPos}%` }
                  : { top: `${splitPos}%` }
              }
            >
              <div className="w-7 h-7 rounded-full bg-black border-2 border-[#28e98c] shadow-lg shadow-[#28e98c]/40 flex items-center justify-center text-[10px] font-black text-[#28e98c] pointer-events-none">
                ↔
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
