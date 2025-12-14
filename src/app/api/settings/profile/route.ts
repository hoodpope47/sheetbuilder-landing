import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client – service role, no auth session required.
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
});

// GET /api/settings/profile?workspaceUserId=xxx
// Returns the workspace profile row (or null) for that workspaceUserId.
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const workspaceUserId = searchParams.get("workspaceUserId");

        if (!workspaceUserId) {
            return NextResponse.json({ profile: null }, { status: 200 });
        }

        const { data, error } = await supabaseAdmin
            .from("workspace_profiles")
            .select("*")
            .eq("workspace_user_id", workspaceUserId)
            .maybeSingle();

        if (error) {
            console.error("[/api/settings/profile] GET error:", error);
            return NextResponse.json(
                { error: "Database error while loading profile." },
                { status: 500 },
            );
        }

        return NextResponse.json({ profile: data }, { status: 200 });
    } catch (err) {
        console.error("[/api/settings/profile] GET unexpected error:", err);
        return NextResponse.json(
            { error: "Unexpected error while loading profile." },
            { status: 500 },
        );
    }
}

// POST /api/settings/profile
// Body: {
//   workspaceUserId: string;
//   full_name?: string | null;
//   company_name?: string | null;
//   role?: string | null;
//   phone?: string | null;
//   display_name?: string | null;
//   profile_picture_url?: string | null;
// }
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            workspaceUserId,
            full_name,
            company_name,
            role,
            phone,
            display_name,
            profile_picture_url,
        } = body as {
            workspaceUserId?: string;
            full_name?: string | null;
            company_name?: string | null;
            role?: string | null;
            phone?: string | null;
            display_name?: string | null;
            profile_picture_url?: string | null;
        };

        if (!workspaceUserId) {
            return NextResponse.json(
                { error: "Missing workspaceUserId." },
                { status: 400 },
            );
        }

        // Load existing row so we don't wipe fields the client didn't send.
        const { data: existing, error: fetchError } = await supabaseAdmin
            .from("workspace_profiles")
            .select("*")
            .eq("workspace_user_id", workspaceUserId)
            .maybeSingle();

        if (fetchError) {
            console.error(
                "[/api/settings/profile] fetch existing error:",
                fetchError,
            );
            return NextResponse.json(
                { error: "Database error while reading existing profile." },
                { status: 500 },
            );
        }

        const upsertPayload = {
            workspace_user_id: workspaceUserId,
            full_name:
                full_name !== undefined ? full_name : existing?.full_name ?? null,
            company_name:
                company_name !== undefined
                    ? company_name
                    : existing?.company_name ?? null,
            role: role !== undefined ? role : existing?.role ?? null,
            phone: phone !== undefined ? phone : existing?.phone ?? null,
            display_name:
                display_name !== undefined
                    ? display_name
                    : existing?.display_name ?? null,
            profile_picture_url:
                profile_picture_url !== undefined
                    ? profile_picture_url
                    : existing?.profile_picture_url ?? null,
        };

        console.log(
            "[/api/settings/profile] Upserting profile for workspaceUserId:",
            upsertPayload,
        );

        const { data, error: upsertError } = await supabaseAdmin
            .from("workspace_profiles")
            .upsert(upsertPayload, { onConflict: "workspace_user_id" })
            .select()
            .maybeSingle();

        if (upsertError) {
            console.error(
                "[/api/settings/profile] Supabase upsert error:",
                upsertError,
            );
            return NextResponse.json(
                { error: "Database error while saving profile." },
                { status: 500 },
            );
        }

        console.log("[/api/settings/profile] Profile saved successfully:", data);

        return NextResponse.json({ profile: data }, { status: 200 });
    } catch (err) {
        console.error("[/api/settings/profile] Unexpected error:", err);
        return NextResponse.json(
            { error: "Unexpected error while saving profile." },
            { status: 500 },
        );
    }
}
