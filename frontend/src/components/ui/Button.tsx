import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/formatters';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const BASE_STYLES =
  'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-500 hover:bg-primary-600 text-white shadow-soft hover:shadow-soft-lg dark:shadow-soft-dark dark:hover:shadow-soft-lg-dark focus:ring-primary-500',
  secondary:
    'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-gray-500',
  danger:
    'bg-red-500 hover:bg-red-600 text-white shadow-soft hover:shadow-soft-lg focus:ring-red-500',
  ghost:
    'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500',
  outline:
    'border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm font-medium',
  lg: 'px-6 py-3 text-base font-medium',
};

const LoadingContent = () => (
  <>
    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
    Loading...
  </>
);

const getButtonStyles = (variant: ButtonVariant, size: ButtonSize, className?: string): string => {
  return cn(BASE_STYLES, VARIANT_STYLES[variant], SIZE_STYLES[size], className);
};

const isButtonDisabled = (disabled?: boolean, isLoading?: boolean): boolean => {
  return disabled || isLoading || false;
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const buttonStyles = getButtonStyles(variant, size, className);
  const buttonDisabled = isButtonDisabled(disabled, isLoading);

  return (
    <button className={buttonStyles} disabled={buttonDisabled} {...props}>
      {isLoading ? <LoadingContent /> : children}
    </button>
  );
}
