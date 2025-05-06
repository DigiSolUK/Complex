import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

// Default theme colors - using our new vibrant healthcare-inspired palette
const lightThemeColors: ThemeColors = {
  primary: '#00b8d4', // Teal/aqua - matches CSS var --primary
  secondary: '#00838f', // Darker teal
  accent: '#2979ff', // Bright blue - matches CSS var --accent
  background: '#f2f8fc', // Light blue-tinted background
  text: '#172554', // Dark navy
  success: '#00c853', // Vibrant green
  warning: '#ffd600', // Bright yellow
  error: '#ff3d00', // Bright red-orange
};

const darkThemeColors: ThemeColors = {
  primary: '#00e5ff', // Brighter teal for dark mode
  secondary: '#00b0ff', // Bright blue
  accent: '#448aff', // Lighter bright blue
  background: '#0a1929', // Deep navy background
  text: '#e6f5ff', // Light blue-white
  success: '#69f0ae', // Lighter green for dark mode
  warning: '#ffea00', // Vibrant yellow
  error: '#ff5252', // Bright red for dark mode
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

  // Define fetchTenantTheme with useCallback to prevent dependency loop
  const fetchTenantTheme = useCallback(async () => {
    try {
      // Only fetch theme if user is authenticated and has a tenantId
      if (user) {
        // If we have a tenantId, fetch that specific tenant's theme
        // Otherwise fetch the current user's tenant theme
        const endpoint = tenantId ? 
          `/api/tenants/${tenantId}/theme` : 
          '/api/tenants/current/theme';
        
        const response = await apiRequest('GET', endpoint);
        const data = await response.json();
        
        if (data.themeName) setThemeName(data.themeName);
        if (data.themeColors) setThemeColors(data.themeColors);
        if (data.themeDarkMode !== undefined) setIsDarkMode(data.themeDarkMode);
        setCustomCss(data.themeCustomCss || null);
      } else {
        // For unauthenticated users, use defaults
        setThemeName('default');
        setThemeColors(lightThemeColors);
        setIsDarkMode(false);
        setCustomCss(null);
      }
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
  }, [user, tenantId, setThemeName, setThemeColors, setIsDarkMode, setCustomCss, setIsInitialized]);

  // Fetch tenant theme when component mounts or auth state changes
  useEffect(() => {
    // Reinitialize theme when auth state changes
    if (!isInitialized || user) {
      fetchTenantTheme();
    }
  }, [isInitialized, fetchTenantTheme, user]);

  // Memoize applyThemeToDOM to prevent unnecessary rerenders
  const applyThemeToDOM = useCallback(() => {
    const root = document.documentElement;
    const colors = isDarkMode && themeName === 'default' ? darkThemeColors : themeColors;

    // Set dark mode class first (ensures CSS variables are correctly applied)
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Map our theme colors to the CSS variables in Tailwind/shadcn
    // This ensures theme colors override the default shadcn theme
    root.style.setProperty('--primary', colors.primary.replace('#', '')); 
    root.style.setProperty('--primary-foreground', '#ffffff');
    
    root.style.setProperty('--secondary', colors.secondary.replace('#', ''));
    root.style.setProperty('--secondary-foreground', '#ffffff');
    
    root.style.setProperty('--accent', colors.accent.replace('#', ''));
    root.style.setProperty('--accent-foreground', '#ffffff');
    
    root.style.setProperty('--background', colors.background.replace('#', ''));
    root.style.setProperty('--foreground', colors.text.replace('#', ''));
    
    // Add additional colors for completeness
    root.style.setProperty('--destructive', colors.error.replace('#', ''));
    root.style.setProperty('--destructive-foreground', '#ffffff');
    
    root.style.setProperty('--success', colors.success.replace('#', ''));
    root.style.setProperty('--success-foreground', '#ffffff');
    
    root.style.setProperty('--warning', colors.warning.replace('#', ''));
    root.style.setProperty('--warning-foreground', '#000000');
    
    // Also set our custom color properties for backward compatibility
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-success', colors.success);
    root.style.setProperty('--color-warning', colors.warning);
    root.style.setProperty('--color-error', colors.error);
    
    // Log theme application for debugging
    console.log('Applied theme:', themeName, 'darkMode:', isDarkMode);
    console.log('Theme colors:', colors);

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
  }, [themeColors, isDarkMode, customCss, themeName]);

  // Apply theme colors to CSS variables whenever they change
  useEffect(() => {
    applyThemeToDOM();
  }, [applyThemeToDOM]);

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
