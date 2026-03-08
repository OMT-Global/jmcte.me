import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: "default" | "muted" | "accent";
};

export function Card({ className, variant = "default", ...props }: CardProps) {
  const variantClass =
    variant === "accent"
      ? "bg-primary/10 border-primary/35"
      : variant === "muted"
        ? "bg-muted/45 border-border/20"
        : "bg-card/95 hover:border-primary/40 hover:bg-card";

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/15 bg-card text-card-foreground shadow-sm transition shadow-black/10 transition-colors",
        variantClass,
        className
      )}
      {...props}
    />
  );
}
