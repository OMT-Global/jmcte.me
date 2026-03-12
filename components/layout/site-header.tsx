"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <header
      data-site-loader-item
      className="sticky top-0 z-30 border-b border-border/30 bg-background/85 backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 py-4">
        <nav aria-label="Primary" className="w-full">
          <ul className="flex items-center justify-center gap-3 sm:gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex items-center rounded-full border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isActive ? "border-primary/50 bg-primary/15" : "border-transparent hover:border-primary/40 hover:bg-primary/10"}`}
                  >
                    <Icon size={16} className="shrink-0" aria-hidden />
                    <span className="sr-only">{item.label}</span>
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
