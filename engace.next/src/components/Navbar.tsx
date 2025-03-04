"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Moon,
  Sun,
  UserCircle,
  MessageCircleHeart,
  Info,
  LogOut,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { NavUser } from "./NavUser";
import { NavMenu } from "./NavMenu";
import { useTheme } from "@/contexts/ThemeContext";
import InfoDialog from "./app/dialog/InfoDialog";
import FeedbackDialog from "./app/dialog/FeedbackDialog";
import UserProfileDialog from "./app/dialog/UserProfileDialog";
import ConfirmDialog from "@/components/app/dialog/ConfirmDialog";
import { getUserPreferences, UserPreferences } from "@/lib/localStorage";
import { Separator } from "./ui/separator";

// Hàm tính toán lời chào dựa trên thời gian trong ngày
const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Chào buổi sáng";
  } else if (hour >= 12 && hour < 18) {
    return "Chào buổi chiều";
  } else {
    return "Chào buổi tối";
  }
};

// Hàm chuyển đổi proficiencyLevel thành text
const getProficiencyText = (level: number): string => {
  switch(level) {
    case 1:
      return "Beginner";
    case 2:
      return "Elementary";
    case 3:
      return "Intermediate";
    case 4:
      return "Upper Intermediate";
    case 5:
      return "Advanced";
    case 6:
      return "Proficient";
    default:
      return "Not Set";
  }
};

export default function Navbar() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({ fullName: '' });
  const [greeting, setGreeting] = useState(getGreeting());
  const [proficiencyText, setProficiencyText] = useState<string>("Not Set");

  useEffect(() => {
    const userPrefs = getUserPreferences();
    setPreferences(userPrefs);
    
    // Cập nhật text cho proficiency level
    if (userPrefs.proficiencyLevel !== undefined) {
      setProficiencyText(getProficiencyText(userPrefs.proficiencyLevel));
    }
    
    // Cập nhật lời chào mỗi phút
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Các hàm xử lý sự kiện cho mobile menu
  const handleProfileClick = () => {
    setShowProfileDialog(true);
  };

  const handleFeedbackClick = () => {
    setShowFeedbackDialog(true);
  };

  const handleInfoClick = () => {
    setShowInfoDialog(true);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50 transition-colors duration-150">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between h-8">

            

            <NavUser 
              showMobileMenu={showMobileMenu} 
              setShowProfileDialog={setShowProfileDialog}
              setShowFeedbackDialog={setShowFeedbackDialog}
              setShowInfoDialog={setShowInfoDialog}
              setShowLogoutDialog={setShowLogoutDialog}
            />
            {/* Navigation Menu */}
            <div className="hidden md:flex flex-1 justify-center">
                <NavMenu />
            </div>

            {/* Logo and Name - Desktop */}
            <div className="hidden md:flex">
                <Link href="/dashboard" className="text-3xl font-black bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 bg-clip-text text-transparent">ENGACE</Link>
            </div>
            
            {/* Logo - Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-xl font-black bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 bg-clip-text text-transparent uppercase"
              >
                EngAce
              </button>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Menu className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                )}
              </button>
            </div>

          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden pt-4 pb-2 border-t border-slate-200 dark:border-slate-700 mt-4">
                          {/* Navigation Menu - Mobile */}
              <div className="mb-4">
                <NavMenu showMobileMenu={showMobileMenu} />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Dialogs */}
      <UserProfileDialog
        isOpen={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
      />

      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất? Tất cả dữ liệu học tập của bạn sẽ bị xóa."
        confirmText="Xác nhận"
      />

      <InfoDialog
        isOpen={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
      />
      <FeedbackDialog
        isOpen={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        userName={preferences.fullName || "Guest"}
      />
    </>
  );
}
