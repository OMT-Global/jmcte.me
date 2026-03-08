"use client";

import { motion, useAnimation } from "motion/react";
import { useCallback, type HTMLAttributes, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type HomeIconProps = HTMLAttributes<HTMLSpanElement> & {
  size?: number;
};

export function HomeIcon({
  className,
  onMouseEnter,
  onMouseLeave,
  size = 16,
  ...props
}: HomeIconProps) {
  const controls = useAnimation();

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLSpanElement>) => {
      controls.start("animate");
      onMouseEnter?.(event);
    },
    [controls, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (event: MouseEvent<HTMLSpanElement>) => {
      controls.start("normal");
      onMouseLeave?.(event);
    },
    [controls, onMouseLeave]
  );

  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <svg
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <motion.path
          animate={controls}
          d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
          initial="normal"
          transition={{ duration: 0.6, opacity: { duration: 0.2 } }}
          variants={{
            normal: { pathLength: 1, opacity: 1 },
            animate: { pathLength: [0, 1], opacity: [0, 1] }
          }}
        />
      </svg>
    </span>
  );
}
