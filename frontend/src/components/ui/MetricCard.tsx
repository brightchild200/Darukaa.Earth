import { TrendIndicator } from './TrendIndicator';
import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: ReactNode;
  trend?: number;
  accent?: boolean;
}

export function MetricCard({ label, value, unit, icon, trend, accent = false }: MetricCardProps) {
  return (
    <div
      className={`rounded-lg p-4 border transition-all duration-normal ease-out ${
        accent
          ? 'bg-primary/5 border-primary/20'
          : 'bg-elevated border-app'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-caption uppercase tracking-wide">{label}</span>
        {icon && <span className={accent ? 'text-primary' : 'text-muted'}>{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-metric-sm text-fg">{value}</span>
        {unit && <span className="text-unit">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className="mt-1.5">
          <TrendIndicator trend={trend} />
        </div>
      )}
    </div>
  );
}
