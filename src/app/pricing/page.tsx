import Link from "next/link";
import { PricingSection } from "@/components/PricingSection";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
            <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold">
                            A
                        </div>
                        <span className="text-sm font-semibold tracking-tight">
                            AI Sheet Builder
                        </span>
                    </Link>
                    <div className="flex items-center gap-4 text-sm">
                        <Link href="/#tools" className="text-slate-300 hover:text-white">
                            Tools
                        </Link>
                        <Link href="#pricing" className="text-slate-300 hover:text-white">
                            Pricing
                        </Link>
                        <Link
                            href="/login"
                            className="rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium hover:border-emerald-400 hover:text-emerald-200"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </header>

            <PricingSection />

            <footer className="border-t border-slate-800 bg-slate-950">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-[11px] text-slate-500">
                    <span>© {new Date().getFullYear()} AI Sheet Builder. All rights reserved.</span>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-slate-300">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-slate-300">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}
