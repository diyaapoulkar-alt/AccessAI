import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContrastCheckerCard } from '../ContrastCheckerCard';
import { PaletteGeneratorCard } from '../PaletteGeneratorCard';

describe('Contrast UI Components', () => {
  describe('<ContrastCheckerCard />', () => {
    it('renders initial colors and calculates contrast ratio', () => {
      render(
        <ContrastCheckerCard
          initialForeground="#FFFFFF"
          initialBackground="#000000"
        />
      );

      expect(screen.getByText('21.00:1')).toBeInTheDocument();
      expect(screen.getByText('WCAG AAA Level')).toBeInTheDocument();
    });

    it('swaps foreground and background when swap button is clicked', () => {
      render(
        <ContrastCheckerCard
          initialForeground="#FFFFFF"
          initialBackground="#000000"
        />
      );

      const swapButton = screen.getByRole('button', { name: /swap colors/i });
      fireEvent.click(swapButton);

      const fgInput = screen.getByLabelText(/foreground \(text \/ icon\)/i) as HTMLInputElement;
      expect(fgInput.value).toBe('#000000');
    });

    it('updates calculation when user inputs a new color', () => {
      const handleScoreChange = vi.fn();
      render(
        <ContrastCheckerCard
          initialForeground="#FFFFFF"
          initialBackground="#000000"
          onScoreChange={handleScoreChange}
        />
      );

      const fgInput = screen.getByLabelText(/foreground \(text \/ icon\)/i);
      fireEvent.change(fgInput, { target: { value: '#FFFF00' } });

      expect(screen.getByText(/yellow on black/i)).toBeInTheDocument();
    });
  });

  describe('<PaletteGeneratorCard />', () => {
    it('renders suggested pairings for base color', () => {
      render(<PaletteGeneratorCard initialBaseColor="#6366F1" />);

      expect(screen.getByText('Accessible Text on Light')).toBeInTheDocument();
      expect(screen.getByText('Accessible Text on Dark')).toBeInTheDocument();
      expect(screen.getByText('Solid Button Component')).toBeInTheDocument();
    });

    it('switches base color when preset button is clicked', () => {
      render(<PaletteGeneratorCard initialBaseColor="#6366F1" />);

      const emeraldButton = screen.getByRole('button', { name: /emerald green/i });
      fireEvent.click(emeraldButton);

      expect(screen.getByDisplayValue('#10B981')).toBeInTheDocument();
    });
  });
});
