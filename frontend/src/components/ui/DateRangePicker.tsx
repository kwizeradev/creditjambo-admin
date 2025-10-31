import { Calendar } from 'lucide-react';
import { cn } from '@/utils/formatters';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: DateRangePickerProps) {
  return (
    <div className={cn('flex items-center gap-2 flex-shrink-0', className)}>
      <div className="relative w-40">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="date"
          value={startDate}
          onChange={e => onStartDateChange(e.target.value)}
          className={cn(
            'w-full pl-10 pr-3 py-2.5 rounded-xl transition-all duration-200',
            'bg-white dark:bg-gray-900',
            'border border-gray-200 dark:border-gray-800',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            'text-xs text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-600'
          )}
        />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">to</span>
      <div className="relative w-40">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <input
          type="date"
          value={endDate}
          onChange={e => onEndDateChange(e.target.value)}
          className={cn(
            'w-full pl-10 pr-3 py-2.5 rounded-xl transition-all duration-200',
            'bg-white dark:bg-gray-900',
            'border border-gray-200 dark:border-gray-800',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            'text-xs text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-600'
          )}
        />
      </div>
    </div>
  );
}
