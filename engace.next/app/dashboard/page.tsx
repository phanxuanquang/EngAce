"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Book, PenLine, GraduationCap, MessageCircle } from "lucide-react";
import { getUserPreferences } from "@/lib/localStorage";
import { API_DOMAIN } from "@/lib/config";
import Navbar from "@/components/Navbar";
import FeedbackDialog from "@/components/FeedbackDialog";
import InfoDialog from "@/components/InfoDialog";
import { FEEDBACK_DIALOG_INTERVAL_DAYS } from "@/lib/constants";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import Threads from "@/components/bits/threads";
import { WordRotate } from "@/components/magicui/word-rotate";

interface GitHubCommit {
  ShaCode: string;
  Message: string;
  Date: string;
}

const features = [
  {
    title: "TỪ ĐIỂN",
    englishTitle: "Tra cứu thông minh",
    description:
      "Truy cập định nghĩa từ, thành ngữ và cụm động từ với ngữ cảnh của từ.",
    icon: Book,
    href: "/dictionary",
    gradient: "from-blue-500 via-blue-400 to-cyan-400",
    glowColor: "from-blue-500/20 via-blue-400/20 to-cyan-400/20",
    borderColor: "from-blue-500/30 to-cyan-400/30",
  },
  {
    title: "BÀI TẬP",
    englishTitle: "Bài tập cá nhân hóa",
    description:
      "Luyện tập với các bài kiểm tra được điều chỉnh theo trình độ và sở thích của bạn.",
    icon: GraduationCap,
    href: "/assignment",
    gradient: "from-purple-500 via-purple-400 to-pink-400",
    glowColor: "from-purple-500/20 via-purple-400/20 to-pink-400/20",
    borderColor: "from-purple-500/30 to-pink-400/30",
  },
  {
    title: "LUYỆN VIẾT",
    englishTitle: "Thực hành viết",
    description:
      "Nhận phản hồi và gợi ý ngay lập tức để cải thiện kỹ năng viết tiếng Anh.",
    icon: PenLine,
    href: "/writing",
    gradient: "from-green-500 via-green-400 to-emerald-400",
    glowColor: "from-green-500/20 via-green-400/20 to-emerald-400/20",
    borderColor: "from-green-500/30 to-emerald-400/30",
  },
  {
    title: "TƯ VẤN",
    englishTitle: "Trò chuyện với gia sư ảo",
    description:
      "Tương tác với gia sư AI để được hướng dẫn và hỗ trợ tự học tiếng Anh.",
    icon: MessageCircle,
    href: "/chat",
    gradient: "from-orange-500 via-orange-400 to-amber-400",
    glowColor: "from-orange-500/20 via-orange-400/20 to-amber-400/20",
    borderColor: "from-orange-500/30 to-amber-400/30",
  },
];

// Animation variants
const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: i * 0.1
    }
  })
};

