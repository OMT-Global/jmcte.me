import Link from "next/link";
import {
  FileTextIcon,
  FolderKanbanIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserIcon
} from "@/components/icons/animated";

const navItems = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/about", label: "About", icon: UserIcon },
  { href: "/projects", label: "Projects", icon: FolderKanbanIcon },
  { href: "/resume", label: "Resume", icon: FileTextIcon },
  { href: "/contact", label: "Access", icon: ShieldCheckIcon }
];

export function SiteHeader() {
  return (
    <header
      data-site-loader-item
      className="sticky top-0 z-30 border-b border-border/30 bg-background/85 backdrop-blur"
    >
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
                    <Icon size={16} className="shrink-0" aria-hidden />
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
