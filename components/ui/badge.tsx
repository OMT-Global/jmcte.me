import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "outline" | "solid";
};

export function Badge({ className, variant = "outline", ...props }: BadgeProps) {
  const variantClass =
    variant === "solid"
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border text-foreground bg-card";
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variantClass,
        className
      )}
      {...props}
    />
  );
}
