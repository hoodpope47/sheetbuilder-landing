// Helpers for working with sheet_specs and feeding the AI "brain".

import { supabaseServer } from "@/lib/supabaseServer";
import {
    logSheetEvent,
    type SheetEventType,
} from "@/lib/brain/logSheetEvent";

export type SheetSpecInput = {
    userId: string | null;
    templateSlug: string;
    title: string;
    description: string;
    specJson: any;
    modelVersion?: string;
};

export async function createSheetSpec(input: SheetSpecInput): Promise<string | null> {
    const { userId, templateSlug, title, description, specJson } = input;

    const { data, error } = await supabaseServer
        .from("sheet_specs")
        .insert({
            user_id: userId,
            template_slug: templateSlug,
            title,
            description,
            spec_json: specJson,
            model_version: input.modelVersion ?? "v1-wizard-manual",
        })
        .select("id")
        .single();

    if (error) {
        console.error("[sheetSpecs] Failed to insert sheet_spec", { error, input });
        throw error;
    }

    const specId = (data as any)?.id ?? null;

    // Fire and forget: log spec_created and customization_completed
    await safeLogSheetEvent({
        userId,
        sheetSpecId: specId,
        templateSlug,
        eventType: "spec_created",
    });

    await safeLogSheetEvent({
        userId,
        sheetSpecId: specId,
        templateSlug,
        eventType: "customization_completed",
    });

    return specId;
}

type LogParams = {
    userId: string | null;
    sheetSpecId: string | null;
    templateSlug: string;
    eventType: SheetEventType;
};

async function safeLogSheetEvent(params: LogParams) {
    try {
        await logSheetEvent({
            userId: params.userId,
            sheetSpecId: params.sheetSpecId,
            templateSlug: params.templateSlug,
            eventType: params.eventType,
            metadata: undefined,
        });
    } catch (err) {
        console.error("[sheetSpecs] Failed to log sheet event", {
            err,
            params,
        });
    }
}
