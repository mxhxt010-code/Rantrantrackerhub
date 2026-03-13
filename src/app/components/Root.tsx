import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { useStyles } from './ThemeContext';

export function Root() {
  const s = useStyles();
  return (
    <div
      className={`min-h-screen ${s.bg} ${s.textPrimary}`}
      style={{ fontFamily: 'Inter, system-ui, sans-serif', transition: 'background 0.3s, color 0.3s' }}
    >
      <Header />
      <main className="pt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}