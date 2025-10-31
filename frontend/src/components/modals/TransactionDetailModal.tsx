import { TrendingUp, TrendingDown, Calendar, Hash, FileText, User, Mail } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
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
  } | null;
  onUserClick?: (userId: string) => void;
}

export function TransactionDetailModal({
  isOpen,
  onClose,
  transaction,
  onUserClick,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" size="md">
      <div className="space-y-5">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {transaction.type === 'DEPOSIT' ? (
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transaction Type</p>
              <Badge
                variant={transaction.type === 'DEPOSIT' ? 'success' : 'danger'}
                size="sm"
                className="mt-1"
              >
                {transaction.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
            <p
              className={`text-2xl font-bold ${
                transaction.type === 'DEPOSIT'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {transaction.type === 'DEPOSIT' ? '+' : '-'}
              {formatCurrency(parseFloat(transaction.amount))}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Transaction ID</p>
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {transaction.id}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Date & Time</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDateTime(transaction.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {transaction.description && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex-shrink-0">
                  <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Description</p>
                  <p className="text-sm text-gray-900 dark:text-white">{transaction.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Customer Information
          </h3>
          <button
            onClick={() => onUserClick?.(transaction.user.id)}
            className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-base font-semibold text-white">
                  {transaction.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {transaction.user.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {transaction.user.email}
                  </p>
                </div>
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium flex-shrink-0">
                View Profile →
              </div>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
}
