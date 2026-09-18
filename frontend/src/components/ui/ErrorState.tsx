import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 p-4 text-danger">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
      </div>
      <h3 className="text-h3 text-fg mb-2">{title}</h3>
      <p className="text-body mb-6 max-w-sm text-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
