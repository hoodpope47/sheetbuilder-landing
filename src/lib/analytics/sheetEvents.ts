//-----------------------------------------------------
// Centralized logging for sheet-related events used by the AI "brain".
// This uses the server-side Supabase client and writes to
// public.sheet_events_log.
//
// NOTE:
// - user_id is optional and can be null for now.
// - This helper must only be used on the server (route handlers / RSC / server actions).

import { supabaseServer } from "@/lib/supabaseServer";

export type SheetEventType =
    | "spec_created"
    | "sheet_created"
    | "sheet_opened"
    | "customization_started"
    | "customization_completed"
    | "feedback_positive"
    | "feedback_negative";

export type LogSheetEventInput = {
    userId?: string | null;
    sheetSpecId?: string | null;
    templateSlug?: string | null;
    eventType: SheetEventType;
    metadata?: Record<string, any> | null;
};

export async function logSheetEvent(input: LogSheetEventInput): Promise<void> {
    const payload = {
        user_id: input.userId ?? null,
        sheet_spec_id: input.sheetSpecId ?? null,
        template_slug: input.templateSlug ?? null,
        event_type: input.eventType,
        metadata: input.metadata ?? null,
    };

    try {
        const { error } = await supabaseServer.from("sheet_events_log").insert(payload);

        if (error) {
            // Do not crash the app because of logging failures.
            console.error("[sheetEvents] Failed to log event", { error, payload });
        }
    } catch (err) {
        console.error("[sheetEvents] Unexpected error while logging event", {
            err,
            payload,
        });
    }
}
