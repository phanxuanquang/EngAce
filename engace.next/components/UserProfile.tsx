'use client';

import { useState, useEffect } from 'react';
import { getUserPreferences } from "@/lib/localStorage";

export default function UserProfile() {
  const [username, setUsername] = useState('');
  const [greeting, setGreeting] = useState('');
  
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
    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
      {greeting}, {username}
    </span>
  );
} 