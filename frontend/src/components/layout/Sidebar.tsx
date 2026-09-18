import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Settings, ChevronLeft, Globe2, Leaf } from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderOpen },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith('/projects');
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-56'
      } shrink-0 bg-surface border-r border-app flex flex-col transition-all duration-medium ease-out h-full`}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-app">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Leaf className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-fg tracking-tight">Darukaa</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
            <Leaf className="w-4.5 h-4.5 text-primary" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted hover:text-fg transition-colors duration-fast absolute top-5 -right-3 w-6 h-6 rounded-full bg-elevated border border-app flex items-center justify-center"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={`w-3.5 h-3.5 transition-transform duration-normal ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-fast ease-out ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:text-fg hover:bg-elevated'
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="py-4 px-3 border-t border-app flex flex-col gap-1">
        <button
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted hover:text-fg hover:bg-elevated transition-all duration-fast ease-out`}
        >
          <Globe2 className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Global Map</span>}
        </button>
        <button
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted hover:text-fg hover:bg-elevated transition-all duration-fast ease-out`}
        >
          <Settings className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        {!collapsed && (
          <div className="mt-2 px-3 py-2 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-elevated border border-app flex items-center justify-center text-xs font-semibold text-secondary">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-fg truncate">Admin User</p>
              <p className="text-[10px] text-muted truncate">admin@darukaa.earth</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
