import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionItem from '@/components/TransactionItem';
import type { Transaction } from '@/interfaces';

jest.mock('@/services/sounds', () => ({
  playTap: jest.fn(),
  playSuccess: jest.fn(),
  playError: jest.fn(),
}));

const makeTx = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: 1,
  title: 'Adobe',
  amount: '$125',
  transactionType: 'SUS',
  date: '2026-05-10',
  ...overrides,
});

describe('TransactionItem', () => {
  it('renders title', () => {
    render(<TransactionItem transaction={makeTx()} />);
    expect(screen.getByText('Adobe')).toBeInTheDocument();
  });

  it('renders amount', () => {
    render(<TransactionItem transaction={makeTx()} />);
    expect(screen.getByText(/\$125/)).toBeInTheDocument();
  });

  it('shows "Pago de suscripción" for SUS type', () => {
    render(
      <TransactionItem transaction={makeTx({ transactionType: 'SUS' })} />,
    );
    expect(screen.getByText('Pago de suscripción')).toBeInTheDocument();
  });

  it('shows "Pago recibido" for CASH_IN type', () => {
    render(
      <TransactionItem
        transaction={makeTx({ transactionType: 'CASH_IN', title: 'Camila' })}
      />,
    );
    expect(screen.getByText('Pago recibido')).toBeInTheDocument();
  });

  it('shows "Pago enviado" for CASH_OUT type', () => {
    render(
      <TransactionItem
        transaction={makeTx({ transactionType: 'CASH_OUT', title: 'Leo' })}
      />,
    );
    expect(screen.getByText('Pago enviado')).toBeInTheDocument();
  });

  it('calls playTap on click', () => {
    const { playTap } = jest.requireMock('@/services/sounds');
    render(<TransactionItem transaction={makeTx()} />);
    fireEvent.click(screen.getByText('Adobe').closest('div')!);
    expect(playTap).toHaveBeenCalled();
  });
});
