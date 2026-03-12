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
        name: "John M. TenEyck Jr."
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About me" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/johnmteneyckjr"
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
  });
});
