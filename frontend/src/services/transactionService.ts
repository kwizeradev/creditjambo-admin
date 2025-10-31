import api from './api';
import type { ApiResponse } from '@/types';

const TRANSACTIONS_ENDPOINT = '/admin/transactions';

export interface TransactionWithUser {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: string;
  description?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface GetTransactionsParams {
  page: number;
  limit: number;
  type?: string;
  startDate?: string;
  endDate?: string;
}

interface GetTransactionsResponse {
  transactions: TransactionWithUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const transactionService = {
  getTransactions: async (params: GetTransactionsParams): Promise<GetTransactionsResponse> => {
    const response = await api.get<ApiResponse<GetTransactionsResponse>>(TRANSACTIONS_ENDPOINT, {
      params,
    });
    return response.data.data!;
  },
};
