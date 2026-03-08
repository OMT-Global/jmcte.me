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
  await writeJson("agent-profile.json", profile);
  await writeJson("projects.json", projects);
  await writeJson("resume.json", resume);

  const sitePages = [
    { loc: "https://jmcte.me/", priority: "1.00" },
    { loc: "https://jmcte.me/about", priority: "0.80" },
    { loc: "https://jmcte.me/projects", priority: "0.80" },
    { loc: "https://jmcte.me/resume", priority: "0.80" },
    { loc: "https://jmcte.me/contact", priority: "0.75" },
    { loc: "https://jmcte.me/profile.json", priority: "0.50" },
    { loc: "https://jmcte.me/projects.json", priority: "0.50" },
    { loc: "https://jmcte.me/resume.json", priority: "0.50" }
  ];

  const now = new Date().toISOString();
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${sitePages
    .map(
      ({ loc, priority }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    )
    .join("\n")}\n</urlset>\n`;

  await writeFile(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");

  const robots = [
    "User-agent: *",
    "Allow: /",
    "",
    "Sitemap: https://jmcte.me/sitemap.xml",
    ""
  ].join("\n");
  await writeFile(path.join(publicDir, "robots.txt"), robots, "utf8");

  const securityTxt = [
    "Contact: mailto:john.m.teneyck@gmail.com",
    "Expires: 2026-12-31T23:59:59Z",
    "Preferred-Languages: en",
    "Canonical: https://jmcte.me/.well-known/security.txt",
    ""
  ].join("\n");
  await writeFile(path.join(wellKnownDir, "security.txt"), securityTxt, "utf8");

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
