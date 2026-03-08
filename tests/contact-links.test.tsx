import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContactPage from "@/app/contact/page";

describe("contact page", () => {
  it("uses rel=noreferrer on outbound social links", async () => {
    render(await ContactPage());
    const links = screen.getAllByRole("link");
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
