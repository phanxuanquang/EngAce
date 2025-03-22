"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const generateSparkle = () => ({
  id: crypto.randomUUID(),
  createdAt: Date.now(),
  color: `hsl(${Math.random() * 360}deg, 100%, 75%)`,
  size: Math.random() * 10 + 10,
  style: {
    top: Math.random() * 100 + '%',
    left: Math.random() * 100 + '%',
    zIndex: 1
  }
});

interface SparklesProps {
  className?: string;
  color?: string;
  children: React.ReactNode;
}

const Sparkle = ({ color, size, style }: any) => {
  return (
    <motion.span
      className="absolute block"
      style={style}
      initial={{ scale: 0, rotate: 0 }}
      animate={{
        scale: [0, 1, 0],
        rotate: [0, 90, 180],
      }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
        times: [0, 0.4, 1],
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("animate-spin-slow")}
      >
        <path
          d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
          fill={color}
        />
      </svg>
    </motion.span>
  );
}

export function Sparkles({
  color = "white",
  children,
  className,
  ...props
}: SparklesProps) {
  const [sparkles, setSparkles] = useState<any[]>([]);

  useEffect(() => {
    const SPARKLE_INTERVAL = 350;
    const MAX_SPARKLES = 3;
    
    const sparkleLoop = setInterval(() => {
      const now = Date.now();
      const sparkle = generateSparkle();
      
      setSparkles(currentSparkles => {
        const newSparkles = currentSparkles
          .filter(spark => now - spark.createdAt < 750)
          .concat(sparkle);
        
        return newSparkles.slice(-MAX_SPARKLES);
      });
    }, SPARKLE_INTERVAL);

    return () => clearInterval(sparkleLoop);
  }, []);

  return (
    <span className={cn("relative inline-block", className)} {...props}>
      {sparkles.map(sparkle => (
        <Sparkle
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </span>
  );
}