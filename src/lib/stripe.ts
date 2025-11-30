import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(secretKey, {
    apiVersion: "2025-11-17.clover",
});
