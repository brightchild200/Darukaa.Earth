import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TrendIndicatorProps {
  trend: number;
  className?: string;
}

export function TrendIndicator({ trend, className = '' }: TrendIndicatorProps) {
  const isPositive = trend >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  const color = isPositive ? 'text-primary' : 'text-danger';

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color} ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {Math.abs(trend).toFixed(1)}%
    </span>
  );
}
