import { type LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

type MetricColor = 'blue' | 'green' | 'red' | 'orange';

interface MetricChange {
  value: number;
  isPositive: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: MetricColor;
  subtitle?: string;
  change?: MetricChange;
}

interface ColorStyles {
  bg: string;
  lightBg: string;
  text: string;
  gradient: string;
}

const COLOR_STYLES: Record<MetricColor, ColorStyles> = {
  blue: {
    bg: 'bg-blue-500',
    lightBg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-blue-600',
  },
  green: {
    bg: 'bg-green-500',
    lightBg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    gradient: 'from-green-500 to-green-600',
  },
  red: {
    bg: 'bg-red-500',
    lightBg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    gradient: 'from-red-500 to-red-600',
  },
  orange: {
    bg: 'bg-orange-500',
    lightBg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-500 to-orange-600',
  },
};

const getChangeStyles = (isPositive: boolean): string => {
  return isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';
};

const getChangeTextStyles = (isPositive: boolean): string => {
  return isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
};

const formatChangeValue = (value: number, isPositive: boolean): string => {
  const prefix = isPositive ? '+' : '';
  return `${prefix}${value}%`;
};

const hasFooterContent = (subtitle?: string, change?: MetricChange): boolean => {
  return Boolean(subtitle || change);
};

interface MetricIconProps {
  Icon: LucideIcon;
  styles: ColorStyles;
}

const MetricIcon = ({ Icon, styles }: MetricIconProps) => (
  <div
    className={`p-2 ${styles.bg} rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-200 shrink-0`}
  >
    <Icon className="w-4 h-4 text-white" />
  </div>
);

interface MetricChangeIndicatorProps {
  change: MetricChange;
}

const MetricChangeIndicator = ({ change }: MetricChangeIndicatorProps) => (
  <div
    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${getChangeStyles(change.isPositive)}`}
  >
    <span className={`text-xs font-semibold ${getChangeTextStyles(change.isPositive)}`}>
      {formatChangeValue(change.value, change.isPositive)}
    </span>
  </div>
);

export function MetricCard({ title, value, icon: Icon, color, subtitle, change }: MetricCardProps) {
  const styles = COLOR_STYLES[color];

  return (
    <Card hover className="relative overflow-hidden group">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
              {title}
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
              {value}
            </h3>
          </div>

          <MetricIcon Icon={Icon} styles={styles} />
        </div>

        {hasFooterContent(subtitle, change) && (
          <div className="flex items-center justify-between">
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
            )}

            {change && <MetricChangeIndicator change={change} />}
          </div>
        )}
      </div>
    </Card>
  );
}
