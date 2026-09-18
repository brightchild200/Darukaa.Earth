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
      <div className="relative bg-surface border border-app rounded-lg w-full max-w-md shadow-[0_8px_40px_rgba(0,0,0,0.5)] animate-scale-in">
        <div className="px-6 py-5 border-b border-app flex items-center justify-between">
          <h3 className="text-h3 text-fg">New Site</h3>
          <button
            onClick={handleCancel}
            className="text-muted hover:text-fg transition-colors duration-fast"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <Input
            label="Site Name"
            placeholder="e.g. Amazon Restoration Site"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <div>
            <label className="text-xs font-medium text-muted tracking-wide uppercase block mb-1.5">
              Area
            </label>
            <div className="bg-elevated border border-app rounded-md px-3.5 py-2.5 text-sm text-fg">
              {formatArea(area)}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-app flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSave} disabled={saving || saved}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
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
      <div className="relative bg-surface border border-app rounded-lg w-full max-w-sm shadow-[0_8px_40px_rgba(0,0,0,0.5)] animate-scale-in">
        <div className="px-6 py-5">
          <h3 className="text-h3 text-fg mb-2">{title}</h3>
          <p className="text-sm text-muted">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-app flex items-center justify-end gap-3">
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
