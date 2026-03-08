import type { Metadata } from "next";
import { loadResume } from "@/lib/content";
import { Section } from "@/components/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Resume",
  description: "Professional experience and education for jmcte.me."
};

function formatDateRange(startAt: string, endAt?: string) {
  const end = endAt ? endAt : "Present";
  return `${startAt} - ${end}`;
}

export default async function ResumePage() {
  const resume = await loadResume();

  return (
    <div className="space-y-10">
      <Section heading="Resume" description="Condensed overview of professional background." />

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Experience</h3>
        <div className="space-y-4">
          {resume.experience.map((entry) => (
            <Card key={`${entry.org}-${entry.title}`} className="space-y-3 p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <h4 className="text-lg font-semibold">{entry.title}</h4>
                <span className="text-sm text-muted-foreground">{formatDateRange(entry.startAt, entry.endAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{entry.org}</p>
              <ul className="ml-5 list-disc space-y-1">
                {entry.bullets.map((bullet) => (
                  <li key={bullet} className="text-sm text-muted-foreground">
                    {bullet}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Education</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {resume.education.map((education) => (
            <Card key={education.school} className="space-y-2 p-5">
              <h4 className="text-lg font-semibold">{education.school}</h4>
              <p className="text-sm text-muted-foreground">
                {education.degree} · {formatDateRange(education.startAt, education.endAt)}
              </p>
              {education.notes ? <p className="text-sm text-muted-foreground">{education.notes}</p> : null}
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Skills</h3>
        <div className="space-y-3">
          <div className="space-x-2">
            {resume.skills.technical.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
          <div className="space-x-2">
            {resume.skills.tools.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
          <div className="space-x-2">
            {resume.skills.soft.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold">Certifications and publications</h3>
        <Card className="space-y-4 p-5">
          <div>
            <h4 className="mb-2 font-semibold">Certifications</h4>
            <div className="space-x-2">
              {resume.certifications.map((cert) => (
                <Badge key={cert}>{cert}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Publications</h4>
            <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
              {resume.publications.map((publication) => (
                <li key={publication.title}>
                  {publication.title} — {publication.publisher} ({publication.year})
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Links</h4>
            <div className="space-x-2">
              {resume.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
