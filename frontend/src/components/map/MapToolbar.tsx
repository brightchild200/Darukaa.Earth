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
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-1.5 bg-elevated/90 backdrop-blur-sm border border-app rounded-lg p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.label}
            onClick={tool.onClick}
            className={`group relative w-10 h-10 rounded-md flex items-center justify-center transition-all duration-fast ease-out ${
              tool.active
                ? 'bg-primary/15 text-primary'
                : 'text-muted hover:text-fg hover:bg-surface'
            }`}
            aria-label={tool.label}
          >
            <Icon className="w-4.5 h-4.5" />
            <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-elevated border border-app rounded-md px-2.5 py-1.5 text-xs text-fg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-fast shadow-lg">
              {tool.label}
            </span>
          </button>
        );
      })}
      <div className="h-px bg-app my-0.5" />
      <button
        className="group relative w-10 h-10 rounded-md flex items-center justify-center text-muted hover:text-fg hover:bg-surface transition-all duration-fast ease-out"
        aria-label="Layers"
      >
        <Layers className="w-4.5 h-4.5" />
        <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-elevated border border-app rounded-md px-2.5 py-1.5 text-xs text-fg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-fast shadow-lg">
          Layers
        </span>
      </button>
    </div>
  );
}
