import type { Project, Site, MonthlyMetric } from '@/types';

function generateMonthlyData(
  startCarbon: number,
  startBio: number,
  startNdvi: number,
  startUsd: number
): MonthlyMetric[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let carbon = startCarbon * 0.72;
  let bio = startBio * 0.82;
  let ndvi = startNdvi * 0.88;
  let usd = startUsd * 0.65;

  return months.map((month, i) => {
    const growth = 1 + (i / 11) * 0.28;
    carbon = startCarbon * 0.72 * growth + (Math.random() - 0.3) * startCarbon * 0.04;
    bio = startBio * 0.82 * (1 + (i / 11) * 0.18) + (Math.random() - 0.3) * 2;
    ndvi = Math.min(0.92, startNdvi * (0.88 + (i / 11) * 0.12) + (Math.random() - 0.4) * 0.03);
    usd = startUsd * 0.65 * growth + (Math.random() - 0.3) * startUsd * 0.03;

    return {
      month,
      carbon_tco2e: Math.round(carbon),
      biodiversity_index: Math.round(bio * 10) / 10,
      ndvi: Math.round(ndvi * 100) / 100,
      projected_credit_usd: Math.round(usd / 1000) * 1000,
    };
  });
}

function makePolygon(center: [number, number], sizeDeg: number): [number, number][] {
  const [lat, lng] = center;
  const offset = sizeDeg / 2;
  const variance = sizeDeg * 0.15;
  return [
    [lat - offset + Math.random() * variance, lng - offset + Math.random() * variance],
    [lat - offset + Math.random() * variance, lng + offset - Math.random() * variance],
    [lat + offset - Math.random() * variance, lng + offset - Math.random() * variance],
    [lat + offset - Math.random() * variance, lng - offset + Math.random() * variance],
  ];
}

const amazonSites: Site[] = [
  {
    id: 'site-amazon-1',
    name: 'Amazon Site Alpha',
    projectId: 'proj-amazon',
    status: 'Active',
    polygon: makePolygon([-3.4653, -62.2159], 0.08),
    center: [-3.4653, -62.2159],
    area: 1240,
    coordinates: '3°27\'55"S 62°12\'57"W',
    lastUpdated: '2026-09-10',
    metrics: {
      carbon_tco2e: 24800,
      carbon_trend: 12.4,
      biodiversity_index: 82.4,
      biodiversity_trend: 8.7,
      ndvi: 0.74,
      ndvi_trend: 5.2,
      projected_credit_usd: 420000,
    },
    monthlyData: generateMonthlyData(24800, 82.4, 0.74, 420000),
  },
  {
    id: 'site-amazon-2',
    name: 'Amazon Site Beta',
    projectId: 'proj-amazon',
    status: 'Active',
    polygon: makePolygon([-4.2153, -61.5892], 0.06),
    center: [-4.2153, -61.5892],
    area: 860,
    coordinates: '4°12\'55"S 61°35\'21"W',
    lastUpdated: '2026-09-08',
    metrics: {
      carbon_tco2e: 18600,
      carbon_trend: 9.8,
      biodiversity_index: 78.1,
      biodiversity_trend: 6.2,
      ndvi: 0.71,
      ndvi_trend: 3.8,
      projected_credit_usd: 315000,
    },
    monthlyData: generateMonthlyData(18600, 78.1, 0.71, 315000),
  },
  {
    id: 'site-amazon-3',
    name: 'Amazon Site Gamma',
    projectId: 'proj-amazon',
    status: 'Pending',
    polygon: makePolygon([-2.8912, -61.1247], 0.05),
    center: [-2.8912, -61.1247],
    area: 740,
    coordinates: '2°53\'28"S 61°07\'29"W',
    lastUpdated: '2026-09-12',
    metrics: {
      carbon_tco2e: 14200,
      carbon_trend: 7.1,
      biodiversity_index: 74.8,
      biodiversity_trend: 4.5,
      ndvi: 0.68,
      ndvi_trend: 2.1,
      projected_credit_usd: 241000,
    },
    monthlyData: generateMonthlyData(14200, 74.8, 0.68, 241000),
  },
];

