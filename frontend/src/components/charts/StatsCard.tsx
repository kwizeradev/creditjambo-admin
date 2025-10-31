import { type LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'blue' | 'purple' | 'orange';
}

export function StatsCard({ title, value, icon: Icon, trend, color = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <Card hover className="group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`p-3 ${colorClasses[color]} rounded-2xl shadow-soft group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
}
