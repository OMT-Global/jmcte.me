import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/"
}));

describe("SiteHeader", () => {
  it("keeps primary navigation links named for assistive tech", () => {
    render(<SiteHeader />);

    const navigation = screen.getByRole("navigation", { name: "Primary" });
    expect(within(navigation).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(navigation).getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(within(navigation).getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/projects");
    expect(within(navigation).getByRole("link", { name: "Resume" })).toHaveAttribute("href", "/resume");
    expect(within(navigation).getByRole("link", { name: "Access" })).toHaveAttribute("href", "/contact");
  });

  it("marks the current page", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });
});