const kenyaSites: Site[] = [
  {
    id: 'site-kenya-1',
    name: 'Laikipia Rangeland North',
    projectId: 'proj-kenya',
    status: 'Active',
    polygon: makePolygon([0.5939, 36.7561], 0.07),
    center: [0.5939, 36.7561],
    area: 980,
    coordinates: '0°35\'38"N 36°45\'22"E',
    lastUpdated: '2026-09-11',
    metrics: {
      carbon_tco2e: 19200,
      carbon_trend: 10.5,
      biodiversity_index: 68.3,
      biodiversity_trend: 5.4,
      ndvi: 0.62,
      ndvi_trend: 4.1,
      projected_credit_usd: 326000,
    },
    monthlyData: generateMonthlyData(19200, 68.3, 0.62, 326000),
  },
  {
    id: 'site-kenya-2',
    name: 'Laikipia Rangeland South',
    projectId: 'proj-kenya',
    status: 'Active',
    polygon: makePolygon([0.2147, 37.0283], 0.06),
    center: [0.2147, 37.0283],
    area: 720,
    coordinates: '0°12\'53"N 37°01\'42"E',
    lastUpdated: '2026-09-09',
    metrics: {
      carbon_tco2e: 15400,
      carbon_trend: 8.2,
      biodiversity_index: 65.7,
      biodiversity_trend: 3.9,
      ndvi: 0.59,
      ndvi_trend: 2.8,
      projected_credit_usd: 262000,
    },
    monthlyData: generateMonthlyData(15400, 65.7, 0.59, 262000),
  },
];

const borneoSites: Site[] = [
  {
    id: 'site-borneo-1',
    name: 'Sabah Reserve East',
    projectId: 'proj-borneo',
    status: 'Active',
    polygon: makePolygon([5.2579, 117.1247], 0.06),
    center: [5.2579, 117.1247],
    area: 1020,
    coordinates: '5°15\'28"N 117°07\'29"E',
    lastUpdated: '2026-09-07',
    metrics: {
      carbon_tco2e: 22300,
      carbon_trend: 11.2,
      biodiversity_index: 86.7,
      biodiversity_trend: 9.1,
      ndvi: 0.78,
      ndvi_trend: 6.3,
      projected_credit_usd: 379000,
    },
    monthlyData: generateMonthlyData(22300, 86.7, 0.78, 379000),
  },
  {
    id: 'site-borneo-2',
    name: 'Sabah Reserve West',
    projectId: 'proj-borneo',
    status: 'Completed',
    polygon: makePolygon([4.8912, 116.5892], 0.05),
    center: [4.8912, 116.5892],
    area: 680,
    coordinates: '4°53\'28"N 116°35\'21"E',
    lastUpdated: '2026-09-05',
    metrics: {
      carbon_tco2e: 16800,
      carbon_trend: 6.4,
      biodiversity_index: 79.2,
      biodiversity_trend: 4.8,
      ndvi: 0.72,
      ndvi_trend: 3.5,
      projected_credit_usd: 285000,
    },
    monthlyData: generateMonthlyData(16800, 79.2, 0.72, 285000),
  },
];

export const projects: Project[] = [
  {
    id: 'proj-amazon',
    name: 'Amazon Rainforest Restoration',
    type: 'Mixed',
    status: 'Active',
    description: 'Large-scale reforestation and conservation across the Amazon basin, combining carbon sequestration with biodiversity monitoring in one of the world\'s most critical ecosystems.',
    location: 'Amazonas, Brazil',
    center: [-3.5, -62.0],
    area: 2840,
    sites: amazonSites,
  },
  {
    id: 'proj-kenya',
    name: 'Kenyan Rangeland Carbon',
    type: 'Carbon',
    status: 'Active',
    description: 'Sustainable rangeland management practices that improve soil carbon sequestration while supporting pastoralist communities and wildlife corridors.',
    location: 'Laikipia County, Kenya',
    center: [0.4, 36.9],
    area: 1700,
    sites: kenyaSites,
  },
  {
    id: 'proj-borneo',
    name: 'Borneo Biodiversity Reserve',
    type: 'Biodiversity',
    status: 'Active',
    description: 'Protecting critical rainforest habitat for endangered species including orangutans, clouded leopards, and sun bears through community-led conservation.',
    location: 'Sabah, Malaysia',
    center: [5.1, 116.9],
    area: 1700,
    sites: borneoSites,
  },
];

export const allSites = [...amazonSites, ...kenyaSites, ...borneoSites];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getSiteById(id: string): Site | undefined {
  return allSites.find((s) => s.id === id);
}

export function getSitesByProject(projectId: string): Site[] {
  return allSites.filter((s) => s.projectId === projectId);
}
