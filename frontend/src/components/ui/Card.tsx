import { type ReactNode } from 'react';
import { cn } from '@/utils/formatters';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

const BASE_STYLES =
  'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-soft dark:shadow-soft-dark transition-all duration-200';
const HOVER_STYLES = 'hover:shadow-soft-lg dark:hover:shadow-soft-lg-dark hover:scale-[1.01]';
const PADDING_STYLES = 'p-4';

const getCardStyles = (padding: boolean, hover: boolean, className?: string): string => {
  return cn(BASE_STYLES, hover && HOVER_STYLES, padding && PADDING_STYLES, className);
};

export function Card({ children, className, padding = true, hover = false }: CardProps) {
  const cardStyles = getCardStyles(padding, hover, className);

  return <div className={cardStyles}>{children}</div>;
}
