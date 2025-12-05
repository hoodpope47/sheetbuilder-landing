"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useState,
    ReactNode,
} from "react";

type ToastVariant = "success" | "error" | "info";

type Toast = {
    id: number;
    variant: ToastVariant;
    title?: string;
    message: string;
};

type ToastContextValue = {
    showToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let globalToastId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((toast: Omit<Toast, "id">) => {
        const id = globalToastId++;
        const next: Toast = { ...toast, id };
        setToasts((prev) => [...prev, next]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={[
                            "pointer-events-auto rounded-xl border px-3 py-2 shadow-lg backdrop-blur",
                            toast.variant === "success"
                                ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
                                : toast.variant === "error"
                                    ? "border-rose-200 bg-rose-50/95 text-rose-900"
                                    : "border-slate-200 bg-white/95 text-slate-900",
                        ].join(" ")}
                    >
                        {toast.title && (
                            <div className="text-xs font-semibold tracking-wide">
                                {toast.title}
                            </div>
                        )}
                        <div className="mt-0.5 text-xs text-slate-700">
                            {toast.message}
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return ctx;
}
