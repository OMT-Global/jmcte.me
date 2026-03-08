import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectGrid from "@/components/projects/project-grid";
import type { ProjectPayload } from "@/lib/types";

const fixtures: (ProjectPayload & { details?: string })[] = [
  {
    id: "p1",
    title: "Active service",
    summary: "An active system in production.",
    stack: ["TypeScript"],
    status: "active",
    featured: true,
    startedAt: "2025-01-01"
  },
  {
    id: "p2",
    title: "Completed service",
    summary: "A stable and shipping product.",
    stack: ["Rust"],
    status: "completed",
    featured: false,
    startedAt: "2024-01-01",
    finishedAt: "2024-12-01"
  }
];

describe("ProjectGrid", () => {
  it("filters projects by status", async () => {
    render(<ProjectGrid projects={fixtures} />);

    expect(screen.getByText("Active service")).toBeInTheDocument();
    expect(screen.getByText("Completed service")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Active" }));
    expect(screen.getByText("Active service")).toBeInTheDocument();
    expect(screen.queryByText("Completed service")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Completed" }));
    expect(screen.getByText("Completed service")).toBeInTheDocument();
    expect(screen.queryByText("Active service")).not.toBeInTheDocument();
  });
});
