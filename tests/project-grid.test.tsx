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
    url: "https://example.com/active-service",
    github: "https://github.com/example/active-service",
    status: "active",
    featured: true,
    startedAt: "2025-01-01"
  },
  {
    id: "p2",
    title: "Completed service",
    summary: "A stable and shipping product.",
    stack: ["Rust"],
    url: "https://example.com/completed-service",
    github: "https://github.com/example/completed-service",
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
    expect(screen.getByRole("status")).toHaveTextContent("2 public projects shown");
    expect(screen.getByRole("link", { name: "Visit Active service" })).toHaveAttribute(
      "href",
      "https://example.com/active-service"
    );
    expect(screen.getByRole("link", { name: "Source for Active service" })).toHaveAttribute(
      "href",
      "https://github.com/example/active-service"
    );

    fireEvent.click(screen.getByRole("button", { name: "Active" }));
    expect(screen.getByText("Active service")).toBeInTheDocument();
    expect(screen.queryByText("Completed service")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 public project shown");

    fireEvent.click(screen.getByRole("button", { name: "Completed" }));
    expect(screen.getByText("Completed service")).toBeInTheDocument();
    expect(screen.queryByText("Active service")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 public project shown");
  });
});
