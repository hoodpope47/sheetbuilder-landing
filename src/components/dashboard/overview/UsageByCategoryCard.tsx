"use client";

import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

// If you already had a prop type for this card, keep it.
// Here we just use a simple local type.
type UsageByCategoryDatum = {
    name: string;
    value: number;
};

// NOTE: For now this is still demo data.
// Later we'll replace this with a call to Supabase per-user.
const DEMO_DATA: UsageByCategoryDatum[] = [
    { name: "Sales", value: 8 },
    { name: "Finance", value: 5 },
    { name: "Ops", value: 4 },
    { name: "Other", value: 3 },
];

// Soft brand-compatible colors; these affect the normal (non-hover) state.
// If you already have a color palette, you can plug it in here.
const SEGMENT_COLORS = ["#22c55e", "#0ea5e9", "#f97316", "#6366f1"];

import { cardClasses, textStyles, palette } from "@/design-system/theme";

export function UsageByCategoryCard() {
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

    const data = DEMO_DATA;

    const handleMouseEnter = React.useCallback((_entry: unknown, index: number) => {
        setActiveIndex(index);
    }, []);

    const handleMouseLeave = React.useCallback(() => {
        setActiveIndex(null);
    }, []);

    return (
        <div className={cardClasses.primary}>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className={textStyles.cardTitle}>
                        Sheets by category
                    </h3>
                    <p className={textStyles.cardLabel}>
                        Where you use AI Sheet Builder the most
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="h-52 w-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={3}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            // We don’t use onClick anymore – all focus is hover-based.
                            >
                                {data.map((entry, index) => {
                                    const isActive = activeIndex === index;
                                    const dimOthers =
                                        activeIndex !== null &&
                                        activeIndex !== index;

                                    return (
                                        <Cell
                                            key={`slice-${entry.name}`}
                                            fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                                            stroke="transparent"
                                            style={{
                                                cursor: "pointer",
                                                // Scale up the hovered slice a bit
                                                transform: isActive
                                                    ? "scale(1.06)"
                                                    : "scale(1)",
                                                transformOrigin: "center",
                                                // Fade non-hovered slices slightly
                                                opacity: dimOthers ? 0.55 : 1,
                                                transition:
                                                    "transform 150ms ease-out, opacity 150ms ease-out",
                                            }}
                                        />
                                    );
                                })}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    borderRadius: 8,
                                    border: "1px solid #e2e8f0",
                                    padding: "6px 10px",
                                    fontSize: 12,
                                    color: "#0f172a",
                                    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                }}
                                formatter={(value: number, name: string) => [
                                    value,
                                    name,
                                ]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend on the right */}
                <div className="flex flex-1 flex-col gap-2 text-xs">
                    {data.map((entry, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <div
                                key={`legend-${entry.name}`}
                                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors"
                                style={{
                                    backgroundColor: isActive
                                        ? "rgba(148, 163, 184, 0.12)"
                                        : "transparent",
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="inline-block h-2.5 w-2.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                                        }}
                                    />
                                    <span className="text-slate-700">
                                        {entry.name}
                                    </span>
                                </div>
                                <span className="font-medium text-slate-900">
                                    {entry.value}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
