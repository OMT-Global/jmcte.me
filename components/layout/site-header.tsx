import Link from "next/link";
import { Home, Briefcase, UserRound, FileText, Shield } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: UserRound },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/contact", label: "Access", icon: Shield }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/30 bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between py-4 px-6">
        <Link href="/" aria-label="JMCTE home" className="font-semibold tracking-wide">
          JMCTE
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-3 sm:gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span className="sr-only sm:not-sr-only">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
