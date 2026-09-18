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
      className="group bg-surface border border-app rounded-lg p-5 text-left transition-all duration-normal ease-out hover:border-strong hover:-translate-y-0.5 w-full animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-h3 text-fg mb-1 truncate">{project.name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant={project.type === 'Carbon' ? 'primary' : project.type === 'Biodiversity' ? 'secondary' : 'neutral'}>
              {project.type}
            </Badge>
            <span className="text-caption flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {project.location}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">{project.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-app">
        <div>
          <p className="text-caption mb-0.5">Sites</p>
          <p className="text-lg font-semibold text-fg">{project.sites.length}</p>
        </div>
        <div>
          <p className="text-caption mb-0.5">Area</p>
          <p className="text-lg font-semibold text-fg">{formatArea(project.area)}</p>
        </div>
        <div>
          <p className="text-caption mb-0.5">Carbon</p>
          <p className="text-lg font-semibold text-primary">{formatNumber(totalCarbon)} tCO₂e</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5" />
          {project.status}
        </span>
        <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-normal">
          Open Project
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </button>
  );
}
