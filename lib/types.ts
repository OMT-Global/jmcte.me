export type ContactVisibility = "open" | "limited" | "private";

export type SocialLink = {
  label: string;
  url: string;
  handle: string;
};

export type ProfilePayload = {
  name: string;
  handle: string;
  title: string;
  bio: string;
  location: string;
  website: string;
  updatedAt: string;
  socials: SocialLink[];
  availability: string;
  pronouns?: string;
  skills: string[];
  certifications?: string[];
  contactVisibility?: ContactVisibility;
  email?: string;
};

export type ProjectPayload = {
  id: string;
  title: string;
  summary: string;
  stack: string[];
  source?: {
    label: string;
    description: string;
  };
  github?: string;
  url?: string;
  status: "completed" | "active" | "maintenance" | "paused";
  featured: boolean;
  startedAt: string;
  finishedAt?: string;
};

export type ProjectsPayload = {
  generatedAt: string;
  projects: ProjectPayload[];
};

export type ResumeSectionItem = {
  title: string;
  org: string;
  startAt: string;
  endAt?: string;
  bullets: string[];
};

export type EducationItem = {
  school: string;
  degree: string;
  startAt: string;
  endAt: string;
  notes?: string;
};

export type PatentItem = {
  title: string;
  patentNumber: string;
  issuedAt: string;
  url: string;
};

export type ResumePayload = {
  updatedAt: string;
  experience: ResumeSectionItem[];
  education: EducationItem[];
  skills: {
    technical: string[];
    tools: string[];
    soft: string[];
  };
  patents: PatentItem[];
  publications: {
    title: string;
    publisher: string;
    year: string;
    link?: string;
  }[];
  certifications: string[];
  links: {
    label: string;
    url: string;
  }[];
};

export type MarkdownBlockType =
  | {
      type: "heading";
      level: 1 | 2 | 3;
      text: string;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      items: string[];
    };
