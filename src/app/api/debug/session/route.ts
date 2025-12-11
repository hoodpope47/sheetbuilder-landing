import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
    try {
        const supabase = supabaseServer();
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error) {
            return NextResponse.json(
                { ok: false, error: error.message },
                { status: 500 },
            );
        }

        return NextResponse.json(
            {
                ok: true,
                loggedIn: !!user,
                userId: user?.id ?? null,
                email: user?.email ?? null,
            },
            { status: 200 },
        );
    } catch (err: any) {
        return NextResponse.json(
            { ok: false, error: err?.message ?? "Unknown error" },
            { status: 500 },
        );
    }
}
