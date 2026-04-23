"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectPayload } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "@/components/icons/animated";

type ProjectFilter = "all" | "featured" | "completed" | "active";
type ProjectWithDetails = ProjectPayload & { details?: string };

const sourceOrder = ["OMT-Global", "jmcte"] as const;
const sourceDescriptions: Record<string, string> = {
  "OMT-Global": "Personal and family organization",
  jmcte: "Individual public work"
};

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
  project: ProjectWithDetails;
}) {
  return (
    <Card className="space-y-4 p-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <div className="flex flex-wrap gap-2">
            {project.source ? <Badge variant="outline">{project.source.label}</Badge> : null}
            <Badge variant={project.status === "completed" ? "solid" : "outline"}>
              {project.status}
            </Badge>
          </div>
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
            <ArrowUpRightIcon size={16} className="shrink-0" aria-hidden />
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
            <ArrowUpRightIcon size={16} className="shrink-0" aria-hidden />
          </a>
        ) : null}
      </div>
    </Card>
  );
}

export default function ProjectGrid({
  projects
}: {
  projects: ProjectWithDetails[];
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
  const groupedProjects = useMemo(() => {
    const groups = new Map<string, ProjectWithDetails[]>();

    for (const project of visibleProjects) {
      const sourceLabel = project.source?.label ?? "Other public work";
      const group = groups.get(sourceLabel) ?? [];
      group.push(project);
      groups.set(sourceLabel, group);
    }

    return [...groups.entries()].sort(([left], [right]) => {
      const leftIndex = sourceOrder.indexOf(left as (typeof sourceOrder)[number]);
      const rightIndex = sourceOrder.indexOf(right as (typeof sourceOrder)[number]);

      if (leftIndex === -1 && rightIndex === -1) {
        return left.localeCompare(right);
      }

      if (leftIndex === -1) {
        return 1;
      }

      if (rightIndex === -1) {
        return -1;
      }

      return leftIndex - rightIndex;
    });
  }, [visibleProjects]);

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "featured", label: "Featured" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" }
  ] as const;
  const projectCountLabel = `${visibleProjects.length} public project${visibleProjects.length === 1 ? "" : "s"} shown`;

  return (
    <section data-site-loader-item className="space-y-6">
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

      <div id="project-results-grid" className="space-y-8">
        {groupedProjects.map(([sourceLabel, sourceProjects]) => (
          <section key={sourceLabel} className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{sourceLabel}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {sourceProjects[0]?.source?.description ?? sourceDescriptions[sourceLabel] ?? "Public work"}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {sourceProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
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
