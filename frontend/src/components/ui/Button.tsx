import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-app font-semibold hover:brightness-110 active:scale-[0.97] shadow-[0_0_20px_rgba(110,231,161,0.15)]',
  secondary:
    'bg-elevated text-fg border border-app hover:border-strong hover:bg-surface active:scale-[0.97]',
  ghost: 'text-muted hover:text-fg hover:bg-elevated active:scale-[0.97]',
  danger: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 active:scale-[0.97]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-md gap-2',
  lg: 'px-6 py-3 text-sm rounded-lg gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center transition-all duration-fast ease-out cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
