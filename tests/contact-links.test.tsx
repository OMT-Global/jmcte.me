import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContactPage from "@/app/contact/page";

describe("contact page", () => {
  it("does not expose direct email or human-facing JSON links and uses rel=noreferrer on outbound links", async () => {
    render(await ContactPage());
    const links = screen.getAllByRole("link");
    expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute("href", "https://github.com/jmcte");
    expect(screen.getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/johnmteneyckjr"
    );
    expect(links.some((link) => (link.getAttribute("href") ?? "").startsWith("mailto:"))).toBe(false);
    expect(screen.queryByText("/profile.json")).not.toBeInTheDocument();
    expect(screen.queryByText("/projects.json")).not.toBeInTheDocument();
    expect(screen.queryByText("/resume.json")).not.toBeInTheDocument();
    const externalLinks = links.filter((link) => {
      const href = link.getAttribute("href") ?? "";
      return href.startsWith("https://") || href.startsWith("http://");
    });
    for (const link of externalLinks) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noreferrer");
    }
    expect(externalLinks.length).toBeGreaterThan(0);
  });
});
