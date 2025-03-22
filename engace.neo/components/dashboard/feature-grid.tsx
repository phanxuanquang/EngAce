"use client";

import { motion, useMotionTemplate } from "framer-motion";
import { Book, ListTodo, Pen, MessageCircle, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFloatAnimation } from "@/hooks/use-float-animation";
import { Sparkles } from "@/components/ui/sparkles";
import { featureStyles } from "@/constants/feature-styles";
import type { DashboardFeature } from "@/types/dashboard";

const features: DashboardFeature[] = [
  {
    title: "Intelligent Dictionary",
    description: "Look up words with context-aware definitions",
    icon: Book,
    path: "/dictionary",
    stats: "2,450 words"
  },
  {
    title: "Personalized Assignment",
    description: "Practice with tailored exercises",
    icon: ListTodo,
    path: "/assignments",
    stats: "85% success"
  },
  {
    title: "Writing Review",
    description: "Get instant feedback on your writing",
    icon: Pen,
    path: "/writing",
    stats: "12 reviews"
  },
  {
    title: "AI Chat",
    description: "Practice conversations with AI tutor",
    icon: MessageCircle,
    path: "/chat",
    stats: "Active"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function FeatureCard({ feature, index }: { feature: DashboardFeature; index: number }) {
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useFloatAnimation({
    rotation: 3,
    springConfig: {
      stiffness: 200,
      damping: 15
    }
  });

  const Icon = feature.icon;
  const styles = featureStyles[index];

  return (
    <motion.div
      style={{
        transform: useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={itemVariants}
      className="relative group"
    >
      <Card className={cn(
        "relative h-full",
        "bg-gradient-to-br from-background/95 to-background/50",
        "backdrop-blur-xl border-white/10",
        "shadow-[0_0_1rem_-0.25rem] shadow-black/20",
        "transition-all duration-500",
        "overflow-hidden",
        "hover:border-white/20"
      )}>
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={cn("absolute inset-0", styles.gradient)} />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        </div>

        <CardHeader className="pb-4 relative">
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className={cn(
                "p-3.5 rounded-xl relative group/icon",
                "bg-gradient-to-br shadow-lg",
                "transition-all duration-500",
                styles.icon,
                "after:absolute after:inset-0 after:rounded-xl after:blur-xl after:opacity-0",
                "after:transition-opacity after:duration-500 group-hover:after:opacity-50",
                styles.glow
              )}
            >
              <Icon className="h-6 w-6 transition-transform group-hover/icon:scale-110" />
            </motion.div>
            <div className="space-y-1.5">
              <Sparkles className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <motion.h3 
                  className={cn(
                    "font-semibold text-lg tracking-tight",
                    styles.text
                  )}
                  variants={{
                    rest: { x: 0 },
                    hover: { x: 5 }
                  }}
                >
                  {feature.title}
                </motion.h3>
              </Sparkles>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <motion.div
            initial={false}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex items-center justify-between"
          >
            <div className="relative px-3 py-1 rounded-md">
              <div className={cn(
                "absolute inset-0 rounded-md opacity-25 blur-sm transition-opacity duration-500",
                "group-hover:opacity-50",
                styles.glow
              )} />
              <p className={cn("text-sm font-medium relative", styles.text)}>
                {feature.stats}
              </p>
            </div>
            <Button
              variant="ghost"
              className={cn(
                "relative group/btn",
                "transition-all duration-500",
                "hover:text-white"
              )}
            >
              <span className={cn(
                "absolute inset-0 opacity-0 group-hover/btn:opacity-100",
                "transition-opacity duration-500",
                styles.gradient
              )} />
              <span className="relative flex items-center gap-2">
                Explore
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </span>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FeatureGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
    >
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.path}
          feature={feature}
          index={index}
        />
      ))}
    </motion.div>
  );
}