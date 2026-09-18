export type ProjectType = 'Carbon' | 'Biodiversity' | 'Mixed';
export type SiteStatus = 'Active' | 'Pending' | 'Completed';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: 'Active' | 'Pending' | 'Completed' | 'Archived' | 'Draft';
  description: string;
  location: string;
  center: [number, number];
  area: number;
  sites: Site[];
}

export interface Site {
  id: string;
  name: string;
  projectId: string;
  status: SiteStatus;
  polygon: [number, number][];
  center: [number, number];
  area: number;
  coordinates: string;
  lastUpdated: string;
  metrics: SiteMetrics;
  monthlyData: MonthlyMetric[];
}

export interface SiteMetrics {
  carbon_tco2e: number;
  carbon_trend: number;
  biodiversity_index: number;
  biodiversity_trend: number;
  ndvi: number;
  ndvi_trend: number;
  projected_credit_usd: number;
}

export interface MonthlyMetric {
  month: string;
  carbon_tco2e: number;
  biodiversity_index: number;
  ndvi: number;
  projected_credit_usd: number;
}

export interface KpiData {
  projects: number;
  sites: number;
  protectedArea: number;
  carbonSequestered: number;
}

export type MetricKey = 'carbon_tco2e' | 'biodiversity_index' | 'ndvi' | 'projected_credit_usd';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
}

// API Response Types (matching backend)
export interface ApiProjectListItem {
  id: string;
  name: string;
  project_type: string;
  status: string;
  location: string | null;
  area: number | null;
  site_count: number;
  total_carbon: number | null;
  created_at: string;
}

export interface ApiProjectDetail {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  project_type: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  sites: ApiSite[];
}

export interface ApiSite {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  status: string;
  geometry: GeoJSON.Polygon;
  area_ha: number | null;
  created_at: string;
  updated_at: string;
  metrics: ApiSiteMetrics[];
}

export interface ApiSiteMetrics {
  id: string;
  site_id: string;
  metric_date: string;
  carbon_tco2e: number | null;
  biodiversity_index: number | null;
  ndvi: number | null;
  projected_credit_usd: number | null;
  created_at: string;
}

export interface ApiSiteAnalytics {
  site_id: string;
  site_name: string;
  current_metrics: {
    carbon_tco2e: number;
    carbon_trend: number;
    biodiversity_index: number;
    biodiversity_trend: number;
    ndvi: number;
    ndvi_trend: number;
    projected_credit_usd: number;
  };
  monthly_data: MonthlyMetric[];
  trends: {
    carbon_trend: number;
    biodiversity_trend: number;
    ndvi_trend: number;
  };
}

export interface ApiProjectAnalytics {
  project_id: string;
  project_name: string;
  total_area: number;
  total_carbon: number;
  avg_biodiversity: number;
  avg_ndvi: number;
  site_count: number;
  active_sites: number;
  monthly_data: MonthlyMetric[];
}