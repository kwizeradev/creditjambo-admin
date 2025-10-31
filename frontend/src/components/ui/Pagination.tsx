import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/formatters';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const MAX_VISIBLE_PAGES = 5;
const ELLIPSIS = '...';

const BASE_BUTTON_STYLES =
  'p-2 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300';
const PAGE_BUTTON_BASE_STYLES =
  'min-w-[36px] h-9 px-3 rounded-lg text-xs font-medium transition-all duration-200';
const ACTIVE_PAGE_STYLES = 'bg-primary-500 text-white shadow-soft';
const ELLIPSIS_STYLES = 'cursor-default text-gray-400 dark:text-gray-600';
const INACTIVE_PAGE_STYLES =
  'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800';

const calculateItemRange = (currentPage: number, itemsPerPage: number, totalItems: number) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  return { startItem, endItem };
};

const generatePageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (totalPages <= MAX_VISIBLE_PAGES) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  if (currentPage <= 3) {
    for (let i = 1; i <= 4; i++) {
      pages.push(i);
    }
    pages.push(ELLIPSIS);
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1);
    pages.push(ELLIPSIS);
    for (let i = totalPages - 3; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    pages.push(ELLIPSIS);
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(i);
    }
    pages.push(ELLIPSIS);
    pages.push(totalPages);
  }

  return pages;
};

const getPageButtonStyles = (page: number | string, currentPage: number): string => {
  if (page === currentPage) {
    return cn(PAGE_BUTTON_BASE_STYLES, ACTIVE_PAGE_STYLES);
  }
  if (page === ELLIPSIS) {
    return cn(PAGE_BUTTON_BASE_STYLES, ELLIPSIS_STYLES);
  }
  return cn(PAGE_BUTTON_BASE_STYLES, INACTIVE_PAGE_STYLES);
};

const handlePageClick = (page: number | string, onPageChange: (page: number) => void): void => {
  if (typeof page === 'number') {
    onPageChange(page);
  }
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const { startItem, endItem } = calculateItemRange(currentPage, itemsPerPage, totalItems);
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Showing <span className="font-medium text-gray-900 dark:text-gray-100">{startItem}</span> to{' '}
        <span className="font-medium text-gray-900 dark:text-gray-100">{endItem}</span> of{' '}
        <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span> results
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={BASE_BUTTON_STYLES}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(page, onPageChange)}
              disabled={page === ELLIPSIS}
              className={getPageButtonStyles(page, currentPage)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={BASE_BUTTON_STYLES}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
