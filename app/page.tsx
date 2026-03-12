import Link from "next/link";
import type { Metadata } from "next";
import { loadHomeCopy, loadProfile, loadProjects } from "@/lib/content";
import { MarkdownView } from "@/components/markdown-view";
import { Section } from "@/components/section";
import { Card } from "@/components/ui/card";
import { PersonStructuredData, ProjectsStructuredData } from "@/components/structured-data";
import {
  ArrowUpRightIcon,
  FileTextIcon,
  GithubIcon,
  LockIcon,
  ShieldCheckIcon,
  UserIcon
} from "@/components/icons/animated";

export const metadata: Metadata = {
  title: {
    absolute: "John M. TenEyck Jr. | JMCTE"
  },
  description: "Home page for the jmcte.me portfolio."
};

const highlightedSkills = [
  "Enterprise architecture",
  "Cloud transformation",
  "Technology strategy",
  "Reliability engineering",
  "Quality assurance",
  "Infrastructure modernization"
];

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
      <div className="space-y-10">
        <div data-site-loader-item className="space-y-6">
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
          description="A practical leadership profile focused on enterprise architecture, reliability, and secure delivery in regulated environments."
        >
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6">
            <div className="pointer-events-none absolute -top-12 -right-10 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
            <MarkdownView content={homeCopy} className="prose prose-invert max-w-none" />
          </div>
        </Section>

        <Section
          heading="Core skills"
          description="Primary disciplines I use most often."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highlightedSkills.map((skill) => (
              <Card key={skill} className="flex items-center gap-3 border-border/60 bg-card/50 px-4 py-3" variant="default">
                <ShieldCheckIcon size={16} className="text-primary" aria-hidden />
                <span className="text-sm font-medium text-foreground">{skill}</span>
              </Card>
            ))}
          </div>
        </Section>

        <Section heading="Selected work" description="Public projects and systems work I can discuss openly.">
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

        <Section heading="Public channels" description="Where to find verified public links.">
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
                <p className="text-sm text-muted-foreground">Private inbound channels are available by request.</p>
              </div>
              <LockIcon
                size={18}
                className="text-muted-foreground group-hover:text-primary"
                aria-hidden
              />
            </Link>
          </div>
        </Section>
      </div>
    </>
  );
}
