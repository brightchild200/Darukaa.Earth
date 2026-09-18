import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  delay?: number;
}

export function PageHeader({ title, subtitle, children, delay = 0 }: PageHeaderProps) {
  return (
    <div
      className="flex items-end justify-between mb-8 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div>
        <h1 className="text-h1 text-fg mb-1.5">{title}</h1>
        {subtitle && <p className="text-body text-muted">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
