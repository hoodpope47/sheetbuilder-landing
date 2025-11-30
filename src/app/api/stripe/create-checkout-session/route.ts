import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
    try {
        const { priceId, planId } = await req.json();

        if (!priceId || typeof priceId !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid priceId" },
                { status: 400 }
            );
        }

        const origin =
            process.env.NEXT_PUBLIC_APP_URL ||
            req.headers.get("origin") ||
            "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${origin}/dashboard?upgrade=success&plan=${encodeURIComponent(
                planId || ""
            )}`,
            cancel_url: `${origin}/pricing?upgrade=cancelled`,
            allow_promotion_codes: true,
            metadata: {
                planId: planId || "unknown",
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Stripe checkout session error", error);
        return NextResponse.json(
            { error: error.message || "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
