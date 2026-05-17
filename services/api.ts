import {
  Card,
  Contact,
  LoginResponse,
  MovementsResponse,
  Notification,
  TransferResponse,
} from '@/interfaces';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
});

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const { data } = await api.post<LoginResponse>('/surabank/login', {
      email,
      password,
    });
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data) {
      return err.response.data as LoginResponse;
    }
    throw err;
  }
}

export async function getContacts(
  token: string,
): Promise<{ success: boolean; data: Contact[] }> {
  const { data } = await api.get<{ success: boolean; data: Contact[] }>(
    '/surabank/contacts',
    { headers: { Authorization: token } },
  );
  return data;
}

export async function transferMoney(
  token: string,
  email: string,
  amount: number,
  cardId: number,
): Promise<TransferResponse> {
  const { data } = await api.post<TransferResponse>(
    '/surabank/transfer',
    { email, amount, cardId },
    { headers: { Authorization: token } },
  );
  return data;
}

export async function getCards(
  token: string,
): Promise<{ success: boolean; data: Card[] }> {
  const { data } = await api.get<{ success: boolean; data: Card[] }>(
    '/surabank/cards',
    { headers: { Authorization: token } },
  );
  return data;
}

export async function getAccount(
  token: string,
): Promise<{ success: boolean; data: { balance: string } }> {
  const { data } = await api.get<{
    success: boolean;
    data: { balance: string };
  }>('/surabank/account', { headers: { Authorization: token } });
  return data;
}

export async function createCard(
  token: string,
  issuer: 'Visa' | 'Mastercard',
): Promise<{ success: boolean; data: Card; message?: string }> {
  const { data } = await api.post<{
    success: boolean;
    data: Card;
    message?: string;
  }>('/surabank/cards', { issuer }, { headers: { Authorization: token } });
  return data;
}

export async function internalTransfer(
  token: string,
  params: {
    fromType: 'card' | 'account';
    fromId?: number;
    toType: 'card' | 'account';
    toId?: number;
    amount: number;
  },
): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post<{ success: boolean; message: string }>(
    '/surabank/cards/transfer',
    params,
    { headers: { Authorization: token } },
  );
  return data;
}

export async function getMovements(
  token: string,
  params?: { search?: string; pageNumber?: number },
): Promise<MovementsResponse> {
  const { data } = await api.get<MovementsResponse>('/surabank/movements', {
    headers: { Authorization: token },
    params,
  });
  return data;
}

export async function getNotifications(
  token: string,
): Promise<{ success: boolean; data: Notification[] }> {
  const { data } = await api.get<{ success: boolean; data: Notification[] }>(
    '/surabank/notifications',
    { headers: { Authorization: token } },
  );
  return data;
}

export async function markNotificationsRead(token: string): Promise<void> {
  await api.patch(
    '/surabank/notifications/read-all',
    {},
    {
      headers: { Authorization: token },
    },
  );
}
