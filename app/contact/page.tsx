import type { Metadata } from "next";
import Link from "next/link";
import { loadProfile } from "@/lib/content";
import { FileText, Globe, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Access",
  description: "Public access policy and published references for jmcte.me."
};

export default async function ContactPage() {
  const profile = await loadProfile();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">Access</h1>
      <p className="max-w-xl text-sm text-muted-foreground">
        I keep direct communication private. Public material here is intentionally limited to published work,
        machine-readable references, and a minimal operating surface.
      </p>
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/80 p-5">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <p className="font-semibold">Operating posture</p>
          <p className="text-sm text-muted-foreground">
            No public email address or direct inbound contact route is published here. Advisory work and
            private correspondence move through controlled channels only.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-5">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <p className="font-semibold">Published references</p>
          <p className="text-sm text-muted-foreground">
            Public JSON: <Link href="/profile.json">/profile.json</Link>,{" "}
            <Link href="/projects.json">/projects.json</Link>, <Link href="/resume.json">/resume.json</Link>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Security contact policy: <Link href="/contact">/contact</Link>
          </p>
        </div>
        <div className="space-y-3">
          {profile.socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-border/60 bg-card/80 p-4 transition hover:border-primary/40 hover:bg-card"
            >
              <p className="font-semibold">{social.label}</p>
              <p className="text-sm text-muted-foreground">{social.handle}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
