export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  balance: string;
  role: string;
  devicesCount: number;
  verifiedDevicesCount: number;
  createdAt: string;
}

export interface Device {
  id: string;
  deviceId: string;
  userId: string;
  deviceInfo: {
    brand?: string;
    model?: string;
    osName?: string;
    osVersion?: string;
  };
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description?: string;
  createdAt: string;
  completedAt?: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: TokenResponse;
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export interface CustomerDetailData {
  customer: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    balance: string;
  };
  devices: Array<{
    id: string;
    deviceId: string;
    deviceInfo: string;
    verified: boolean;
    createdAt: string;
  }>;
  recentTransactions: Array<{
    id: string;
    type: 'DEPOSIT' | 'WITHDRAW';
    amount: string;
    description?: string;
    createdAt: string;
  }>;
}

export interface ApiError {
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalBalance: number;
  totalTransactions: number;
  pendingDevices: number;
  recentTransactions: Transaction[];
}

export interface AnalyticsData {
  analytics: {
    totalCustomers: number;
    totalDeposits: {
      amount: string;
      count: number;
    };
    totalWithdrawals: {
      amount: string;
      count: number;
    };
    pendingDevices: number;
  };
  recentTransactions: Array<{
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
  }>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  customers?: T[];
  transactions?: T[];
  devices?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
