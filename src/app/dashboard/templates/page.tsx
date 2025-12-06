import type { Metadata } from "next";
import {
    SheetTemplateLibrary,
    PlanId,
} from "@/components/dashboard/templates/SheetTemplateLibrary";
import { getDashboardUser } from "@/lib/userClient";

export const metadata: Metadata = {
    title: "Templates – AI Sheet Builder",
};

export default async function TemplatesPage() {
    const user = await getDashboardUser();

    const email = (user as any)?.email ?? "";
    const isAdmin =
        typeof email === "string" &&
        email.toLowerCase() === "admin@sheetbuilder.ai";

    // Try to read plan from a few possible locations
    const rawPlan =
        (user as any)?.plan ??
        (user as any)?.metadata?.plan ??
        (user as any)?.stripePlan ??
        "free";

    const allowedPlans: PlanId[] = ["free", "starter", "pro", "enterprise"];

    const plan: PlanId = allowedPlans.includes(rawPlan)
        ? (rawPlan as PlanId)
        : "free";

    return (
        <SheetTemplateLibrary
            plan={plan}
            isAdmin={isAdmin}
        />
    );
}