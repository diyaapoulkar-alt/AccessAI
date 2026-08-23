/**
 * Floating Accessibility Settings Modal (Drake Theme)
 * AccessAI - UX/UI & Compliance Suite
 */

import React, { useState, useEffect, useRef } from 'react';
import { Settings, X } from 'lucide-react';
import { AccessibilitySettingsPanel } from './AccessibilitySettingsPanel';
import { useAccessibility } from './useAccessibility';

export interface AccessibilitySettingsModalProps {
  className?: string;
}

export const AccessibilitySettingsModal: React.FC<AccessibilitySettingsModalProps> = ({
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isHighContrast, isOpenDyslexic } = useAccessibility();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Sleek, Perfectly-Sized Floating Trigger Button */}
      <div className={`fixed bottom-5 right-5 lg:bottom-6 lg:right-6 z-40 ${className}`}>
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          title="Accessibility & Theme Preferences (Alt+A)"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#28e98c] hover:bg-[#20c978] text-black font-extrabold text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(40,233,140,0.35)] border border-[#28e98c] transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#28e98c]/50"
        >
          <Settings className="w-3.5 h-3.5" aria-hidden="true" />
          <span>A11Y</span>
          {(isHighContrast || isOpenDyslexic) && (
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Accessible Backdrop & Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.9)] focus:outline-none"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-5 right-5 z-10 p-2 text-slate-400 hover:text-white bg-[#1a1a1a] hover:bg-[#242424] border border-[#333333] rounded-full transition-colors"
              title="Close accessibility dialog (Escape)"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close preferences dialog</span>
            </button>

            <AccessibilitySettingsPanel onClose={handleClose} />
          </div>
        </div>
      )}
    </>
  );
};
