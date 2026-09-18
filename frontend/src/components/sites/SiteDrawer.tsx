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
        className={`fixed inset-0 bg-black/40 z-[2000] transition-opacity duration-medium ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-app z-[2001] transition-transform duration-medium ease-spring flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-app shrink-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-h2 text-fg mb-1">{site.name}</h2>
              <p className="text-caption">{project?.name || 'Unknown project'}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md flex items-center justify-center text-muted hover:text-fg hover:bg-elevated transition-all duration-fast shrink-0"
              aria-label="Close"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success">
              <MapPin className="w-3 h-3" />
              {formatArea(site.area)}
            </Badge>
            <Badge
              variant={site.status === 'Active' ? 'success' : site.status === 'Pending' ? 'warning' : 'neutral'}
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
          <div className="mt-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-caption uppercase tracking-wide">Time Series Analytics</h4>
              <MetricSelector active={activeMetric} onChange={setActiveMetric} />
            </div>
            <div className="bg-elevated border border-app rounded-lg p-4">
              <AnalyticsChart data={site.monthlyData} metric={activeMetric} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
