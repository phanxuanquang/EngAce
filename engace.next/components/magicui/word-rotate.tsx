"use client";

import { AnimatePresence, motion, MotionProps } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { SparklesText } from "./sparkles-text";

interface WordRotateProps {
  words: string[];
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
  size?: "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl";
  highIntensity?: boolean;
  colorScheme?: "purple-pink" | "blue-cyan" | "green-lime" | "orange-red" | "indigo-blue" | "pink-orange" | "teal-green" | "red-pink";
  colors?: {
    first: string;
    second: string;
  };
  textColors?: {
    first: string;
    second: string;
  };
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
  size = "default",
  highIntensity = false,
  colorScheme,
  colors,
  textColors,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div className="relative min-h-[1.5em] flex items-center justify-center my-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={words[index]}
          className={cn("block", className)}
          {...motionProps}
        >
          <SparklesText 
            text={words[index]} 
            highIntensity={highIntensity} 
            size={size}
            colorScheme={colorScheme}
            colors={colors}
            textColors={textColors}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
