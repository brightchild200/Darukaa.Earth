import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateProjectDialog({ open, onClose, onSuccess }: CreateProjectDialogProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState<'Carbon' | 'Biodiversity' | 'Mixed'>('Mixed');
  const [status, setStatus] = useState<'draft' | 'active' | 'completed' | 'archived'>('active');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await api.projects.create({
        name: name.trim(),
        description: description.trim() || undefined,
        project_type: projectType,
        status,
      });
      showToast('success', 'Project created successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background animate-fade-in relative w-full max-w-md rounded-lg border p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <Card className="p-6">
          <h2 className="mb-6 text-xl font-semibold">Create New Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                label="Project Name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Amazon Rainforest Restoration"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Project description..."
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-medium">Project Type</label>
              <select
                value={projectType}
                onChange={e =>
                  setProjectType(e.target.value as 'Carbon' | 'Biodiversity' | 'Mixed')
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                <option value="Carbon">Carbon</option>
                <option value="Biodiversity">Biodiversity</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={e =>
                  setStatus(e.target.value as 'draft' | 'active' | 'completed' | 'archived')
                }
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !name.trim()}>
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
