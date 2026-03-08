"use client";

import { motion, useAnimation } from "motion/react";
import { useCallback, type HTMLAttributes, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type ArrowUpRightIconProps = HTMLAttributes<HTMLSpanElement> & {
  size?: number;
};

export function ArrowUpRightIcon({
  className,
  onMouseEnter,
  onMouseLeave,
  size = 16,
  ...props
}: ArrowUpRightIconProps) {
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
        <motion.g
          animate={controls}
          initial="normal"
          variants={{
            normal: {
              scale: 1,
              translateX: 0,
              translateY: 0
            },
            animate: {
              scale: [1, 0.85, 1],
              translateX: [0, -4, 0],
              translateY: [0, 4, 0],
              originX: 1,
              originY: 0,
              transition: {
                duration: 0.5,
                ease: "easeInOut"
              }
            }
          }}
        >
          <path d="M7 7H17" />
          <path d="M17 7V17" />
          <path d="M7 17L17 7" />
        </motion.g>
      </svg>
    </span>
  );
}
