import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import NewCard from '@/app/cards/_components/NewCard';
import MoveBalance from '@/app/cards/_components/MoveBalance';
import type { Card } from '@/interfaces';

const mockCard: Card = {
  id: 1,
  issuer: 'Mastercard',
  name: 'Carlos',
  expDate: '02/30',
  lastDigits: 1234,
  balance: '500.00',
  currency: 'USD',
};

describe('NewCard', () => {
  it('renders Visa and Mastercard buttons', () => {
    render(<NewCard cards={[]} creating={null} onCreate={jest.fn()} />);
    expect(screen.getByText('+ Nueva Visa')).toBeInTheDocument();
    expect(screen.getByText('+ Nueva Mastercard')).toBeInTheDocument();
  });

  it('calls onCreate with correct issuer', () => {
    const onCreate = jest.fn();
    render(<NewCard cards={[]} creating={null} onCreate={onCreate} />);
    fireEvent.click(screen.getByText('+ Nueva Visa').closest('button')!);
    expect(onCreate).toHaveBeenCalledWith('Visa');
  });

  it('shows limit message when 6 cards', () => {
    const sixCards = Array.from({ length: 6 }, (_, i) => ({
      ...mockCard,
      id: i + 1,
    }));
    render(<NewCard cards={sixCards} creating={null} onCreate={jest.fn()} />);
    expect(
      screen.getByText('Límite de 6 tarjetas alcanzado'),
    ).toBeInTheDocument();
  });

  it('shows spinner when creating', () => {
    render(<NewCard cards={[]} creating="Visa" onCreate={jest.fn()} />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows card count when cards exist', () => {
    render(<NewCard cards={[mockCard]} creating={null} onCreate={jest.fn()} />);
    expect(screen.getByText('1 / 6 tarjetas')).toBeInTheDocument();
  });
});

describe('MoveBalance', () => {
  const defaultProps = {
    cards: [mockCard],
    accountBalance: '1000.00',
    fromKey: 'account',
    toKey: '',
    amount: '',
    transferring: false,
    onFromChange: jest.fn(),
    onToChange: jest.fn(),
    onAmountChange: jest.fn(),
    onTransfer: jest.fn(),
  };

  it('renders from/to selects and amount input', () => {
    render(<MoveBalance {...defaultProps} />);
    expect(screen.getByText('Mover saldo')).toBeInTheDocument();
    expect(screen.getByText('Desde')).toBeInTheDocument();
    expect(screen.getByText('Hacia')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('populates source options with account and cards', () => {
    render(<MoveBalance {...defaultProps} />);
    expect(screen.getByText(/Cuenta — \$1000\.00/)).toBeInTheDocument();
    expect(screen.getAllByText(/Mastercard ••••1234/)).toHaveLength(2);
  });

  it('calls onFromChange when source changes', () => {
    const onFromChange = jest.fn();
    render(<MoveBalance {...defaultProps} onFromChange={onFromChange} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: '1' } });
    expect(onFromChange).toHaveBeenCalledWith('1');
  });

  it('calls onTransfer when button clicked with valid input', () => {
    const onTransfer = jest.fn();
    render(
      <MoveBalance
        {...defaultProps}
        toKey="1"
        amount="50"
        onTransfer={onTransfer}
      />,
    );
    fireEvent.click(screen.getByText('Transferir'));
    expect(onTransfer).toHaveBeenCalled();
  });

  it('disables transfer button when transferring', () => {
    render(
      <MoveBalance
        {...defaultProps}
        toKey="1"
        amount="50"
        transferring={true}
      />,
    );
    expect(screen.getByText('Transfiriendo...')).toBeDisabled();
  });
});
