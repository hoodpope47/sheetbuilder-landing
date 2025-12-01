"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
    label: string;
    href: string;
    icon?: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
    { label: "Overview", href: "/dashboard" },
    { label: "My Sheets", href: "/dashboard?view=sheets" },
    { label: "Templates", href: "/templates" },
    { label: "Usage & Limits", href: "/settings?tab=billing" }, // Shortcut to billing
    { label: "Billing", href: "/settings?tab=billing" },
    { label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950/95 px-4 py-6 sm:flex sb-surface">
            {/* Brand */}
            <div className="mb-8 flex items-center gap-3 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-400/20">
                    A
                </div>
                <span className="text-sm font-semibold tracking-tight text-slate-100">
                    AI Sheet Builder
                </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                    // Simple active check: exact match or starts with for sub-routes
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard" && !item.href.includes("?view=sheets") // Basic check, refined in parent if needed
                            : pathname.startsWith(item.href.split("?")[0]);

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={[
                                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
                            ].join(" ")}
                        >
                            {/* Placeholder icon if we had them */}
                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Support / Help */}
            <div className="mt-auto px-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                    <p className="text-xs font-semibold text-slate-200">Need help?</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                        Check our docs or contact support.
                    </p>
                    <a
                        href="mailto:support@sheetbuilder.ai"
                        className="mt-3 block text-[11px] font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                        Contact Support &rarr;
                    </a>
                </div>
            </div>
        </aside>
    );
}
