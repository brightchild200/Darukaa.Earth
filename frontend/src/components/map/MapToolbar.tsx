import { Plus, Minus, Locate, Spline, Layers } from 'lucide-react';

interface MapToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  onDraw: () => void;
  isDrawing: boolean;
}

export function MapToolbar({ onZoomIn, onZoomOut, onLocate, onDraw, isDrawing }: MapToolbarProps) {
  const tools = [
    { icon: Plus, label: 'Zoom in', onClick: onZoomIn },
    { icon: Minus, label: 'Zoom out', onClick: onZoomOut },
    { icon: Locate, label: 'Locate', onClick: onLocate },
    { icon: Spline, label: 'Draw site', onClick: onDraw, active: isDrawing },
  ];

  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-1.5 rounded-lg border border-app bg-elevated/90 p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      {tools.map(tool => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.label}
            onClick={tool.onClick}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-md transition-all duration-fast ease-out ${
              tool.active
                ? 'bg-primary/15 text-primary'
                : 'hover:text-fg text-muted hover:bg-surface'
            }`}
            aria-label={tool.label}
          >
            <Icon className="w-4.5 h-4.5" />
            <span className="text-fg pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-app bg-elevated px-2.5 py-1.5 text-xs opacity-0 shadow-lg transition-opacity duration-fast group-hover:opacity-100">
              {tool.label}
            </span>
          </button>
        );
      })}
      <div className="my-0.5 h-px bg-app" />
      <button
        className="hover:text-fg group relative flex h-10 w-10 items-center justify-center rounded-md text-muted transition-all duration-fast ease-out hover:bg-surface"
        aria-label="Layers"
      >
        <Layers className="w-4.5 h-4.5" />
        <span className="text-fg pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-app bg-elevated px-2.5 py-1.5 text-xs opacity-0 shadow-lg transition-opacity duration-fast group-hover:opacity-100">
          Layers
        </span>
      </button>
    </div>
  );
}
