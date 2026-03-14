import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "@/app/page";
import AboutPage from "@/app/about/page";
import ProjectsPage from "@/app/projects/page";
import ResumePage from "@/app/resume/page";

describe("route pages", () => {
  it("renders homepage content", async () => {
    render(await HomePage());
    expect(
      screen.getByRole("heading", {
        name: "John McChesney TenEyck Jr."
      })
    ).toBeInTheDocument();
    expect(screen.getByText("Professional Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Career trajectory")).toBeInTheDocument();
    expect(screen.getByText("Patent record")).toBeInTheDocument();
    expect(screen.getByText("Slopmeter snapshot")).toBeInTheDocument();
    expect(screen.getByText(/Recent focus on AI-assisted coding/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Slopmeter usage snapshot/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /US 12184814/i })).toHaveAttribute(
      "href",
      "https://patents.google.com/patent/US12184814B1/en"
    );
    expect(screen.queryByText("Profile JSON")).not.toBeInTheDocument();
  });

  it("renders about page content", async () => {
    render(await AboutPage());
    expect(screen.getAllByRole("heading", { name: "About" })).toHaveLength(1);
    expect(screen.getByText(/Senior Vice President and Chief Information Officer/i)).toBeInTheDocument();
  });

  it("renders projects page content", async () => {
    render(await ProjectsPage());
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText(/Public repositories and shipped systems work/)).toBeInTheDocument();
  });

  it("renders resume page content", async () => {
    render(await ResumePage());
    expect(screen.getByRole("heading", { name: "Resume" })).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Patents")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /US 12184814/i })[0]).toHaveAttribute(
      "href",
      "https://patents.google.com/patent/US12184814B1/en"
    );
  });
});
