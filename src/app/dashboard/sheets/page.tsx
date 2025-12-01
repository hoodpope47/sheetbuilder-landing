"use client";

const demoSheets = [
    {
        id: "sales-pipeline-v1",
        name: "Sales pipeline tracker",
        category: "Sales",
        status: "Draft",
        lastUpdated: "2025-11-30",
    },
    {
        id: "income-expense-v1",
        name: "Income & expense tracker",
        category: "Finance",
        status: "Active",
        lastUpdated: "2025-11-20",
    },
];

export default function MySheetsPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">My Sheets</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Manage your generated sheets and templates.
                    </p>
                </div>
                <button className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400">
                    + New sheet
                </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-4 py-3">
                    <p className="text-xs font-semibold text-slate-600">All sheets</p>
                </div>
                {demoSheets.length === 0 ? (
                    <div className="px-4 py-6 text-xs text-slate-500">
                        You don&apos;t have any sheets yet. Generate one from the button
                        above.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] text-slate-500">
                                    <th className="px-4 py-2 text-left font-medium">Name</th>
                                    <th className="px-4 py-2 text-left font-medium">Category</th>
                                    <th className="px-4 py-2 text-left font-medium">Status</th>
                                    <th className="px-4 py-2 text-left font-medium">
                                        Last updated
                                    </th>
                                    <th className="px-4 py-2 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {demoSheets.map((sheet) => (
                                    <tr
                                        key={sheet.id}
                                        className="border-b border-slate-100 last:border-0"
                                    >
                                        <td className="px-4 py-2 text-slate-800">{sheet.name}</td>
                                        <td className="px-4 py-2 text-slate-600">
                                            {sheet.category}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                                                {sheet.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-slate-600">
                                            {sheet.lastUpdated}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <button className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-500">
                                                Open
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
