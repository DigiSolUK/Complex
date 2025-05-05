import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import { apiRequest } from '@/lib/queryClient';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  success: string;
  warning: string;
  error: string;
  // Add other color variables as needed
}

interface ThemeContextType {
  themeName: string;
  themeColors: ThemeColors;
  isDarkMode: boolean;
  customCss: string | null;
  setTheme: (themeName: string) => void;
  setThemeColors: (colors: ThemeColors) => void;
  toggleDarkMode: () => void;
  setCustomCss: (css: string | null) => void;
  resetTheme: () => void;
}

// Default theme colors
const lightThemeColors: ThemeColors = {
  primary: '#2563eb', // Blue
  secondary: '#6366F1', // Indigo
  accent: '#3B82F6', // Lighter blue
  background: '#ffffff',
  text: '#121212',
  success: '#16a34a', // Green
  warning: '#facc15', // Yellow
  error: '#e11d48', // Red
};

const darkThemeColors: ThemeColors = {
  primary: '#3482F6', // Lighter blue
  secondary: '#818CF8', // Lighter indigo
  accent: '#60a5fa', // Even lighter blue
  background: '#121212',
  text: '#f9fafb',
  success: '#22c55e', // Lighter green
  warning: '#fbbf24', // Lighter yellow
  error: '#f43f5e', // Lighter red
};

// Theme variations
const themeVariations: Record<string, ThemeColors> = {
  default: lightThemeColors,
  dark: darkThemeColors,
  blue: {
    ...lightThemeColors,
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#93c5fd',
  },
  green: {
    ...lightThemeColors,
    primary: '#166534',
    secondary: '#22c55e',
    accent: '#86efac',
  },
  purple: {
    ...lightThemeColors,
    primary: '#7e22ce',
    secondary: '#a855f7',
    accent: '#d8b4fe',
  },
  red: {
    ...lightThemeColors,
    primary: '#b91c1c',
    secondary: '#ef4444',
    accent: '#fca5a5',
  },
  // NHS theme aligned with NHS identity guidelines
  nhs: {
    ...lightThemeColors,
    primary: '#005eb8', // NHS Blue
    secondary: '#41b6e6', // NHS Light Blue
    accent: '#0072CE', // NHS Mid Blue
    background: '#f0f4f5', // NHS Pale Grey
    success: '#007f3b', // NHS Green
    warning: '#ffb81c', // NHS Yellow
    error: '#da291c', // NHS Red
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, tenantId } = useAuth();
  const [themeName, setThemeName] = useState<string>('default');
  const [themeColors, setThemeColors] = useState<ThemeColors>(lightThemeColors);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [customCss, setCustomCss] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch tenant theme on mount if user is authenticated
  useEffect(() => {
    if (user && tenantId && !isInitialized) {
      fetchTenantTheme();
    }
  }, [user, tenantId]);

  // Apply theme colors to CSS variables whenever they change
  useEffect(() => {
    applyThemeToDOM();
  }, [themeColors, isDarkMode, customCss]);

  const fetchTenantTheme = async () => {
    try {
      const response = await apiRequest('GET', `/api/tenants/${tenantId}/theme`);
      const data = await response.json();
      
      if (data.themeName) setThemeName(data.themeName);
      if (data.themeColors) setThemeColors(data.themeColors);
      if (data.themeDarkMode !== undefined) setIsDarkMode(data.themeDarkMode);
      setCustomCss(data.themeCustomCss || null);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to fetch tenant theme:', error);
      // Fall back to defaults
      setThemeName('default');
      setThemeColors(lightThemeColors);
      setIsDarkMode(false);
      setCustomCss(null);
      setIsInitialized(true);
    }
  };

  const applyThemeToDOM = () => {
    const root = document.documentElement;
    const colors = isDarkMode && themeName === 'default' ? darkThemeColors : themeColors;

    // Set color theme variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Set dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply custom CSS if any
    let styleTag = document.getElementById('custom-theme-css');
    if (!styleTag && customCss) {
      styleTag = document.createElement('style');
      styleTag.id = 'custom-theme-css';
      document.head.appendChild(styleTag);
    }

    if (styleTag) {
      styleTag.textContent = customCss || '';
    }
  };

  const setTheme = (name: string) => {
    setThemeName(name);
    setThemeColors(themeVariations[name] || lightThemeColors);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const resetTheme = () => {
    setThemeName('default');
    setThemeColors(lightThemeColors);
    setIsDarkMode(false);
    setCustomCss(null);
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
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
