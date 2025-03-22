"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { WEBSITE_FEATURES } from "@/constants/website-features";

interface FeatureSectionProps {
  className?: string;
  autoPlayInterval?: number;
}

export function FeatureSection({
  className,
  autoPlayInterval = 3000,
}: FeatureSectionProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100));
      } else {
        setCurrentFeature((prev) => (prev + 1) % WEBSITE_FEATURES.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress, autoPlayInterval]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Image nằm phía trên Features */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {WEBSITE_FEATURES.map(
            (feature, index) =>
              index === currentFeature && (
                <motion.div
                  key={index}
                  className="relative w-full h-[650px] overflow-hidden"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Image
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform"
                  width={1000}
                  height={1000}
                  priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-background via-background/80 via-background/60 via-background/40 via-background/20 to-transparent" />
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Features nằm phía dưới Image */}
      <div className="flex-1 pl-15 pr-10">
        <div className="flex flex-col h-full space-y-8">
          {WEBSITE_FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-6"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10",
                  index === currentFeature &&
                    "bg-primary text-primary-foreground"
                )}
              >
                {React.createElement(feature.icon, {
                  className: "w-6 h-6",
                  strokeWidth: 1.5,
                })}
              </motion.div>

              <div className="flex-1">
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="text-lg text-muted-foreground">
                  {feature.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
