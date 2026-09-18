import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Layers, MapPin, Leaf, Trees } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { KpiCard } from '@/components/ui/KpiCard';
import { Badge } from '@/components/ui/Badge';
import { MapView } from '@/components/map/MapView';
import { SiteDrawer } from '@/components/sites/SiteDrawer';
import { CreateSiteDialog } from '@/components/sites/CreateSiteDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/hooks/useToast';
import { useProject, useSites } from '@/hooks/useApi';
import { adaptProject, adaptSite } from '@/lib/adapters';
import { api } from '@/lib/api';
import { formatNumber, formatArea } from '@/lib/utils';
import type { Site } from '@/types';

export function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { project: apiProject, loading: projectLoading } = useProject(projectId);
  const { sites: apiSites, loading: sitesLoading, refetch: refetchSites } = useSites(projectId);

  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSiteArea, setNewSiteArea] = useState(0);
  const [siteFilter, setSiteFilter] = useState<'All' | 'Active' | 'Pending' | 'Completed'>('All');

  const project = apiProject ? adaptProject(apiProject) : undefined;

  const handleSelectSite = useCallback((site: Site | null) => {
    setSelectedSite(site);
  }, []);

  const handleSiteCreated = useCallback(
    (polygon: [number, number][], area: number, _center: [number, number]) => {
      setNewSiteArea(area);
      setShowCreateDialog(true);
    },
    []
  );

  const handleSaveSite = useCallback(
    async (name: string) => {
      if (!projectId) return;
      try {
        const geometry = selectedSite?.polygon;
        if (!geometry) return;

        await api.sites.create({
          project_id: projectId,
          name,
          geometry: {
            type: 'Polygon',
            coordinates: [geometry.map(([lat, lng]) => [lng, lat])],
          },
          status: 'active',
        });

        setShowCreateDialog(false);
        showToast('success', `Site "${name}" created successfully`);
        void refetchSites();
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : 'Failed to create site');
      }
    },
    [projectId, selectedSite, showToast, refetchSites]
  );

  if (projectLoading) {
    return (
      <AppShell>
        <div className="p-8">
          <div className="flex h-64 items-center justify-center">
            <Skeleton className="h-3/4 w-3/4" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <div className="p-8">
          <EmptyState
            title="Project not found"
            description="The project you're looking for doesn't exist or has been removed."
            actionLabel="Back to Dashboard"
            onAction={() => void navigate('/dashboard')}
          />
        </div>
      </AppShell>
    );
  }

  const totalCarbon = project.sites.reduce((sum, s) => sum + s.metrics.carbon_tco2e, 0);
  const avgBiodiversity = project.sites.length
    ? project.sites.reduce((sum, s) => sum + s.metrics.biodiversity_index, 0) / project.sites.length
    : 0;

  const filteredSites =
    siteFilter === 'All' ? project.sites : project.sites.filter(s => s.status === siteFilter);

  const loading = projectLoading || sitesLoading;

  return (
    <AppShell>
      <div className="mx-auto max-w-[1600px] p-6 lg:p-8">
        {/* Back + Title */}
        <button
          onClick={() => void navigate('/dashboard')}
          className="hover:text-fg animate-fade-in mb-4 flex items-center gap-2 text-sm text-muted transition-colors duration-fast"
        >
          <ArrowLeft className="h-4 w-4" />
          Projects
        </button>

        <div
          className="animate-fade-up mb-8 flex items-start justify-between"
          style={{ animationDelay: '50ms' }}
        >
          <div>
            <h1 className="text-h1 text-fg mb-2">{project.name}</h1>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  project.type === 'Carbon'
                    ? 'primary'
                    : project.type === 'Biodiversity'
                      ? 'secondary'
                      : 'neutral'
                }
              >
                {project.type}
              </Badge>
              <Badge variant="success">{project.status}</Badge>
              <span className="text-caption">{project.location}</span>
            </div>
          </div>
        </div>

        <p
          className="text-body animate-fade-up mb-6 max-w-2xl text-muted"
          style={{ animationDelay: '100ms' }}
        >
          {project.description}
        </p>

        {/* KPI Row */}
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
                label="Area"
                value={project.area}
                unit="ha"
                icon={<Layers className="h-4 w-4" />}
                delay={150}
                format={n => n.toLocaleString()}
              />
              <KpiCard
                label="Sites"
                value={project.sites.length}
                icon={<MapPin className="h-4 w-4" />}
                delay={200}
              />
              <KpiCard
                label="Carbon"
                value={totalCarbon}
                unit="tCO₂e"
                icon={<Leaf className="h-4 w-4" />}
                delay={250}
                format={formatNumber}
              />
              <KpiCard
                label="Biodiversity"
                value={avgBiodiversity}
                icon={<Trees className="h-4 w-4" />}
                delay={300}
                format={n => n.toFixed(1)}
              />
            </>
          )}
        </div>

        {/* Map */}
        <div
          className="animate-fade-up mb-6 h-[450px] overflow-hidden rounded-lg border border-app bg-surface"
          style={{ animationDelay: '350ms' }}
        >
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Skeleton className="h-3/4 w-3/4" />
            </div>
          ) : (
            <MapView
              sites={project.sites}
              selectedSiteId={selectedSite?.id || null}
              onSelectSite={handleSelectSite}
              onSiteCreated={handleSiteCreated}
              center={project.center}
              zoom={6}
              className="h-full"
            />
          )}
        </div>

        {/* Sites list */}
        <div className="animate-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-h2 text-fg">Sites</h3>
            <div className="flex items-center gap-2">
              {(['All', 'Active', 'Pending', 'Completed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setSiteFilter(f)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-fast ease-out ${
                    siteFilter === f
                      ? 'border border-primary/20 bg-primary/15 text-primary'
                      : 'hover:text-fg border border-app bg-elevated text-muted'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredSites.length === 0 ? (
            <EmptyState
              title="No sites found"
              description="No sites match the selected filter. Try a different filter or draw a new site on the map."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSites.map((site, i) => (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={`animate-fade-up group w-full rounded-lg border bg-surface p-4 text-left transition-all duration-normal ease-out hover:-translate-y-0.5 ${
                    selectedSite?.id === site.id
                      ? 'border-primary/30 bg-primary/5'
                      : 'hover:border-strong border-app'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-h3 text-fg mb-1 truncate">{site.name}</h4>
                      <p className="text-caption font-mono">{site.coordinates}</p>
                    </div>
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
                  <div className="grid grid-cols-2 gap-3 border-t border-app pt-3">
                    <div>
                      <p className="text-caption mb-0.5">Area</p>
                      <p className="text-fg text-sm font-semibold">{formatArea(site.area)}</p>
                    </div>
                    <div>
                      <p className="text-caption mb-0.5">Carbon</p>
                      <p className="text-sm font-semibold text-primary">
                        {formatNumber(site.metrics.carbon_tco2e)} tCO₂e
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Site Drawer */}
      <SiteDrawer site={selectedSite} project={project} onClose={() => setSelectedSite(null)} />

      {/* Create Site Dialog */}
      <CreateSiteDialog
        open={showCreateDialog}
        area={newSiteArea}
        onClose={() => setShowCreateDialog(false)}
        onSave={handleSaveSite}
      />
    </AppShell>
  );
}
