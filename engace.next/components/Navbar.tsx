"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
  GraduationCap,
  MessageCircleHeart,
  Info,
} from "lucide-react";
import { getUserPreferences, saveUserPreferences } from "@/lib/localStorage";
import { useTheme } from "@/contexts/ThemeContext";
import { PROFICIENCY_LEVELS } from "@/lib/constants";
import InfoDialog from "./InfoDialog";
import FeedbackDialog from "./FeedbackDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Navbar() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const preferences = getUserPreferences();

  const handleLevelChange = (value: string) => {
    const levelId = parseInt(value, 10);
    saveUserPreferences({
      ...preferences,
      proficiencyLevel: levelId,
    });
  };

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
              {/* Level Selector */}
              <div className="flex items-center space-x-2 px-2">
                <GraduationCap className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <Select
                  defaultValue={String(preferences.proficiencyLevel || 1)}
                  onValueChange={handleLevelChange}
                >
                  <SelectTrigger className="w-[180px] border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Chọn trình độ" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map((level) => (
                      <SelectItem
                        key={level.id}
                        value={String(level.id)}
                        className="cursor-pointer"
                      >
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                {/* Mobile Level Selector */}
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-slate-600 dark:text-slate-400 ml-2" />
                  <Select
                    defaultValue={String(preferences.proficiencyLevel || 1)}
                    onValueChange={handleLevelChange}
                  >
                    <SelectTrigger className="w-full bg-transparent border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Chọn trình độ" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map((level) => (
                        <SelectItem
                          key={level.id}
                          value={String(level.id)}
                          className="cursor-pointer"
                        >
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Theme switch"
                >
                  <div className="flex items-center space-x-2">
                    {isDark ? <Sun className="h-5 w-5 text-slate-600 dark:text-slate-400" /> : <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {isDark ? 'Bật chế độ sáng' : 'Bật chế độ tối'}
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

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Đăng xuất
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Bạn có chắc chắn muốn đăng xuất? Tất cả dữ liệu học tập của bạn sẽ
              bị xóa.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
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
