import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: "default" | "muted" | "accent";
};

export function Card({ className, variant = "default", ...props }: CardProps) {
  const variantClass =
    variant === "accent"
      ? "border-primary/30 bg-primary/10"
      : variant === "muted"
        ? "border-border/25 bg-muted/40"
        : "border-white/12 bg-card/88";

  return (
    <section
      className={cn(
        "rounded-lg border text-card-foreground shadow-sm shadow-black/10 transition-colors hover:border-primary/35",
        variantClass,
        className
      )}
      {...props}
    />
  );
}
