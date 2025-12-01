"use client";

import { useTheme } from "@/lib/theme";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, toggleTheme, loading } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || loading) {
        return (
            <div className="h-7 w-12 rounded-full bg-slate-800/80 animate-pulse" />
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={[
                "relative inline-flex h-7 w-12 items-center rounded-full border transition-colors",
                isDark
                    ? "border-emerald-400/60 bg-slate-900"
                    : "border-slate-300 bg-slate-100",
            ].join(" ")}
        >
            <span
                className={[
                    "inline-flex h-5 w-5 transform items-center justify-center rounded-full text-[10px] font-semibold shadow transition-transform",
                    isDark
                        ? "translate-x-[26px] bg-emerald-400 text-slate-950"
                        : "translate-x-[4px] bg-slate-700 text-slate-50",
                ].join(" ")}
            >
                {isDark ? "🌙" : "☀️"}
            </span>
        </button>
    );
}
