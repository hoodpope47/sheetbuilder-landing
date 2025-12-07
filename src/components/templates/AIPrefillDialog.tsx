"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type AIPrefillDialogProps = {
    templateName: string;
    templateCategory: string;
    onApply: (payload: {
        suggestedTitle: string;
        suggestedDescription: string;
        suggestedSpecJson: Record<string, unknown>;
    }) => void;
};

export function AIPrefillDialog({
    templateName,
    templateCategory,
    onApply,
}: AIPrefillDialogProps) {
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleAskAI() {
        if (!query.trim()) {
            showToast({
                variant: "error",
                title: "Please describe what you want",
                message: "Enter a description of your needs before asking AI.",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/brain/suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `${query} | Template: ${templateName}`,
                    templateCategory,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to get AI suggestion");
            }

            const data = await response.json();

            if (data.success) {
                onApply({
                    suggestedTitle: data.suggestedTitle,
                    suggestedDescription: data.suggestedDescription,
                    suggestedSpecJson: data.suggestedSpecJson || {},
                });

                showToast({
                    variant: "success",
                    title: "AI prefilled this setup!",
                    message: "Review and adjust the fields before saving.",
                });

                setIsOpen(false);
                setQuery("");
            } else {
                throw new Error("AI response missing success field");
            }
        } catch (error) {
            console.error("[AIPrefillDialog] Error:", error);
            showToast({
                variant: "error",
                title: "AI couldn't prefill this setup",
                message: "Please try again or fill it manually.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center  gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
                Use AI to prefill this setup
            </button>

            {/* Modal Dialog */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Let AI prefill this setup
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                Describe what you want to track and AI will suggest a configuration for{" "}
                                <span className="font-medium">{templateName}</span>.
                            </p>
                        </div>

                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Example: Track monthly recurring revenue and churn for a SaaS product with 500 customers..."
                            className="h-32 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            disabled={isLoading}
                        />

                        <div className="mt-4 flex items-center justify-between gap-3">
                            <p className="text-xs text-slate-500">
                                💡 Be specific about what you want to track and how
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery("");
                                    }}
                                    disabled={isLoading}
                                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAskAI}
                                    disabled={isLoading || !query.trim()}
                                    className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                                >
                                    {isLoading ? "Thinking..." : "Ask AI"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
