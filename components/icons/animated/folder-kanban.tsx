"use client";

import { motion, useAnimation } from "motion/react";
import { useCallback, type HTMLAttributes, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type FolderKanbanIconProps = HTMLAttributes<HTMLSpanElement> & {
  size?: number;
};

export function FolderKanbanIcon({
  className,
  onMouseEnter,
  onMouseLeave,
  size = 16,
  ...props
}: FolderKanbanIconProps) {
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
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        <motion.g
          animate={controls}
          initial="normal"
          variants={{
            normal: {},
            animate: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <motion.path
            d="M8 10v4"
            variants={{
              normal: { opacity: 1 },
              animate: {
                opacity: [1, 0.2, 1],
                transition: {
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                }
              }
            }}
          />
          <motion.path
            d="M12 10v2"
            variants={{
              normal: { opacity: 1 },
              animate: {
                opacity: [1, 0.2, 1],
                transition: {
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                }
              }
            }}
          />
          <motion.path
            d="M16 10v6"
            variants={{
              normal: { opacity: 1 },
              animate: {
                opacity: [1, 0.2, 1],
                transition: {
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                }
              }
            }}
          />
        </motion.g>
      </svg>
    </span>
  );
}
