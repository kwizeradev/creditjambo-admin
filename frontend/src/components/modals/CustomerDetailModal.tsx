import { useQuery } from '@tanstack/react-query';
import {
  Mail,
  Calendar,
  Wallet,
  Smartphone,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import api from '@/services/api';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatRelativeTime } from '@/utils/formatters';
import type { ApiResponse } from '@/types';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
}

interface CustomerDetail {
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

export function CustomerDetailModal({ isOpen, onClose, customerId }: CustomerDetailModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['customer-detail', customerId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CustomerDetail>>(`/admin/customers/${customerId}`);
      return response.data.data!;
    },
    enabled: isOpen && !!customerId,
  });

  const recentTransactions = data?.recentTransactions.slice(0, 5) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Details" size="lg">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : data ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                    {data.customer.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Wallet className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Balance</p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(parseFloat(data.customer.balance))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Devices</p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {data.devices.length} total
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Joined</p>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatRelativeTime(data.customer.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Devices ({data.devices.length})
            </h3>
            {data.devices.length > 0 ? (
              <div className="space-y-2">
                {data.devices.map(device => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Smartphone className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {device.deviceInfo || 'Unknown Device'}
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
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Recent Transactions (Last 5)
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
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">Customer not found</div>
      )}
    </Modal>
  );
}
