import { type LucideIcon } from 'lucide-react';

interface StatsBadgeProps {
  icon: LucideIcon;
  label: string;
  count: number;
  variant?: 'blue' | 'purple' | 'orange' | 'green';
}

const VARIANT_STYLES = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
  purple:
    'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400',
  orange:
    'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400',
  green:
    'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
};

export function StatsBadge({ icon: Icon, label, count, variant = 'blue' }: StatsBadgeProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${VARIANT_STYLES[variant]}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium">
        {count} {label}
      </span>
    </div>
  );
}
