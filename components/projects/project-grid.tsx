"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectPayload } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProjectFilter = "all" | "featured" | "completed" | "active";

function getProjectExcerpt(details?: string) {
  if (!details) {
    return "";
  }

  const excerpt = details
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0 && !line.startsWith("#") && !line.startsWith("-"));

  return excerpt ?? "";
}

function ProjectCard({
  project
}: {
  project: ProjectPayload & { details?: string };
}) {
  return (
    <Card className="space-y-4 p-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <Badge variant={project.status === "completed" ? "solid" : "outline"}>
            {project.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{project.summary}</p>
      </div>
      <p className="text-sm text-muted-foreground">{getProjectExcerpt(project.details)}</p>
      <div className="flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <Badge key={item} variant="outline">
            {item}
          </Badge>
        ))}
      </div>
      <div className="flex gap-3 pt-1">
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit ${project.title}`}
            className="inline-flex items-center gap-2 text-sm text-foreground transition hover:text-primary"
          >
            Visit
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : null}
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`Source for ${project.title}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            Source
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </Card>
  );
}

export default function ProjectGrid({
  projects
}: {
  projects: (ProjectPayload & { details?: string })[];
}) {
  const [statusFilter, setStatusFilter] = useState<ProjectFilter>("all");
  const visibleProjects = useMemo(() => {
    if (statusFilter === "featured") {
      return projects.filter((project) => project.featured);
    }
    if (statusFilter === "active") {
      return projects.filter((project) => project.status === "active" || project.status === "maintenance");
    }
    if (statusFilter === "completed") {
      return projects.filter((project) => project.status === "completed");
    }
    return projects;
  }, [projects, statusFilter]);

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "featured", label: "Featured" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" }
  ] as const;
  const projectCountLabel = `${visibleProjects.length} public project${visibleProjects.length === 1 ? "" : "s"} shown`;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-3" role="group" aria-label="Project filters">
        {filterOptions.map((filterOption) => {
          const isActive = statusFilter === filterOption.key;
          return (
            <button
              key={filterOption.key}
              type="button"
              aria-pressed={isActive}
              aria-controls="project-results-grid"
              onClick={() => setStatusFilter(filterOption.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/60 bg-card hover:bg-card/85"
              )}
            >
              {filterOption.label}
            </button>
          );
        })}
      </div>

      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
        {projectCountLabel}
      </p>

      <div id="project-results-grid" className="grid gap-4 md:grid-cols-2">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {visibleProjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No projects match this filter. Try a different status.
        </p>
      ) : null}
    </section>
  );
}
