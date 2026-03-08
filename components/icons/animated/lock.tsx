"use client";

import { motion, useAnimation } from "motion/react";
import { useCallback, type HTMLAttributes, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type LockIconProps = HTMLAttributes<HTMLSpanElement> & {
  size?: number;
};

export function LockIcon({
  className,
  onMouseEnter,
  onMouseLeave,
  size = 16,
  ...props
}: LockIconProps) {
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
      <motion.svg
        animate={controls}
        fill="none"
        height={size}
        initial="normal"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        transition={{
          duration: 1,
          ease: [0.4, 0, 0.2, 1]
        }}
        variants={{
          normal: { rotate: 0, scale: 1 },
          animate: { rotate: [-3, 1, -2, 0], scale: [0.95, 1.05, 0.98, 1] }
        }}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
        <motion.path
          animate={controls}
          d="M7 11V7a5 5 0 0 1 10 0v4"
          initial="normal"
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          variants={{
            normal: { pathLength: 1 },
            animate: { pathLength: 0.7 }
          }}
        />
      </motion.svg>
    </span>
  );
}