const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: i * 0.1
    }
  }),
  hover: {
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export default function Dashboard() {
  const router = useRouter();
  const preferences = getUserPreferences();
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<GitHubCommit | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  useEffect(() => {
    if (!preferences.hasCompletedOnboarding) {
      router.push("/");
      return;
    }

    // Show info dialog if user hasn't seen it before
    const hasSeenInfo = localStorage.getItem("hasSeenInfo");
    if (!hasSeenInfo) {
      setShowInfoDialog(true);
      localStorage.setItem("hasSeenInfo", "true");
    }

    // Check for updates if not first entry
    const firstEntryDate = localStorage.getItem("firstEntryDate");
    if (firstEntryDate) {
      checkForUpdates();
    }
  }, [router, preferences.hasCompletedOnboarding]);

  useEffect(() => {
    // Check if user has completed onboarding
    if (!preferences.hasCompletedOnboarding) return;

    // Get the first entry date from localStorage or set it if not exists
    const firstEntryDate = localStorage.getItem("firstEntryDate");
    if (!firstEntryDate) {
      localStorage.setItem("firstEntryDate", new Date().toISOString());
      return;
    }

    // Calculate days since first entry
    const daysSinceFirstEntry = Math.floor(
      (Date.now() - new Date(firstEntryDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Show feedback dialog if days is divisible by FEEDBACK_DIALOG_INTERVAL_DAYS
    if (
      daysSinceFirstEntry > 0 &&
      daysSinceFirstEntry % FEEDBACK_DIALOG_INTERVAL_DAYS === 0
    ) {
      setShowFeedbackDialog(true);
    }
  }, [preferences.hasCompletedOnboarding]);

  const checkForUpdates = async () => {
    setIsCheckingUpdate(true);
    try {
      const lastShaCode = localStorage.getItem("lastShaCode");
      const response = await fetch(`${API_DOMAIN}/api/Healthcheck/GetLatestGithubCommit`);
      const data: GitHubCommit = await response.json();

      if (!lastShaCode || lastShaCode !== data.ShaCode) {
        setUpdateInfo(data);
        setShowUpdateDialog(true);
        localStorage.setItem("lastShaCode", data.ShaCode);
      }
    } catch (error) {
      console.error("Failed to check for updates:", error);
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const formatUpdateDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-white dark:bg-black font-outfit"
    >

      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-3xl" />
        <div className="absolute h-full w-full bg-gradient-to-tr from-sky-500/5 via-violet-500/5 to-rose-500/5" />
      </div>
      
      {/* Animated Background Beams */}
      <div className="absolute inset-0 mask-edges-vertical opacity-50">
        <div className="absolute inset-0 h-full w-full">
          <svg
            className="z-0 h-full w-full pointer-events-none absolute"
            width="100%"
            height="100%"
            viewBox="0 0 696 316"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875"
              stroke="url(#paint0_radial_242_278)"
              strokeOpacity="0.05"
              strokeWidth="0.5"
            ></path>
            <defs>
              <radialGradient
                id="paint0_radial_242_278"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
              >
                <stop offset="0.0666667" stopColor="var(--neutral-300)"></stop>
                <stop offset="0.243243" stopColor="var(--neutral-300)"></stop>
                <stop offset="0.43594" stopColor="white" stopOpacity="0"></stop>
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <Navbar />

      <div className="absolute inset-0 opacity-20">
        <Threads
          amplitude={3.1}
          distance={0.8}
          enableMouseInteraction={false}
        />
      </div>

      {/* Info Dialog */}
      <InfoDialog
        isOpen={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
      />

      {/* Update Dialog */}
      <InfoDialog
        isOpen={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        title="Cập nhật mới"
        loading={isCheckingUpdate}
        content={updateInfo ? `${updateInfo.Message}

---

Cập nhật vào lúc **${formatUpdateDate(updateInfo.Date)}**. Thông tin chi tiết tại [**ĐÂY**](https://github.com/phanxuanquang/EngAce/commit/${updateInfo.ShaCode}).
        `.trim() : ""}
        showGithubButton={true}
      />

      {/* Feedback Dialog */}
      <FeedbackDialog
        isOpen={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        userName={preferences.fullName || ""}
      />

      {/* Main content */}
      <motion.div
        style={{ y, opacity }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 py-20"
      >
        <div className="flex flex-col gap-20">
          {/* Header Section */}
          <div className="text-center space-y-6">
          <motion.div
              variants={headerVariants}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 rounded-full bg-blue-500 mr-2"
              />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Hoàn toàn miễn phí
              </span>
            </motion.div>
            <div className="flex flex-col items-center justify-center">
              {/* OPEN-SOURCE badge */}
              <div className="relative">
                <div className="absolute -rotate-12 -left-10 -top-2">
                  <div className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    AI-POWERED
                  </div>
                </div>
                
                {/* Main Heading */}
                <h1 className="text-6xl sm:text-7xl font-black uppercase text-center">
                  <span className="block text-black dark:text-white">Học tiếng Anh</span>
                    <WordRotate
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
                      words={["thông minh", "tiện lợi", "dễ dàng"]}
                      size="xl"
                      highIntensity={true}
                      colorScheme="blue-cyan"
                    />
                </h1>
              </div>
            </div>

            {/* Subtitle */}
            <motion.p
              variants={headerVariants}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 font-light"
            >
              Trải nghiệm học tiếng Anh được cá nhân hóa với công nghệ AI tiên tiến,
              giúp bạn tiến bộ nhanh chóng và hiệu quả.
            </motion.p>
          </div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.button
                  key={feature.href}
                  onClick={() => router.push(feature.href)}
                  variants={cardVariants}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-100/90 via-gray-100/70 to-gray-100/90 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-900/90 p-8 border border-gray-200 dark:border-white/10 transition-all duration-500 cursor-pointer shadow-md dark:shadow-none"
                >
                  {/* Border Glow Effect */}
                  <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
                    <motion.div
                      className={`absolute aspect-square bg-gradient-to-l ${feature.gradient} to-transparent opacity-0 group-hover:opacity-100`}
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
                        duration: 4,
                      }}
                    />
                  </div>
                  
                  {/* Additional border highlight */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden`}>
                    <motion.div 
                      className={`absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r ${feature.gradient}`}
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
                        rotate: hoveredFeature === index ? -5 : -12,
                        scale: hoveredFeature === index ? 1.25 : 1,
                        filter: hoveredFeature === index ? "blur(0px)" : "blur(1px)",
                        y: hoveredFeature === index ? [-5, 0, -5] : 0
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
                          hoveredFeature === index 
                            ? (
                                feature.title === "TỪ ĐIỂN" ? "text-blue-500" :
                                feature.title === "BÀI TẬP" ? "text-purple-500" :
                                feature.title === "LUYỆN VIẾT" ? "text-green-500" :
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
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${feature.glowColor}`} />
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
                        <div className={`inline-flex items-center justify-center rounded-2xl p-4 bg-gradient-to-br ${feature.gradient} cursor-pointer`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                      </motion.div>
                      {/* Icon Glow */}
                      <div className={`absolute -inset-2 opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-lg bg-[radial-gradient(circle_at_50%_50%,var(--icon-glow),transparent_70%)]`} 
                        style={{
                          '--icon-glow': feature.gradient.includes("blue") ? '#0ea5e920' :
                                        feature.gradient.includes("purple") ? '#8b5cf620' :
                                        feature.gradient.includes("green") ? '#05966920' :
                                        '#f59e0b20'
                        } as any}
                      />
                    </div>

                    <motion.h3 
                      className={`mb-2 text-2xl font-bold tracking-tight bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text group-hover:scale-105 transform-gpu transition-all duration-500`}
                    >
                      {feature.title}
                    </motion.h3>
                    <p className={`mb-3 text-md font-medium bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text transition-all duration-300 group-hover:scale-105`}>
                      {feature.englishTitle}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
