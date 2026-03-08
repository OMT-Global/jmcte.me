import { promises as fs } from "node:fs";
import path from "node:path";
import {
  type ProfilePayload,
  type ProjectsPayload,
  type ResumePayload
} from "@/lib/types";

const contentDirectory = path.join(process.cwd(), "content");

async function readJson<T>(filename: string): Promise<T> {
  const file = await fs.readFile(path.join(contentDirectory, filename), "utf8");
  return JSON.parse(file) as T;
}

async function readText(filename: string): Promise<string> {
  return fs.readFile(path.join(contentDirectory, filename), "utf8");
}

export async function loadProfile(): Promise<ProfilePayload> {
  return readJson<ProfilePayload>("profile.json");
}

export async function loadProjects(): Promise<ProjectsPayload> {
  return readJson<ProjectsPayload>("projects.json");
}

export async function loadResume(): Promise<ResumePayload> {
  return readJson<ResumePayload>("resume.json");
}

export async function loadHomeCopy(): Promise<string> {
  return readText("site/index.md");
}

export async function loadAboutCopy(): Promise<string> {
  return readText("site/about.md");
}

export async function loadProjectDetails(ids: string[]): Promise<Record<string, string>> {
  const detailEntries = await Promise.all(
    ids.map(async (id) => {
      const body = await fs.readFile(path.join(contentDirectory, "projects", `${id}.md`), "utf8");
      return { id, body };
    })
  );

  return detailEntries.reduce<Record<string, string>>((acc, entry) => {
    acc[entry.id] = entry.body;
    return acc;
  }, {});
}
