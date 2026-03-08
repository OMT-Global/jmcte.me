import type { ProfilePayload, ProjectsPayload } from "@/lib/types";
import { personJsonLd, projectsCreativeWorkJsonLd } from "@/lib/ld";

export function PersonStructuredData({ profile }: { profile: ProfilePayload }) {
  return (
    <script
      id="person-jsonld"
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(profile)) }}
    />
  );
}

export function ProjectsStructuredData({ projects }: { projects: ProjectsPayload }) {
  return (
    <script
      id="projects-jsonld"
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsCreativeWorkJsonLd(projects)) }}
    />
  );
}
