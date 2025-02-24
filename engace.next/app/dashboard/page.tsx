"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Book, PenLine, GraduationCap, MessageCircle } from "lucide-react";
import { getUserPreferences } from "@/lib/localStorage";
import Navbar from "@/components/Navbar";
import FeedbackDialog from "@/components/FeedbackDialog";
import InfoDialog from "@/components/InfoDialog";
import { FEEDBACK_DIALOG_INTERVAL_DAYS } from "@/lib/constants";

const features = [
  {
    title: "TỪ ĐIỂN",
    englishTitle: "Tra cứu thông minh",
    description:
      "Truy cập định nghĩa từ, thành ngữ và cụm động từ với ngữ cảnh của từ.",
    icon: Book,
    href: "/dictionary",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "BÀI TẬP",
    englishTitle: "Bài tập cá nhân hóa",
    description:
      "Luyện tập với các bài kiểm tra được điều chỉnh theo trình độ và sở thích của bạn.",
    icon: GraduationCap,
    href: "/assignment",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    title: "LUYỆN VIẾT",
    englishTitle: "Thực hành viết",
    description:
      "Nhận phản hồi và gợi ý ngay lập tức để cải thiện kỹ năng viết tiếng Anh.",
    icon: PenLine,
    href: "/writing",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    title: "TƯ VẤN",
    englishTitle: "Trò chuyện với AI",
    description:
      "Tương tác với gia sư AI để được hướng dẫn và hỗ trợ tự học tiếng Anh.",
    icon: MessageCircle,
    href: "/chat",
    gradient: "from-orange-500 to-amber-400",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const preferences = getUserPreferences();
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

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
    if (daysSinceFirstEntry > 0 && daysSinceFirstEntry % FEEDBACK_DIALOG_INTERVAL_DAYS === 0) {
      setShowFeedbackDialog(true);
    }
  }, [preferences.hasCompletedOnboarding]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-purple-400 to-blue-600">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-400 blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-400 blur-3xl opacity-30"></div>
      <Navbar />

      {/* Info Dialog */}
      <InfoDialog isOpen={showInfoDialog} onClose={() => setShowInfoDialog(false)} />

      {/* Feedback Dialog */}
      <FeedbackDialog
        isOpen={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        userName={preferences.fullName || ""}
      />

      {/* Main content with padding-top to account for fixed navbar */}
      <div className="container mx-auto px-8 min-h-screen pt-20 flex items-center justify-center py-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.href}
                onClick={() => router.push(feature.href)}
                className="group relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-lg p-8 shadow-lg transition-all hover:shadow-2xl dark:bg-slate-700/60 hover:-translate-y-2 duration-300 border border-slate-200/30 dark:border-slate-700/30 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100"
              >
                <div className="relative z-10">
                  <div
                    className={`mb-6 inline-flex items-center justify-center rounded-2xl p-4 bg-gradient-to-br ${feature.gradient}`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mb-3 text-md font-medium bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent dark:from-slate-400 dark:to-slate-300">
                    {feature.englishTitle}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effects */}
                <div
                  className={`absolute inset-0 z-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-10 dark:group-hover:opacity-20 pointer-events-none ${feature.gradient}`}
                />
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 transition-all duration-300 group-hover:opacity-100 ${feature.gradient}`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
