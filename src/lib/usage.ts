"use client";

import { getBrowserSupabaseClient } from "./supabaseClient";

export type PlanTier = "free" | "starter" | "pro" | "enterprise";

export interface ProfileInfo {
    id: string;
    email: string | null;
    fullName: string | null;
    plan: PlanTier;
}

export interface UsageSummary {
    sheetsThisMonth: number;
    lastSheetAt: string | null;
}

const DEMO_USER_ID_KEY = "sheetbuilder_demo_user_id";

function ensureDemoUserId(): string {
    if (typeof window === "undefined") return "demo-user-static";
    let existing = window.localStorage.getItem(DEMO_USER_ID_KEY);
    if (!existing) {
        existing = "demo-user-" + Math.random().toString(36).slice(2, 10);
        window.localStorage.setItem(DEMO_USER_ID_KEY, existing);
    }
    return existing;
}

export async function fetchProfileAndUsage(): Promise<{
    profile: ProfileInfo;
    usage: UsageSummary;
}> {
    const demoUserId = ensureDemoUserId();
    const client = getBrowserSupabaseClient();

    // Fallback mock if Supabase is not configured
    if (!client) {
        return {
            profile: {
                id: demoUserId,
                email: "demo@sheetbuilder.ai",
                fullName: "Demo User",
                plan: "free",
            },
            usage: {
                sheetsThisMonth: 3,
                lastSheetAt: null,
            },
        };
    }

    try {
        const { data: profileRow, error: profileError } = await client
            .from("profiles")
            .select("*")
            .eq("id", demoUserId)
            .maybeSingle();

        if (profileError) {
            console.warn("[Supabase] profile fetch error", profileError);
        }

        const profile: ProfileInfo = {
            id: demoUserId,
            email: profileRow?.email ?? "demo@sheetbuilder.ai",
            fullName: profileRow?.full_name ?? "Demo User",
            plan: (profileRow?.plan as PlanTier) || "free",
        };

        const { data: usageRows, error: usageError } = await client
            .from("sheet_events")
            .select("created_at")
            .eq("user_id", demoUserId)
            .gte(
                "created_at",
                new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
            )
            .order("created_at", { ascending: false });

        if (usageError) {
            console.warn("[Supabase] usage fetch error", usageError);
        }

        const sheetsThisMonth = usageRows?.length ?? 0;
        const lastSheetAt =
            usageRows && usageRows.length > 0 ? usageRows[0].created_at : null;

        return {
            profile,
            usage: {
                sheetsThisMonth,
                lastSheetAt,
            },
        };
    } catch (err) {
        console.error("[Supabase] fetchProfileAndUsage failed", err);
        return {
            profile: {
                id: demoUserId,
                email: "demo@sheetbuilder.ai",
                fullName: "Demo User",
                plan: "free",
            },
            usage: {
                sheetsThisMonth: 0,
                lastSheetAt: null,
            },
        };
    }
}

export async function logSheetCreated(sheetType: string): Promise<void> {
    const client = getBrowserSupabaseClient();
    const demoUserId = ensureDemoUserId();

    if (!client) {
        console.warn("[Supabase] Skipping logSheetCreated because client is null.");
        return;
    }

    try {
        const { error } = await client.from("sheet_events").insert({
            user_id: demoUserId,
            event_type: "created",
            sheet_type: sheetType,
            metadata: {},
        });

        if (error) {
            console.warn("[Supabase] logSheetCreated insert error", error);
        }
    } catch (err) {
        console.error("[Supabase] logSheetCreated failed", err);
    }
}
