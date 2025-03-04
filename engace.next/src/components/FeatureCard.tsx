"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";

export interface FeatureCardProps {
  title: string;
  englishTitle: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  glowColor: string;
  borderColor: string;
  index: number;
}

export default function FeatureCard({
  title,
  englishTitle,
  description,
  icon: Icon,
  href,
  gradient,
  glowColor,
  borderColor,
  index,
}: FeatureCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
    },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.button
      key={href}
      onClick={() => router.push(href)}
      variants={cardVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-100/90 via-gray-100/70 to-gray-100/90 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-900/90 p-8 border border-gray-200 dark:border-white/10 transition-all duration-500 cursor-pointer shadow-md dark:shadow-none"
    >
      {/* Border Glow Effect */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
        <motion.div
          className={`absolute aspect-square bg-gradient-to-l ${gradient} to-transparent opacity-0 group-hover:opacity-100`}
          style={{
            width: 100,
            offsetPath: `rect(0 auto auto 0 round 50px)`,
          }}
          initial={{ offsetDistance: "0%" }}
          animate={{
            offsetDistance: ["0%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 6,
          }}
        />
      </div>
      
      {/* Additional border highlight */}
      <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden`}>
        <motion.div 
          className={`absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r ${gradient}`}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
      </div>

      {/* Large Background Icon */}
      <div className="absolute -right-10 -bottom-10 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-500">
        <motion.div
          initial={{ rotate: -12, scale: 1, y: 0 }}
          animate={{ 
            rotate: isHovered ? -5 : -12,
            scale: isHovered ? 1.25 : 1,
            filter: isHovered ? "blur(0px)" : "blur(1px)",
            y: isHovered ? [-5, 0, -5] : 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="origin-bottom-right"
        >
          <Icon 
            className={`w-52 h-52 ${
              isHovered 
                ? (
                    title === "TỪ ĐIỂN" ? "text-blue-500" :
                    title === "BÀI TẬP" ? "text-purple-500" :
                    title === "LUYỆN VIẾT" ? "text-green-500" :
                    "text-orange-500"
                  )
                : 'text-gray-800 dark:text-white'
            }`} 
          />
        </motion.div>
      </div>
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-black/[0.01] dark:bg-grid-white/[0.01] bg-[size:16px_16px] opacity-20" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${glowColor}`} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="relative mb-6 group-hover:transition-transform duration-500">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            <div className={`inline-flex items-center justify-center rounded-2xl p-4 bg-gradient-to-br ${gradient} cursor-pointer`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          {/* Icon Glow */}
          <div className={`absolute -inset-2 opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-lg bg-[radial-gradient(circle_at_50%_50%,var(--icon-glow),transparent_70%)]`} 
            style={{
              '--icon-glow': gradient.includes("blue") ? '#0ea5e920' :
                          gradient.includes("purple") ? '#8b5cf620' :
                          gradient.includes("green") ? '#05966920' :
                          '#f59e0b20'
            } as any}
          />
        </div>

        <motion.h3 
          className={`mb-2 text-2xl font-bold tracking-tight bg-gradient-to-r ${gradient} text-transparent bg-clip-text group-hover:scale-105 transform-gpu transition-all duration-500`}
        >
          {title}
        </motion.h3>
        <p className={`mb-3 text-md font-medium bg-gradient-to-r ${gradient} text-transparent bg-clip-text transition-all duration-300 group-hover:scale-105`}>
          {englishTitle}
        </p>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </motion.button>
  );
} 