import type { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";

type SettingsLayoutProps = {
    children: ReactNode;
};

const NAV_ITEMS = [
    { href: "/settings/profile", label: "Profile" },
    { href: "/settings/billing", label: "Billing" },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-slate-950">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-100">
                                AI Sheet Builder
                            </span>
                            <span className="text-[10px] text-slate-400">
                                Account & workspace settings
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                        <Link
                            href="/dashboard"
                            className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-emerald-400/70 hover:text-emerald-200 transition"
                        >
                            Back to dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-8">
                <aside className="hidden w-52 flex-shrink-0 flex-col gap-2 text-xs sm:flex">
                    <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Settings
                    </h2>
                    {NAV_ITEMS.map((item) => (
                        <SettingsNavLink key={item.href} href={item.href}>
                            {item.label}
                        </SettingsNavLink>
                    ))}
                </aside>

                <section className="flex-1">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm backdrop-blur">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}

type SettingsNavLinkProps = {
    href: string;
    children: ReactNode;
};

function SettingsNavLink({ href, children }: SettingsNavLinkProps) {
    const isActive =
        typeof window !== "undefined" ? window.location.pathname === href : false;

    return (
        <Link
            href={href}
            className={clsx(
                "flex items-center justify-between rounded-xl border px-3 py-2 transition",
                "border-slate-800 text-slate-300 hover:border-emerald-400/60 hover:text-emerald-200 hover:bg-slate-900/80",
                isActive && "border-emerald-400/80 bg-slate-900 text-emerald-200"
            )}
        >
            <span>{children}</span>
        </Link>
    );
}
