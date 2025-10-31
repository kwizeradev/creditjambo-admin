import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { customerService } from '@/services/customerService';

const CUSTOMERS_QUERY_KEY = 'customers';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const useCustomers = () => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading, error } = useQuery({
    queryKey: [CUSTOMERS_QUERY_KEY, page, search, statusFilter, sortBy, sortOrder],
    queryFn: () =>
      customerService.getCustomers({
        page,
        limit: DEFAULT_LIMIT,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy,
        sortOrder,
      }),
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(DEFAULT_PAGE);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPage(DEFAULT_PAGE);
  }, []);

  const handleSortChange = useCallback(
    (field: string) => {
      if (sortBy === field) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(field);
        setSortOrder('desc');
      }
    },
    [sortBy, sortOrder]
  );

  return {
    customers: data?.customers || [],
    pagination: data?.pagination,
    isLoading,
    error,
    page,
    search,
    statusFilter,
    sortBy,
    sortOrder,
    handlePageChange,
    handleSearchChange,
    handleStatusFilterChange,
    handleSortChange,
  };
};
