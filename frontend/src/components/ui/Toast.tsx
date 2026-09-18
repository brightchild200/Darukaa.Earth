import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const iconMap = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const colorMap = {
  success: 'text-primary',
  warning: 'text-warning',
  error: 'text-danger',
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 bg-elevated border border-app rounded-lg px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-fade-up"
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${colorMap[toast.type]}`} />
            <p className="text-sm text-fg flex-1 leading-relaxed">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-muted hover:text-fg transition-colors duration-fast"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
