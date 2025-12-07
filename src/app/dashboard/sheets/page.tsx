"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getOrCreateLocalUserId } from "@/lib/userClient";
import { MySheetsTable, type SheetData } from "@/components/dashboard/sheets/MySheetsTable";

function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    } catch {
        return dateString;
    }
}

export default function MySheetsPage() {
    const [sheets, setSheets] = useState<SheetData[]>([]);
    const [loadError, setLoadError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadSheets() {
            try {
                setIsLoading(true);
                setLoadError(false);

                // Get current user from Supabase session
                const { data: { user } } = await supabase.auth.getUser();
                const userId = user?.id || getOrCreateLocalUserId();

                // Simple query to sheet_specs - no joins
                const { data: specs, error } = await supabase
                    .from("sheet_specs")
                    .select("*")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false });

                if (error) {
                    console.error("[MySheetsPage] Supabase error:", error);
                    throw error;
                }

                // Build sheet rows with safe fallbacks
                const processedSheets: SheetData[] = (specs || []).map((spec: any) => {
                    const title = spec.title || spec.text || "Untitled Sheet";
                    const templateSlug = spec.template_slug || spec.slug || "custom-sheet";
                    const category = spec.category || "General";
                    const createdAt = spec.updated_at || spec.created_at || new Date().toISOString();

                    return {
                        id: spec.id,
                        name: title,
                        category,
                        status: "Draft" as const, // Will wire events later
                        lastUpdated: formatDate(createdAt),
                        templateSlug,
                    };
                });

                setSheets(processedSheets);
            } catch (error) {
                console.error("[MySheetsPage] Error loading sheets:", error);
                setLoadError(true);
                setSheets([]);
            } finally {
                setIsLoading(false);
            }
        }

        loadSheets();
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">My Sheets</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Manage your generated sheets and templates.
                    </p>
                </div>
                <Link
                    href="/dashboard/templates"
                    className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400"
                >
                    + New sheet
                </Link>
            </div>

            {isLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6">
                    <p className="text-sm text-slate-500 text-center">Loading your sheets...</p>
                </div>
            ) : (
                <MySheetsTable sheets={sheets} loadError={loadError} />
            )}
        </div>
    );
}
