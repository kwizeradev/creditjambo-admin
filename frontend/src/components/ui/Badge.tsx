import { type ReactNode } from 'react';
import { cn } from '@/utils/formatters';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const BASE_STYLES = 'inline-flex items-center justify-center font-medium rounded-lg';

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  success:
    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800',
  warning:
    'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
  danger:
    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  purple:
    'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

const getBadgeStyles = (variant: BadgeVariant, size: BadgeSize, className?: string): string => {
  return cn(BASE_STYLES, VARIANT_STYLES[variant], SIZE_STYLES[size], className);
};

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const badgeStyles = getBadgeStyles(variant, size, className);

  return <span className={badgeStyles}>{children}</span>;
}
