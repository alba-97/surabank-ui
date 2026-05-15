import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock('@/lib/api', () => ({
  login: jest.fn(),
}));

jest.mock('@/lib/auth', () => ({
  saveSession: jest.fn(),
  isAuthenticated: jest.fn().mockReturnValue(false),
}));

jest.mock('@/lib/sounds', () => ({
  playTap: jest.fn(),
  playSuccess: jest.fn(),
  playError: jest.fn(),
  initSounds: jest.fn(),
}));

const { login: mockLogin } = jest.requireMock('@/lib/api');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('LoginPage', () => {
  it('renders the Surabank title', () => {
    render(<LoginPage />);
    expect(screen.getByText('Surabank')).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Ingresa tu email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Ingresa tu contraseña'),
    ).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<LoginPage />);
    expect(screen.getByText('Ingresar')).toBeInTheDocument();
  });

  it('renders the Recordarme checkbox', () => {
    render(<LoginPage />);
    expect(screen.getByText('Recordarme')).toBeInTheDocument();
  });

  it('navigates to home on successful login', async () => {
    mockLogin.mockResolvedValueOnce({
      success: true,
      data: { name: 'Carlos', token: 'tok123' },
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Ingresa tu email'), {
      target: { value: 'user@suragaming.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), {
      target: { value: 'SURA2026!$' },
    });
    fireEvent.click(screen.getByText('Ingresar'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  it('shows error on failed login', async () => {
    mockLogin.mockResolvedValueOnce({ success: false });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Ingresa tu email'), {
      target: { value: 'bad@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByText('Ingresar'));

    await waitFor(() => {
      expect(screen.getByText(/Credenciales inválidas/)).toBeInTheDocument();
    });
  });

  it('shows error on network failure', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Network error'));

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Ingresa tu email'), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Ingresa tu contraseña'), {
      target: { value: 'pass' },
    });
    fireEvent.click(screen.getByText('Ingresar'));

    await waitFor(() => {
      expect(screen.getByText(/Error de conexión/)).toBeInTheDocument();
    });
  });

  it('redirects to home if already authenticated', () => {
    const { isAuthenticated } = jest.requireMock('@/lib/auth');
    isAuthenticated.mockReturnValueOnce(true);

    render(<LoginPage />);
    expect(mockReplace).toHaveBeenCalledWith('/home');
  });
});
