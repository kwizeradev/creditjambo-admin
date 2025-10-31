import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { analyticsService } from '@/services/analyticsService';
import type { AnalyticsData } from '@/types';

const ANALYTICS_QUERY_KEY = 'analytics';
const REFETCH_INTERVAL_MS = 60000;
const DAYS_TO_SHOW = 7;

interface ChartDataPoint {
  date: string;
  deposits: number;
  withdrawals: number;
}

const getDateKey = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const initializeDateMap = (
  daysCount: number
): Map<string, { deposits: number; withdrawals: number }> => {
  const dateMap = new Map<string, { deposits: number; withdrawals: number }>();

  for (let i = daysCount - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = getDateKey(date);
    dateMap.set(dateKey, { deposits: 0, withdrawals: 0 });
  }

  return dateMap;
};

const aggregateTransactionData = (
  transactions: AnalyticsData['recentTransactions'],
  dateMap: Map<string, { deposits: number; withdrawals: number }>,
  startDate: Date
): void => {
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.createdAt);
    if (transactionDate >= startDate) {
      const dateKey = getDateKey(transactionDate);
      const existing = dateMap.get(dateKey);
      if (existing) {
        const amount = parseFloat(transaction.amount);
        if (transaction.type === 'DEPOSIT') {
          existing.deposits += amount;
        } else {
          existing.withdrawals += amount;
        }
      }
    }
  });
};

const convertToChartData = (
  dateMap: Map<string, { deposits: number; withdrawals: number }>
): ChartDataPoint[] => {
  return Array.from(dateMap.entries()).map(([date, values]) => ({
    date,
    deposits: Math.round(values.deposits),
    withdrawals: Math.round(values.withdrawals),
  }));
};

const generateChartData = (analytics?: AnalyticsData): ChartDataPoint[] => {
  if (!analytics?.recentTransactions) {
    return [];
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (DAYS_TO_SHOW - 1));

  const dateMap = initializeDateMap(DAYS_TO_SHOW);
  aggregateTransactionData(analytics.recentTransactions, dateMap, startDate);

  return convertToChartData(dateMap);
};

export const useAnalytics = () => {
  const {
    data: analytics,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ANALYTICS_QUERY_KEY],
    queryFn: analyticsService.getAnalytics,
    refetchInterval: REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });

  const chartData = useMemo(() => generateChartData(analytics), [analytics]);

  return {
    analytics,
    chartData,
    isLoading,
    error,
  };
};
