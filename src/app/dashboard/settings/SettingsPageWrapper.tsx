"use client";

import dynamic from "next/dynamic";

// Client-only dynamic import of SettingsPageClient.
// Because this file is a Client Component ("use client"),
// using `ssr: false` here is allowed.
const SettingsPageClient = dynamic(() => import("./SettingsPageClient"), {
    ssr: false,
});

export default function SettingsPageWrapper() {
    return <SettingsPageClient />;
}
