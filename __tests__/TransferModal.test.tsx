import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TransferModal from '@/components/TransferModal';

jest.mock('@/services/api', () => ({
  getContacts: jest.fn(),
  getCards: jest.fn(),
  transferMoney: jest.fn(),
}));

jest.mock('@/services/auth', () => ({
  getToken: jest.fn().mockReturnValue('test-token'),
}));

jest.mock('@/services/sounds', () => ({
  playTap: jest.fn(),
  playSuccess: jest.fn(),
  playError: jest.fn(),
}));

const { getContacts, getCards, transferMoney } = jest.requireMock('@/services/api');

const mockCards = [
  { id: 1, issuer: 'Visa', name: 'Carlos', expDate: '02/30', lastDigits: 1234, balance: '500.00', currency: 'USD' },
];

const mockContacts = [
  { id: 2, email: 'camila@test.com', name: 'Camila Montenegro' },
];

beforeEach(() => {
  jest.clearAllMocks();
  getCards.mockResolvedValue({ success: true, data: mockCards });
  getContacts.mockResolvedValue({ success: true, data: mockContacts });
  transferMoney.mockResolvedValue({ success: true });
});

const waitForLoad = () => waitFor(() => screen.getByText('Visa'));

describe('TransferModal', () => {
  it('renders modal title', async () => {
    render(<TransferModal onClose={jest.fn()} />);
    await waitFor(() => expect(screen.getByText('Transferir dinero')).toBeInTheDocument());
  });

  it('renders loaded card issuer', async () => {
    render(<TransferModal onClose={jest.fn()} />);
    await waitForLoad();
    expect(screen.getByText('Visa')).toBeInTheDocument();
  });

  it('renders contact first name', async () => {
    render(<TransferModal onClose={jest.fn()} />);
    await waitFor(() => expect(screen.getByText('Camila')).toBeInTheDocument());
  });

  it('shows "no contacts" when list is empty', async () => {
    getContacts.mockResolvedValueOnce({ success: true, data: [] });
    render(<TransferModal onClose={jest.fn()} />);
    await waitFor(() =>
      expect(screen.getByText('No hay contactos disponibles')).toBeInTheDocument(),
    );
  });

  it('shows "no cards" when list is empty', async () => {
    getCards.mockResolvedValueOnce({ success: true, data: [] });
    render(<TransferModal onClose={jest.fn()} />);
    await waitFor(() =>
      expect(screen.getByText('No hay tarjetas disponibles')).toBeInTheDocument(),
    );
  });

  it('populates email field when contact is selected', async () => {
    render(<TransferModal onClose={jest.fn()} />);
    await waitForLoad();
    fireEvent.click(screen.getByText('Camila'));
    const emailInput = screen.getByPlaceholderText('email@ejemplo.com') as HTMLInputElement;
    expect(emailInput.value).toBe('camila@test.com');
  });

  it('advances to confirm step with transfer summary', async () => {
    render(<TransferModal onClose={jest.fn()} />);
    await waitForLoad();

    fireEvent.click(screen.getByText('Camila'));
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Continuar'));

    await waitFor(() =>
      expect(screen.getByText('Confirmar transferencia')).toBeInTheDocument(),
    );
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('Camila Montenegro')).toBeInTheDocument();
  });

  it('goes back to form when Volver is clicked', async () => {
    render(<TransferModal onClose={jest.fn()} />);
    await waitForLoad();

    fireEvent.click(screen.getByText('Camila'));
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Continuar'));

    await waitFor(() => screen.getByText('Volver'));
    fireEvent.click(screen.getByText('Volver'));

    await waitFor(() =>
      expect(screen.getByText('Transferir dinero')).toBeInTheDocument(),
    );
  });

  it('shows success screen after confirmed transfer', async () => {
    render(<TransferModal onClose={jest.fn()} />);
    await waitForLoad();

    fireEvent.click(screen.getByText('Camila'));
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Continuar'));

    await waitFor(() => screen.getByText('Confirmar'));
    fireEvent.click(screen.getByText('Confirmar'));

    await waitFor(() =>
      expect(screen.getByText('¡Transferencia exitosa!')).toBeInTheDocument(),
    );
    expect(screen.getByText(/Se transfirieron \$50/)).toBeInTheDocument();
  });

  it('calls onClose and onTransferSuccess when Listo is clicked', async () => {
    const onClose = jest.fn();
    const onTransferSuccess = jest.fn();
    render(<TransferModal onClose={onClose} onTransferSuccess={onTransferSuccess} />);
    await waitForLoad();

    fireEvent.click(screen.getByText('Camila'));
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Continuar'));
    await waitFor(() => screen.getByText('Confirmar'));
    fireEvent.click(screen.getByText('Confirmar'));
    await waitFor(() => screen.getByText('Listo'));
    fireEvent.click(screen.getByText('Listo'));

    expect(onClose).toHaveBeenCalled();
    expect(onTransferSuccess).toHaveBeenCalled();
  });

  it('shows error message on confirm step when transfer fails', async () => {
    transferMoney.mockResolvedValueOnce({ success: false, message: 'Fondos insuficientes' });
    render(<TransferModal onClose={jest.fn()} />);
    await waitForLoad();

    fireEvent.click(screen.getByText('Camila'));
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Continuar'));
    await waitFor(() => screen.getByText('Confirmar'));
    fireEvent.click(screen.getByText('Confirmar'));

    await waitFor(() =>
      expect(screen.getByText('Fondos insuficientes')).toBeInTheDocument(),
    );
  });

  it('shows error on server exception', async () => {
    transferMoney.mockRejectedValueOnce({
      response: { data: { message: 'Error del servidor' } },
    });
    render(<TransferModal onClose={jest.fn()} />);
    await waitForLoad();

    fireEvent.click(screen.getByText('Camila'));
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Continuar'));
    await waitFor(() => screen.getByText('Confirmar'));
    fireEvent.click(screen.getByText('Confirmar'));

    await waitFor(() =>
      expect(screen.getByText('Error del servidor')).toBeInTheDocument(),
    );
  });

  it('email field is auto-populated when typed email matches a contact', async () => {
    render(<TransferModal onClose={jest.fn()} />);
    await waitForLoad();

    const emailInput = screen.getByPlaceholderText('email@ejemplo.com');
    fireEvent.change(emailInput, { target: { value: 'camila@test.com' } });

    expect((emailInput as HTMLInputElement).value).toBe('camila@test.com');
  });
});
