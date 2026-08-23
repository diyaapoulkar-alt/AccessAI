import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccessibilityProvider, useAccessibility, STORAGE_KEY } from '../AccessibilityContext';

function TestConsumer() {
  const {
    preferences,
    setTheme,
    setFontFamily,
    setTextScale,
    setLineSpacing,
    resetPreferences,
    isHighContrast,
    isOpenDyslexic
  } = useAccessibility();

  return (
    <div>
      <div data-testid="theme">{preferences.theme}</div>
      <div data-testid="font">{preferences.fontFamily}</div>
      <div data-testid="scale">{preferences.textScale}</div>
      <div data-testid="spacing">{preferences.lineSpacing}</div>
      <div data-testid="is-hc">{isHighContrast ? 'true' : 'false'}</div>
      <div data-testid="is-dyslexic">{isOpenDyslexic ? 'true' : 'false'}</div>

      <button onClick={() => setTheme('high-contrast-yellow')}>Set HC Yellow</button>
      <button onClick={() => setFontFamily('opendyslexic')}>Set Dyslexic</button>
      <button onClick={() => setTextScale('130')}>Set Scale 130</button>
      <button onClick={() => setLineSpacing('relaxed')}>Set Spacing Relaxed</button>
      <button onClick={resetPreferences}>Reset</button>
    </div>
  );
}

describe('AccessibilityContext & Provider', () => {
  beforeEach(() => {
    try {
      window.localStorage?.clear();
    } catch {
      // ignore
    }
    document.documentElement.className = '';
  });

  it('provides default preferences and attaches default classes', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(screen.getByTestId('font').textContent).toBe('default');
    expect(screen.getByTestId('is-hc').textContent).toBe('false');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('applies high-contrast-yellow theme and attaches .theme-hc-yellow class', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    const btn = screen.getByText('Set HC Yellow');
    fireEvent.click(btn);

    expect(screen.getByTestId('theme').textContent).toBe('high-contrast-yellow');
    expect(screen.getByTestId('is-hc').textContent).toBe('true');
    expect(document.documentElement.classList.contains('theme-hc-yellow')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Verify localStorage persistence
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    expect(saved.theme).toBe('high-contrast-yellow');
  });

  it('toggles OpenDyslexic font and attaches .font-opendyslexic class', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    const btn = screen.getByText('Set Dyslexic');
    fireEvent.click(btn);

    expect(screen.getByTestId('font').textContent).toBe('opendyslexic');
    expect(screen.getByTestId('is-dyslexic').textContent).toBe('true');
    expect(document.documentElement.classList.contains('font-opendyslexic')).toBe(true);
  });

  it('updates text scale and line spacing classes', () => {
    render(
      <AccessibilityProvider>
        <TestConsumer />
      </AccessibilityProvider>
    );

    fireEvent.click(screen.getByText('Set Scale 130'));
    fireEvent.click(screen.getByText('Set Spacing Relaxed'));

    expect(document.documentElement.classList.contains('text-scale-130')).toBe(true);
    expect(document.documentElement.classList.contains('line-spacing-relaxed')).toBe(true);
  });
});
