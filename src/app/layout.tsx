import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InviteRedirect } from "@/components/auth/InviteRedirect";

export const metadata: Metadata = {
  title: { default: "You Don’t Know Jack Trivia", template: "%s · YDKJ Trivia" },
  description: "Clever, campy trivia online and at booked events—follow the show or bring Jack to your crowd.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "YDKJ Trivia" },
};

export const viewport: Viewport = {
  themeColor: "#111115",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">
        <InviteRedirect />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="min-h-[70vh]" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
