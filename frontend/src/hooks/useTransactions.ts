import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { transactionService } from '@/services/transactionService';

const TRANSACTIONS_QUERY_KEY = 'transactions';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

export const useTransactions = () => {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [typeFilter, setTypeFilter] = useState('all');
  const defaultDates = getDefaultDateRange();
  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);

  const { data, isLoading, error } = useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, page, typeFilter, startDate, endDate],
    queryFn: () =>
      transactionService.getTransactions({
        page,
        limit: DEFAULT_LIMIT,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        startDate,
        endDate,
      }),
  });

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleTypeFilterChange = useCallback((value: string) => {
    setTypeFilter(value);
    setPage(DEFAULT_PAGE);
  }, []);

  const handleStartDateChange = useCallback((value: string) => {
    setStartDate(value);
    setPage(DEFAULT_PAGE);
  }, []);

  const handleEndDateChange = useCallback((value: string) => {
    setEndDate(value);
    setPage(DEFAULT_PAGE);
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
  };
};
