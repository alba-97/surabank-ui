import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import CardComponent from '@/components/CardComponent';
import type { Card } from '@/interfaces';

const makeCard = (overrides: Partial<Card> = {}): Card => ({
  id: 1,
  issuer: 'Mastercard',
  name: 'Carlos Sura',
  expDate: '02/30',
  lastDigits: 1234,
  balance: '978.85',
  currency: 'USD',
  ...overrides,
});

describe('CardComponent', () => {
  it('renders cardholder name', () => {
    render(<CardComponent card={makeCard()} index={0} />);
    expect(screen.getByText('Carlos Sura')).toBeInTheDocument();
  });

  it('renders balance', () => {
    render(<CardComponent card={makeCard()} index={0} />);
    expect(screen.getByText('978.85')).toBeInTheDocument();
  });

  it('renders currency', () => {
    render(<CardComponent card={makeCard()} index={0} />);
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('renders expiration date', () => {
    render(<CardComponent card={makeCard()} index={0} />);
    expect(screen.getByText('02/30')).toBeInTheDocument();
  });

  it('renders last digits', () => {
    render(<CardComponent card={makeCard()} index={0} />);
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('renders Visa card correctly', () => {
    render(
      <CardComponent
        card={makeCard({ issuer: 'Visa', lastDigits: 5678 })}
        index={1}
      />,
    );
    expect(screen.getByAltText('Visa')).toBeInTheDocument();
  });
});
