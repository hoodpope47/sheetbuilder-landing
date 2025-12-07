"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type FeedbackWidgetProps = {
    sheetSpecId: string;
};

export function FeedbackWidget({ sheetSpecId }: FeedbackWidgetProps) {
    const { showToast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState("");

    async function submitFeedback(rating: "up" | "down") {
        if (submitted) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/brain/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sheetSpecId,
                    rating,
                    comment: comment.trim() || undefined,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to submit feedback");
            }

            setSubmitted(true);
            showToast({
                variant: "success",
                title: "Thanks for the feedback!",
                message: "Your input helps improve AI suggestions.",
            });
        } catch (error) {
            console.error("[FeedbackWidget] Error:", error);
            showToast({
                variant: "error",
                title: "Feedback failed",
                message: "We couldn't save your feedback. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                    />
                </svg>
                <span>Feedback submitted</span>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">Was this helpful?</span>
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => submitFeedback("up")}
                        disabled={submitting}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
                        title="This setup helped"
                    >
                        👍
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowComment(true);
                        }}
                        disabled={submitting}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
                        title="Needs improvement"
                    >
                        👎
                    </button>
                </div>
            </div>

            {showComment && !submitted && (
                <div className="space-y-1.5">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Optional: What could be better?"
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-300"
                        rows={2}
                    />
                    <div className="flex gap-1.5">
                        <button
                            type="button"
                            onClick={() => submitFeedback("down")}
                            disabled={submitting}
                            className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                        >
                            {submitting ? "Sending..." : "Submit"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowComment(false);
                                setComment("");
                            }}
                            className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
