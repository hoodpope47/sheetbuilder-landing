export type LoginRecord = {
    username: string;
    userAgent: string;
    loggedInAt: string; // ISO string
};

const STORAGE_KEY = "sheetbuilder_login_records";

function isBrowser() {
    return typeof window !== "undefined";
}

export function logLogin(username: string): void {
    if (!isBrowser()) return;

    const userAgent =
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown";

    const record: LoginRecord = {
        username,
        userAgent,
        loggedInAt: new Date().toISOString(),
    };

    try {
        const existingRaw = window.localStorage.getItem(STORAGE_KEY);
        const existing: LoginRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
        existing.push(record);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (err) {
        // Fail silently in dev
        console.error("Failed to log login record", err);
    }
}

export function getLoginRecords(): LoginRecord[] {
    if (!isBrowser()) return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as LoginRecord[]) : [];
    } catch {
        return [];
    }
}
