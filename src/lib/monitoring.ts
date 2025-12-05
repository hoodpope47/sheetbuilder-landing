import * as Sentry from "@sentry/nextjs";

type ExtraContext = Record<string, unknown>;

export function captureError(error: unknown, context?: ExtraContext) {
    try {
        if (!error) return;

        if (context) {
            Sentry.captureException(error, (scope) => {
                scope.setContext("extra", context);
                return scope;
            });
        } else {
            Sentry.captureException(error);
        }
    } catch {
        // Never let monitoring crash the app
        console.error("[monitoring] Failed to capture error", error, context);
    }
}
