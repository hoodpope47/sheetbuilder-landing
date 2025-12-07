"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type CopyToGoogleButtonProps = {
    templateSlug: string;
    sheetSpecId?: string | null;
    buttonLabel?: string;
};

export function CopyToGoogleButton({
    templateSlug,
    sheetSpecId,
    buttonLabel = "Copy to Google Sheets",
}: CopyToGoogleButtonProps) {
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    async function handleCopy() {
        setIsLoading(true);

        try {
            const res = await fetch("/api/sheets/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    templateSlug,
                    sheetSpecId: sheetSpecId ?? null,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.ok) {
                showToast({
                    variant: "error",
                    title: "Copy failed",
                    message: "We couldn't create your sheet. Please try again.",
                });
                setIsLoading(false);
                return;
            }

            // Show success toast
            showToast({
                variant: "success",
                title: "Sheet ready",
                message: "Your Google Sheet is opening in a new tab.",
            });

            // Open the copy URL in a new tab
            if (data.redirectUrl) {
                window.open(data.redirectUrl, "_blank", "noopener,noreferrer");
            }

            setIsLoading(false);
        } catch (error) {
            console.error("[CopyToGoogleButton] Error:", error);
            showToast({
                variant: "error",
                title: "Copy failed",
                message: "We couldn't create your sheet. Please try again.",
            });
            setIsLoading(false);
        }
    }

    return (
        <button
            onClick={handleCopy}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? "Copying…" : buttonLabel}
        </button>
    );
}
