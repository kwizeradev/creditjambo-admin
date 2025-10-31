import { CardSkeleton } from '@/components/ui/Skeleton';

interface LoadingStateProps {
  count?: number;
}

const DEFAULT_SKELETON_COUNT = 4;

export function LoadingState({ count = DEFAULT_SKELETON_COUNT }: LoadingStateProps) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}
