import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Receipt, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

interface Transaction {
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

interface RecentTransactionsTableProps {
  transactions: Transaction[];
}

export function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  const navigate = useNavigate();

  const formatAmount = (amount: string) => {
    return `RWF ${parseFloat(amount).toLocaleString('en-RW', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <Receipt className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Latest activity</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/transactions')}
          className="gap-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
        >
          View All
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions yet"
          description="Transactions will appear here once customers start using the platform."
        />
      ) : (
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 5).map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                        {transaction.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {transaction.user.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium ${
                        transaction.type === 'DEPOSIT'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'DEPOSIT' ? (
                        <ArrowDownRight className="w-3 h-3 mr-0.5" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3 mr-0.5" />
                      )}
                      {transaction.type === 'DEPOSIT' ? 'Deposit' : 'Withdraw'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {formatAmount(transaction.amount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {formatDateTime(transaction.createdAt)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
