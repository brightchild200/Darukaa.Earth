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
      className={`rounded-lg border p-4 transition-all duration-normal ease-out ${
        accent ? 'border-primary/20 bg-primary/5' : 'border-app bg-elevated'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
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
