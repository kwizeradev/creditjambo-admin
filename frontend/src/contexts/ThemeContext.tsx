import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext } from './ThemeContextDefinition';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';
const DEFAULT_THEME: Theme = 'light';
const THEME_CLASS_LIGHT = 'light';
const THEME_CLASS_DARK = 'dark';

const isValidTheme = (value: string | null): value is Theme => {
  return value === THEME_CLASS_LIGHT || value === THEME_CLASS_DARK;
};

const getStoredTheme = (): Theme | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return isValidTheme(storedTheme) ? storedTheme : null;
};

const getInitialTheme = (): Theme => {
  return getStoredTheme() || DEFAULT_THEME;
};

const applyThemeToDocument = (theme: Theme): void => {
  const root = window.document.documentElement;
  root.classList.remove(THEME_CLASS_LIGHT, THEME_CLASS_DARK);
  root.classList.add(theme);
};

const persistTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

const getOppositeTheme = (currentTheme: Theme): Theme => {
  return currentTheme === THEME_CLASS_LIGHT ? THEME_CLASS_DARK : THEME_CLASS_LIGHT;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    applyThemeToDocument(initialTheme);
    setThemeState(initialTheme);
  }, []);

  useEffect(() => {
    applyThemeToDocument(theme);
    persistTheme(theme);
  }, [theme]);

  const toggleTheme = (): void => {
    setThemeState(getOppositeTheme);
  };

  const setTheme = (newTheme: Theme): void => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
