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
    <div className="absolute bottom-6 left-4 z-[1000] rounded-lg border border-app bg-elevated/90 p-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2">
        <Leaf className="h-3.5 w-3.5 text-primary" />
        <span className="text-fg text-xs font-medium">Site Status</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {statuses.map(status => {
          const config = statusConfig[status];
          const isVisible = visibleStatuses.has(status);
          return (
            <div key={status} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-sm border"
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
