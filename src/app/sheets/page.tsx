"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getOrCreateLocalUserId } from "@/lib/userClient";

type SheetRow = {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    created_at: string;
    last_opened_at: string | null;
};

export default function MySheetsPage() {
    const [sheets, setSheets] = useState<SheetRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const userId = getOrCreateLocalUserId();
                const { data, error } = await supabase
                    .from("sheets")
                    .select("*")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false });

                if (!cancelled && !error && data) {
                    setSheets(data as SheetRow[]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            My Sheets
                        </h1>
                        <p className="mt-1 text-sm text-slate-300">
                            Recent sheets generated with AI Sheet Builder.
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center rounded-full border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-emerald-400/70 hover:text-emerald-200"
                    >
                        ← Back to dashboard
                    </Link>
                </div>

                <div className="sb-surface rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
                    {loading ? (
                        <p className="text-sm text-slate-300">Loading sheets…</p>
                    ) : sheets.length === 0 ? (
                        <div className="text-sm text-slate-300">
                            <p>You don&apos;t have any saved sheets yet.</p>
                            <p className="mt-1">
                                Generate one from your{" "}
                                <Link
                                    href="/dashboard"
                                    className="text-emerald-400 hover:text-emerald-300"
                                >
                                    dashboard
                                </Link>{" "}
                                and it will appear here.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-800">
                            {sheets.map((sheet) => (
                                <li
                                    key={sheet.id}
                                    className="flex items-center justify-between gap-3 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-50">
                                            {sheet.name}
                                        </p>
                                        {sheet.description && (
                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {sheet.description}
                                            </p>
                                        )}
                                        <p className="mt-0.5 text-[11px] text-slate-500">
                                            Created{" "}
                                            {new Date(sheet.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button className="inline-flex items-center rounded-full border border-slate-600 px-3 py-1 text-[11px] font-medium text-slate-100 hover:border-emerald-400/70 hover:text-emerald-200">
                                        Open in Sheets (coming soon)
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}
