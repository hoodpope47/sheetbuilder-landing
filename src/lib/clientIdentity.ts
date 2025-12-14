"use client";

import { useEffect, useState } from "react";

export type LocalProfileIdentity = {
    displayName: string | null;
    fullName: string | null;
    avatarUrl: string | null;
};

const LOCAL_STORAGE_KEY = "ai-sheet-builder:local-profile-identity";

const defaultIdentity: LocalProfileIdentity = {
    displayName: null,
    fullName: null,
    avatarUrl: null,
};

function safeReadIdentity(): LocalProfileIdentity {
    if (typeof window === "undefined") {
        return defaultIdentity;
    }

    try {
        const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return defaultIdentity;

        const parsed = JSON.parse(raw) as Partial<LocalProfileIdentity>;
        return {
            displayName: parsed.displayName ?? null,
            fullName: parsed.fullName ?? null,
            avatarUrl: parsed.avatarUrl ?? null,
        };
    } catch (e) {
        console.warn("[clientIdentity] Failed to read identity from localStorage:", e);
        return defaultIdentity;
    }
}

function safeWriteIdentity(update: Partial<LocalProfileIdentity>): void {
    if (typeof window === "undefined") return;

    try {
        const current = safeReadIdentity();
        const next: LocalProfileIdentity = {
            displayName:
                update.displayName !== undefined ? update.displayName : current.displayName,
            fullName:
                update.fullName !== undefined ? update.fullName : current.fullName,
            avatarUrl:
                update.avatarUrl !== undefined ? update.avatarUrl : current.avatarUrl,
        };

        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
        console.warn("[clientIdentity] Failed to write identity to localStorage:", e);
    }
}

/**
 * Hook used by the dashboard shell / overview to show:
 * - display name
 * - full name
 * - avatar URL
 *
 * IMPORTANT: Initial state is static (defaultIdentity) so that
 * server render and first client render match. We only touch
 * localStorage in useEffect AFTER hydration, which avoids
 * hydration mismatch warnings.
 */
export function useLocalProfileIdentity(): LocalProfileIdentity {
    const [identity, setIdentity] = useState<LocalProfileIdentity>(defaultIdentity);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const value = safeReadIdentity();
        setIdentity(value);

        // Optional: listen for future updates (if other parts of the app
        // dispatch this event after calling setLocalProfileIdentity).
        const handler = () => {
            setIdentity(safeReadIdentity());
        };

        window.addEventListener("ai-sheet-builder:profile-identity-updated", handler);
        return () => {
            window.removeEventListener("ai-sheet-builder:profile-identity-updated", handler);
        };
    }, []);

    return identity;
}

/**
 * Helper used by Settings page (and potentially others) to
 * push the latest profile into localStorage so the dashboard
 * header / overview greeting stay in sync.
 */
export function setLocalProfileIdentity(update: Partial<LocalProfileIdentity>): void {
    safeWriteIdentity(update);

    if (typeof window !== "undefined") {
        try {
            window.dispatchEvent(
                new CustomEvent("ai-sheet-builder:profile-identity-updated"),
            );
        } catch {
            // Not critical if this fails; localStorage is already updated.
        }
    }
}
