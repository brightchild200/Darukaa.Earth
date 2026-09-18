import { useCountUp } from '@/hooks/useCountUp';
import { TrendIndicator } from './TrendIndicator';
import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: number;
  unit?: string;
  icon?: ReactNode;
  trend?: number;
  format?: (n: number) => string;
  delay?: number;
}

export function KpiCard({ label, value, unit, icon, trend, format, delay = 0 }: KpiCardProps) {
  const animatedValue = useCountUp(value, 1200, true);
  const displayValue = format ? format(animatedValue) : Math.round(animatedValue).toLocaleString();

  return (
    <div
      className="hover:border-strong animate-fade-up rounded-lg border border-app bg-surface p-5 transition-all duration-normal ease-out hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-caption uppercase tracking-wide">{label}</span>
        {icon && <span className="text-muted">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-metric text-fg">{displayValue}</span>
        {unit && <span className="text-unit">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className="mt-2.5">
          <TrendIndicator trend={trend} />
        </div>
      )}
    </div>
  );
}
