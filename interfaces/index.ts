export type TransactionType = 'SUS' | 'CASH_IN' | 'CASH_OUT';

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
  transactionType: TransactionType;
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

export interface Notification {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  createdAt: string;
}
