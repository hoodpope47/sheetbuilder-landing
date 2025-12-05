"use server";

import { supabaseServer } from "@/lib/supabaseServer";
import { logSheetEvent } from "@/lib/analytics/sheetEvents";

export type CustomizeTemplateInput = {
    templateSlug: string;
    templateTitle: string;
    templateCategory?: string | null;
    tracking?: string;
    timeHorizon?: string;
    views?: string;
    palette?: string;
    extraNotes?: string;
    // Canonical prompt we show in the UI
    promptPreview: string;
};

export type CustomizeTemplateResult =
    | { ok: true; sheetSpecId: string | null }
    | { ok: false; error: string };

export async function customizeTemplateAction(
    input: CustomizeTemplateInput
): Promise<CustomizeTemplateResult> {
    try {
        const supabase = supabaseServer;

        // Try to get the current user; if it fails, proceed with null.
        let userId: string | null = null;
        try {
            const { data } = await supabase.auth.getUser();
            if (data?.user?.id) {
                userId = data.user.id;
            }
        } catch {
            // ignore; keep userId = null
        }

        // Insert into sheet_specs as a structured spec.
        const specJson = {
            templateSlug: input.templateSlug,
            templateTitle: input.templateTitle,
            templateCategory: input.templateCategory ?? null,
            tracking: input.tracking ?? null,
            timeHorizon: input.timeHorizon ?? null,
            views: input.views ?? null,
            palette: input.palette ?? null,
            extraNotes: input.extraNotes ?? null,
            promptPreview: input.promptPreview,
        };

        const { data, error } = await supabase
            .from("sheet_specs")
            .insert({
                user_id: userId,
                template_slug: input.templateSlug,
                title: input.templateTitle,
                description:
                    input.tracking ||
                    `Customization for template "${input.templateTitle}"`,
                spec_json: specJson,
                model_version: null,
            })
            .select("id")
            .single();

        const sheetSpecId = data?.id ?? null;

        // Log customization_completed
        await logSheetEvent({
            userId,
            templateSlug: input.templateSlug,
            sheetSpecId,
            eventType: "customization_completed",
            metadata: {
                hasTracking: !!input.tracking,
                hasTimeHorizon: !!input.timeHorizon,
                hasViews: !!input.views,
                hasPalette: !!input.palette,
            },
        });

        return { ok: true, sheetSpecId };
    } catch (err: any) {
        console.error("[customizeTemplateAction] error", err);
        return {
            ok: false,
            error: "Something went wrong while saving your customization.",
        };
    }
}
