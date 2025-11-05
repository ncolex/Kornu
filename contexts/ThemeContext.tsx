import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light'); // Default for SSR
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Guard for server-side

    // Check for saved theme in localStorage, fallback to system preference
    const savedTheme = window.localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !initialized) return; // Guard for server-side and before initialized

    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme, initialized]);

  const toggleTheme = () => {
    if (typeof window !== 'undefined') { // Guard for server-side
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }
  };

  if (!initialized && typeof window !== 'undefined') {
    return <div>Loading...</div>; // Or your preferred loading component
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
