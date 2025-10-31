import { cn } from '@/utils/formatters';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

const SELECT_STYLES = cn(
  'px-4 py-2.5 rounded-xl transition-all duration-200',
  'bg-white dark:bg-gray-900',
  'border border-gray-200 dark:border-gray-800',
  'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
  'text-sm text-gray-900 dark:text-gray-100',
  'cursor-pointer'
);

const handleSelectChange = (
  event: React.ChangeEvent<HTMLSelectElement>,
  onChange: (value: string) => void
): void => {
  onChange(event.target.value);
};

export function Select({ value, onChange, options, className }: SelectProps) {
  return (
    <select
      value={value}
      onChange={event => handleSelectChange(event, onChange)}
      className={cn(SELECT_STYLES, className)}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
