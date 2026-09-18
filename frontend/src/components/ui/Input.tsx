import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-muted tracking-wide uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`bg-elevated border border-app rounded-md px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 transition-all duration-fast ease-out focus:outline-none focus:border-primary/40 focus:bg-surface ${
            error ? 'border-danger/30' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
