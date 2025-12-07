"use client";

import * as React from "react";

type SavedSpec = {
    id: string;
    title: string | null;
    description: string | null;
    created_at: string | null;
};

type SavedSpecsListProps = {
    specs: SavedSpec[];
};

function formatDate(input: string | null): string {
    if (!input) return "";
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(d);
}

export function SavedSpecsList({ specs }: SavedSpecsListProps) {
    const hasSpecs = specs && specs.length > 0;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-slate-700">Saved setups</p>
                {hasSpecs && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        {specs.length} total
                    </span>
                )}
            </div>

            {!hasSpecs ? (
                <div className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/80 px-3 py-3">
                    <p className="text-[11px] font-medium text-slate-700">
                        No setups yet
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        Click <span className="font-semibold">Generate sheet</span> at the
                        end of the wizard and we'll save your answers here as a reusable
                        setup.
                    </p>
                </div>
            ) : (
                <ul className="mt-3 space-y-2">
                    {specs.map((spec) => (
                        <li
                            key={spec.id}
                            className="group flex items-start justify-between gap-2 rounded-lg px-2 py-2 hover:bg-slate-50"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-slate-800">
                                    {spec.title || "Untitled setup"}
                                </p>
                                {spec.description && (
                                    <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">
                                        {spec.description}
                                    </p>
                                )}
                            </div>
                            {spec.created_at && (
                                <span className="shrink-0 text-[10px] text-slate-400 group-hover:text-slate-500">
                                    {formatDate(spec.created_at)}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <p className="mt-3 text-[10px] text-slate-400">
                These come from your <code>sheet_specs</code> table. In the future
                you'll be able to re-use a setup in one click when generating new
                sheets.
            </p>
        </div>
    );
}
