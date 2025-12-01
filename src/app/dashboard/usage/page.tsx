export default function UsageLimitsPage() {
    const plan = "Free";
    const limit: number = 5;
    const used = 0;

    const percent = limit === 0 ? 0 : Math.round((used / limit) * 100);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-lg font-semibold tracking-tight">
                    Usage & limits
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Keep an eye on how many AI-generated sheets you&apos;ve used this
                    month.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Current plan</p>
                    <p className="mt-2 text-lg font-semibold text-emerald-600">{plan}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        Upgrade for higher limits and priority support.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Sheets used</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{used}</p>
                    <p className="mt-1 text-[11px] text-slate-500">This billing cycle</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Limit</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{limit}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        Sheets included on the Free plan
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-xs font-semibold text-slate-500">Usage bar</p>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                    <div
                        className="h-2 rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                </div>
                <p className="mt-2 text-xs text-slate-600">
                    {used} of {limit} sheets used ({percent}%).
                </p>
            </div>
        </div>
    );
}
