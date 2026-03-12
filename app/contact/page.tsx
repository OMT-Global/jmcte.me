import type { Metadata } from "next";
import { Linkedin } from "lucide-react";
import { loadProfile } from "@/lib/content";
import { GithubIcon, LockIcon } from "@/components/icons/animated";

export const metadata: Metadata = {
  title: "Access",
  description: "Public access policy for jmcte.me."
};

export default async function ContactPage() {
  const profile = await loadProfile();
  const githubProfile = profile.socials.find((social) => social.label === "GitHub");
  const linkedinProfile = profile.socials.find((social) => social.label === "LinkedIn");

  return (
    <div className="space-y-6">
      <div data-site-loader-item className="space-y-6">
        <h1 className="text-4xl font-semibold">Access</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          I keep direct communication private. Public material here is intentionally limited to published work
          and a minimal operating surface.
        </p>
      </div>
      <section data-site-loader-item className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card/80 p-5">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <LockIcon size={20} aria-hidden />
          </div>
          <p className="font-semibold">Operating posture</p>
          <p className="text-sm text-muted-foreground">
            No public email address or direct inbound contact route is published here. Advisory work and
            private correspondence move through controlled channels only.
          </p>
        </div>

        {githubProfile ? (
          <a
            href={githubProfile.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-border/60 bg-card/80 p-5 transition hover:border-primary/40 hover:bg-card"
          >
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
              <GithubIcon size={20} aria-hidden />
            </div>
            <p className="font-semibold">Public code</p>
            <p className="text-sm text-muted-foreground">
              Open-source work is published on GitHub. Internal systems, private repositories, and direct
              correspondence stay off the public surface.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{githubProfile.handle}</p>
          </a>
        ) : null}

        {linkedinProfile ? (
          <a
            href={linkedinProfile.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl border border-border/60 bg-card/80 p-5 transition hover:border-primary/40 hover:bg-card"
          >
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
              <Linkedin size={20} aria-hidden />
            </div>
            <p className="font-semibold">LinkedIn</p>
            <p className="text-sm text-muted-foreground">
              Public professional background and executive role history are available on LinkedIn.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{linkedinProfile.handle}</p>
          </a>
        ) : null}
      </section>
    </div>
  );
}
