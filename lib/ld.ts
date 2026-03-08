import type { ProfilePayload, ProjectPayload, ProjectsPayload } from "@/lib/types";

export function personJsonLd(profile: ProfilePayload) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.website,
    jobTitle: profile.title,
    description: profile.bio,
    image: "https://jmcte.me/avatar/profile.svg",
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location
    },
    hasCredential: profile.certifications ?? []
  };

  if (profile.email) {
    Object.assign(payload, { email: `mailto:${profile.email}` });
  }

  if (profile.socials.length > 0) {
    Object.assign(payload, { sameAs: profile.socials.map((social) => social.url) });
  }

  return payload;
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
