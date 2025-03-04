'use client';

import { useState, useEffect } from 'react';
import { getUserPreferences } from "@/lib/localStorage";
import Image from 'next/image';
import UserProfileDialog from './UserProfileDialog';

export default function UserProfile() {
  const [username, setUsername] = useState('');
  const [greeting, setGreeting] = useState('');
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  
  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const preferences = getUserPreferences();
    setUsername(preferences.fullName || '');
    
    // Tạo câu chào theo thời gian
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let newGreeting = '';
      
      if (hour >= 5 && hour < 12) {
        newGreeting = 'Chào buổi sáng';
      } else if (hour >= 12 && hour < 18) {
        newGreeting = 'Chào buổi chiều';
      } else {
        newGreeting = 'Chào buổi tối';
      }
      
      setGreeting(newGreeting);
    };
    
    // Cập nhật lần đầu
    updateGreeting();
    
    // Cập nhật mỗi phút
    const intervalId = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  if (!username) return null;
  
  return (
    <>
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowProfileDialog(true)}>
      <div className="avatar-container relative w-10 h-10"
      >
        <div className="avatar-gradient absolute inset-0 rounded-full animate-spin-slow"></div>
        <div className="avatar-inner absolute inset-[2px] rounded-full bg-white dark:bg-slate-600 flex items-center justify-center overflow-hidden">
          <Image 
            src="https://api.dicebear.com/9.x/notionists/webp" 
            alt="Avatar" 
            width={36} 
            height={36}
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col space-y-0">
        <span className="text-sm text-slate-500 dark:text-slate-400 leading-tight">
          {greeting}
        </span>
        <span className="text-base font-bold text-slate-700 dark:text-slate-200 leading-tight">
          {username}
        </span>
      </div>
    </div>
       {/* Dialogs */}
       <UserProfileDialog
        isOpen={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
      />

    </>
  );
} 