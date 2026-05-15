import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '@/app/home/page';

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

jest.mock('@/services/api', () => ({
  getCards: jest.fn(),
  getMovements: jest.fn(),
  getAccount: jest.fn(),
}));

jest.mock('@/services/auth', () => ({
  getToken: jest.fn().mockReturnValue('test-token'),
  getName: jest.fn().mockReturnValue('Carlos Sura'),
  clearSession: jest.fn(),
  isAuthenticated: jest.fn().mockReturnValue(true),
}));

jest.mock('@/services/sounds', () => ({
  playTap: jest.fn(),
  playSuccess: jest.fn(),
  playError: jest.fn(),
  initSounds: jest.fn(),
}));

const { getCards, getMovements, getAccount } =
  jest.requireMock('@/services/api');

const mockCards = [
  {
    id: 1,
    issuer: 'Mastercard',
    name: 'Carlos Sura',
    expDate: '02/30',
    lastDigits: 1234,
    balance: '978.85',
    currency: 'USD',
  },
  {
    id: 2,
    issuer: 'Visa',
    name: 'Carlos Sura',
    expDate: '05/28',
    lastDigits: 5678,
    balance: '3241.50',
    currency: 'USD',
  },
];

const mockMovements = [
  {
    id: 1,
    title: 'Adobe',
    amount: '$125',
    transactionType: 'SUS',
    date: '2026-05-10',
  },
  {
    id: 2,
    title: 'Camila Montenegro',
    amount: '$95',
    transactionType: 'CASH_IN',
    date: '2026-05-09',
  },
  {
    id: 3,
    title: 'Leonardo Echazu',
    amount: '$95',
    transactionType: 'CASH_OUT',
    date: '2026-05-07',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  getCards.mockResolvedValue({ success: true, data: mockCards });
  getMovements.mockResolvedValue({
    success: true,
    data: mockMovements,
    total: mockMovements.length,
  });
  getAccount.mockResolvedValue({ success: true, data: { balance: '978.85' } });
});

describe('HomePage', () => {
  it('shows loading state initially', () => {
    render(<HomePage />);
    expect(
      screen.getByRole('status', { name: 'Cargando' }),
    ).toBeInTheDocument();
  });

  it('renders greeting after load', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText('Carlos')).toBeInTheDocument();
    });
  });

  it('renders movements section title', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText('Últimos movimientos')).toBeInTheDocument();
    });
  });

  it('renders transaction items', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText('Adobe')).toBeInTheDocument();
      expect(screen.getByText('Camila Montenegro')).toBeInTheDocument();
    });
  });

  it('redirects to login if not authenticated', () => {
    const { isAuthenticated } = jest.requireMock('@/services/auth');
    isAuthenticated.mockReturnValueOnce(false);

    render(<HomePage />);
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('renders card balances', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText('978.85')).toBeInTheDocument();
    });
  });
});
