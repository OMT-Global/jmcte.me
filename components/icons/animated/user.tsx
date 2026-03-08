"use client";

import { motion, useAnimation } from "motion/react";
import { useCallback, type HTMLAttributes, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type UserIconProps = HTMLAttributes<HTMLSpanElement> & {
  size?: number;
};

export function UserIcon({
  className,
  onMouseEnter,
  onMouseLeave,
  size = 16,
  ...props
}: UserIconProps) {
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
        <motion.circle
          animate={controls}
          cx="12"
          cy="8"
          initial="normal"
          r="5"
          variants={{
            normal: { pathLength: 1, pathOffset: 0, scale: 1 },
            animate: { pathLength: [0, 1], pathOffset: [1, 0], scale: [0.5, 1] }
          }}
        />
        <motion.path
          animate={controls}
          d="M20 21a8 8 0 0 0-16 0"
          initial="normal"
          transition={{ delay: 0.2, duration: 0.4 }}
          variants={{
            normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
            animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0] }
          }}
        />
      </svg>
    </span>
  );
}
