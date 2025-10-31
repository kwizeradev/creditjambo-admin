import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Receipt, Eye } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { PageHeader } from '@/components/layout/PageHeader';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { TransactionDetailModal } from '@/components/modals/TransactionDetailModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { StatsBadge } from '@/components/ui/StatsBadge';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import type { TransactionWithUser } from '@/services/transactionService';

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'DEPOSIT', label: 'Deposits' },
  { value: 'WITHDRAW', label: 'Withdrawals' },
];

const TransactionTypeBadge = ({ type }: { type: 'DEPOSIT' | 'WITHDRAW' }) =>
  type === 'DEPOSIT' ? (
    <Badge variant="success" size="sm" className="gap-1">
      <TrendingUp className="w-3 h-3" />
      Deposit
    </Badge>
  ) : (
    <Badge variant="danger" size="sm" className="gap-1">
      <TrendingDown className="w-3 h-3" />
      Withdrawal
    </Badge>
  );

export function Transactions() {
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithUser | null>(null);

  const {
    transactions,
    pagination,
    isLoading,
    typeFilter,
    startDate,
    endDate,
    handlePageChange,
    handleTypeFilterChange,
    handleStartDateChange,
    handleEndDateChange,
    clearFilters,
  } = useTransactions();

  const handleUserClick = (userId: string) => {
    setSelectedTransaction(null);
    navigate(`/customers/${userId}`);
  };

  const handleViewTransaction = (transaction: TransactionWithUser) => {
    setSelectedTransaction(transaction);
  };

  const hasNoTransactions = !isLoading && transactions.length === 0;
  const hasActiveFilters = typeFilter !== 'all' || startDate || endDate;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Transactions"
        subtitle="View and manage all platform transactions"
        actions={
          pagination && (
            <StatsBadge icon={Receipt} label="Total" count={pagination.total} variant="purple" />
          )
        }
      />

      <div className="space-y-4 animate-fade-in flex-1">
        <Card>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Select value={typeFilter} onChange={handleTypeFilterChange} options={TYPE_OPTIONS} />
            <div className="flex-1" />
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
            />
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>

          {isLoading ? (
            <LoadingState count={5} />
          ) : hasNoTransactions ? (
            <EmptyState
              icon={Receipt}
              title="No transactions found"
              description={
                hasActiveFilters
                  ? 'Try adjusting your filters'
                  : 'No transactions have been made yet'
              }
            />
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <TransactionTypeBadge type={transaction.type} />
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(parseFloat(transaction.amount))}
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleUserClick(transaction.user.id)}
                            className="text-left hover:underline"
                          >
                            <div className="font-medium text-sm">{transaction.user.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {transaction.user.email}
                            </div>
                          </button>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                          {transaction.description || '-'}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 text-xs">
                          {formatDateTime(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTransaction(transaction)}
                            className="gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {transactions.map(transaction => (
                  <div
                    key={transaction.id}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <TransactionTypeBadge type={transaction.type} />
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(parseFloat(transaction.amount))}
                          </span>
                        </div>
                        <button
                          onClick={() => handleUserClick(transaction.user.id)}
                          className="text-left hover:underline"
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.user.email}
                          </p>
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {transaction.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {transaction.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {pagination && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                />
              )}
            </>
          )}
        </Card>
      </div>

      {selectedTransaction && (
        <TransactionDetailModal
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
}
