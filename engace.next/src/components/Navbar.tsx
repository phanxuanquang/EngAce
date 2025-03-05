"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  UserCircle,
  MessageCircleHeart,
  Info,
} from "lucide-react";
import { getUserPreferences } from "@/lib/localStorage";
import { useTheme } from "@/contexts/ThemeContext";
import InfoDialog from "./InfoDialog";
import FeedbackDialog from "./FeedbackDialog";
import UserProfileDialog from "./UserProfileDialog";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Navbar() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const preferences = getUserPreferences();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200/50 dark:bg-slate-900/80 dark:border-slate-700/50 transition-colors duration-150">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Name - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 hover:opacity-80 transition-opacity"
              >
                EngAce
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                |
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {preferences.fullName}
              </span>
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

            {/* Logo - Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
              >
                EngAce
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setShowProfileDialog(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <UserCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>

              <button
                onClick={() => setShowFeedbackDialog(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Submit feedback"
              >
                <MessageCircleHeart className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>

              <button
                onClick={() => setShowInfoDialog(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Project information"
              >
                <Info className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>

              <button
                onClick={() => setShowLogoutDialog(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden pt-4 pb-2 border-t border-slate-200 dark:border-slate-700 mt-4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => setShowProfileDialog(true)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <UserCircle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Cập nhật thông tin
                  </span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Theme switch"
                >
                  <div className="flex items-center space-x-2">
                    {isDark ? (
                      <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    ) : (
                      <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    )}
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {isDark ? "Bật chế độ sáng" : "Bật chế độ tối"}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setShowFeedbackDialog(true)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Submit feedback"
                >
                  <div className="flex items-center space-x-2">
                    <MessageCircleHeart className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Phản hồi từ người dùng
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setShowInfoDialog(true)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Project information"
                >
                  <div className="flex items-center space-x-2">
                    <Info className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Thông tin về EngAce
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Đăng xuất</span>
                </button>
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
