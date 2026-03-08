import Link from "next/link";
import type { Metadata } from "next";
import { loadHomeCopy, loadProfile, loadProjects } from "@/lib/content";
import { MarkdownView } from "@/components/markdown-view";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PersonStructuredData, ProjectsStructuredData } from "@/components/structured-data";
import {
  ArrowUpRightIcon,
  FileTextIcon,
  GithubIcon,
  LockIcon,
  UserIcon
} from "@/components/icons/animated";

export const metadata: Metadata = {
  title: {
    absolute: "John M. TenEyck Jr. | JMCTE"
  },
  description: "Home page for the jmcte.me portfolio."
};

export default async function HomePage() {
  const [profile, projectsPayload, homeCopy] = await Promise.all([
    loadProfile(),
    loadProjects(),
    loadHomeCopy()
  ]);
  const featuredProjects = projectsPayload.projects.filter((project) => project.featured);
  const githubProfile = profile.socials.find((social) => social.label === "GitHub");

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
              <ArrowUpRightIcon size={16} className="shrink-0" aria-hidden />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 transition hover:bg-card"
            >
              <UserIcon size={16} className="shrink-0" aria-hidden />
              About
            </Link>
            <Link href="/resume" className="inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 transition hover:bg-card">
              <FileTextIcon size={16} className="shrink-0" aria-hidden />
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

        <Section heading="Public channels" description="Human-facing links only: public code and operating policy.">
          <div className="grid gap-3 sm:grid-cols-2">
            {githubProfile ? (
              <a
                href={githubProfile.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-4 py-3 transition hover:border-primary/40 hover:bg-card"
              >
                <div className="space-y-1">
                  <p className="font-semibold">GitHub</p>
                  <p className="text-sm text-muted-foreground">{githubProfile.handle}</p>
                </div>
                <GithubIcon
                  size={18}
                  className="text-muted-foreground group-hover:text-primary"
                  aria-hidden
                />
              </a>
            ) : null}
            <Link
              href="/contact"
              className="group flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-4 py-3 transition hover:border-primary/40 hover:bg-card"
            >
              <div className="space-y-1">
                <p className="font-semibold">Access policy</p>
                <p className="text-sm text-muted-foreground">Low-profile public surface and private inbound channels.</p>
              </div>
              <LockIcon
                size={18}
                className="text-muted-foreground group-hover:text-primary"
                aria-hidden
              />
            </Link>
          </div>
        </Section>
      </section>
    </>
  );
}
