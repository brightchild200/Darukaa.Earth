const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('access_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export interface ProjectListItem {
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

export interface ProjectDetail {
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
  sites: Site[];
}

export interface Site {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  status: string;
  geometry: GeoJSON.Polygon;
  area_ha: number | null;
  created_at: string;
  updated_at: string;
  metrics: SiteMetrics[];
}

export interface SiteMetrics {
  id: string;
  site_id: string;
  metric_date: string;
  carbon_tco2e: number | null;
  biodiversity_index: number | null;
  ndvi: number | null;
  projected_credit_usd: number | null;
  created_at: string;
}

export interface SiteAnalytics {
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

export interface MonthlyMetric {
  month: string;
  carbon_tco2e: number;
  biodiversity_index: number;
  ndvi: number;
  projected_credit_usd: number;
}

export interface ProjectAnalytics {
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

export interface CreateProjectRequest {
  name: string;
  description?: string;
  project_type: 'Carbon' | 'Biodiversity' | 'Mixed';
  status?: 'draft' | 'active' | 'completed' | 'archived';
  start_date?: string;
  end_date?: string;
}

export interface CreateSiteRequest {
  project_id: string;
  name: string;
  description?: string;
  status?: 'active' | 'inactive' | 'pending' | 'archived';
  geometry: GeoJSON.Polygon;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchWithAuth<AuthTokens>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (email: string, password: string, full_name?: string) =>
      fetchWithAuth<AuthTokens>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name }),
      }),

    logout: () => fetchWithAuth<void>('/auth/logout', { method: 'POST' }),

    me: () => fetchWithAuth<User>('/auth/me'),

    refresh: (refresh_token: string) =>
      fetchWithAuth<AuthTokens>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token }),
      }),
  },

  projects: {
    list: () => fetchWithAuth<ProjectListItem[]>('/projects'),

    get: (id: string) => fetchWithAuth<ProjectDetail>(`/projects/${id}`),

    getDetail: (id: string) => fetchWithAuth<ProjectDetail>(`/projects/${id}/detail`),

    create: (data: CreateProjectRequest) =>
      fetchWithAuth<ProjectDetail>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<CreateProjectRequest>) =>
      fetchWithAuth<ProjectDetail>(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) => fetchWithAuth<void>(`/projects/${id}`, { method: 'DELETE' }),

    analytics: (id: string) => fetchWithAuth<ProjectAnalytics>(`/projects/${id}/analytics`),
  },

  sites: {
    list: (projectId: string) => fetchWithAuth<Site[]>(`/projects/${projectId}/sites`),

    get: (projectId: string, siteId: string) =>
      fetchWithAuth<Site>(`/projects/${projectId}/sites/${siteId}`),

    create: (data: CreateSiteRequest) =>
      fetchWithAuth<Site>(`/projects/${data.project_id}/sites`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (projectId: string, siteId: string, data: Partial<CreateSiteRequest>) =>
      fetchWithAuth<Site>(`/projects/${projectId}/sites/${siteId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (projectId: string, siteId: string) =>
      fetchWithAuth<void>(`/projects/${projectId}/sites/${siteId}`, { method: 'DELETE' }),

    analytics: (projectId: string, siteId: string) =>
      fetchWithAuth<SiteAnalytics>(`/projects/${projectId}/sites/${siteId}/analytics`),
  },

  metrics: {
    list: (siteId: string, startDate?: string, endDate?: string) => {
      const params = new URLSearchParams();
      if (startDate) params.set('start_date', startDate);
      if (endDate) params.set('end_date', endDate);
      const query = params.toString() ? `?${params.toString()}` : '';
      return fetchWithAuth<{ site_id: string; metrics: SiteMetrics[] }>(
        `/sites/${siteId}/metrics${query}`
      );
    },

    upsert: (
      siteId: string,
      date: string,
      data: Omit<SiteMetrics, 'id' | 'site_id' | 'created_at'>
    ) =>
      fetchWithAuth<SiteMetrics>(`/sites/${siteId}/metrics/${date}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },
};

export function getAuthToken(): string | null {
  return localStorage.getItem('access_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('access_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('access_token');
}
