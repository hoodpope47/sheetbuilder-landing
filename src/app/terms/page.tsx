import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Terms of Service
          </h1>
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            ← Back to home
          </Link>
        </header>

        <p className="text-sm text-slate-600 mb-4">
          These are placeholder terms for AI Sheet Builder. Replace this with
          your actual terms before launch.
        </p>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            By using this service, you agree that the tool is provided on a
            best-effort basis with no guarantee of fitness for a particular
            purpose.
          </p>
          <p>
            You are responsible for reviewing and validating all generated
            spreadsheets before using them for financial, legal, or operational
            decisions.
          </p>
          <p>
            We may update these terms from time to time. Continued use of the
            service after changes constitutes acceptance of the new terms.
          </p>
        </div>
      </div>
    </main>
  );
}
