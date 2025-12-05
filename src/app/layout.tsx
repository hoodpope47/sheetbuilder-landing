import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme";
import { ToastProvider } from "@/components/ui/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Automate Your Job – AI Sheet Builder",
  description:
    "Industrial-grade Google Sheets templates and AI tools to automate repetitive work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}