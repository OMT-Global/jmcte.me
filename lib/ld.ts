import type { ProfilePayload, ProjectPayload, ProjectsPayload } from "@/lib/types";

export function personJsonLd(profile: ProfilePayload) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.website,
    jobTitle: profile.title,
    description: profile.bio,
    image: "https://jmcte.me/avatar/profile.svg",
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location
    },
    sameAs: profile.socials.map((social) => social.url),
    hasCredential: profile.certifications ?? []
  };
}

export function projectsCreativeWorkJsonLd(projectsPayload: ProjectsPayload) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured projects",
    itemListElement: projectsPayload.projects.map((project: ProjectPayload, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        keywords: project.stack.join(", "),
        url: project.url ?? project.github,
        dateCreated: project.startedAt,
        dateModified: project.finishedAt ?? project.startedAt
      }
    }))
  };
}
