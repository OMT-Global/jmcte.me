import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SITE_LOADER_EXIT_MS,
  SITE_LOADER_HOLD_MS,
  SITE_LOADER_ITEM_REVEAL_MS,
  SITE_LOADER_MIN_MS,
  SITE_LOADER_REVEAL_STAGGER_MS,
  SiteLoadingScreen
} from "@/components/layout/site-loading-screen";

type MockFonts = {
  ready: Promise<void>;
};

function flushMicrotasks() {
  return act(async () => {
    await Promise.resolve();
  });
}

describe("SiteLoadingScreen", () => {
  const originalFonts = Object.getOwnPropertyDescriptor(document, "fonts");
  const originalReadyState = Object.getOwnPropertyDescriptor(document, "readyState");

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    document.documentElement.removeAttribute("data-site-loader");

    if (originalFonts) {
      Object.defineProperty(document, "fonts", originalFonts);
    } else {
      // @ts-expect-error deleting mocked browser property for test cleanup
      delete document.fonts;
    }

    if (originalReadyState) {
      Object.defineProperty(document, "readyState", originalReadyState);
    }
  });

  it("holds the loading screen until the minimum display time and exit fade complete", async () => {
    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "complete"
    });
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: Promise.resolve() satisfies MockFonts["ready"] }
    });

    render(
      <>
        <div data-site-loader-item>Header</div>
        <div data-site-loader-item>Section</div>
        <SiteLoadingScreen />
      </>
    );

    expect(screen.getByRole("status", { name: "Loading site" })).toBeInTheDocument();
    expect(document.documentElement.dataset.siteLoader).toBe("visible");

    await flushMicrotasks();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SITE_LOADER_MIN_MS - 1);
    });
    expect(screen.getByRole("status", { name: "Loading site" })).toBeInTheDocument();
    expect(document.documentElement.dataset.siteLoader).toBe("visible");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(screen.getByRole("status", { name: "Loading site" })).toBeInTheDocument();
    expect(document.documentElement.dataset.siteLoader).toBe("holding");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SITE_LOADER_HOLD_MS - 1);
    });
    expect(screen.getByRole("status", { name: "Loading site" })).toBeInTheDocument();
    expect(document.documentElement.dataset.siteLoader).toBe("holding");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(document.documentElement.dataset.siteLoader).toBe("revealing");

    const revealWindowMs =
      SITE_LOADER_ITEM_REVEAL_MS + SITE_LOADER_REVEAL_STAGGER_MS;

    await act(async () => {
      await vi.advanceTimersByTimeAsync(revealWindowMs - 1);
    });
    expect(screen.getByRole("status", { name: "Loading site" })).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(screen.queryByRole("status", { name: "Loading site" })).not.toBeInTheDocument();
    expect(document.documentElement.dataset.siteLoader).toBeUndefined();
  });

  it("waits for the window load event before dismissing the overlay", async () => {
    let resolveFonts: (() => void) | undefined;
    const fontsReady = new Promise<void>((resolve) => {
      resolveFonts = resolve;
    });

    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "loading"
    });
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: fontsReady satisfies MockFonts["ready"] }
    });

    render(
      <>
        <div data-site-loader-item>Header</div>
        <SiteLoadingScreen />
      </>
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(
        SITE_LOADER_MIN_MS + SITE_LOADER_HOLD_MS + SITE_LOADER_EXIT_MS
      );
    });
    expect(screen.getByRole("status", { name: "Loading site" })).toBeInTheDocument();
    expect(document.documentElement.dataset.siteLoader).toBe("visible");

    resolveFonts?.();
    await flushMicrotasks();
    expect(screen.getByRole("status", { name: "Loading site" })).toBeInTheDocument();
    expect(document.documentElement.dataset.siteLoader).toBe("visible");

    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "complete"
    });
    await act(async () => {
      window.dispatchEvent(new Event("load"));
    });
    expect(document.documentElement.dataset.siteLoader).toBe("holding");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SITE_LOADER_HOLD_MS);
    });
    expect(document.documentElement.dataset.siteLoader).toBe("revealing");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SITE_LOADER_ITEM_REVEAL_MS);
    });

    expect(screen.queryByRole("status", { name: "Loading site" })).not.toBeInTheDocument();
    expect(document.documentElement.dataset.siteLoader).toBeUndefined();
  });
});
