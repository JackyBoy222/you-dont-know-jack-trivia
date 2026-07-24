import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "You Don’t Know Jack Trivia", template: "%s · YDKJ Trivia" },
  description: "Clever, campy live trivia across New Orleans—find a show or bring Jack to your crowd.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "YDKJ Trivia" },
};

export const viewport: Viewport = {
  themeColor: "#f3efe6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
