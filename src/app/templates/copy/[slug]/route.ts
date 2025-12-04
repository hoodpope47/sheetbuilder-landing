import { NextResponse } from "next/server";
import {
    SHEET_TEMPLATE_LIST,
    type SheetTemplate,
} from "@/components/dashboard/templates/SheetTemplateLibrary";

type RouteParams = {
    params: { slug: string };
};

export async function GET(_req: Request, { params }: RouteParams) {
    const list: SheetTemplate[] = Array.isArray(SHEET_TEMPLATE_LIST)
        ? SHEET_TEMPLATE_LIST
        : (Object.values(SHEET_TEMPLATE_LIST as any) as SheetTemplate[]);

    const template = list.find((t) => t.slug === params.slug);

    const sheetId =
        template?.copySheetId ||
        process.env.NEXT_PUBLIC_DEFAULT_TEMPLATE_SHEET_ID ||
        "1Ov_jEqt9gG5A1v3QR21kBIvi0cxsTGgHD-JFTNDd19E";

    if (!sheetId) {
        return NextResponse.json(
            { error: "Missing copy sheet id for this template." },
            { status: 500 }
        );
    }

    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/copy`;

    return NextResponse.redirect(url);
}
