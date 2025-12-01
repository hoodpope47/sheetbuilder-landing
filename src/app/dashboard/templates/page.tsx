export default function TemplatesWorkspacePage() {
    const templates = [
        {
            name: "Sales pipeline CRM",
            description: "Track deals, stages, owners, and forecasted value.",
            tag: "Sales",
        },
        {
            name: "Income & expense tracker",
            description: "Monitor cash flow, runway, and burn-rate with rollups.",
            tag: "Finance",
        },
        {
            name: "Marketing content calendar",
            description: "Plan content by channel, owner, and launch date.",
            tag: "Marketing",
        },
    ];

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-lg font-semibold tracking-tight">
                    Templates & tools
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Start from a proven template instead of a blank sheet.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {templates.map((tpl) => (
                    <div
                        key={tpl.name}
                        className="flex flex-col rounded-2xl border border-slate-200 bg-white px-4 py-4"
                    >
                        <span className="inline-flex w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 mb-2">
                            {tpl.tag}
                        </span>
                        <h2 className="text-sm font-semibold text-slate-900">
                            {tpl.name}
                        </h2>
                        <p className="mt-1 text-xs text-slate-600">{tpl.description}</p>
                        <button className="mt-4 inline-flex w-fit rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                            Use this template
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
