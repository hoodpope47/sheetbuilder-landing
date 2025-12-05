import { NextRequest, NextResponse } from "next/server";
import {
    SHEET_TEMPLATE_LIST,
    type SheetTemplate,
} from "@/lib/templates/sheetTemplates";
import { logSheetEvent } from "@/lib/analytics/sheetEvents";

type RouteParams = {
    params: {
        slug: string;
    };
};

export async function GET(req: NextRequest, { params }: RouteParams) {
    const { slug } = params;

    const list: SheetTemplate[] = SHEET_TEMPLATE_LIST;
    const template = list.find((t) => t.slug === slug);

    if (!template || !template.copySheetUrl) {
        console.error(
            "[CopyRoute] Missing template or copySheetUrl for slug:",
            slug
        );
        return NextResponse.redirect(new URL("/dashboard/templates", req.url));
    }

    await logSheetEvent({
        templateSlug: template.slug,
        eventType: "sheet_created",
        metadata: {
            source: "copy_route",
            copy_sheet_url: template.copySheetUrl,
        },
    });

    // Redirect directly to the Google "Make a copy" URL
    return NextResponse.redirect(template.copySheetUrl, 307);
}
