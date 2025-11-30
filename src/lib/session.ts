const STORAGE_KEY = "sheetbuilder_user";

export function setUser(username: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, username);
}

export function getUser(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEY);
}

export function clearUser(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
}
