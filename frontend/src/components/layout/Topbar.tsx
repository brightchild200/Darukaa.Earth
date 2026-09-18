import { Search, Bell } from 'lucide-react';

export function Topbar() {
  return (
    <header className="h-16 border-b border-app bg-surface/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search projects, sites..."
            className="w-full bg-elevated border border-app rounded-md pl-10 pr-4 py-2 text-sm text-fg placeholder:text-muted/60 focus:outline-none focus:border-primary/30 transition-colors duration-fast"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-md flex items-center justify-center text-muted hover:text-fg hover:bg-elevated transition-all duration-fast">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>
        <div className="w-9 h-9 rounded-full bg-elevated border border-app flex items-center justify-center text-xs font-semibold text-secondary">
          AD
        </div>
      </div>
    </header>
  );
}
