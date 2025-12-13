import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a single Supabase service client instance
const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        persistSession: false,
    },
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const full_name =
            typeof body.full_name === "string" && body.full_name.trim().length > 0
                ? body.full_name.trim()
                : null;

        const company_name =
            typeof body.company_name === "string" &&
            body.company_name.trim().length > 0
                ? body.company_name.trim()
                : null;

        const role =
            typeof body.role === "string" && body.role.trim().length > 0
                ? body.role.trim()
                : null;

        const workspaceUserId =
            typeof body.workspaceUserId === "string" &&
            body.workspaceUserId.trim().length > 0
                ? body.workspaceUserId.trim()
                : null;

        if (!workspaceUserId) {
            return NextResponse.json(
                { error: "Missing workspaceUserId" },
                { status: 400 },
            );
        }

        // Upsert into a simple table keyed by workspace_user_id
        const { error: upsertError } = await supabase
            .from("workspace_profiles")
            .upsert(
                {
                    workspace_user_id: workspaceUserId,
                    full_name,
                    company_name,
                    role,
                },
                {
                    onConflict: "workspace_user_id",
                },
            );

        if (upsertError) {
            console.error(
                "[api/settings/profile] Supabase upsert error:",
                upsertError,
            );
            return NextResponse.json(
                { error: "Database error while saving profile." },
                { status: 500 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                profile: {
                    workspace_user_id: workspaceUserId,
                    full_name,
                    company_name,
                    role,
                },
            },
            { status: 200 },
        );
    } catch (err: any) {
        console.error("[api/settings/profile] Unexpected error:", err);
        return NextResponse.json(
            { error: "Unexpected error while saving profile." },
            { status: 500 },
        );
    }
}
