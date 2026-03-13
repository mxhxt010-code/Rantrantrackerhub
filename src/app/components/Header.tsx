import { Link, useLocation } from 'react-router';
import { Moon, Sun, Cpu } from 'lucide-react';
import { useTheme, useStyles } from './ThemeContext';

const NAV_ITEMS = [
  { label: 'Feed', href: '/' },
  { label: 'Pulse Map', href: '/pulse-map' },
  { label: 'The Devices', href: '/devices' },
  { label: 'My Dashboard', href: '/dashboard' },
];

export function Header() {
  const { toggleTheme } = useTheme();
  const s = useStyles();
  const location = useLocation();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[72px]"
      style={{
        background: s.isDark
          ? 'rgba(9,9,14,0.85)'
          : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${s.divider}`,
      }}
    >
      <div className="max-w-[1440px] mx-auto px-10 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' }}
          >
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-baseline gap-0.5">
            <span
              className={`text-xl tracking-tight ${s.textPrimary}`}
              style={{ fontWeight: 700, letterSpacing: '-0.02em' }}
            >
              RANT
            </span>
            <span
              className="text-xl"
              style={{ color: s.accentViolet, fontWeight: 700, letterSpacing: '-0.02em' }}
            >
              HUB
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const isActive =
              item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? s.isDark
                      ? 'bg-white/[0.08] text-white'
                      : 'bg-black/[0.06] text-[#0A0A12]'
                    : s.isDark
                    ? 'text-[#8888A0] hover:text-white hover:bg-white/[0.05]'
                    : 'text-[#6B6B82] hover:text-[#0A0A12] hover:bg-black/[0.04]'
                }`}
                style={{ fontWeight: 500 }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              s.isDark
                ? 'bg-white/[0.07] hover:bg-white/[0.12] text-[#8888A0] hover:text-white'
                : 'bg-black/[0.05] hover:bg-black/[0.09] text-[#6B6B82] hover:text-[#0A0A12]'
            }`}
          >
            {s.isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* CTA */}
          <Link
            to="/devices"
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
            }}
          >
            Get a Rantracker
          </Link>
        </div>
      </div>
    </header>
  );
}
