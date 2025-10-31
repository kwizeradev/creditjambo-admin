import { Users, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { PageHeader } from '@/components/layout/PageHeader';
import { MetricCard } from '@/components/charts/MetricCard';
import { TransactionChart } from '@/components/charts/TransactionChart';
import { RecentTransactionsTable } from '@/components/charts/RecentTransactionsTable';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/utils/formatters';

const SKELETON_COUNT = 4;

const DashboardSkeleton = () => (
  <div className="flex flex-col h-full">
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 -mx-6 -mt-6 px-6 py-4 mb-6">
      <div className="space-y-1.5">
        <div className="h-7 w-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-3.5 w-56 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    </div>
    <div className="space-y-4 animate-fade-in flex-1">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(SKELETON_COUNT)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <CardSkeleton className="h-[320px] lg:col-span-3" />
        <CardSkeleton className="h-[320px] lg:col-span-4" />
      </div>
    </div>
  </div>
);

export function Dashboard() {
  const { analytics, chartData, isLoading } = useAnalytics();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const totalDeposits = parseFloat(analytics?.analytics.totalDeposits.amount || '0');
  const totalWithdrawals = parseFloat(analytics?.analytics.totalWithdrawals.amount || '0');
  const depositCount = analytics?.analytics.totalDeposits.count || 0;
  const withdrawalCount = analytics?.analytics.totalWithdrawals.count || 0;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your platform's performance and activity"
      />
      <div className="space-y-4 animate-fade-in flex-1">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            title="Total Customers"
            value={analytics?.analytics.totalCustomers || 0}
            icon={Users}
            color="blue"
            subtitle="Registered users"
          />
          <MetricCard
            title="Total Deposits"
            value={formatCurrency(totalDeposits)}
            icon={TrendingUp}
            color="green"
            subtitle={`${depositCount} transactions`}
          />
          <MetricCard
            title="Total Withdrawals"
            value={formatCurrency(totalWithdrawals)}
            icon={TrendingDown}
            color="red"
            subtitle={`${withdrawalCount} transactions`}
          />
          <MetricCard
            title="Pending Devices"
            value={analytics?.analytics.pendingDevices || 0}
            icon={Clock}
            color="orange"
            subtitle="Awaiting verification"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          <div className="lg:col-span-3">
            <TransactionChart data={chartData} />
          </div>

          <div className="lg:col-span-4">
            <RecentTransactionsTable transactions={analytics?.recentTransactions || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
