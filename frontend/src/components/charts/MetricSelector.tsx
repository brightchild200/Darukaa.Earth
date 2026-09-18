import type { MetricKey } from '@/types';

interface MetricSelectorProps {
  active: MetricKey;
  onChange: (metric: MetricKey) => void;
}

const metrics: { key: MetricKey; label: string }[] = [
  { key: 'carbon_tco2e', label: 'Carbon' },
  { key: 'biodiversity_index', label: 'Biodiversity' },
  { key: 'ndvi', label: 'NDVI' },
];

export function MetricSelector({ active, onChange }: MetricSelectorProps) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-app bg-elevated p-1">
      {metrics.map(metric => (
        <button
          key={metric.key}
          onClick={() => onChange(metric.key)}
          className={`rounded-[6px] px-3.5 py-1.5 text-xs font-medium transition-all duration-fast ease-out ${
            active === metric.key ? 'bg-primary/15 text-primary' : 'hover:text-fg text-muted'
          }`}
        >
          {metric.label}
        </button>
      ))}
    </div>
  );
}
