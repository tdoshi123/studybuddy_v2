"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
    setMounted(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Save to localStorage
    localStorage.setItem("theme", theme);

    // Remove existing class first
    root.classList.remove("dark");

    // Apply theme
    if (theme === "dark") {
      root.classList.add("dark");
      setResolvedTheme("dark");
    } else if (theme === "light") {
      setResolvedTheme("light");
    } else {
      // System preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const applySystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) {
          root.classList.add("dark");
          setResolvedTheme("dark");
        } else {
          root.classList.remove("dark");
          setResolvedTheme("light");
        }
      };

      // Apply initial system theme
      applySystemTheme(mediaQuery);

      // Listen for system theme changes
      const listener = (e: MediaQueryListEvent) => applySystemTheme(e);
      mediaQuery.addEventListener("change", listener);

      return () => {
        mediaQuery.removeEventListener("change", listener);
      };
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
