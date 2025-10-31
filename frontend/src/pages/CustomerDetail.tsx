import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import api from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatRelativeTime } from '@/utils/formatters';
import type { ApiResponse } from '@/types';

interface CustomerDetailData {
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

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['customer-detail', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CustomerDetailData>>(`/admin/customers/${id}`);
      return response.data.data!;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 dark:border-primary-400"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Customer not found
        </p>
        <Link
          to="/customers"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          ← Back to customers
        </Link>
      </div>
    );
  }

  const { customer, devices, recentTransactions } = data;

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 -mx-6 -mt-6 px-6 py-4 mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/customers"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Customer Details</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 animate-fade-in flex-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate mt-0.5">
              {customer.email}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">Balance</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white mt-0.5">
              {formatCurrency(parseFloat(customer.balance))}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">Devices</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white mt-0.5">
              {devices.length} total
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">Joined</p>
            <p className="text-xs font-medium text-gray-900 dark:text-white mt-0.5">
              {formatRelativeTime(customer.createdAt)}
            </p>
          </div>
        </div>

        <Card>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Devices ({devices.length})
          </h3>
          {devices.length > 0 ? (
            <div className="space-y-2">
              {devices.map(device => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Smartphone className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {device.deviceInfo}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        ID: {device.deviceId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(device.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {device.verified ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        <XCircle className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-xs">
              No devices registered
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Recent Transactions ({recentTransactions.length})
          </h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map(tx => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {tx.type === 'DEPOSIT' ? (
                      <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg flex-shrink-0">
                        <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                      </p>
                      {tx.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{tx.description}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-xs font-semibold ${
                        tx.type === 'DEPOSIT'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {tx.type === 'DEPOSIT' ? '+' : '-'}
                      {formatCurrency(parseFloat(tx.amount))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-xs">
              No transactions yet
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
