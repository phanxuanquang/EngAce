"use client";

import { motion } from "motion/react";
import { CSSProperties, ReactElement, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

const Sparkle: React.FC<Sparkle> = ({ id, x, y, color, delay, scale }) => {
  return (
    <motion.svg
      key={id}
      className="pointer-events-none absolute z-20"
      initial={{ opacity: 0, left: x, top: y }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, scale, 0],
        rotate: [75, 120, 150],
      }}
      transition={{ duration: 0.8, repeat: Infinity, delay }}
      width="21"
      height="21"
      viewBox="0 0 21 21"
    >
      <path
        d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
        fill={color}
      />
    </motion.svg>
  );
};

interface SparklesTextProps {
  /**
   * @default <div />
   * @type ReactElement
   * @description
   * The component to be rendered as the text
   * */
  as?: ReactElement;

  /**
   * @default ""
   * @type string
   * @description
   * The className of the text
   */
  className?: string;

  /**
   * @required
   * @type string
   * @description
   * The text to be displayed
   * */
  text: string;

  /**
   * @default 10
   * @type number
   * @description
   * The count of sparkles
   * */
  sparklesCount?: number;

  /**
   * @default "{first: '#9E7AFF', second: '#FE8BBB'}"
   * @type string
   * @description
   * The colors of the sparkles
   * */
  colors?: {
    first: string;
    second: string;
  };
  
  /**
   * @default false
   * @type boolean
   * @description
   * Whether to use high intensity colors for text
   * */
  highIntensity?: boolean;

  /**
   * @default "default"
   * @type "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl"
   * @description
   * The size of the text
   * */
  size?: "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl";

  /**
   * @default undefined
   * @type {first: string, second: string}
   * @description
   * Custom text colors that override the sparkle colors for text gradient
   * */
  textColors?: {
    first: string;
    second: string;
  };

  /**
   * @default "purple-pink"
   * @type "purple-pink" | "blue-cyan" | "green-lime" | "orange-red" | "indigo-blue" | "pink-orange" | "teal-green" | "red-pink"
   * @description
   * Predefined color schemes for both sparkles and text (if textColors not provided)
   * */
  colorScheme?: "purple-pink" | "blue-cyan" | "green-lime" | "orange-red" | "indigo-blue" | "pink-orange" | "teal-green" | "red-pink";
}

// Predefined color schemes
const COLOR_SCHEMES = {
  "purple-pink": { first: "#9E7AFF", second: "#FE8BBB" },
  "blue-cyan": { first: "#0EA5E9", second: "#22D3EE" },
  "green-lime": { first: "#10B981", second: "#A3E635" },
  "orange-red": { first: "#F59E0B", second: "#EF4444" },
  "indigo-blue": { first: "#6366F1", second: "#3B82F6" },
  "pink-orange": { first: "#EC4899", second: "#F97316" },
  "teal-green": { first: "#14B8A6", second: "#22C55E" },
  "red-pink": { first: "#DC2626", second: "#DB2777" },
};

// High intensity versions of color schemes
const HIGH_INTENSITY_SCHEMES = {
  "purple-pink": { first: "#7C3AFF", second: "#FF4A9E" },
  "blue-cyan": { first: "#0284C7", second: "#0891B2" },
  "green-lime": { first: "#059669", second: "#65A30D" },
  "orange-red": { first: "#D97706", second: "#B91C1C" },
  "indigo-blue": { first: "#4F46E5", second: "#2563EB" },
  "pink-orange": { first: "#BE185D", second: "#C2410C" },
  "teal-green": { first: "#0F766E", second: "#15803D" },
  "red-pink": { first: "#B91C1C", second: "#9D174D" },
};

export const SparklesText: React.FC<SparklesTextProps> = ({
  text,
  colors,
  className,
  sparklesCount = 10,
  highIntensity = false,
  size = "default",
  textColors,
  colorScheme = "purple-pink",
  ...props
}) => {
  // Determine the base colors from colorScheme or custom colors
  const baseColors = colors || COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES["purple-pink"];
  
  // Determine sparkle colors
  const sparkleColors = baseColors;
  
  // Determine text colors based on priority: textColors > highIntensity > baseColors
  const finalTextColors = textColors 
    ? textColors 
    : highIntensity 
      ? HIGH_INTENSITY_SCHEMES[colorScheme] || { first: "#7C3AFF", second: "#FF4A9E" }
      : baseColors;

  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateStar = (): Sparkle => {
      const starX = `${Math.random() * 100}%`;
      const starY = `${Math.random() * 100}%`;
      const color = Math.random() > 0.5 ? sparkleColors.first : sparkleColors.second;
      const delay = Math.random() * 2;
      const scale = Math.random() * 1 + 0.3;
      const lifespan = Math.random() * 10 + 5;
      const id = `${starX}-${starY}-${Date.now()}`;
      return { id, x: starX, y: starY, color, delay, scale, lifespan };
    };

    const initializeStars = () => {
      const newSparkles = Array.from({ length: sparklesCount }, generateStar);
      setSparkles(newSparkles);
    };

    const updateStars = () => {
      setSparkles((currentSparkles) =>
        currentSparkles.map((star) => {
          if (star.lifespan <= 0) {
            return generateStar();
          } else {
            return { ...star, lifespan: star.lifespan - 0.1 };
          }
        }),
      );
    };

    initializeStars();
    const interval = setInterval(updateStars, 100);

    return () => clearInterval(interval);
  }, [sparkleColors.first, sparkleColors.second, sparklesCount]);

  // Define size classes
  const sizeClasses = {
    sm: "text-xl md:text-2xl",
    default: "text-3xl md:text-5xl",
    lg: "text-4xl md:text-6xl",
    xl: "text-5xl md:text-7xl",
    "2xl": "text-6xl md:text-8xl",
    "3xl": "text-7xl md:text-9xl",
    "4xl": "text-8xl",
    "5xl": "text-9xl",
    "6xl": "text-[6rem]",
    "7xl": "text-[7rem]",
    "8xl": "text-[8rem]",
  };

  // Get the appropriate size class
  const sizeClass = sizeClasses[size] || sizeClasses.default;

  return (
    <div
      className={cn(sizeClass, "font-bold", className)}
      {...props}
      style={
        {
          "--sparkles-first-color": `${sparkleColors.first}`,
          "--sparkles-second-color": `${sparkleColors.second}`,
          "--text-first-color": `${finalTextColors.first}`,
          "--text-second-color": `${finalTextColors.second}`,
        } as CSSProperties
      }
    >
      <span className="relative inline-block">
        {sparkles.map((sparkle) => (
          <Sparkle key={sparkle.id} {...sparkle} />
        ))}
        <strong className="bg-gradient-to-r from-[var(--text-first-color)] to-[var(--text-second-color)] text-transparent bg-clip-text font-black">{text}</strong>
      </span>
    </div>
  );
};
