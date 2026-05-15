import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';

const mockToggle = jest.fn();
let mockDark = false;

jest.mock('@/contexts/theme', () => ({
  useTheme: () => ({ dark: mockDark, toggle: mockToggle }),
}));

jest.mock('@/services/sounds', () => ({
  playTap: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockDark = false;
});

describe('ThemeToggle', () => {
  it('renders the toggle button', () => {
    render(<ThemeToggle />);
    expect(
      screen.getByRole('button', { name: 'Cambiar modo' }),
    ).toBeInTheDocument();
  });

  it('shows moon icon in light mode', () => {
    render(<ThemeToggle />);
    expect(screen.getByAltText('Modo oscuro')).toBeInTheDocument();
  });

  it('shows sun icon in dark mode', () => {
    mockDark = true;
    render(<ThemeToggle />);
    expect(screen.getByAltText('Modo claro')).toBeInTheDocument();
  });

  it('calls playTap and toggle when clicked', () => {
    const { playTap } = jest.requireMock('@/services/sounds');
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar modo' }));
    expect(playTap).toHaveBeenCalled();
    expect(mockToggle).toHaveBeenCalled();
  });
});
