"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserSettings, updateThemePreference } from "./userClient";

type Theme = "dark" | "light";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    loading: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function init() {
            try {
                const stored =
                    typeof window !== "undefined"
                        ? (window.localStorage.getItem("sheetbuilder_theme") as Theme | null)
                        : null;

                if (stored) {
                    if (!cancelled) {
                        setThemeState(stored);
                        applyThemeClass(stored);
                    }
                } else {
                    const settings = await fetchUserSettings();
                    const fallback: Theme = settings?.theme || "dark";
                    if (!cancelled) {
                        setThemeState(fallback);
                        applyThemeClass(fallback);
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        init();
        return () => {
            cancelled = true;
        };
    }, []);

    const setTheme = (next: Theme) => {
        setThemeState(next);
        applyThemeClass(next);
        if (typeof window !== "undefined") {
            window.localStorage.setItem("sheetbuilder_theme", next);
        }
        updateThemePreference(next).catch((err) =>
            console.error("[ThemeProvider] Failed to persist theme", err)
        );
    };

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, loading }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
}

function applyThemeClass(theme: Theme) {
    if (typeof document === "undefined") return;
    const body = document.body;
    body.classList.remove("theme-dark", "theme-light");
    body.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
}
