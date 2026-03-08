import { type ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto min-h-[calc(100vh-8rem)] max-w-6xl px-6 py-10 sm:px-8">
      {children}
    </main>
  );
}
