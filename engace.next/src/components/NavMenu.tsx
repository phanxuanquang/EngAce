"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, FileText, Edit, MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavMenuProps {
  className?: string;
  showMobileMenu?: boolean;
}

export function NavMenu({ className, showMobileMenu = false }: NavMenuProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Từ điển",
      href: "/dictionary",
      icon: Book,
    },
    {
      name: "Bài Tập",
      href: "/assignment",
      icon: FileText,
    },
    {
      name: "Luyện Viết",
      href: "/writing",
      icon: Edit,
    },
    {
      name: "Tư Vấn",
      href: "/chat",
      icon: MessageSquareText,
    },
  ];

  // Kiểm tra xem đường dẫn hiện tại có khớp với href của menu item không
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Component cho menu item trên desktop
  const DesktopMenuItem = ({ item }: { item: typeof menuItems[0] }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          active
            ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{item.name}</span>
      </Link>
    );
  };

  // Component cho menu item trên mobile
  const MobileMenuItem = ({ item }: { item: typeof menuItems[0] }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center space-x-2 p-2 rounded-lg transition-colors",
          active
            ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
            : "hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
      >
        <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Menu */}
      <div className={cn("hidden md:flex items-center space-x-1", className, showMobileMenu ? "hidden" : "")}>
        {menuItems.map((item) => (
          <DesktopMenuItem key={item.href} item={item} />
        ))}
      </div>

      {/* Mobile Menu Items - Sẽ được hiển thị trong Navbar.tsx */}
      {showMobileMenu && (
        <div className="md:hidden flex flex-col space-y-2">
          {menuItems.map((item) => (
            <MobileMenuItem key={item.href} item={item} />
          ))}
        </div>
      )}
    </>
  );
} 