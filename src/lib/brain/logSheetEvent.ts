import { supabaseServer } from "@/lib/supabaseServer";
import { captureError } from "@/lib/monitoring";

export type SheetEventType =
    | "preview_opened"
    | "spec_created"
    | "customization_completed"
    | "sheet_created"
    | "sheet_deleted"
    | "feedback_submitted";

type LogSheetEventArgs = {
    userId: string | null;
    sheetSpecId?: string | null;
    templateSlug?: string | null;
    eventType: SheetEventType;
    metadata?: Record<string, unknown>;
};

/**
 * Centralized helper to log sheet-related events to sheet_events_log table.
 * Used for AI Brain learning and analytics.
 */
export async function logSheetEvent(args: LogSheetEventArgs): Promise<void> {
    const { userId, sheetSpecId, templateSlug, eventType, metadata } = args;

    try {
        const { error } = await supabaseServer
            .from("sheet_events_log")
            .insert({
                user_id: userId,
                sheet_spec_id: sheetSpecId ?? null,
                template_slug: templateSlug ?? null,
                event_type: eventType,
                metadata: metadata ?? {},
            });

        if (error) {
            throw error;
        }
    } catch (error) {
        // Log error but don't throw - event logging should not break user flows
        captureError(error, {
            context: "logSheetEvent",
            userId,
            eventType,
            templateSlug,
        });
    }
}
