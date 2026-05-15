import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CardsPage from '@/app/cards/page';

const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
}));

jest.mock('@/services/api', () => ({
  getCards: jest.fn(),
  getAccount: jest.fn(),
  createCard: jest.fn(),
  internalTransfer: jest.fn(),
}));

jest.mock('@/services/auth', () => ({
  getToken: jest.fn().mockReturnValue('test-token'),
  isAuthenticated: jest.fn().mockReturnValue(true),
  clearSession: jest.fn(),
}));

jest.mock('@/services/sounds', () => ({
  playTap: jest.fn(),
  playSuccess: jest.fn(),
  playError: jest.fn(),
}));

jest.mock('@/app/cards/_components/NewCard', () => ({
  __esModule: true,
  default: ({
    onCreate,
  }: {
    onCreate: (issuer: 'Visa' | 'Mastercard') => void;
  }) => (
    <button data-testid="create-visa" onClick={() => onCreate('Visa')}>
      Nueva Visa
    </button>
  ),
}));

jest.mock('@/app/cards/_components/MoveBalance', () => ({
  __esModule: true,
  default: () => <div data-testid="move-balance" />,
}));

jest.mock('@/components/Navbar', () => ({
  __esModule: true,
  default: ({ onTransfer }: { onTransfer?: () => void }) => (
    <button data-testid="open-transfer" onClick={onTransfer}>
      Transfer
    </button>
  ),
}));

jest.mock('@/components/TransferModal', () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="transfer-modal">
      <button onClick={onClose}>Cerrar modal</button>
    </div>
  ),
}));

const { getCards, getAccount, createCard } = jest.requireMock('@/services/api');

const mockCards = [
  {
    id: 1,
    issuer: 'Mastercard',
    name: 'Carlos',
    expDate: '02/30',
    lastDigits: 1234,
    balance: '978.85',
    currency: 'USD',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  getCards.mockResolvedValue({ success: true, data: mockCards });
  getAccount.mockResolvedValue({ success: true, data: { balance: '500.00' } });
  createCard.mockResolvedValue({
    success: true,
    data: { id: 2, issuer: 'Visa' },
  });
});

describe('CardsPage', () => {
  it('shows loading spinner initially', () => {
    render(<CardsPage />);
    expect(
      screen.getByRole('status', { name: 'Cargando' }),
    ).toBeInTheDocument();
  });

  it('renders page title after load', async () => {
    render(<CardsPage />);
    await waitFor(() =>
      expect(screen.getByText('Tarjetas')).toBeInTheDocument(),
    );
  });

  it('renders sub-components after load', async () => {
    render(<CardsPage />);
    await waitFor(() => screen.getByTestId('create-visa'));
    expect(screen.getByTestId('move-balance')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    const { isAuthenticated } = jest.requireMock('@/services/auth');
    isAuthenticated.mockReturnValueOnce(false);
    render(<CardsPage />);
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('redirects to login on data load error', async () => {
    getCards.mockRejectedValueOnce(new Error('Network error'));
    render(<CardsPage />);
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'));
  });

  it('shows success feedback after card creation', async () => {
    render(<CardsPage />);
    await waitFor(() => screen.getByTestId('create-visa'));
    fireEvent.click(screen.getByTestId('create-visa'));
    await waitFor(() =>
      expect(screen.getByText('Tarjeta Visa creada')).toBeInTheDocument(),
    );
  });

  it('shows error feedback when createCard returns failure', async () => {
    createCard.mockResolvedValueOnce({
      success: false,
      message: 'Error al crear tarjeta',
    });
    render(<CardsPage />);
    await waitFor(() => screen.getByTestId('create-visa'));
    fireEvent.click(screen.getByTestId('create-visa'));
    await waitFor(() =>
      expect(screen.getByText('Error al crear tarjeta')).toBeInTheDocument(),
    );
  });

  it('shows error feedback when createCard throws', async () => {
    createCard.mockRejectedValueOnce(new Error('Network'));
    render(<CardsPage />);
    await waitFor(() => screen.getByTestId('create-visa'));
    fireEvent.click(screen.getByTestId('create-visa'));
    await waitFor(() =>
      expect(screen.getByText('Error al crear tarjeta')).toBeInTheDocument(),
    );
  });

  it('shows limit error when already at 6 cards', async () => {
    const sixCards = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      issuer: 'Visa',
      name: 'Carlos',
      expDate: '02/30',
      lastDigits: 1234,
      balance: '0.00',
      currency: 'USD',
    }));
    getCards.mockResolvedValue({ success: true, data: sixCards });
    render(<CardsPage />);
    await waitFor(() => screen.getByTestId('create-visa'));
    fireEvent.click(screen.getByTestId('create-visa'));
    await waitFor(() =>
      expect(
        screen.getByText('Límite de 6 tarjetas alcanzado'),
      ).toBeInTheDocument(),
    );
  });

  it('opens TransferModal when navbar transfer button is clicked', async () => {
    render(<CardsPage />);
    await waitFor(() => screen.getByTestId('open-transfer'));
    fireEvent.click(screen.getByTestId('open-transfer'));
    expect(screen.getByTestId('transfer-modal')).toBeInTheDocument();
  });

  it('closes TransferModal when onClose is called', async () => {
    render(<CardsPage />);
    await waitFor(() => screen.getByTestId('open-transfer'));
    fireEvent.click(screen.getByTestId('open-transfer'));
    fireEvent.click(screen.getByText('Cerrar modal'));
    expect(screen.queryByTestId('transfer-modal')).not.toBeInTheDocument();
  });
});
