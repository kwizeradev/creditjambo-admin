import { Search, X } from 'lucide-react';
import { cn } from '@/utils/formatters';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const DEFAULT_PLACEHOLDER = 'Search...';

const INPUT_STYLES = cn(
  'w-full pl-10 pr-10 py-2.5 rounded-xl transition-all duration-200',
  'bg-white dark:bg-gray-900',
  'border border-gray-200 dark:border-gray-800',
  'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
  'text-sm text-gray-900 dark:text-gray-100',
  'placeholder:text-gray-400 dark:placeholder:text-gray-600'
);

const ICON_BASE_STYLES = 'absolute top-1/2 -translate-y-1/2 w-4 h-4';
const SEARCH_ICON_STYLES = cn(ICON_BASE_STYLES, 'left-3 text-gray-400 dark:text-gray-500');
const CLEAR_BUTTON_STYLES =
  'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors';

const handleInputChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void
): void => {
  onChange(event.target.value);
};

const clearSearch = (onChange: (value: string) => void): void => {
  onChange('');
};

const hasSearchValue = (value: string): boolean => {
  return value.length > 0;
};

export function SearchBar({
  value,
  onChange,
  placeholder = DEFAULT_PLACEHOLDER,
  className,
}: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className={SEARCH_ICON_STYLES} />
      <input
        type="text"
        value={value}
        onChange={event => handleInputChange(event, onChange)}
        placeholder={placeholder}
        className={INPUT_STYLES}
      />
      {hasSearchValue(value) && (
        <button onClick={() => clearSearch(onChange)} className={CLEAR_BUTTON_STYLES}>
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
