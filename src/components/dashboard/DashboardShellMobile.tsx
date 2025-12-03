"use client";

import React from "react";
import { DashboardShellDesktop } from "./DashboardShellDesktop";

type Props = {
    children: React.ReactNode;
};

/**
 * Mobile shell
 *
 * For now, this simply reuses the desktop layout so nothing changes visually.
 * Later, we can freely customize THIS file for phones/tablets without touching
 * the desktop experience.
 */
export function DashboardShellMobile({ children }: Props) {
    return <DashboardShellDesktop>{children}</DashboardShellDesktop>;
}
