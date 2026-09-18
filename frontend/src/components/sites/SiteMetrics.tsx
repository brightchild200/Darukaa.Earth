import { MetricCard } from '@/components/ui/MetricCard';
import { Badge } from '@/components/ui/Badge';
import { TrendIndicator } from '@/components/ui/TrendIndicator';
import { Leaf, Trees, Activity, DollarSign } from 'lucide-react';
import type { Site, Project } from '@/types';
import { formatNumber, formatCurrency, formatArea } from '@/lib/utils';

interface SiteMetricsProps {
  site: Site;
  project?: Project;
}

export function SiteMetrics({ site, project }: SiteMetricsProps) {
  const m = site.metrics;

  return (
    <div className="space-y-5">
      {/* Environmental KPIs */}
      <div>
        <h4 className="text-caption mb-3 uppercase tracking-wide">Environmental KPIs</h4>
        <div className="grid grid-cols-2 gap-2.5">
          <MetricCard
            label="Carbon"
            value={formatNumber(m.carbon_tco2e)}
            unit="tCO₂e"
            icon={<Leaf className="h-4 w-4" />}
            trend={m.carbon_trend}
            accent
          />
          <MetricCard
            label="Biodiversity"
            value={m.biodiversity_index.toFixed(1)}
            icon={<Trees className="h-4 w-4" />}
            trend={m.biodiversity_trend}
          />
          <MetricCard
            label="NDVI"
            value={m.ndvi.toFixed(2)}
            icon={<Activity className="h-4 w-4" />}
            trend={m.ndvi_trend}
          />
          <MetricCard
            label="Projected Value"
            value={formatCurrency(m.projected_credit_usd)}
            icon={<DollarSign className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Metadata */}
      <div>
        <h4 className="text-caption mb-3 uppercase tracking-wide">Site Information</h4>
        <div className="space-y-3 rounded-lg border border-app bg-elevated p-4">
          <div className="flex items-center justify-between">
            <span className="text-caption">Location</span>
            <span className="text-fg font-mono text-sm">{site.coordinates}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-caption">Area</span>
            <span className="text-fg text-sm">{formatArea(site.area)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-caption">Status</span>
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
          <div className="flex items-center justify-between">
            <span className="text-caption">Project</span>
            <span className="text-fg text-sm">{project?.name || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-caption">Last updated</span>
            <span className="text-fg text-sm">{site.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div>
        <h4 className="text-caption mb-2 uppercase tracking-wide">Environmental Summary</h4>
        <p className="text-sm leading-relaxed text-muted">{generateSummary(site)}</p>
      </div>
    </div>
  );
}

function generateSummary(site: Site): string {
  const m = site.metrics;
  const carbonDirection = m.carbon_trend > 0 ? 'increased' : 'decreased';
  const carbonMagnitude = Math.abs(m.carbon_trend) > 10 ? 'significantly' : 'steadily';
  const ndviDirection = m.ndvi_trend > 0 ? 'stable and healthy' : 'under stress';
  const ndviLevel = m.ndvi > 0.7 ? 'strong' : m.ndvi > 0.5 ? 'moderate' : 'low';
  const bioDirection = m.biodiversity_trend > 0 ? 'improving' : 'declining';

  return `Carbon sequestration has ${carbonDirection} ${carbonMagnitude} over the last six months while vegetation health remains ${ndviDirection}. NDVI at ${m.ndvi} indicates ${ndviLevel} vegetation density, and biodiversity trends are ${bioDirection} with an index of ${m.biodiversity_index}.`;
}
