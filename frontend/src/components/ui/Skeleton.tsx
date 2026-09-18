interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse-subtle rounded-md bg-elevated/60 ${className}`} />;
}
