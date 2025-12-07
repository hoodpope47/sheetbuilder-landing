"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

export function GoogleStatusToaster() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();

    useEffect(() => {
        const status = searchParams.get("googleStatus");
        const error = searchParams.get("googleError");

        if (!status && !error) return;

        if (status === "connected") {
            showToast({
                variant: "success",
                title: "Google account connected",
                message: "We'll use this to create and update your Sheets.",
            });
        } else if (error) {
            let description =
                "Google sign-in was canceled or failed. Please try again.";

            if (error === "oauth_start_failed") {
                description =
                    "We couldn't start Google sign-in. Please try again.";
            } else if (error === "missing_code") {
                description =
                    "Google didn't send a sign-in code. Please try again.";
            } else if (error === "callback_failed") {
                description =
                    "We couldn't finish connecting your Google account. Please try again.";
            } else if (error === "no_session") {
                description =
                    "Please log in to AI Sheet Builder before connecting Google.";
            } else if (error === "db_upsert_failed") {
                description =
                    "We couldn't save your Google connection. Please try again.";
            }

            showToast({
                variant: "error",
                title: "Google connection failed",
                message: description,
            });
        }

        // Clean query params from URL
        const params = new URLSearchParams(window.location.search);
        params.delete("googleStatus");
        params.delete("googleError");
        const next = params.toString()
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname;

        router.replace(next);
    }, [router, searchParams, showToast]);

    return null;
}
