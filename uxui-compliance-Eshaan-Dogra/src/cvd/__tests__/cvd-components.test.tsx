import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CVDSimulatorToolbar } from '../CVDSimulatorToolbar';
import { CVDPreviewWrapper } from '../CVDPreviewWrapper';

describe('CVD React Components', () => {
  describe('<CVDSimulatorToolbar />', () => {
    it('renders with standard vision selected by default', () => {
      render(
        <CVDSimulatorToolbar
          currentType="normal"
          severity={1.0}
          comparisonMode="full"
          onTypeChange={vi.fn()}
          onSeverityChange={vi.fn()}
          onModeChange={vi.fn()}
          onReset={vi.fn()}
        />
      );

      const select = screen.getByLabelText(/vision mode/i) as HTMLSelectElement;
      expect(select.value).toBe('normal');
    });

    it('triggers onTypeChange when user changes dropdown selection', () => {
      const handleTypeChange = vi.fn();
      render(
        <CVDSimulatorToolbar
          currentType="normal"
          severity={1.0}
          comparisonMode="full"
          onTypeChange={handleTypeChange}
          onSeverityChange={vi.fn()}
          onModeChange={vi.fn()}
          onReset={vi.fn()}
        />
      );

      const select = screen.getByLabelText(/vision mode/i);
      fireEvent.change(select, { target: { value: 'deuteranopia' } });

      expect(handleTypeChange).toHaveBeenCalledWith('deuteranopia');
    });

    it('shows severity slider and reset button when simulating a condition', () => {
      const handleSeverityChange = vi.fn();
      const handleReset = vi.fn();

      render(
        <CVDSimulatorToolbar
          currentType="protanopia"
          severity={0.8}
          comparisonMode="full"
          onTypeChange={vi.fn()}
          onSeverityChange={handleSeverityChange}
          onModeChange={vi.fn()}
          onReset={handleReset}
        />
      );

      const slider = screen.getByLabelText(/severity/i) as HTMLInputElement;
      expect(slider).toBeInTheDocument();
      expect(slider.value).toBe('0.8');

      fireEvent.change(slider, { target: { value: '0.5' } });
      expect(handleSeverityChange).toHaveBeenCalledWith(0.5);

      const resetButton = screen.getByTitle(/reset vision simulator/i);
      fireEvent.click(resetButton);
      expect(handleReset).toHaveBeenCalled();
    });

    it('triggers onModeChange when view mode buttons are clicked', () => {
      const handleModeChange = vi.fn();
      render(
        <CVDSimulatorToolbar
          currentType="deuteranopia"
          severity={1.0}
          comparisonMode="full"
          onTypeChange={vi.fn()}
          onSeverityChange={vi.fn()}
          onModeChange={handleModeChange}
          onReset={vi.fn()}
        />
      );

      const splitButton = screen.getByRole('button', { name: /split/i });
      fireEvent.click(splitButton);
      expect(handleModeChange).toHaveBeenCalledWith('split-vertical');

      const sideBySideButton = screen.getByRole('button', { name: /side-by-side/i });
      fireEvent.click(sideBySideButton);
      expect(handleModeChange).toHaveBeenCalledWith('side-by-side');
    });
  });

  describe('<CVDPreviewWrapper />', () => {
    it('renders children and injects SVG filter definitions', () => {
      const { container } = render(
        <CVDPreviewWrapper type="deuteranopia">
          <div data-testid="target-content">Test UI Content</div>
        </CVDPreviewWrapper>
      );

      expect(screen.getByTestId('target-content')).toBeInTheDocument();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.querySelector('#accessai-cvd-deuteranopia')).toBeInTheDocument();
    });

    it('renders split divider in split mode', () => {
      render(
        <CVDPreviewWrapper type="deuteranopia" comparisonMode="split-vertical" splitPosition={40}>
          <div>Interactive UI</div>
        </CVDPreviewWrapper>
      );

      const slider = screen.getByRole('slider', { name: /comparison split slider/i });
      expect(slider).toBeInTheDocument();
      expect(slider).toHaveAttribute('aria-valuenow', '40');
    });
  });
});
