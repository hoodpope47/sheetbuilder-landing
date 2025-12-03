"use client";

import React, { useEffect, useState } from "react";
import { DashboardShellDesktop } from "./DashboardShellDesktop";
import { DashboardShellMobile } from "./DashboardShellMobile";

type Props = {
    children: React.ReactNode;
};

/**
 * Responsive wrapper:
 * - Uses Desktop shell on screens >= 1024px (lg breakpoint)
 * - Uses Mobile shell below that
 *
 * This keeps imports the same:
 *   import { DashboardShell } from "@/components/dashboard/DashboardShell";
 *
 * Desktop layout stays exactly as before (DashboardShellDesktop).
 * Mobile layout can be customized separately in DashboardShellMobile.tsx.
 */
export function DashboardShell({ children }: Props) {
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mq = window.matchMedia("(min-width: 1024px)");
        const handleChange = (event: MediaQueryListEvent) => {
            setIsDesktop(event.matches);
        };

        // Initial value
        setIsDesktop(mq.matches);

        // Listen for changes
        mq.addEventListener("change", handleChange);
        return () => mq.removeEventListener("change", handleChange);
    }, []);

    // First render / SSR: default to desktop, so nothing "jumps"
    if (isDesktop === null) {
        return <DashboardShellDesktop>{children}</DashboardShellDesktop>;
    }

    return isDesktop ? (
        <DashboardShellDesktop>{children}</DashboardShellDesktop>
    ) : (
        <DashboardShellMobile>{children}</DashboardShellMobile>
    );
}
