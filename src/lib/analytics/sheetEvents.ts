// Centralized logging for sheet-related events used by the AI "brain".
// For now, this is a SAFE NO-OP that only console.logs so we don't
// break the app while the database schema is still evolving.

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

export async function logSheetEvent(
    input: LogSheetEventInput,
): Promise<void> {
    const payload = {
        user_id: input.userId ?? null,
        sheet_spec_id: input.sheetSpecId ?? null,
        template_slug: input.templateSlug ?? null,
        event_type: input.eventType,
        metadata: input.metadata ?? null,
    };

    // TEMPORARY: Just log in dev, no Supabase writes.
    // This avoids "[sheetEvents] Failed to log event {}" until
    // the sheet_events_log table is finalized.
    if (process.env.NODE_ENV !== "production") {
        console.log("[sheetEvents] (dev) logSheetEvent payload:", payload);
    }

    return;
}
