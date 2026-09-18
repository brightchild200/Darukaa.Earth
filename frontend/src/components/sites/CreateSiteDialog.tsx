import { useState, type ReactNode } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatArea } from '@/lib/utils';

interface CreateSiteDialogProps {
  open: boolean;
  area: number;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function CreateSiteDialog({ open, area, onClose, onSave }: CreateSiteDialogProps) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        onSave(name || 'Untitled Site');
        setName('');
        setSaved(false);
      }, 800);
    }, 1000);
  };

  const handleCancel = () => {
    setName('');
    setSaved(false);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />
      <div className="animate-scale-in relative w-full max-w-md rounded-lg border border-app bg-surface shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-app px-6 py-5">
          <h3 className="text-h3 text-fg">New Site</h3>
          <button
            onClick={handleCancel}
            className="hover:text-fg text-muted transition-colors duration-fast"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <Input
            label="Site Name"
            placeholder="e.g. Amazon Restoration Site"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
              Area
            </label>
            <div className="text-fg rounded-md border border-app bg-elevated px-3.5 py-2.5 text-sm">
              {formatArea(area)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-app px-6 py-4">
          <Button variant="ghost" size="md" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving || saved}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              'Save Site'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmDialogProps): ReactNode {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="animate-scale-in relative w-full max-w-sm rounded-lg border border-app bg-surface shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
        <div className="px-6 py-5">
          <h3 className="text-h3 text-fg mb-2">{title}</h3>
          <p className="text-sm text-muted">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-app px-6 py-4">
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
