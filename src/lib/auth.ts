export const DEV_USER = {
    username: "admin",
    password: "admin123",
};

export function authenticate(identifier: string, password: string): boolean {
    const trimmedId = identifier.trim().toLowerCase();
    const isMatchUser =
        trimmedId === DEV_USER.username.toLowerCase() ||
        trimmedId === "admin@example.com";
    const isMatchPassword = password === DEV_USER.password;
    return isMatchUser && isMatchPassword;
}
