import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Privacy Policy
          </h1>
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            ← Back to home
          </Link>
        </header>

        <p className="text-sm text-slate-600 mb-4">
          This is a placeholder privacy policy for AI Sheet Builder. Replace
          this with your real legal copy once you&apos;re ready to go live.
        </p>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            We use your data only to provide and improve our spreadsheet
            automation tools. We do not sell your data to third parties.
          </p>
          <p>
            Any Google Sheets or Google Drive access you grant is used solely to
            create and update spreadsheets on your behalf.
          </p>
          <p>
            You can request deletion of your account and associated data at any
            time by contacting support.
          </p>
        </div>
      </div>
    </main>
  );
}
