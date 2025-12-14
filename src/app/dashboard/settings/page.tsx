import SettingsPageWrapper from "./SettingsPageWrapper";

export default function SettingsPage() {
    // This is still a Server Component, but it only renders
    // a client wrapper that handles all the settings logic.
    return <SettingsPageWrapper />;
}
