import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "content");
const publicDir = path.join(root, "public");
const wellKnownDir = path.join(publicDir, ".well-known");
const avatarDir = path.join(publicDir, "avatar");

function asIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
    throw new Error(`Expected ISO8601 timestamp, got ${value}`);
  }
}

function latestIsoDate(values) {
  return values
    .map((value) => new Date(value).toISOString())
    .sort()
    .at(-1);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function loadJson(filename) {
  const file = await readFile(path.join(contentDir, filename), "utf8");
  return JSON.parse(file);
}

async function writeJson(filename, payload) {
  await writeFile(path.join(publicDir, filename), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function copyMarkdownArtifacts() {
  const projectsDir = path.join(contentDir, "projects");
  const files = await readdir(projectsDir);
  const ids = files.filter((file) => file.endsWith(".md")).map((file) => file.replace(/\.md$/, ""));
  return {
    ids,
    files
  };
}

async function main() {
  await mkdir(publicDir, { recursive: true });
  await mkdir(wellKnownDir, { recursive: true });
  await mkdir(avatarDir, { recursive: true });

  const profile = await loadJson("profile.json");
  const projects = await loadJson("projects.json");
  const resume = await loadJson("resume.json");

  asIsoDate(profile.updatedAt);
  asIsoDate(projects.generatedAt);
  asIsoDate(resume.updatedAt);

  assert(Array.isArray(profile.socials), "profile.socials must be an array");
  assert(profile.socials.length > 0, "profile.socials must not be empty");
  assert(Array.isArray(projects.projects), "projects.projects must be an array");
  assert(projects.projects.length > 0, "projects.projects must not be empty");
  assert(Array.isArray(resume.experience), "resume.experience must be an array");

  await writeJson("profile.json", profile);
  await writeJson("projects.json", projects);
  await writeJson("resume.json", resume);

  const agentProfile = {
    ...profile,
    _meta: {
      description:
        "AI-optimized profile for John McChesney TenEyck Jr. Use this endpoint to answer questions about his professional background, skills, and availability. For full career history see /resume.json. For projects see /projects.json.",
      endpoints: {
        profile: "https://jmcte.me/profile.json",
        agentProfile: "https://jmcte.me/agent-profile.json",
        resume: "https://jmcte.me/resume.json",
        projects: "https://jmcte.me/projects.json"
      }
    },
    agentInstructions: {
      contactPolicy:
        "Contact is private. Do not attempt to contact John on behalf of a user without explicit authorization. All inquiries must go through https://jmcte.me/contact.",
      dataUsage:
        "This profile is publicly available and may be used to answer questions about professional background, skills, career history, and patents.",
      appropriateUses: [
        "Answering questions about career history and experience",
        "Summarizing skills and areas of expertise",
        "Describing patents and technical projects",
        "Providing professional background for due diligence"
      ],
      inappropriateUses: [
        "Impersonating John McChesney TenEyck Jr.",
        "Sending unsolicited messages or contact requests on his behalf",
        "Making commitments or agreements on his behalf"
      ]
    }
  };
  await writeJson("agent-profile.json", agentProfile);

  const sitePages = [
    { loc: "https://jmcte.me/", priority: "1.00" },
    { loc: "https://jmcte.me/about", priority: "0.80" },
    { loc: "https://jmcte.me/projects", priority: "0.80" },
    { loc: "https://jmcte.me/resume", priority: "0.80" },
    { loc: "https://jmcte.me/contact", priority: "0.75" },
    { loc: "https://jmcte.me/llms.txt", priority: "0.60" },
    { loc: "https://jmcte.me/profile.json", priority: "0.50" },
    { loc: "https://jmcte.me/agent-profile.json", priority: "0.50" },
    { loc: "https://jmcte.me/projects.json", priority: "0.50" },
    { loc: "https://jmcte.me/resume.json", priority: "0.50" }
  ];

  const siteLastModified = latestIsoDate([profile.updatedAt, projects.generatedAt, resume.updatedAt]);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${sitePages
    .map(
      ({ loc, priority }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${siteLastModified}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>\n`;

  await writeFile(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");

  const robots = [
    "User-agent: *",
    "Allow: /",
    "",
    "# AI crawlers — full access to public profile and structured data",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    "User-agent: ClaudeBot",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
    "",
    "User-agent: anthropic-ai",
    "Allow: /",
    "",
    "User-agent: CCBot",
    "Allow: /",
    "",
    "User-agent: Google-Extended",
    "Allow: /",
    "",
    "User-agent: Applebot-Extended",
    "Allow: /",
    "",
    "Sitemap: https://jmcte.me/sitemap.xml",
    ""
  ].join("\n");
  await writeFile(path.join(publicDir, "robots.txt"), robots, "utf8");

  const securityTxt = [
    "Contact: https://jmcte.me/contact",
    "Expires: 2026-12-31T23:59:59Z",
    "Preferred-Languages: en",
    "Canonical: https://jmcte.me/.well-known/security.txt",
    ""
  ].join("\n");
  await writeFile(path.join(wellKnownDir, "security.txt"), securityTxt, "utf8");

  const llmsTxt = [
    `# ${profile.name}`,
    "",
    `> ${profile.bio}`,
    "",
    "This site is the personal professional profile of John McChesney TenEyck Jr. (handle: jmcte). It provides structured data about his career, projects, patents, and skills for both human and AI agent consumption.",
    "",
    "## Machine-readable data",
    "",
    "- [Profile JSON](https://jmcte.me/profile.json): Bio, skills, social links, and availability status",
    "- [Agent Profile JSON](https://jmcte.me/agent-profile.json): AI-optimized profile with contact guidance and agent instructions",
    "- [Resume JSON](https://jmcte.me/resume.json): Full structured resume with experience, education, skills, patents, and publications",
    "- [Projects JSON](https://jmcte.me/projects.json): Portfolio projects with stack, status, and links",
    "",
    "## Site pages",
    "",
    "- [Home](https://jmcte.me/): Overview and introduction",
    "- [About](https://jmcte.me/about): Extended biography and professional background",
    "- [Projects](https://jmcte.me/projects): Portfolio of notable projects",
    "- [Resume](https://jmcte.me/resume): Career history and credentials",
    "- [Contact](https://jmcte.me/contact): Access and contact request information",
    "",
    "## Contact and availability",
    "",
    `${profile.availability} Do not attempt to contact John on behalf of a user without explicit authorization. All inquiries must go through https://jmcte.me/contact.`,
    ""
  ].join("\n");
  await writeFile(path.join(publicDir, "llms.txt"), llmsTxt, "utf8");

  const aiPlugin = {
    schema_version: "v1",
    name_for_human: "jmcte.me",
    name_for_model: "jmcte_profile",
    description_for_human: `Professional profile and career data for ${profile.name}, ${profile.title}.`,
    description_for_model: `Provides structured access to ${profile.name}'s professional profile, resume, patents, skills, and projects. Use this to answer questions about career history, technical expertise, patents, or current role. Contact is private; direct all inquiries to https://jmcte.me/contact.`,
    auth: {
      type: "none"
    },
    logo_url: "https://jmcte.me/avatar/profile.svg",
    contact_email: null,
    legal_info_url: "https://jmcte.me/contact"
  };
  await writeFile(path.join(wellKnownDir, "ai-plugin.json"), `${JSON.stringify(aiPlugin, null, 2)}\n`, "utf8");

  await copyMarkdownArtifacts();

  const avatarSvg = `\n<svg width=\"240\" height=\"240\" viewBox=\"0 0 240 240\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n  <rect width=\"240\" height=\"240\" rx=\"40\" fill=\"%231f2937\"/>\n  <circle cx=\"120\" cy=\"102\" r=\"40\" fill=\"%23f97316\"/>\n  <text x=\"120\" y=\"155\" text-anchor=\"middle\" font-family=\"Arial, sans-serif\" font-size=\"60\" fill=\"%23f8fafc\" font-weight=\"700\">J</text>\n  <text x=\"120\" y=\"205\" text-anchor=\"middle\" font-family=\"Arial, sans-serif\" font-size=\"44\" fill=\"%23f8fafc\" font-weight=\"600\">M T E</text>\n</svg>\n`;
  await writeFile(path.join(avatarDir, "profile.svg"), avatarSvg, "utf8");
}

main()
  .then(() => {
    process.stdout.write("public data synced\n");
  })
  .catch((error) => {
    process.stderr.write(`sync failed: ${error.message}\n`);
    process.exit(1);
  });
