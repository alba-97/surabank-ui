import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
});

export interface Card {
  id: number;
  issuer: string;
  name: string;
  expDate: string;
  lastDigits: number;
  balance: string;
  currency: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: string;
  transactionType: 'SUS' | 'CASH_IN' | 'CASH_OUT';
  date: string;
}

export interface LoginResponse {
  success: boolean;
  data: { name: string; token: string };
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/surabank/login', {
    email,
    password,
  });
  return data;
}

export async function getCards(
  token: string,
): Promise<{ success: boolean; data: Card[] }> {
  const { data } = await api.get<{ success: boolean; data: Card[] }>(
    '/surabank/cards',
    {
      headers: { Authorization: token },
    },
  );
  return data;
}

export async function getLastMovements(
  token: string,
): Promise<{ success: boolean; data: Transaction[] }> {
  const { data } = await api.get<{ success: boolean; data: Transaction[] }>(
    '/surabank/movements/last',
    {
      headers: { Authorization: token },
    },
  );
  return data;
}
