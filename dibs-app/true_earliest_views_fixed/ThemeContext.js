import React, { createContext, useState, useContext } from 'react';

// The global color palettes for Day and Night modes
export const themes = {
  dark: {
    background: '#09090B',
    card: '#18181B',
    border: '#27272A',
    text: '#FFFFFF',
    subText: '#A1A1AA',
    primary: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    overlay: 'rgba(0,0,0,0.85)',
    mapTiles: 'dark_all' // CartoDB dark theme
  },
  light: {
    background: '#F3F4F6', // Clean light gray
    card: '#FFFFFF',       // Crisp white cards
    border: '#E5E7EB',
    text: '#111827',       // Near-black text for readability
    subText: '#6B7280',
    primary: '#10B981',    // Keep the eco-green brand color
    danger: '#EF4444',
    warning: '#D97706',
    overlay: 'rgba(255,255,255,0.9)',
    mapTiles: 'rastertiles/voyager' // CartoDB light/day theme
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);