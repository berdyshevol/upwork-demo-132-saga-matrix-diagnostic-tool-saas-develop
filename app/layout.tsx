import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saga Matrix — Diagnostic Tool",
  description:
    "Take a culture & leadership assessment, auto-score it, classify an archetype, and explore an executive dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <header className="border-b border-white/10 bg-ink/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-400 text-sm">
                ◆
              </span>
              <span>Saga Matrix</span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link href="/assessment" className="rounded-lg px-3 py-2 text-white/75 hover:bg-white/5 hover:text-white">
                Assessment
              </Link>
              <Link href="/dashboard" className="rounded-lg px-3 py-2 text-white/75 hover:bg-white/5 hover:text-white">
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-white/40">
          Saga Matrix Diagnostic Tool — assessment → scoring → archetype → executive reporting.
        </footer>
      </body>
    </html>
  );
}
