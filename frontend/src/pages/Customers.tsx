import { useState } from 'react';
import { Users, Eye, CheckCircle2, XCircle, Smartphone, Wallet } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { PageHeader } from '@/components/layout/PageHeader';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { CustomerDetailModal } from '@/components/modals/CustomerDetailModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { StatsBadge } from '@/components/ui/StatsBadge';
import { formatCurrency, formatRelativeTime } from '@/utils/formatters';
import type { Customer } from '@/types';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const getStatusBadge = (customer: Customer) => {
  return customer.verifiedDevicesCount > 0 ? (
    <div className="flex items-center gap-1.5">
      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
      <span className="text-xs font-medium text-green-700 dark:text-green-400">Verified</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5">
      <XCircle className="w-4 h-4 text-gray-400 dark:text-gray-600" />
      <span className="text-xs text-gray-500 dark:text-gray-500">None</span>
    </div>
  );
};

const CustomerTableRow = ({ customer, onClick }: { customer: Customer; onClick: () => void }) => (
  <TableRow onClick={onClick}>
    <TableCell className="font-medium">{customer.name}</TableCell>
    <TableCell className="text-gray-600 dark:text-gray-400">{customer.email}</TableCell>
    <TableCell className="font-semibold">{formatCurrency(parseFloat(customer.balance))}</TableCell>
    <TableCell>
      <Badge variant="info" size="sm">
        {customer.devicesCount}
      </Badge>
    </TableCell>
    <TableCell>{getStatusBadge(customer)}</TableCell>
    <TableCell className="text-gray-600 dark:text-gray-400 text-xs">
      {formatRelativeTime(customer.createdAt)}
    </TableCell>
    <TableCell>
      <Button
        variant="ghost"
        size="sm"
        onClick={e => {
          e.stopPropagation();
          onClick();
        }}
        className="gap-1.5"
      >
        <Eye className="w-3.5 h-3.5" />
        View
      </Button>
    </TableCell>
  </TableRow>
);

const CustomerMobileCard = ({ customer, onClick }: { customer: Customer; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {customer.name}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">{customer.email}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={e => {
          e.stopPropagation();
          onClick();
        }}
        className="flex-shrink-0 ml-2"
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-gray-400 dark:text-gray-600" />
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(parseFloat(customer.balance))}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Smartphone className="w-4 h-4 text-gray-400 dark:text-gray-600" />
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Devices</p>
          <div className="flex items-center gap-1.5">
            <Badge variant="info" size="sm">
              {customer.devicesCount}
            </Badge>
            {customer.verifiedDevicesCount > 0 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
            )}
          </div>
        </div>
      </div>
    </div>

    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Joined {formatRelativeTime(customer.createdAt)}
      </p>
    </div>
  </div>
);

export function Customers() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const {
    customers,
    pagination,
    isLoading,
    search,
    statusFilter,
    handlePageChange,
    handleSearchChange,
    handleStatusFilterChange,
  } = useCustomers();

  const handleRowClick = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const hasNoCustomers = !isLoading && customers.length === 0;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Customers"
        subtitle="Manage and view all customer accounts"
        actions={
          pagination && (
            <StatsBadge icon={Users} label="Total" count={pagination.total} variant="blue" />
          )
        }
      />

      <div className="space-y-4 animate-fade-in flex-1">
        <Card>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="sm:w-80">
              <SearchBar
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name or email..."
              />
            </div>
            <div className="flex-1" />
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              options={STATUS_OPTIONS}
            />
          </div>

          {isLoading ? (
            <LoadingState count={5} />
          ) : hasNoCustomers ? (
            <EmptyState
              icon={Users}
              title="No customers found"
              description={
                search ? 'Try adjusting your search or filters' : 'No customers have registered yet'
              }
            />
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Devices</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map(customer => (
                      <CustomerTableRow
                        key={customer.id}
                        customer={customer}
                        onClick={() => handleRowClick(customer.id)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {customers.map(customer => (
                  <CustomerMobileCard
                    key={customer.id}
                    customer={customer}
                    onClick={() => handleRowClick(customer.id)}
                  />
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

      {selectedCustomerId && (
        <CustomerDetailModal
          isOpen={!!selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
          customerId={selectedCustomerId}
        />
      )}
    </div>
  );
}
