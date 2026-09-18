interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-elevated/60 rounded-md animate-pulse-subtle ${className}`}
    />
  );
}
