import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router';
import { LayoutDashboard, Package, ClipboardList, LogOut, Loader2, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const { session, loading, configured, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-cyan animate-spin" />
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6">
        <div
          className="max-w-md p-8 rounded-2xl text-center"
          style={{
            background: 'rgba(11, 14, 26, 0.7)',
            border: '1px solid rgba(244, 246, 255, 0.1)',
          }}
        >
          <h1 className="font-display text-xl font-bold text-text-primary mb-2">
            Supabase Not Configured
          </h1>
          <p className="text-text-secondary text-sm mb-4">
            Set <code className="text-cyan">VITE_SUPABASE_URL</code> and{' '}
            <code className="text-cyan">VITE_SUPABASE_ANON_KEY</code> in Vercel
            environment variables, then redeploy.
          </p>
          <Link to="/" className="text-cyan text-sm hover:underline">
            ← Back to site
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col lg:flex-row">
      <aside
        className="lg:w-64 lg:min-h-screen lg:flex lg:flex-col p-4 lg:p-6"
        style={{
          background: 'rgba(11, 14, 26, 0.95)',
          borderRight: '1px solid rgba(244, 246, 255, 0.05)',
        }}
      >
        <Link to="/admin" className="flex items-center gap-2 mb-6 lg:mb-10">
          <div className="w-8 h-8 rounded-lg bg-cyan/15 border border-cyan/30 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-cyan" />
          </div>
          <div>
            <span className="font-display text-sm font-bold text-text-primary tracking-wider block leading-none">
              ADMIN
            </span>
            <span className="text-[10px] text-text-secondary">Abdulkareem Auto</span>
          </div>
        </Link>

        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan/10 text-cyan'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block mt-auto pt-6 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary transition"
          >
            <Home className="w-4 h-4" />
            View Site
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
