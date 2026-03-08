import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement> & {
  heading: string;
  description?: string;
};

export function Section({
  heading,
  description,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("space-y-6", className)} {...props}>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{heading}</h2>
        {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
