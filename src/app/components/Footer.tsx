import { Link } from 'react-router';
import { Cpu } from 'lucide-react';
import { useStyles } from './ThemeContext';

export function Footer() {
  const s = useStyles();

  return (
    <footer style={{ borderTop: `1px solid ${s.divider}` }}>
      <div className="max-w-[1440px] mx-auto px-10 py-16">
        <div className="grid grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' }}
              >
                <Cpu className="w-3.5 h-3.5 text-white" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: s.isDark ? '#F1F1F5' : '#0A0A12' }}>
                RANT<span style={{ color: '#8B5CF6' }}>HUB</span>
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: s.isDark ? '#8888A0' : '#6B6B82', maxWidth: 220 }}>
              Bridging emotional expression with medical-grade biometric sensing.
            </p>
          </div>

          {/* Platform */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: s.isDark ? '#555568' : '#A0A0B0', marginBottom: 16 }}>
              PLATFORM
            </div>
            {['Feed', 'Pulse Map', 'My Dashboard', 'AI Empathy'].map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <Link to="/" style={{ fontSize: 13, color: s.isDark ? '#8888A0' : '#6B6B82', textDecoration: 'none' }}
                  className="hover:opacity-70 transition-opacity">
                  {l}
                </Link>
              </div>
            ))}
          </div>

          {/* Devices */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: s.isDark ? '#555568' : '#A0A0B0', marginBottom: 16 }}>
              DEVICES
            </div>
            {['Anxiety Node', 'Deep Pulse Wristband', 'Sleep Mat Sensor', 'Charging Hub'].map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <Link to="/devices" style={{ fontSize: 13, color: s.isDark ? '#8888A0' : '#6B6B82', textDecoration: 'none' }}
                  className="hover:opacity-70 transition-opacity">
                  {l}
                </Link>
              </div>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: s.isDark ? '#555568' : '#A0A0B0', marginBottom: 16 }}>
              LEGAL
            </div>
            {['Privacy Policy', 'Data Ethics', 'Terms of Use', 'Security'].map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: s.isDark ? '#8888A0' : '#6B6B82', cursor: 'pointer' }}
                  className="hover:opacity-70 transition-opacity">
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between pt-6"
          style={{ borderTop: `1px solid ${s.divider}` }}
        >
          <span style={{ fontSize: 12, color: s.isDark ? '#555568' : '#A0A0B0' }}>
            © 2026 RantHub Inc. Award-Winning Buildathon Entry.
          </span>
          <div className="flex items-center gap-2">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            <span style={{ fontSize: 12, color: s.isDark ? '#555568' : '#A0A0B0' }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
