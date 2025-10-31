import { format, formatDistanceToNow } from 'date-fns';

const RWANDA_LOCALE = 'en-RW';
const RWANDA_CURRENCY = 'RWF';
const US_LOCALE = 'en-US';

const DATE_FORMAT = 'MMM dd, yyyy';
const DATE_TIME_FORMAT = 'MMM dd, yyyy HH:mm';

const CURRENCY_OPTIONS = {
  style: 'currency' as const,
  currency: RWANDA_CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

const parseNumericAmount = (amount: number | string): number => {
  return typeof amount === 'string' ? parseFloat(amount) : amount;
};

const parseToDate = (date: string | Date): Date => {
  return new Date(date);
};

export const formatCurrency = (amount: number | string): string => {
  const numericAmount = parseNumericAmount(amount);
  return new Intl.NumberFormat(RWANDA_LOCALE, CURRENCY_OPTIONS).format(numericAmount);
};

export const formatDate = (date: string | Date): string => {
  return format(parseToDate(date), DATE_FORMAT);
};

export const formatDateTime = (date: string | Date): string => {
  return format(parseToDate(date), DATE_TIME_FORMAT);
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(parseToDate(date), { addSuffix: true });
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat(US_LOCALE).format(num);
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
