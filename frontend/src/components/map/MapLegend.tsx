import { Leaf } from 'lucide-react';
import type { SiteStatus } from '@/types';

interface MapLegendProps {
  visibleStatuses: Set<SiteStatus>;
}

const statusConfig: Record<SiteStatus, { color: string; label: string }> = {
  Active: { color: '#6EE7A1', label: 'Active' },
  Pending: { color: '#F4C95D', label: 'Pending' },
  Completed: { color: '#A7D7B8', label: 'Completed' },
};

export function MapLegend({ visibleStatuses }: MapLegendProps) {
  const statuses = Object.keys(statusConfig) as SiteStatus[];

  return (
    <div className="absolute bottom-6 left-4 z-[1000] bg-elevated/90 backdrop-blur-sm border border-app rounded-lg p-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-2 mb-2">
        <Leaf className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium text-fg">Site Status</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {statuses.map((status) => {
          const config = statusConfig[status];
          const isVisible = visibleStatuses.has(status);
          return (
            <div key={status} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm border"
                style={{
                  backgroundColor: isVisible ? `${config.color}40` : 'transparent',
                  borderColor: config.color,
                }}
              />
              <span className={`text-xs ${isVisible ? 'text-muted' : 'text-muted/40'}`}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
