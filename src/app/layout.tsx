// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Sheet Builder",
  description: "Montee-style landing page for AI-powered Google Sheets tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}