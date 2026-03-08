import type { Metadata } from "next";
import Link from "next/link";
import { loadProfile } from "@/lib/content";
import { Mail, Globe, KeySquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact details and social links for jmcte.me."
};

export default async function ContactPage() {
  const profile = await loadProfile();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold">Contact</h1>
      <p className="max-w-xl text-sm text-muted-foreground">
        I prefer concise messages with context and goals. For most work, email is best.
      </p>
      <section className="grid gap-4 sm:grid-cols-2">
        <a
          href={`mailto:${profile.email}`}
          className="rounded-2xl border border-border/60 bg-card/80 p-5 transition hover:border-primary/40 hover:bg-card"
        >
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <p className="font-semibold">Email</p>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </a>

        <div className="rounded-2xl border border-border/60 bg-card/80 p-5">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
            <KeySquare className="h-5 w-5" />
          </div>
          <p className="font-semibold">Agent hints</p>
          <p className="text-sm text-muted-foreground">
            Public JSON: <Link href="/profile.json">/profile.json</Link>,{" "}
            <Link href="/projects.json">/projects.json</Link>, <Link href="/resume.json">/resume.json</Link>
          </p>
          {profile.gpgFingerprint ? (
            <p className="mt-2 text-xs text-muted-foreground">GPG: {profile.gpgFingerprint}</p>
          ) : null}
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
