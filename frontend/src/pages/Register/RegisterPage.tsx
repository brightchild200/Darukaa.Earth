import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { api, setAuthToken } from '@/lib/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tokens = await api.auth.register(email, password, fullName);
      setAuthToken(tokens.access_token);
      showToast('success', 'Account created successfully');
      void navigate('/dashboard');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-app">
      {/* Left side - branding */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(110,231,161,1) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,161,1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="animate-pulse-subtle absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div
          className="animate-pulse-subtle absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-secondary/5 blur-3xl"
          style={{ animationDelay: '1s' }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="text-fg text-lg font-bold tracking-tight">DARUKAA.EARTH</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-display text-fg mb-4">
            Environmental
            <br />
            intelligence,
            <br />
            <span className="text-primary">mapped.</span>
          </h1>
          <p className="text-body max-w-md leading-relaxed text-muted">
            A premium geospatial platform for managing and visualizing carbon and biodiversity
            projects across the globe.
          </p>
        </div>

        <div className="text-caption relative z-10 flex items-center gap-6">
          <span>PostGIS Powered</span>
          <span className="h-1 w-1 rounded-full bg-muted/40" />
          <span>Satellite Intelligence</span>
          <span className="h-1 w-1 rounded-full bg-muted/40" />
          <span>Carbon Verified</span>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="animate-fade-up w-full max-w-sm">
          <div className="mb-12 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="text-fg text-lg font-bold tracking-tight">DARUKAA.EARTH</span>
          </div>

          <h2 className="text-h1 text-fg mb-2">Create account</h2>
          <p className="text-body mb-8 text-muted">Start managing your environmental projects</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-app/30 border-t-app" />
                  Creating account...
                </span>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <button
              onClick={() => void navigate('/login')}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
