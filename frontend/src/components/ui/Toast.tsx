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
    <div className="fixed bottom-6 right-6 z-[9999] flex max-w-sm flex-col gap-3">
      {toasts.map(toast => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className="animate-fade-up flex items-start gap-3 rounded-lg border border-app bg-elevated px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${colorMap[toast.type]}`} />
            <p className="text-fg flex-1 text-sm leading-relaxed">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="hover:text-fg text-muted transition-colors duration-fast"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
