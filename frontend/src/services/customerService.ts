import api from './api';
import type { Customer, ApiResponse, CustomerDetailData } from '@/types';

const CUSTOMERS_ENDPOINT = '/admin/customers';

interface GetCustomersParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface GetCustomersResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const customerService = {
  getCustomers: async (params: GetCustomersParams): Promise<GetCustomersResponse> => {
    const response = await api.get<ApiResponse<GetCustomersResponse>>(CUSTOMERS_ENDPOINT, {
      params,
    });
    return response.data.data!;
  },

  getCustomerById: async (customerId: string): Promise<CustomerDetailData> => {
    const response = await api.get<ApiResponse<CustomerDetailData>>(
      `${CUSTOMERS_ENDPOINT}/${customerId}`
    );
    return response.data.data!;
  },
};
