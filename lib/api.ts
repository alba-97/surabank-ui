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

export interface MovementsResponse {
  success: boolean;
  data: Transaction[];
  total: number;
}

export interface Contact {
  id: number;
  email: string;
  name: string;
}

export interface TransferResponse {
  success: boolean;
  message: string;
  data?: {
    newBalance: string;
    cardId: number;
  };
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

