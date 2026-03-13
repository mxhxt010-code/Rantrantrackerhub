import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: true, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.background = '#09090E';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.background = '#FFFFFF';
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// Shared style helpers derived from theme
export function useStyles() {
  const { isDark } = useTheme();
  return {
    isDark,
    bg: isDark ? 'bg-[#09090E]' : 'bg-white',
    card: isDark ? 'bg-[#111118]' : 'bg-white',
    cardElevated: isDark ? 'bg-[#16161E]' : 'bg-[#F8F8FC]',
    border: isDark ? 'border-white/[0.07]' : 'border-black/[0.07]',
    textPrimary: isDark ? 'text-[#F1F1F5]' : 'text-[#0A0A12]',
    textSecondary: isDark ? 'text-[#8888A0]' : 'text-[#6B6B82]',
    textTertiary: isDark ? 'text-[#555568]' : 'text-[#A0A0B0]',
    accentViolet: '#8B5CF6',
    accentMint: '#10B981',
    accentAmber: '#F59E0B',
    divider: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    inputBg: isDark ? 'bg-[#0D0D14]' : 'bg-[#F3F3F8]',
    shadowColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.08)',
    glowViolet: isDark ? '0 0 40px rgba(139,92,246,0.15)' : '0 4px 24px rgba(109,40,217,0.1)',
  };
}
