import Link from "next/link";

export const metadata = {
  title: "Login | AI Sheet Builder",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 space-y-6 border border-gray-100">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
          <p className="text-sm text-gray-600">
            Sign in to access your saved templates and schema presets.
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
          >
            Continue
          </button>
        </form>

        <div className="text-center text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
