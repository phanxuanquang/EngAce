"use client";

import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { SparklesText } from "@/components/system/text/sparkles-text";

interface WordRotateProps {
  words: string[];
  interval?: number;
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
  interval = 2500,
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
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [words, interval]);

  return (
    <div className="relative flex items-center justify-center my-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={words[index]}
          className={cn("block", className)}
          {...motionProps}
        >
           <SparklesText firstColor="#F8E7F6" secondColor="#A1E3F9">
              <span className="text-5xl font-black bg-gradient-to-r from-pink-400 via-blue-500 via-70% to-blue-600/60 dark:from-pink-400 dark:to-blue-100/60 bg-clip-text text-transparent">{words[index]}</span>
            </SparklesText>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 