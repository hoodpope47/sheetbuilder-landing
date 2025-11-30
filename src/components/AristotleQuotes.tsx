"use client";

import { useEffect, useState } from "react";

const ARISTOTLE_QUOTES: string[] = [
    "Quality is not an act, it is a habit.",
    "We are what we repeatedly do.",
    "The beginning of work is the most important part.",
    "Pleasure in the job puts perfection in the work.",
    "Knowing yourself is the beginning of all wisdom.",
    "Well begun is half done.",
];

const ROTATION_MS = 30_000; // 30 seconds

export function AristotleQuotes() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % ARISTOTLE_QUOTES.length);
        }, ROTATION_MS);

        return () => clearInterval(id);
    }, []);

    const quote = ARISTOTLE_QUOTES[index];

    return (
        <div className="mt-auto border-t border-slate-800/60 pt-4 pr-4 pb-4 pl-4 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Aristotle on work</p>
            <p className="leading-snug italic">&ldquo;{quote}&rdquo;</p>
        </div>
    );
}
