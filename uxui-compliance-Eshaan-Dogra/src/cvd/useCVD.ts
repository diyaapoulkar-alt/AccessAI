/**
 * useCVD Hook - State and Control Manager for Color Vision Deficiency Simulation
 * AccessAI - UX/UI & Compliance Suite
 */

import { useState, useCallback, useEffect } from 'react';
import { CVDType, ComparisonMode, CVDSimulatorState } from './types';

const CVD_CYCLE_ORDER: CVDType[] = [
  'normal',
  'deuteranopia',
  'deuteranomaly',
  'protanopia',
  'protanomaly',
  'tritanopia',
  'tritanomaly',
  'achromatopsia',
  'achromatomaly'
];

export interface UseCVDOptions {
  initialType?: CVDType;
  initialSeverity?: number;
  initialMode?: ComparisonMode;
  enableKeyboardShortcuts?: boolean;
}

export function useCVD(options: UseCVDOptions = {}) {
  const {
    initialType = 'normal',
    initialSeverity = 1.0,
    initialMode = 'full',
    enableKeyboardShortcuts = true
  } = options;

  const [state, setState] = useState<CVDSimulatorState>({
    type: initialType,
    severity: initialSeverity,
    comparisonMode: initialMode,
    splitPosition: 50
  });

  const setCvdType = useCallback((type: CVDType) => {
    setState(prev => ({ ...prev, type }));
  }, []);

  const setSeverity = useCallback((severity: number) => {
    setState(prev => ({ ...prev, severity: Math.max(0, Math.min(1, severity)) }));
  }, []);

  const setComparisonMode = useCallback((comparisonMode: ComparisonMode) => {
    setState(prev => ({ ...prev, comparisonMode }));
  }, []);

  const setSplitPosition = useCallback((splitPosition: number) => {
    setState(prev => ({ ...prev, splitPosition: Math.max(0, Math.min(100, splitPosition)) }));
  }, []);

  const reset = useCallback(() => {
    setState({
      type: 'normal',
      severity: 1.0,
      comparisonMode: 'full',
      splitPosition: 50
    });
  }, []);

  const cycleNextCvd = useCallback(() => {
    setState(prev => {
      const currentIndex = CVD_CYCLE_ORDER.indexOf(prev.type);
      const nextIndex = (currentIndex + 1) % CVD_CYCLE_ORDER.length;
      return { ...prev, type: CVD_CYCLE_ORDER[nextIndex] };
    });
  }, []);

  // Keyboard shortcut listener (Alt + C to cycle, Alt + M to toggle split view)
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing in input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        cycleNextCvd();
      } else if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setState(prev => ({
          ...prev,
          comparisonMode: prev.comparisonMode === 'full' ? 'split-vertical' : 'full'
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts, cycleNextCvd]);

  const isSimulating = state.type !== 'normal' && state.severity > 0;

  return {
    ...state,
    isSimulating,
    setCvdType,
    setSeverity,
    setComparisonMode,
    setSplitPosition,
    reset,
    cycleNextCvd
  };
}
