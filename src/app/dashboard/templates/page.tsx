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

    const email = user?.email ?? null;
    const rawPlan = (user?.plan ?? user?.metadata?.plan ?? "free") as string;

    const validPlans: PlanId[] = ["free", "starter", "pro", "enterprise"];
    const normalizedPlan = validPlans.includes(rawPlan as PlanId)
        ? (rawPlan as PlanId)
        : ("free" as PlanId);

    const isAdmin = email === "admin@sheetbuilder.ai";

    return (
        <SheetTemplateLibrary
            currentUserEmail={email}
            currentPlan={normalizedPlan}
            isAdmin={isAdmin}
        />
    );
}