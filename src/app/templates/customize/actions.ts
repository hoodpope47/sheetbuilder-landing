"use server";

import { revalidatePath } from "next/cache";
import { getDashboardUser } from "@/lib/userClient";
import { createSheetSpec } from "@/lib/sheetSpecs";

export type CustomizeWizardPayload = {
    templateSlug: string;
    title: string;
    description: string;
    goal: string;
    category: string;
    audience: string;
    timeHorizon: { length: number; unit: string };
    timeGrain: string;
    expectedVolume: string | null;
    inputs: string[];
    kpis: string[];
    views: {
        summary_tab: boolean;
        detail_tab: boolean;
        time_trend_chart: boolean;
        breakdown_chart: boolean;
        checklist_view: boolean;
        notes: string | null;
    };
    style: {
        tone: string;
        brand_colors: string[];
        density: string;
        extras: string[];
    };
};

export async function saveCustomizeWizardSpec(
    payload: CustomizeWizardPayload
): Promise<{ ok: boolean; specId: string | null }> {
    const user = await getDashboardUser();
    const userId = user?.id ?? null;

    // Build a compact spec_json object from the payload
    const specJson = {
        templateSlug: payload.templateSlug,
        title: payload.title,
        description: payload.description,
        goal: payload.goal,
        category: payload.category,
        audience: payload.audience,
        timeHorizon: payload.timeHorizon,
        timeGrain: payload.timeGrain,
        expectedVolume: payload.expectedVolume,
        inputs: payload.inputs,
        kpis: payload.kpis,
        views: payload.views,
        style: payload.style,
    };

    const specId = await createSheetSpec({
        userId,
        templateSlug: payload.templateSlug,
        title: payload.title,
        description: payload.description,
        specJson,
        modelVersion: "v1-wizard-manual",
    });

    // Revalidate the customize page so "My setups" updates
    if (payload.templateSlug) {
        revalidatePath(`/templates/customize/${payload.templateSlug}`);
    }

    return { ok: true, specId };
}
