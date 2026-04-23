import type { Metadata } from "next";
import { loadAboutCopy, loadProfile } from "@/lib/content";
import { MarkdownView } from "@/components/markdown-view";
import { Section } from "@/components/section";
import { PersonStructuredData } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "About John McChesney TenEyck Jr., an enterprise technology executive focused on architecture, infrastructure, operations, and regulated-industry modernization."
};

export default async function AboutPage() {
  const [profile, copy] = await Promise.all([loadProfile(), loadAboutCopy()]);

  return (
    <>
      <PersonStructuredData profile={profile} />
      <div className="space-y-10">
        <Section heading="About">
          <MarkdownView content={copy} className="prose prose-invert max-w-none" />
        </Section>
      </div>
    </>
  );
}
