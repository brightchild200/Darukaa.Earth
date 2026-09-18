export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value}`;
}

export function formatArea(value: number): string {
  return `${value.toLocaleString()} ha`;
}

export function formatTrend(trend: number): string {
  const sign = trend >= 0 ? '+' : '';
  return `${sign}${trend.toFixed(1)}%`;
}

export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function polygonToLatLngArray(polygon: [number, number][]): [number, number][] {
  return polygon.map(([lat, lng]) => [lat, lng]);
}

export function calculatePolygonArea(polygon: [number, number][]): number {
  if (polygon.length < 3) return 0;
  const R = 6371;
  let area = 0;
  const n = polygon.length;

  for (let i = 0; i < n; i++) {
    const [lat1, lng1] = polygon[i];
    const [lat2, lng2] = polygon[(i + 1) % n];
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lng1Rad = (lng1 * Math.PI) / 180;
    const lng2Rad = (lng2 * Math.PI) / 180;
    area += (lng2Rad - lng1Rad) * (2 + Math.sin(lat1Rad) + Math.sin(lat2Rad));
  }

  area = Math.abs((area * R * R) / 2);
  return Math.round(area * 100);
}

export function getPolygonCenter(polygon: [number, number][]): [number, number] {
  let latSum = 0;
  let lngSum = 0;
  for (const [lat, lng] of polygon) {
    latSum += lat;
    lngSum += lng;
  }
  return [latSum / polygon.length, lngSum / polygon.length];
}

export function generateEnvironmentalSummary(metrics: {
  carbon_tco2e: number;
  carbon_trend: number;
  biodiversity_index: number;
  biodiversity_trend: number;
  ndvi: number;
  ndvi_trend: number;
}): string {
  const carbonDirection = metrics.carbon_trend > 0 ? 'increased' : 'decreased';
  const carbonMagnitude = Math.abs(metrics.carbon_trend) > 10 ? 'significantly' : 'steadily';
  const bioDirection = metrics.biodiversity_trend > 0 ? 'improving' : 'declining';
  const ndviDirection = metrics.ndvi_trend > 0 ? 'stable and healthy' : 'under stress';
  const ndviLevel = metrics.ndvi > 0.7 ? 'strong' : metrics.ndvi > 0.5 ? 'moderate' : 'low';

  return `Carbon sequestration has ${carbonDirection} ${carbonMagnitude} over the last six months while vegetation health remains ${ndviDirection}. NDVI at ${metrics.ndvi} indicates ${ndviLevel} vegetation density, and biodiversity trends are ${bioDirection} with an index of ${metrics.biodiversity_index}.`;
}
