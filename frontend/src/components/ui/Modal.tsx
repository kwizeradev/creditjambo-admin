import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/formatters';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: ModalSize;
}

const ESCAPE_KEY = 'Escape';
const OVERFLOW_HIDDEN = 'hidden';
const OVERFLOW_UNSET = 'unset';

const SIZE_STYLES: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

const setBodyOverflow = (overflow: string): void => {
  document.body.style.overflow = overflow;
};

const handleEscapeKey = (event: KeyboardEvent, onClose: () => void): void => {
  if (event.key === ESCAPE_KEY) {
    onClose();
  }
};

const useBodyScrollLock = (isOpen: boolean): void => {
  useEffect(() => {
    setBodyOverflow(isOpen ? OVERFLOW_HIDDEN : OVERFLOW_UNSET);
    return () => setBodyOverflow(OVERFLOW_UNSET);
  }, [isOpen]);
};

const useEscapeKeyHandler = (isOpen: boolean, onClose: () => void): void => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => handleEscapeKey(event, onClose);
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
};

const getModalStyles = (size: ModalSize): string => {
  return cn(
    'relative w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl',
    'border border-gray-200 dark:border-gray-800',
    'animate-fade-in',
    SIZE_STYLES[size]
  );
};

const stopPropagation = (event: React.MouseEvent): void => {
  event.stopPropagation();
};

export function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
  useBodyScrollLock(isOpen);
  useEscapeKeyHandler(isOpen, onClose);

  if (!isOpen) {
    return null;
  }

  const modalStyles = getModalStyles(size);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className={modalStyles} onClick={stopPropagation}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="px-5 py-4 max-h-[calc(100vh-180px)] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
