"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Moon,
  Sun,
  UserCircle,
  MessageCircleHeart,
  Info,
  Menu,
  X,
  Star,
  Trophy,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getUserPreferences, UserPreferences } from "@/lib/localStorage";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import InfoDialog from "./app/dialog/InfoDialog";
import FeedbackDialog from "./app/dialog/FeedbackDialog";
import UserProfileDialog from "./app/dialog/UserProfileDialog";
import ConfirmDialog from "@/components/app/dialog/ConfirmDialog";
import { Separator } from "./ui/separator";


interface NavUserProps {
  showMobileMenu?: boolean;
  setShowProfileDialog?: (show: boolean) => void;
  setShowFeedbackDialog?: (show: boolean) => void;
  setShowInfoDialog?: (show: boolean) => void;
  setShowLogoutDialog?: (show: boolean) => void;
}

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

export function NavUser({ 
  showMobileMenu = false,
  setShowProfileDialog: externalSetShowProfileDialog,
  setShowFeedbackDialog: externalSetShowFeedbackDialog,
  setShowInfoDialog: externalSetShowInfoDialog,
  setShowLogoutDialog: externalSetShowLogoutDialog
}: NavUserProps) {
    const router = useRouter();
    const { isDark, toggleTheme } = useTheme();
    const [preferences, setPreferences] = useState<Partial<UserPreferences>>({ fullName: '' });
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [showProfileDialog, setShowProfileDialog] = useState(false);
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

    const handleLogout = () => {
      localStorage.clear();
      router.push("/");
    };

    // Xử lý các sự kiện click
    const handleProfileClick = () => {
      if (externalSetShowProfileDialog) {
        externalSetShowProfileDialog(true);
      } else {
        setShowProfileDialog(true);
      }
    };

    const handleFeedbackClick = () => {
      if (externalSetShowFeedbackDialog) {
        externalSetShowFeedbackDialog(true);
      } else {
        setShowFeedbackDialog(true);
      }
    };

    const handleInfoClick = () => {
      if (externalSetShowInfoDialog) {
        externalSetShowInfoDialog(true);
      } else {
        setShowInfoDialog(true);
      }
    };

    const handleLogoutClick = () => {
      if (externalSetShowLogoutDialog) {
        externalSetShowLogoutDialog(true);
      } else {
        setShowLogoutDialog(true);
      }
    };

  return (
    <>
        {/* Desktop Dropdown */}
        <div className={showMobileMenu ? "hidden" : ""}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className="flex items-center gap-2 md:px-2 md:py-2 p-1 rounded-lg text-left text-sm data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-slate-300 dark:bg-slate-700">{preferences?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight hidden md:grid">
                  <span className="truncate text-xs">{greeting}</span>
                  <span className="truncate font-semibold">{preferences?.fullName}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 p-2"
              side={"bottom"}
              align="start"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">{preferences?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{preferences?.fullName}</span>
                    <div className="flex items-center gap-1">
                      <span className="truncate text-xs">{proficiencyText}</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <Separator className="my-1"/>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleProfileClick}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Cập nhật thông tin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {isDark ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {isDark ? "Bật chế độ sáng" : "Bật chế độ tối"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleFeedbackClick}>
                  <MessageCircleHeart className="mr-2 h-4 w-4" />
                  Phản hồi từ người dùng
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleInfoClick}>
                  <Info className="mr-2 h-4 w-4" />
                  Thông tin về EngAce
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <Separator className="my-1"/>
              <DropdownMenuItem onClick={handleLogoutClick} className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/50">
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Dialogs - Chỉ hiển thị nếu không có external handlers */}
        {!externalSetShowProfileDialog && (
          <UserProfileDialog
            isOpen={showProfileDialog}
            onClose={() => setShowProfileDialog(false)}
          />
        )}

        {!externalSetShowLogoutDialog && (
          <ConfirmDialog
            isOpen={showLogoutDialog}
            onClose={() => setShowLogoutDialog(false)}
            onConfirm={handleLogout}
            title="Đăng xuất"
            message="Bạn có chắc chắn muốn đăng xuất? Tất cả dữ liệu học tập của bạn sẽ bị xóa."
            confirmText="Xác nhận"
          />
        )}

        {!externalSetShowInfoDialog && (
          <InfoDialog
            isOpen={showInfoDialog}
            onClose={() => setShowInfoDialog(false)}
          />
        )}
        
        {!externalSetShowFeedbackDialog && (
          <FeedbackDialog
            isOpen={showFeedbackDialog}
            onClose={() => setShowFeedbackDialog(false)}
            userName={preferences.fullName || "Guest"}
          />
        )}
    </>
  )
}
