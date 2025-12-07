import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import {
    SHEET_TEMPLATE_LIST,
    type SheetTemplate,
} from "@/components/dashboard/templates/SheetTemplateLibrary";
import { logSheetEvent } from "@/lib/brain/logSheetEvent";
import { captureError } from "@/lib/monitoring";

type CreateSheetBody = {
    templateSlug: string;
    sheetSpecId?: string | null;
};

export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = (await request.json()) as CreateSheetBody;

        if (!body.templateSlug) {
            return NextResponse.json(
                { ok: false, code: "MISSING_TEMPLATE_SLUG" },
                { status: 400 }
            );
        }

        // Get current user
        const { data: { user } } = await supabaseServer.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { ok: false, code: "NOT_AUTHENTICATED" },
                { status: 401 }
            );
        }

        // Look up template
        const template = (SHEET_TEMPLATE_LIST as SheetTemplate[]).find(
            (t) => t.slug === body.templateSlug
        );

        if (!template) {
            return NextResponse.json(
                { ok: false, code: "TEMPLATE_NOT_FOUND" },
                { status: 404 }
            );
        }

        if (!template.copySheetUrl) {
            return NextResponse.json(
                { ok: false, code: "COPY_URL_MISSING" },
                { status: 500 }
            );
        }

        // Log sheet_created event
        await logSheetEvent({
            userId: user.id,
            templateSlug: body.templateSlug,
            sheetSpecId: body.sheetSpecId ?? null,
            eventType: "sheet_created",
            metadata: {
                source: "preview_page",
                viaApi: true,
            },
        });

        // Return success with the copy URL
        return NextResponse.json({
            ok: true,
            redirectUrl: template.copySheetUrl,
        });
    } catch (error) {
        captureError(error, { context: "api/sheets/create" });

        return NextResponse.json(
            { ok: false, code: "INTERNAL_ERROR" },
            { status: 500 }
        );
    }
}
