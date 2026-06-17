import { useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type LocationState = { from?: { pathname?: string } } | null;

export default function LoginPage() {
  const { session, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-cyan animate-spin" />
      </div>
    );
  }

  if (session) {
    const from = (location.state as LocationState)?.from?.pathname ?? '/admin';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInErr } = await signIn(email, password);
    if (signInErr) {
      setError(signInErr);
      setSubmitting(false);
      return;
    }
    const from = (location.state as LocationState)?.from?.pathname ?? '/admin';
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6 noise-overlay">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan/10 filter blur-[120px] opacity-30 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="block text-center mb-8 font-display text-lg font-bold text-text-primary tracking-wider"
        >
          ABDULKAREEM<span className="text-cyan">AUTO</span>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl space-y-5"
          style={{
            background: 'rgba(11, 14, 26, 0.85)',
            border: '1px solid rgba(244, 246, 255, 0.1)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="text-center mb-2">
            <h1 className="font-display text-2xl font-bold text-text-primary">
              Admin Login
            </h1>
            <p className="font-arabic text-sm text-text-secondary mt-1">
              تسجيل دخول الإدارة
            </p>
          </div>

          <div>
            <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
              EMAIL
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-dark-bg border border-white/10 text-text-primary text-sm focus:border-cyan/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-mono-label text-[10px] text-text-secondary mb-2 block">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-3 rounded-lg bg-dark-bg border border-white/10 text-text-primary text-sm focus:border-cyan/50 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
          </button>

          <Link
            to="/"
            className="block text-center text-xs text-text-secondary hover:text-cyan transition"
          >
            ← Back to site
          </Link>
        </form>
      </div>
    </div>
  );
}
