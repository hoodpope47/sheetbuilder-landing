"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

type NavItem = {
    label: string;
    href: string;
};

const NAV_ITEMS: NavItem[] = [
    { label: "Overview", href: "/dashboard" },
    { label: "My Sheets", href: "/dashboard/sheets" },
    { label: "Templates", href: "/dashboard/templates" },
    { label: "Usage & Limits", href: "/dashboard/usage" },
    { label: "Billing", href: "/dashboard/billing" },
    { label: "Settings", href: "/dashboard/settings" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    function isActive(href: string) {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex md:flex-col w-60 border-r border-slate-200 bg-white">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-semibold">
                        A
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">AI Sheet Builder</span>
                        <span className="text-[11px] text-slate-500">
                            Automate your job in Google Sheets
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={[
                                "flex w-full items-center rounded-xl px-3 py-2 transition-colors",
                                isActive(item.href)
                                    ? "bg-emerald-50 text-emerald-700 font-medium"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                            ].join(" ")}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="px-4 pb-5 pt-3 border-t border-slate-200">
                    <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-3">
                        <p className="text-xs font-semibold text-slate-800">
                            Need help?
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                            Check docs or message support if something feels off.
                        </p>
                        <Link
                            href="mailto:support@sheetbuilder.ai"
                            className="mt-3 inline-flex rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-400"
                        >
                            Contact support
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-2">
                        <button
                            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            onClick={() => router.push("/dashboard")}
                        >
                            ☰
                        </button>
                        <p className="text-xs font-semibold tracking-[0.14em] uppercase text-emerald-500">
                            Workspace
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="search"
                            placeholder="Search sheets..."
                            className="hidden sm:block h-9 w-52 rounded-full border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none"
                        />
                        {/* Simple “theme” pill: purely visual right now */}
                        <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
                            <span className="h-3 w-3 rounded-full bg-slate-900" />
                            <span>Light mode</span>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-semibold">
                            U
                        </div>
                    </div>
                </header>

                <main className="flex-1 min-h-0 bg-slate-50">
                    <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
