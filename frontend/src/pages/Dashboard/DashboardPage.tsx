import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, MapPin, Layers, TrendingUp } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard } from '@/components/ui/KpiCard';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { MapView } from '@/components/map/MapView';
import { SiteDrawer } from '@/components/sites/SiteDrawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/hooks/useToast';
import { useProjects, useSites } from '@/hooks/useApi';
import { adaptSite } from '@/lib/adapters';
import { formatNumber, formatArea } from '@/lib/utils';
import type { Site, ProjectType } from '@/types';

type FilterType = 'All' | 'Carbon' | 'Biodiversity' | 'Mixed';

interface DashboardProject {
  id: string;
  name: string;
  type: ProjectType;
  status: 'Active' | 'Pending';
  description: string;
  location: string;
  center: [number, number];
  area: number;
  sites: Site[];
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { projects: apiProjects, loading: projectsLoading } = useProjects();
  const { sites: apiSites, loading: sitesLoading, refetch: refetchSites } = useSites(undefined);

  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [filter, setFilter] = useState<FilterType>('All');

  // Convert API projects to frontend format
  const projects: DashboardProject[] = apiProjects.map(p => ({
    id: p.id,
    name: p.name,
    type: p.project_type as ProjectType,
    status: (p.status === 'active' ? 'Active' : 'Pending') as DashboardProject['status'],
    description: p.location || '',
    location: p.location || '',
    center: [0, 0] as [number, number],
    area: p.area || 0,
    sites: [],
  }));

  // Convert API sites to frontend format
  const allSites = apiSites.map(adaptSite);

  const totalSites = allSites.length;
  const totalArea = projects.reduce((sum, p) => sum + p.area, 0);
  const totalCarbon = allSites.reduce((sum, s) => sum + s.metrics.carbon_tco2e, 0);

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.type === filter);

  const filteredSites =
    filter === 'All'
      ? allSites
      : allSites.filter(s => {
          const project = projects.find(p => p.id === s.projectId);
          return project?.type === filter;
        });

  const loading = projectsLoading || sitesLoading;

  const handleSelectSite = useCallback((site: Site | null) => {
    setSelectedSite(site);
  }, []);

  const selectedProject = selectedSite
    ? projects.find(p => p.id === selectedSite.projectId)
    : undefined;

  const handleSiteCreated = useCallback(
    (polygon: [number, number][], area: number, _center: [number, number]) => {
      showToast('success', `Site created successfully — ${formatArea(area)}`);
      void refetchSites();
    },
    [showToast, refetchSites]
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-[1600px] p-6 lg:p-8">
        <PageHeader
          title="Environmental portfolio"
          subtitle="A live overview of your projects and sites."
          delay={0}
        >
          <div className="flex items-center gap-2">
            {(Object.values(['All', 'Carbon', 'Biodiversity', 'Mixed']) as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3.5 py-2 text-xs font-medium transition-all duration-fast ease-out ${
                  filter === f
                    ? 'border border-primary/20 bg-primary/15 text-primary'
                    : 'hover:text-fg border border-app bg-elevated text-muted'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </PageHeader>

        {/* KPI Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading ? (
            <>
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </>
          ) : (
            <>
              <KpiCard
                label="Projects"
                value={projects.length}
                icon={<Layers className="h-4 w-4" />}
                delay={50}
              />
              <KpiCard
                label="Sites"
                value={totalSites}
                icon={<MapPin className="h-4 w-4" />}
                delay={100}
              />
              <KpiCard
                label="Protected Area"
                value={totalArea}
                unit="ha"
                icon={<Leaf className="h-4 w-4" />}
                delay={150}
              />
              <KpiCard
                label="Carbon Sequestered"
                value={totalCarbon}
                unit="tCO₂e"
                icon={<TrendingUp className="h-4 w-4" />}
                delay={200}
                format={formatNumber}
              />
            </>
          )}
        </div>

        {/* Map + Projects */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Map */}
          <div
            className="animate-fade-up h-[500px] overflow-hidden rounded-lg border border-app bg-surface lg:col-span-2 lg:h-[600px]"
            style={{ animationDelay: '250ms' }}
          >
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Skeleton className="h-3/4 w-3/4" />
              </div>
            ) : (
              <MapView
                sites={filteredSites}
                selectedSiteId={selectedSite?.id || null}
                onSelectSite={handleSelectSite}
                onSiteCreated={handleSiteCreated}
                center={[0, 20]}
                zoom={3}
                className="h-full"
              />
            )}
          </div>

          {/* Project list */}
          <div className="animate-fade-up space-y-4" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-h3 text-fg">Projects</h3>
              <span className="text-caption">{filteredProjects.length} active</span>
            </div>
            {filteredProjects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                description="Create your first environmental project to begin mapping and monitoring sites."
                actionLabel="Create Project"
                onAction={() => void showToast('success', 'Project creation coming soon')}
              />
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => void navigate(`/projects/${project.id}`)}
                    delay={i * 50}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Site Intelligence Drawer */}
      <SiteDrawer
        site={selectedSite}
        project={selectedProject}
        onClose={() => setSelectedSite(null)}
      />
    </AppShell>
  );
}
