import type {
  Project,
  Site,
  SiteMetrics,
  MonthlyMetric,
  ApiProjectDetail,
  ApiSite,
  ApiSiteMetrics,
} from '@/types';

function mapApiSiteMetricsToFrontend(apiMetrics: ApiSiteMetrics[]): {
  current: SiteMetrics;
  monthly: MonthlyMetric[];
} {
  if (!apiMetrics || apiMetrics.length === 0) {
    return {
      current: {
        carbon_tco2e: 0,
        carbon_trend: 0,
        biodiversity_index: 0,
        biodiversity_trend: 0,
        ndvi: 0,
        ndvi_trend: 0,
        projected_credit_usd: 0,
      },
      monthly: [],
    };
  }

  const sorted = [...apiMetrics].sort(
    (a, b) => new Date(a.metric_date).getTime() - new Date(b.metric_date).getTime()
  );

  const latest = sorted[sorted.length - 1];
  const first = sorted[0];

  const carbonTrend = first.carbon_tco2e
    ? ((latest.carbon_tco2e! - first.carbon_tco2e) / first.carbon_tco2e) * 100
    : 0;
  const bioTrend = first.biodiversity_index
    ? ((latest.biodiversity_index! - first.biodiversity_index) / first.biodiversity_index) * 100
    : 0;
  const ndviTrend = first.ndvi ? ((latest.ndvi! - first.ndvi) / first.ndvi) * 100 : 0;

  return {
    current: {
      carbon_tco2e: latest.carbon_tco2e ?? 0,
      carbon_trend: Math.round(carbonTrend * 10) / 10,
      biodiversity_index: latest.biodiversity_index ?? 0,
      biodiversity_trend: Math.round(bioTrend * 10) / 10,
      ndvi: latest.ndvi ?? 0,
      ndvi_trend: Math.round(ndviTrend * 10) / 10,
      projected_credit_usd: latest.projected_credit_usd ?? 0,
    },
    monthly: sorted.map(m => ({
      month: new Date(m.metric_date).toLocaleDateString('en-US', { month: 'short' }),
      carbon_tco2e: m.carbon_tco2e ?? 0,
      biodiversity_index: m.biodiversity_index ?? 0,
      ndvi: m.ndvi ?? 0,
      projected_credit_usd: m.projected_credit_usd ?? 0,
    })),
  };
}

function geoJsonPolygonToLatLng(polygon: GeoJSON.Polygon): [number, number][] {
  // GeoJSON coordinates are [lng, lat], frontend expects [lat, lng]
  return polygon.coordinates[0].map(([lng, lat]) => [lat, lng]) as [number, number][];
}

function getPolygonCenter(polygon: [number, number][]): [number, number] {
  let latSum = 0,
    lngSum = 0;
  for (const [lat, lng] of polygon) {
    latSum += lat;
    lngSum += lng;
  }
  return [latSum / polygon.length, lngSum / polygon.length] as [number, number];
}

function formatCoordinates(center: [number, number]): string {
  const [lat, lng] = center;
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  const latAbs = Math.abs(lat);
  const lngAbs = Math.abs(lng);
  const latDeg = Math.floor(latAbs);
  const latMin = Math.floor((latAbs - latDeg) * 60);
  const latSec = Math.round((latAbs - latDeg - latMin / 60) * 3600);
  const lngDeg = Math.floor(lngAbs);
  const lngMin = Math.floor((lngAbs - lngDeg) * 60);
  const lngSec = Math.round((lngAbs - lngDeg - lngMin / 60) * 3600);
  return `${latDeg}°${latMin}'${latSec}"${latDir} ${lngDeg}°${lngMin}'${lngSec}"${lngDir}`;
}

export function adaptProject(apiProject: ApiProjectDetail): Project {
  const firstSite = apiProject.sites[0];
  const center = firstSite
    ? getPolygonCenter(geoJsonPolygonToLatLng(firstSite.geometry))
    : ([0, 0] as [number, number]);
  const location = firstSite
    ? `${Math.abs(center[0]).toFixed(2)}°${center[0] >= 0 ? 'N' : 'S'}, ${Math.abs(center[1]).toFixed(2)}°${center[1] >= 0 ? 'E' : 'W'}`
    : 'Unknown';

  const statusMap: Record<string, Project['status']> = {
    active: 'Active',
    pending: 'Pending',
    completed: 'Completed',
    archived: 'Archived',
    draft: 'Draft',
  };
  const status = statusMap[apiProject.status.toLowerCase()] || 'Active';

  return {
    id: apiProject.id,
    name: apiProject.name,
    type: apiProject.project_type as Project['type'],
    status,
    description: apiProject.description || '',
    location,
    center,
    area: apiProject.sites.reduce((sum, s) => sum + (s.area_ha || 0), 0),
    sites: apiProject.sites.map(adaptSite),
  };
}

export function adaptSite(apiSite: ApiSite): Site {
  const polygon = geoJsonPolygonToLatLng(apiSite.geometry);
  const center = getPolygonCenter(polygon);
  const { current, monthly } = mapApiSiteMetricsToFrontend(apiSite.metrics);

  const statusMap: Record<string, Site['status']> = {
    active: 'Active',
    pending: 'Pending',
    completed: 'Completed',
    inactive: 'Completed',
    archived: 'Completed',
  };
  const status = statusMap[apiSite.status.toLowerCase()] || 'Active';

  return {
    id: apiSite.id,
    name: apiSite.name,
    projectId: apiSite.project_id,
    status,
    polygon,
    center,
    area: apiSite.area_ha || 0,
    coordinates: formatCoordinates(center),
    lastUpdated: new Date(apiSite.updated_at).toLocaleDateString('en-CA'),
    metrics: current,
    monthlyData: monthly,
  };
}

export function adaptSiteAnalytics(apiAnalytics: import('@/types').ApiSiteAnalytics): {
  currentMetrics: SiteMetrics;
  monthlyData: MonthlyMetric[];
  trends: { carbon_trend: number; biodiversity_trend: number; ndvi_trend: number };
} {
  return {
    currentMetrics: apiAnalytics.current_metrics,
    monthlyData: apiAnalytics.monthly_data,
    trends: apiAnalytics.trends,
  };
}

export function adaptProjectAnalytics(apiAnalytics: import('@/types').ApiProjectAnalytics) {
  return apiAnalytics;
}
