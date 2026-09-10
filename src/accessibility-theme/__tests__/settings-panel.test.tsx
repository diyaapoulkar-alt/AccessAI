import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccessibilityProvider } from '../AccessibilityContext';
import { AccessibilitySettingsPanel } from '../AccessibilitySettingsPanel';

describe('<AccessibilitySettingsPanel />', () => {
  it('renders theme choices and accessibility controls', () => {
    render(
      <AccessibilityProvider>
        <AccessibilitySettingsPanel />
      </AccessibilityProvider>
    );

    expect(screen.getByText('High Contrast Yellow/Black')).toBeInTheDocument();
    expect(screen.getByText('Dyslexia-Friendly Typography (OpenDyslexic)')).toBeInTheDocument();
    expect(screen.getByText('High-Visibility Focus Indicators')).toBeInTheDocument();
  });

  it('selects high contrast theme when user clicks theme button', () => {
    render(
      <AccessibilityProvider>
        <AccessibilitySettingsPanel />
      </AccessibilityProvider>
    );

    const hcButton = screen.getByRole('button', { name: /high contrast yellow\/black/i });
    fireEvent.click(hcButton);

    expect(hcButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('High Contrast Active')).toBeInTheDocument();
  });

  it('toggles OpenDyslexic switch', () => {
    render(
      <AccessibilityProvider>
        <AccessibilitySettingsPanel />
      </AccessibilityProvider>
    );

    const switchBtn = screen.getByRole('switch', { name: /toggle opendyslexic font/i });
    expect(switchBtn).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(switchBtn);
    expect(switchBtn).toHaveAttribute('aria-checked', 'true');
  });
});
