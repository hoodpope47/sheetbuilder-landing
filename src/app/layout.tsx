// src/app/layout.tsx
import type { Metadata } from "next";
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
      <body className="min-h-screen bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}