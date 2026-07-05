import React, { createContext, useState, useCallback, useEffect, useMemo } from "react";
import storage from "../utils/storage";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#7C3AED");
  const [secondaryColor, setSecondaryColor] = useState("#10B981");
  const [fontFamily, setFontFamily] = useState("inter");

  // Initialize theme from storage or system preference
  useEffect(() => {
    try {
      const storedTheme = storage.get("settings");

      if (storedTheme?.theme) {
        setIsDark(storedTheme.theme.isDark ?? false);
        setPrimaryColor(storedTheme.theme.primaryColor ?? "#7C3AED");
        setSecondaryColor(storedTheme.theme.secondaryColor ?? "#10B981");
        setFontFamily(storedTheme.theme.fontFamily ?? "inter");
      } else {
        // Check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(prefersDark);
      }

      // Apply theme to document
      applyTheme(isDark);
    } catch (err) {
      console.error("Failed to initialize theme:", err);
    }
  }, []);

  // Apply theme to HTML element
  const applyTheme = useCallback((dark) => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    applyTheme(newDarkMode);

    // Save to storage
    const settings = storage.get("settings") || {};
    storage.set("settings", {
      ...settings,
      theme: {
        isDark: newDarkMode,
        primaryColor,
        secondaryColor,
        fontFamily
      }
    });
  }, [isDark, primaryColor, secondaryColor, fontFamily, applyTheme]);

  // Update primary color
  const updatePrimaryColor = useCallback((color) => {
    setPrimaryColor(color);

    // Apply to CSS variable
    document.documentElement.style.setProperty("--primary", color);

    // Save to storage
    const settings = storage.get("settings") || {};
    storage.set("settings", {
      ...settings,
      theme: {
        isDark,
        primaryColor: color,
        secondaryColor,
        fontFamily
      }
    });
  }, [isDark, secondaryColor, fontFamily]);

  // Update secondary color
  const updateSecondaryColor = useCallback((color) => {
    setSecondaryColor(color);

    // Apply to CSS variable
    document.documentElement.style.setProperty("--secondary", color);

    // Save to storage
    const settings = storage.get("settings") || {};
    storage.set("settings", {
      ...settings,
      theme: {
        isDark,
        primaryColor,
        secondaryColor: color,
        fontFamily
      }
    });
  }, [isDark, primaryColor, fontFamily]);

  // Update font family
  const updateFontFamily = useCallback((font) => {
    setFontFamily(font);

    // Apply to document
    const fontClass = `font-${font}`;
    document.documentElement.className = fontClass;

    // Save to storage
    const settings = storage.get("settings") || {};
    storage.set("settings", {
      ...settings,
      theme: {
        isDark,
        primaryColor,
        secondaryColor,
        fontFamily: font
      }
    });
  }, [isDark, primaryColor, secondaryColor]);

  // Reset to default theme
  const resetToDefault = useCallback(() => {
    const defaultTheme = {
      isDark: false,
      primaryColor: "#7C3AED",
      secondaryColor: "#10B981",
      fontFamily: "inter"
    };

    setIsDark(false);
    setPrimaryColor("#7C3AED");
    setSecondaryColor("#10B981");
    setFontFamily("inter");
    applyTheme(false);

    const settings = storage.get("settings") || {};
    storage.set("settings", {
      ...settings,
      theme: defaultTheme
    });
  }, [applyTheme]);

  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Memoized context value.
   * Prevents redundant re-renders of all ThemeContext consumers
   * when ThemeProvider re-renders for unrelated reasons.
   */
  const value = useMemo(() => ({
    isDark,
    primaryColor,
    secondaryColor,
    fontFamily,
    toggleDarkMode,
    updatePrimaryColor,
    updateSecondaryColor,
    updateFontFamily,
    resetToDefault
  }), [
    isDark,
    primaryColor,
    secondaryColor,
    fontFamily,
    toggleDarkMode,
    updatePrimaryColor,
    updateSecondaryColor,
    updateFontFamily,
    resetToDefault
  ]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
