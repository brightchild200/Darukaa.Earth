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
      } flex h-full shrink-0 flex-col border-r border-app bg-surface transition-all duration-medium ease-out`}
    >
      <div className="flex h-16 items-center justify-between border-b border-app px-4">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Leaf className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-fg text-sm font-semibold tracking-tight">Darukaa</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Leaf className="w-4.5 h-4.5 text-primary" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hover:text-fg absolute -right-3 top-5 flex h-6 w-6 items-center justify-center rounded-full border border-app bg-elevated text-muted transition-colors duration-fast"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={`h-3.5 w-3.5 transition-transform duration-normal ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-fast ease-out ${
                active ? 'bg-primary/10 text-primary' : 'hover:text-fg text-muted hover:bg-elevated'
              }`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-app px-3 py-4">
        <button
          className={`hover:text-fg flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted transition-all duration-fast ease-out hover:bg-elevated`}
        >
          <Globe2 className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Global Map</span>}
        </button>
        <button
          className={`hover:text-fg flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted transition-all duration-fast ease-out hover:bg-elevated`}
        >
          <Settings className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        {!collapsed && (
          <div className="mt-2 flex items-center gap-2.5 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-app bg-elevated text-xs font-semibold text-secondary">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-fg truncate text-xs font-medium">Admin User</p>
              <p className="truncate text-[10px] text-muted">admin@darukaa.earth</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
