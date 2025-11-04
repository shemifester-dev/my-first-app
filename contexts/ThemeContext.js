import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  dark: {
    background: '#0f172a',
    cardBackground: '#1e293b',
    border: '#334155',
    text: '#ffffff',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b',
    profit: '#10b981',
    loss: '#ef4444',
    profitBg: '#10b98120',
    lossBg: '#ef444420',
    tabBarBackground: '#1e293b',
    tabBarBorder: '#334155',
    tabActive: '#3b82f6',
    tabInactive: '#64748b',
    headerBackground: '#1e293b',
  },
  light: {
    background: '#f8fafc',
    cardBackground: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#94a3b8',
    profit: '#059669',
    loss: '#dc2626',
    profitBg: '#d1fae5',
    lossBg: '#fee2e2',
    tabBarBackground: '#ffffff',
    tabBarBorder: '#e2e8f0',
    tabActive: '#2563eb',
    tabInactive: '#94a3b8',
    headerBackground: '#ffffff',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
