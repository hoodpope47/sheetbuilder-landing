"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

type TopbarProps = {
    title?: string;
    subtitle?: string;
};

export function Topbar({ title = "Dashboard", subtitle }: TopbarProps) {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur sb-surface">
            {/* Left: Title & Subtitle */}
            <div className="flex flex-col justify-center">
                <h1 className="text-sm font-semibold text-slate-100">{title}</h1>
                {subtitle && (
                    <p className="text-[11px] text-slate-400 hidden sm:block">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Search (Visual only) */}
                <div className="hidden md:block relative">
                    <input
                        type="text"
                        placeholder="Search sheets..."
                        className="h-8 w-64 rounded-full border border-slate-800 bg-slate-900/50 px-4 text-xs text-slate-300 placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    />
                </div>

                {/* New Sheet Button */}
                <button className="hidden sm:inline-flex items-center rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition shadow-lg shadow-emerald-400/10">
                    + New Sheet
                </button>

                <div className="h-4 w-px bg-slate-800 mx-1" />

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* User Avatar (Link to Profile) */}
                <Link
                    href="/profile"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition"
                >
                    U
                </Link>
            </div>
        </header>
    );
}
