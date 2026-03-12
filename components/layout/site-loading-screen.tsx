"use client";

import { useEffect, useState } from "react";
import { ShieldCheckIcon } from "@/components/icons/animated";
import { cn } from "@/lib/utils";

export const SITE_LOADER_MIN_MS = 900;
export const SITE_LOADER_EXIT_MS = 360;

const SITE_LOADER_FAILSAFE_MS = 3200;

export function SiteLoadingScreen() {
  const [phase, setPhase] = useState<"visible" | "exiting" | "hidden">("visible");

  useEffect(() => {
    let minimumElapsed = false;
    let windowReady = document.readyState === "complete";
    let fontsReady = typeof document.fonts === "undefined";
    let finished = false;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (finished) {
        return;
      }

      finished = true;
      setPhase("exiting");

      exitTimer = window.setTimeout(() => {
        document.body.style.overflow = previousOverflow;
        setPhase("hidden");
      }, SITE_LOADER_EXIT_MS);
    };

    const maybeFinish = () => {
      if (minimumElapsed && windowReady && fontsReady) {
        window.clearTimeout(failsafeTimer);
        finish();
      }
    };

    const handleLoad = () => {
      windowReady = true;
      maybeFinish();
    };

    const minimumTimer = window.setTimeout(() => {
      minimumElapsed = true;
      maybeFinish();
    }, SITE_LOADER_MIN_MS);

    let exitTimer = 0;
    const failsafeTimer = window.setTimeout(() => {
      finish();
    }, SITE_LOADER_FAILSAFE_MS);

    if (!windowReady) {
      window.addEventListener("load", handleLoad, { once: true });
    }

    if (!fontsReady) {
      document.fonts.ready
        .catch(() => undefined)
        .then(() => {
          fontsReady = true;
          maybeFinish();
        });
    }

    maybeFinish();

    return () => {
      window.clearTimeout(minimumTimer);
      window.clearTimeout(failsafeTimer);
      window.clearTimeout(exitTimer);
      window.removeEventListener("load", handleLoad);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <>
      <noscript>
        <style>{".site-loading-screen{display:none!important}"}</style>
      </noscript>
      <div
        aria-label="Loading site"
        aria-live="polite"
        className={cn(
          "site-loading-screen fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-background/96 px-6 transition-opacity duration-300",
          phase === "exiting" && "pointer-events-none opacity-0"
        )}
        role="status"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.16),transparent_32%),radial-gradient(circle_at_80%_12%,hsl(var(--accent)/0.12),transparent_26%),radial-gradient(circle_at_50%_90%,hsl(var(--secondary)/0.7),transparent_42%)]"
          aria-hidden
        />
        <div className="site-loader-grid pointer-events-none absolute inset-0 opacity-35" aria-hidden />

        <div className="relative w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/88 p-8 shadow-[0_24px_120px_hsl(var(--background)/0.65)] backdrop-blur-xl sm:p-10">
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent"
            aria-hidden
          />
          <div className="space-y-8">
            <div className="flex items-center justify-between gap-6">
              <div className="space-y-3">
                <p className="font-[family:var(--font-code)] text-[11px] uppercase tracking-[0.42em] text-accent">
                  JMCTE // public surface
                </p>
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Establishing signal
                  </h2>
                  <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                    Loading typography, layout, and public artifacts behind a
                    low-profile operator shell.
                  </p>
                </div>
              </div>

              <div className="relative hidden h-24 w-24 shrink-0 items-center justify-center sm:flex">
                <span
                  className="site-loader-ring absolute inset-0 rounded-full border border-primary/25"
                  aria-hidden
                />
                <span
                  className="site-loader-ring absolute inset-3 rounded-full border border-accent/30"
                  style={{ animationDelay: "0.4s" }}
                  aria-hidden
                />
                <span
                  className="site-loader-sweep absolute inset-4 rounded-full border border-transparent border-t-primary/80"
                  aria-hidden
                />
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-background/90 text-primary shadow-[0_0_48px_hsl(var(--primary)/0.24)]">
                  <ShieldCheckIcon size={24} aria-hidden />
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-end gap-2" aria-hidden>
                {[0, 1, 2, 3].map((index) => (
                  <span
                    key={index}
                    className="site-loader-bar h-8 flex-1 rounded-full bg-gradient-to-t from-primary/85 via-primary/35 to-transparent"
                    style={{ animationDelay: `${index * 140}ms` }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4 font-[family:var(--font-code)] text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                <span>Fonts warming</span>
                <span>Artifacts staging</span>
                <span>Surface locking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
