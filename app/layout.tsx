import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteShell } from "@/components/layout/site-shell";
import "@/app/globals.css";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

const codeFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "JMCTE",
    template: "%s | JMCTE"
  },
  description:
    "Professional portfolio for John McChesney TenEyck Jr., focused on reliable systems, practical engineering, and infrastructure."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${codeFont.variable}`}>
      <body className="antialiased">
        <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,hsl(var(--primary)/0.12),transparent_40%),radial-gradient(circle_at_85%_5%,hsl(var(--accent)/0.15),transparent_30%),radial-gradient(circle_at_30%_90%,hsl(var(--secondary)/0.24),transparent_35%)]"
            aria-hidden
          />
          <div className="relative z-10">
            <SiteHeader />
            <SiteShell>{children}</SiteShell>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
