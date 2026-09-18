import { ArrowRight, MapPin, Leaf } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Project } from '@/types';
import { formatNumber, formatArea } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  delay?: number;
}

export function ProjectCard({ project, onClick, delay = 0 }: ProjectCardProps) {
  const totalCarbon = project.sites.reduce((sum, s) => sum + s.metrics.carbon_tco2e, 0);

  return (
    <button
      onClick={onClick}
      className="hover:border-strong animate-fade-up group w-full rounded-lg border border-app bg-surface p-5 text-left transition-all duration-normal ease-out hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-h3 text-fg mb-1 truncate">{project.name}</h3>
          <div className="flex items-center gap-2">
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
            <span className="text-caption flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {project.location}
            </span>
          </div>
        </div>
      </div>

      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">{project.description}</p>

      <div className="mb-4 grid grid-cols-3 gap-4 border-b border-app pb-4">
        <div>
          <p className="text-caption mb-0.5">Sites</p>
          <p className="text-fg text-lg font-semibold">{project.sites.length}</p>
        </div>
        <div>
          <p className="text-caption mb-0.5">Area</p>
          <p className="text-fg text-lg font-semibold">{formatArea(project.area)}</p>
        </div>
        <div>
          <p className="text-caption mb-0.5">Carbon</p>
          <p className="text-lg font-semibold text-primary">{formatNumber(totalCarbon)} tCO₂e</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Leaf className="h-3.5 w-3.5" />
          {project.status}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-primary transition-all duration-normal group-hover:gap-2">
          Open Project
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}
