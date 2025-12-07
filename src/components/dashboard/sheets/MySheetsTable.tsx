"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";

// Export the type so page.tsx can import it
export type SheetData = {
    id: string;
    name: string;
    category: string;
    status: "Draft" | "Active";
    lastUpdated: string;
    templateSlug: string;
};

type MySheetsTableProps = {
    sheets: SheetData[];
    loadError: boolean;
};

export function MySheetsTable({ sheets, loadError }: MySheetsTableProps) {
    const { showToast } = useToast();

    useEffect(() => {
        if (loadError) {
            showToast({
                variant: "error",
                title: "Loading failed",
                message: "We couldn't load your sheets. Please try again.",
            });
        }
    }, [loadError, showToast]);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-xs font-semibold text-slate-600">All sheets</p>
            </div>

            {loadError ? (
                <div className="px-4 py-6 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        We couldn&apos;t load your sheets right now
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Please refresh the page or try again later.
                    </p>
                </div>
            ) : sheets.length === 0 ? (
                <div className="px-4 py-6 text-xs text-slate-500">
                    No sheets yet. Start from a template to create your first setup.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-[11px] text-slate-500">
                                <th className="px-4 py-2 text-left font-medium">Name</th>
                                <th className="px-4 py-2 text-left font-medium">Category</th>
                                <th className="px-4 py-2 text-left font-medium">Status</th>
                                <th className="px-4 py-2 text-left font-medium">
                                    Last updated
                                </th>
                                <th className="px-4 py-2 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sheets.map((sheet) => (
                                <tr
                                    key={sheet.id}
                                    className="border-b border-slate-100 last:border-0"
                                >
                                    <td className="px-4 py-2 text-slate-800">{sheet.name}</td>
                                    <td className="px-4 py-2 text-slate-600">
                                        {sheet.category}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                                            {sheet.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-slate-600">
                                        {sheet.lastUpdated}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <Link
                                            href={`/templates/customize/${sheet.templateSlug}?specId=${sheet.id}`}
                                            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-500"
                                        >
                                            Open
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
