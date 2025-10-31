import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { transactionService } from '@/services/transactionService';

const TRANSACTIONS_QUERY_KEY = 'transactions';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const useTransactions = () => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Set default dates only when filters are first applied
  useEffect(() => {
    if (!filtersApplied && (typeFilter !== 'all' || startDate || endDate)) {
      setFiltersApplied(true);
    }
  }, [typeFilter, startDate, endDate, filtersApplied]);

  const { data, isLoading, error } = useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, page, typeFilter, startDate, endDate],
    queryFn: () =>
      transactionService.getTransactions({
        page,
        limit: DEFAULT_LIMIT,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
    // Only enable the query when filters have been applied or it's the initial load with no filters
    enabled: filtersApplied || (typeFilter === 'all' && !startDate && !endDate),
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
    setPage(DEFAULT_PAGE);
    if (!filtersApplied && value !== 'all') {
      setFiltersApplied(true);
    }
  }, [filtersApplied]);

  const handleStartDateChange = useCallback((value: string) => {
    setStartDate(value);
    setPage(DEFAULT_PAGE);
    if (!filtersApplied && value) {
      setFiltersApplied(true);
    }
  }, [filtersApplied]);

  const handleEndDateChange = useCallback((value: string) => {
    setEndDate(value);
    setPage(DEFAULT_PAGE);
    if (!filtersApplied && value) {
      setFiltersApplied(true);
    }
  }, [filtersApplied]);

  const clearFilters = useCallback(() => {
    setTypeFilter('all');
    setStartDate('');
    setEndDate('');
    setPage(DEFAULT_PAGE);
    // Keep filtersApplied as true to show all transactions
  }, []);

  return {
    transactions: data?.transactions || [],
    pagination: data?.pagination,
    isLoading,
    error,
    page,
    typeFilter,
    startDate,
    endDate,
    handlePageChange,
    handleTypeFilterChange,
    handleStartDateChange,
    handleEndDateChange,
    clearFilters,
  };
};