import Link from "next/link";
import { ArrowUpRight, FileText, Globe, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { loadHomeCopy, loadProfile, loadProjects } from "@/lib/content";
import { MarkdownView } from "@/components/markdown-view";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PersonStructuredData, ProjectsStructuredData } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page for the jmcte.me portfolio."
};

export default async function HomePage() {
  const [profile, projectsPayload, homeCopy] = await Promise.all([
    loadProfile(),
    loadProjects(),
    loadHomeCopy()
  ]);
  const featuredProjects = projectsPayload.projects.filter((project) => project.featured);
  const publicSurfaceItems = [
    ...profile.socials.map((social) => ({
      label: social.label,
      url: social.url,
      handle: social.handle,
      external: true
    })),
    {
      label: "Profile JSON",
      url: "/profile.json",
      handle: "Machine-readable profile",
      external: false
    }
  ];

  return (
    <>
      <PersonStructuredData profile={profile} />
      <ProjectsStructuredData projects={projectsPayload} />
      <section className="space-y-10">
        <div className="space-y-6">
          <p className="inline-block rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-primary">
            Professional Portfolio
          </p>
          <h1 className="max-w-3xl text-4xl leading-tight font-bold sm:text-6xl">
            {profile.name}
          </h1>
          <p className="max-w-2xl text-xl font-medium text-primary">{profile.title}</p>
          <p className="max-w-2xl text-base text-muted-foreground">{profile.bio}</p>
          <p className="max-w-2xl text-sm text-muted-foreground">{profile.location} · {profile.availability}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-primary-foreground transition hover:brightness-105"
            >
              See projects
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 transition hover:bg-card"
            >
              <UserRound className="h-4 w-4" />
              About
            </Link>
            <Link href="/resume" className="inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 transition hover:bg-card">
              <FileText className="h-4 w-4" />
              Resume
            </Link>
          </div>
        </div>

        <Section
          heading="About me"
          description="A high-agency operator profile grounded in enterprise architecture, reliability, and public restraint."
        >
          <MarkdownView content={homeCopy} className="prose prose-invert max-w-none" />
        </Section>

        <Section
          heading="Core skills"
          description="Stack highlights I use to ship resilient systems."
        >
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </Section>

        <Section heading="Selected work" description="Public repositories and systems work I can discuss openly. Private code stays off the site.">
          <div className="grid gap-4 md:grid-cols-3">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="space-y-4 p-5" variant="accent">
                <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.slice(0, 3).map((entry) => (
                    <span key={entry} className="rounded-full bg-card px-2 py-1 text-xs">
                      {entry}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section heading="Public surface" description="Minimal public footprint. No public inbox; published material only.">
          <div className="grid gap-3 sm:grid-cols-2">
            {publicSurfaceItems.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-4 py-3 transition hover:border-primary/40 hover:bg-card"
              >
                <div className="space-y-1">
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.handle}</p>
                </div>
                <Globe className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </a>
            ))}
          </div>
        </Section>
      </section>
    </>
  );
}
