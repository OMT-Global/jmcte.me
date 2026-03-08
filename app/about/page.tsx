import type { Metadata } from "next";
import { loadAboutCopy, loadProfile } from "@/lib/content";
import { MarkdownView } from "@/components/markdown-view";
import { Section } from "@/components/section";
import { PersonStructuredData } from "@/components/structured-data";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description: "About the engineering operator behind jmcte.me."
};

export default async function AboutPage() {
  const [profile, copy] = await Promise.all([loadProfile(), loadAboutCopy()]);

  return (
    <>
      <PersonStructuredData profile={profile} />
      <div className="space-y-10">
        <Section
          heading="About"
          description="Work style, background, and operating principles."
        >
          <MarkdownView content={copy} className="prose prose-invert max-w-none" />
        </Section>
        <Section heading="Working style" description="How I approach systems and product work.">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="space-y-4 p-5">
              <h3 className="text-lg font-semibold">Execution-first engineering</h3>
              <p className="text-sm text-muted-foreground">
                I reduce uncertainty by pairing direct experiments with clear fallback plans. Every change
                has an acceptance criterion and rollback story.
              </p>
            </Card>
            <Card className="space-y-4 p-5">
              <h3 className="text-lg font-semibold">Practical reliability</h3>
              <p className="text-sm text-muted-foreground">
                If monitoring, recovery, and observability are absent, the feature is incomplete. I
                optimize for maintainable operations, not novelty.
              </p>
            </Card>
          </div>
        </Section>
      </div>
    </>
  );
}
