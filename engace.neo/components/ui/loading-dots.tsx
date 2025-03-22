"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingDotsProps {
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingDots({
  className,
  color = "primary",
  size = "md",
}: LoadingDotsProps) {
  const dotSize = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  }[size];

  const containerSize = {
    sm: "h-4",
    md: "h-5",
    lg: "h-6",
  }[size];

  return (
    <div className={cn("flex items-center justify-center gap-1.5", containerSize, className)}>
      <motion.div
        className={cn(
          "rounded-full",
          dotSize,
          color === "primary" ? "bg-primary" : `bg-${color}-500`
        )}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatDelay: 0.2,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={cn(
          "rounded-full",
          dotSize,
          color === "primary" ? "bg-primary" : `bg-${color}-500`
        )}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.2,
          repeatDelay: 0.2,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={cn(
          "rounded-full",
          dotSize,
          color === "primary" ? "bg-primary" : `bg-${color}-500`
        )}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.4,
          repeatDelay: 0.2,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}