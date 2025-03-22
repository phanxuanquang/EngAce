"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BackgroundEffect() {
  return (
    <>
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-background/0 z-0" />
      
      {/* Animated gradient blobs */}
      <div className="fixed inset-0 overflow-hidden z-[-1]">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className={cn(
            "absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2",
            "w-[30rem] h-[30rem]",
            "rounded-full",
            "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
            "blur-[100px]"
          )}
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
          className={cn(
            "absolute top-3/4 right-1/4 -translate-x-1/2 -translate-y-1/2",
            "w-[25rem] h-[25rem]",
            "rounded-full",
            "bg-gradient-to-br from-green-500/20 to-orange-500/20",
            "blur-[80px]"
          )}
        />
      </div>

      {/* Grid pattern */}
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] z-[-1]" />

      {/* Noise texture */}
      <div
        className="fixed inset-0 z-[-1] opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}