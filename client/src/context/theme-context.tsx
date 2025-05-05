import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  success: string;
  warning: string;
  error: string;
  [key: string]: string;
}

interface ThemeContextType {
  themeName: string;
  themeColors: ThemeColors;
  isDarkMode: boolean;
  customCss: string | null;
  setTheme: (themeName: string) => void;
  setThemeColors: (colors: Partial<ThemeColors>) => void;
  toggleDarkMode: () => void;
  setCustomCss: (css: string | null) => void;
  resetTheme: () => void;
}

const defaultThemeColors: ThemeColors = {
  primary: '#0070f3',
  secondary: '#6c757d',
  accent: '#f59e0b',
  background: '#ffffff',
  text: '#000000',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const darkThemeColors: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  accent: '#f59e0b',
  background: '#171717',
  text: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const predefinedThemes: Record<string, ThemeColors> = {
  default: defaultThemeColors,
  dark: darkThemeColors,
  blue: {
    ...defaultThemeColors,
    primary: '#2563eb',
    accent: '#60a5fa',
  },
  green: {
    ...defaultThemeColors,
    primary: '#059669',
    accent: '#34d399',
  },
  purple: {
    ...defaultThemeColors,
    primary: '#7c3aed',
    accent: '#a78bfa',
  },
  red: {
    ...defaultThemeColors,
    primary: '#dc2626',
    accent: '#f87171',
  },
  nhs: {
    ...defaultThemeColors,
    primary: '#005EB8',
    secondary: '#41B6E6',
    accent: '#00A9CE',
    success: '#009639',
    error: '#DA291C'
  }
};

const ThemeContext = createContext<ThemeContextType>({
  themeName: 'default',
  themeColors: defaultThemeColors,
  isDarkMode: false,
  customCss: null,
  setTheme: () => {},
  setThemeColors: () => {},
  toggleDarkMode: () => {},
  setCustomCss: () => {},
  resetTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState('default');
  const [themeColors, setThemeColorsState] = useState<ThemeColors>(defaultThemeColors);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customCss, setCustomCssState] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch theme settings based on the tenant
  useEffect(() => {
    const fetchTenantTheme = async () => {
      try {
        // Only fetch tenant theme if user is authenticated
        if (user) {
          const res = await fetch('/api/tenants/current/theme', {
            credentials: 'include',
          });
          
          if (res.ok) {
            const theme = await res.json();
            
            if (theme.themeName) {
              setThemeName(theme.themeName);
            }
            
            if (theme.themeColors) {
              setThemeColorsState(theme.themeColors);
            }
            
            if (theme.themeDarkMode !== undefined) {
              setIsDarkMode(theme.themeDarkMode);
            }
            
            if (theme.themeCustomCss) {
              setCustomCssState(theme.themeCustomCss);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching tenant theme:', error);
      }
    };
    
    fetchTenantTheme();
  }, [user]);

  // Apply theme changes to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Apply dark mode
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Apply custom CSS if provided
    let customStyleElement = document.getElementById('tenant-custom-css');
    
    if (!customStyleElement && customCss) {
      customStyleElement = document.createElement('style');
      customStyleElement.id = 'tenant-custom-css';
      document.head.appendChild(customStyleElement);
    }
    
    if (customStyleElement) {
      customStyleElement.textContent = customCss || '';
    }
  }, [themeColors, isDarkMode, customCss]);

  const setTheme = (name: string) => {
    if (predefinedThemes[name]) {
      setThemeName(name);
      setThemeColorsState(predefinedThemes[name]);
    }
  };

  const setThemeColors = (colors: Partial<ThemeColors>) => {
    setThemeColorsState(prevColors => ({
      ...prevColors,
      ...colors,
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const setCustomCss = (css: string | null) => {
    setCustomCssState(css);
  };

  const resetTheme = () => {
    setThemeName('default');
    setThemeColorsState(defaultThemeColors);
    setIsDarkMode(false);
    setCustomCssState(null);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        themeColors,
        isDarkMode,
        customCss,
        setTheme,
        setThemeColors,
        toggleDarkMode,
        setCustomCss,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
