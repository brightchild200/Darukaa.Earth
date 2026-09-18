import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { api, setAuthToken } from '@/lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tokens = await api.auth.login(email, password);
      setAuthToken(tokens.access_token);
      showToast('success', 'Signed in successfully');
      navigate('/dashboard');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(110,231,161,1) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,161,1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Animated circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-subtle" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/5 blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-fg tracking-tight">DARUKAA.EARTH</span>
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
          <p className="text-body text-muted max-w-md leading-relaxed">
            A premium geospatial platform for managing and visualizing carbon and biodiversity projects across the globe.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-caption">
          <span>PostGIS Powered</span>
          <span className="w-1 h-1 rounded-full bg-muted/40" />
          <span>Satellite Intelligence</span>
          <span className="w-1 h-1 rounded-full bg-muted/40" />
          <span>Carbon Verified</span>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="lg:hidden flex items-center gap-3 mb-12 justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-fg tracking-tight">DARUKAA.EARTH</span>
          </div>

          <h2 className="text-h1 text-fg mb-2">Welcome back</h2>
          <p className="text-body text-muted mb-8">Sign in to your environmental intelligence dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="admin@darukaa.earth"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-app bg-elevated accent-primary" />
                <span className="text-sm text-muted">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-app/30 border-t-app rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{' '}
            <button className="text-primary hover:underline font-medium" onClick={() => navigate('/register')}>
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}