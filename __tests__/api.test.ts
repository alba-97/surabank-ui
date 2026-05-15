import { login, getCards, getLastMovements } from '@/lib/api';

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockClear();
});

describe('login()', () => {
  it('sends POST request with credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { name: 'Carlos', token: 'abc' },
      }),
    });

    const res = await login('user@test.com', 'pass');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/surabank/login'),
      expect.objectContaining({ method: 'POST' }),
    );
    expect(res.success).toBe(true);
    expect(res.data.token).toBe('abc');
  });

  it('returns success false on bad credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ success: false }),
    });

    const res = await login('bad@email.com', 'wrong');
    expect(res.success).toBe(false);
  });
});

describe('getCards()', () => {
  it('sends Authorization header', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: [] }),
    });

    await getCards('my-token');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/surabank/cards'),
      expect.objectContaining({ headers: { Authorization: 'my-token' } }),
    );
  });

  it('returns card list', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: [
          {
            id: 1,
            issuer: 'Mastercard',
            name: 'Test',
            expDate: '01/30',
            lastDigits: 1234,
            balance: '100',
            currency: 'USD',
          },
        ],
      }),
    });

    const res = await getCards('token');
    expect(res.data).toHaveLength(1);
    expect(res.data[0].issuer).toBe('Mastercard');
  });
});

describe('getLastMovements()', () => {
  it('sends Authorization header', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: [] }),
    });

    await getLastMovements('tok');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/surabank/movements/last'),
      expect.objectContaining({ headers: { Authorization: 'tok' } }),
    );
  });

  it('returns movement list', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: [
          {
            id: 1,
            title: 'Adobe',
            amount: '$125',
            transactionType: 'SUS',
            date: '2026-05-10',
          },
        ],
      }),
    });

    const res = await getLastMovements('token');
    expect(res.data[0].transactionType).toBe('SUS');
  });
});
