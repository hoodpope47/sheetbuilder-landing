import type { SupabaseClient } from "@supabase/supabase-js";

export type UsageMetrics = {
    sheetsThisMonth: number;
    totalSheets: number;
    planLimit: number;
    usagePercent: number;
    monthlyUsageSeries: Array<{ monthLabel: string; count: number }>;
    usingDemoData: boolean;
};

const DEMO_DATA = [
    { monthLabel: "Jan", count: 5 },
    { monthLabel: "Feb", count: 7 },
    { monthLabel: "Mar", count: 10 },
    { monthLabel: "Apr", count: 13 },
    { monthLabel: "May", count: 16 },
    { monthLabel: "Jun", count: 20 },
];

function getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function getMonthsAgo(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() - months);
    return result;
}

function formatMonthLabel(date: Date): string {
    return date.toLocaleString("en-US", { month: "short" });
}

export async function getUsageMetrics(
    supabase: SupabaseClient,
    userId: string
): Promise<UsageMetrics> {
    const now = new Date();
    const startOfMonth = getStartOfMonth(now);
    const twelveMonthsAgo = getMonthsAgo(now, 11);

    // Query events for this month
    const { data: monthEvents, error: monthError } = await supabase
        .from("sheet_events_log")
        .select("id, event_type, created_at, sheet_spec_id")
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString())
        .lte("created_at", now.toISOString());

    if (monthError) {
        console.error("[usage] Failed to fetch month events:", monthError);
        throw monthError;
    }

    // Query events for last 12 months
    const { data: yearEvents, error: yearError } = await supabase
        .from("sheet_events_log")
        .select("id, event_type, created_at")
        .eq("user_id", userId)
        .gte("created_at", twelveMonthsAgo.toISOString())
        .lte("created_at", now.toISOString());

    if (yearError) {
        console.error("[usage] Failed to fetch year events:", yearError);
        throw yearError;
    }

    // Count total sheets
    const { count: totalSheetsCount, error: countError } = await supabase
        .from("sheet_specs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

    if (countError) {
        console.error("[usage] Failed to count sheets:", countError);
        throw countError;
    }

    // Calculate metrics
    const sheetsThisMonth = (monthEvents || []).filter(
        (e) => e.event_type === "sheet_created"
    ).length;

    const totalSheets = totalSheetsCount || 0;

    // Plan limit - default to 5 for free tier
    // TODO: Wire to actual plan metadata when available
    const planLimit = 5;

    const usagePercent =
        planLimit > 0 ? Math.min(100, (sheetsThisMonth / planLimit) * 100) : 0;

    // Build monthly series
    const eventsByMonth = new Map<string, number>();

    (yearEvents || []).forEach((event) => {
        if (event.event_type === "sheet_created") {
            const eventDate = new Date(event.created_at);
            const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, "0")}`;
            eventsByMonth.set(monthKey, (eventsByMonth.get(monthKey) || 0) + 1);
        }
    });

    // Generate series for last 12 months
    const monthlyUsageSeries: Array<{ monthLabel: string; count: number }> = [];
    let hasAnyData = false;

    for (let i = 11; i >= 0; i--) {
        const monthDate = getMonthsAgo(now, i);
        const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;
        const count = eventsByMonth.get(monthKey) || 0;

        if (count > 0) hasAnyData = true;

        monthlyUsageSeries.push({
            monthLabel: formatMonthLabel(monthDate),
            count,
        });
    }

    // If no data at all, use demo data
    const usingDemoData = !hasAnyData;

    return {
        sheetsThisMonth,
        totalSheets,
        planLimit,
        usagePercent,
        monthlyUsageSeries: usingDemoData ? DEMO_DATA : monthlyUsageSeries,
        usingDemoData,
    };
}
