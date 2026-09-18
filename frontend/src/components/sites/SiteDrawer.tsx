import { useEffect, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import type { Site, Project, MetricKey } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { MetricSelector } from '@/components/charts/MetricSelector';
import { AnalyticsChart } from '@/components/charts/AnalyticsChart';
import { SiteMetrics } from './SiteMetrics';
import { formatArea } from '@/lib/utils';

interface SiteDrawerProps {
  site: Site | null;
  project?: Project;
  onClose: () => void;
}

export function SiteDrawer({ site, project, onClose }: SiteDrawerProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('carbon_tco2e');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (site) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [site]);

  if (!site) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[2000] bg-black/40 transition-opacity duration-medium ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-[2001] flex h-full w-full max-w-md flex-col border-l border-app bg-surface transition-transform duration-medium ease-spring ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-app px-6 py-5">
          <div className="mb-3 flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-h2 text-fg mb-1">{site.name}</h2>
              <p className="text-caption">{project?.name || 'Unknown project'}</p>
            </div>
            <button
              onClick={onClose}
              className="hover:text-fg flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted transition-all duration-fast hover:bg-elevated"
              aria-label="Close"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success">
              <MapPin className="h-3 w-3" />
              {formatArea(site.area)}
            </Badge>
            <Badge
              variant={
                site.status === 'Active'
                  ? 'success'
                  : site.status === 'Pending'
                    ? 'warning'
                    : 'neutral'
              }
            >
              {site.status}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* KPIs + Metadata */}
          <div className="animate-fade-up">
            <SiteMetrics site={site} project={project} />
          </div>

          {/* Chart */}
          <div className="animate-fade-up mt-6" style={{ animationDelay: '100ms' }}>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-caption uppercase tracking-wide">Time Series Analytics</h4>
              <MetricSelector active={activeMetric} onChange={setActiveMetric} />
            </div>
            <div className="rounded-lg border border-app bg-elevated p-4">
              <AnalyticsChart data={site.monthlyData} metric={activeMetric} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
