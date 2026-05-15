import {
  login,
  getCards,
  getMovements,
  getAccount,
  getContacts,
  getNotifications,
  markNotificationsRead,
  transferMoney,
  createCard,
  internalTransfer,
} from '@/services/api';
import axios from 'axios';

jest.mock('axios', () => {
  const mockAxiosInstance = {
    post: jest.fn(),
    get: jest.fn(),
    interceptors: {
      response: { use: jest.fn() },
    },
  };
  return {
    create: jest.fn(() => mockAxiosInstance),
    default: { create: jest.fn(() => mockAxiosInstance) },
  };
});

const getInstance = () => (axios.create as jest.Mock).mock.results[0].value;

beforeEach(() => {
  const inst = getInstance();
  inst.post.mockClear();
  inst.get.mockClear();
});

describe('login()', () => {
  it('sends POST request with credentials', async () => {
    getInstance().post.mockResolvedValueOnce({
      data: { success: true, data: { name: 'Carlos', token: 'abc' } },
    });

    const res = await login('user@test.com', 'pass');

    expect(getInstance().post).toHaveBeenCalledWith('/surabank/login', {
      email: 'user@test.com',
      password: 'pass',
    });
    expect(res.success).toBe(true);
    expect(res.data.token).toBe('abc');
  });

  it('returns success false on bad credentials', async () => {
    getInstance().post.mockResolvedValueOnce({ data: { success: false } });

    const res = await login('bad@email.com', 'wrong');
    expect(res.success).toBe(false);
  });
});

describe('getCards()', () => {
  it('sends Authorization header', async () => {
    getInstance().get.mockResolvedValueOnce({
      data: { success: true, data: [] },
    });

    await getCards('my-token');

    expect(getInstance().get).toHaveBeenCalledWith(
      '/surabank/cards',
      expect.objectContaining({ headers: { Authorization: 'my-token' } }),
    );
  });

  it('returns card list', async () => {
    getInstance().get.mockResolvedValueOnce({
      data: {
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
      },
    });

    const res = await getCards('token');
    expect(res.data).toHaveLength(1);
    expect(res.data[0].issuer).toBe('Mastercard');
  });
});

describe('getMovements()', () => {
  it('sends Authorization header and hits /surabank/movements', async () => {
    getInstance().get.mockResolvedValueOnce({
      data: { success: true, data: [], total: 0 },
    });

    await getMovements('tok');

    expect(getInstance().get).toHaveBeenCalledWith(
      '/surabank/movements',
      expect.objectContaining({ headers: { Authorization: 'tok' } }),
    );
  });

  it('returns movement list with total', async () => {
    getInstance().get.mockResolvedValueOnce({
      data: {
        success: true,
        total: 1,
        data: [
          {
            id: 1,
            title: 'Adobe',
            amount: '$125',
            transactionType: 'SUS',
            date: '2026-05-10',
          },
        ],
      },
    });

    const res = await getMovements('token');
    expect(res.total).toBe(1);
    expect(res.data[0].transactionType).toBe('SUS');
  });

  it('passes search and pageNumber as query params', async () => {
    getInstance().get.mockResolvedValueOnce({
      data: { success: true, data: [], total: 0 },
    });

    await getMovements('tok', { search: 'Adobe', pageNumber: 2 });

    expect(getInstance().get).toHaveBeenCalledWith(
      '/surabank/movements',
      expect.objectContaining({ params: { search: 'Adobe', pageNumber: 2 } }),
    );
  });
});

describe('getAccount()', () => {
  it('returns account balance', async () => {
    getInstance().get.mockResolvedValueOnce({
      data: { success: true, data: { balance: '500.00' } },
    });

    const res = await getAccount('tok');

    expect(getInstance().get).toHaveBeenCalledWith(
      '/surabank/account',
      expect.objectContaining({ headers: { Authorization: 'tok' } }),
    );
    expect(res.data.balance).toBe('500.00');
  });
});

describe('getContacts()', () => {
  it('returns contact list', async () => {
    getInstance().get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [{ id: 2, name: 'Camila', email: 'c@test.com' }],
      },
    });

    const res = await getContacts('tok');

    expect(getInstance().get).toHaveBeenCalledWith(
      '/surabank/contacts',
      expect.objectContaining({ headers: { Authorization: 'tok' } }),
    );
    expect(res.data).toHaveLength(1);
  });
});

describe('getNotifications()', () => {
  it('returns notification list', async () => {
    getInstance().get.mockResolvedValueOnce({
      data: { success: true, data: [] },
    });

    const res = await getNotifications('tok');

    expect(getInstance().get).toHaveBeenCalledWith(
      '/surabank/notifications',
      expect.objectContaining({ headers: { Authorization: 'tok' } }),
    );
    expect(res.success).toBe(true);
  });
});

describe('markNotificationsRead()', () => {
  it('sends PATCH request', async () => {
    getInstance().patch = jest.fn().mockResolvedValueOnce({});

    await markNotificationsRead('tok');

    expect(getInstance().patch).toHaveBeenCalledWith(
      '/surabank/notifications/read-all',
      {},
      expect.objectContaining({ headers: { Authorization: 'tok' } }),
    );
  });
});

describe('transferMoney()', () => {
  it('sends transfer POST request', async () => {
    getInstance().post.mockResolvedValueOnce({
      data: { success: true, data: { newBalance: '400.00' } },
    });

    const res = await transferMoney('tok', 'camila@test.com', 100, 1);

    expect(getInstance().post).toHaveBeenCalledWith(
      '/surabank/transfer',
      { email: 'camila@test.com', amount: 100, cardId: 1 },
      expect.objectContaining({ headers: { Authorization: 'tok' } }),
    );
    expect(res.success).toBe(true);
  });
});

describe('createCard()', () => {
  it('sends create card POST request', async () => {
    getInstance().post.mockResolvedValueOnce({
      data: { success: true, data: { id: 3, issuer: 'Visa' } },
    });

    const res = await createCard('tok', 'Visa');

    expect(getInstance().post).toHaveBeenCalledWith(
      '/surabank/cards',
      { issuer: 'Visa' },
      expect.objectContaining({ headers: { Authorization: 'tok' } }),
    );
    expect(res.success).toBe(true);
  });
});

describe('internalTransfer()', () => {
  it('sends internal transfer POST request', async () => {
    getInstance().post.mockResolvedValueOnce({
      data: { success: true, message: 'Transfer successful' },
    });

    const res = await internalTransfer('tok', {
      fromType: 'account',
      toType: 'card',
      toId: 1,
      amount: 50,
    });

    expect(getInstance().post).toHaveBeenCalledWith(
      '/surabank/cards/transfer',
      expect.objectContaining({
        fromType: 'account',
        toType: 'card',
        amount: 50,
      }),
      expect.objectContaining({ headers: { Authorization: 'tok' } }),
    );
    expect(res.success).toBe(true);
  });
});
