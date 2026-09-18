import { Search, Bell } from 'lucide-react';

export function Topbar() {
  return (
    <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-app bg-surface/80 px-6 backdrop-blur-sm">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search projects, sites..."
            className="text-fg w-full rounded-md border border-app bg-elevated py-2 pl-10 pr-4 text-sm transition-colors duration-fast placeholder:text-muted/60 focus:border-primary/30 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hover:text-fg relative flex h-9 w-9 items-center justify-center rounded-md text-muted transition-all duration-fast hover:bg-elevated">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-app bg-elevated text-xs font-semibold text-secondary">
          AD
        </div>
      </div>
    </header>
  );
}
