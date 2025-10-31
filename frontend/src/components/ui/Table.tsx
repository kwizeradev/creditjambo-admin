import { type ReactNode } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/utils/formatters';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">{children}</table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={cn('border-b border-gray-200 dark:border-gray-800', className)}>
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function TableRow({ children, onClick, className }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-gray-100 dark:border-gray-800/50 transition-colors duration-150',
        onClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50',
        className
      )}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children: ReactNode;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
  className?: string;
}

export function TableHead({
  children,
  sortable,
  sortDirection,
  onSort,
  className,
}: TableHeadProps) {
  return (
    <th
      onClick={sortable ? onSort : undefined}
      className={cn(
        'text-left py-3 px-4 text-xs font-medium text-gray-600 dark:text-gray-400 align-middle',
        sortable && 'cursor-pointer select-none hover:text-gray-900 dark:hover:text-gray-200',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        {children}
        {sortable && (
          <span className="text-gray-400 dark:text-gray-600">
            {sortDirection === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5" />
            ) : sortDirection === 'desc' ? (
              <ArrowDown className="w-3.5 h-3.5" />
            ) : (
              <ArrowUpDown className="w-3.5 h-3.5" />
            )}
          </span>
        )}
      </div>
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td
      className={cn('py-3 px-4 text-sm text-gray-900 dark:text-gray-100 align-middle', className)}
    >
      {children}
    </td>
  );
}
